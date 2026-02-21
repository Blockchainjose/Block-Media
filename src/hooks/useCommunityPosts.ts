import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { MarketCategory } from "@/lib/market-utils";

export interface CommunityPost {
  id: string;
  user_id: string;
  content: string;
  sentiment: "bullish" | "bearish" | null;
  asset_tags: string[];
  market_category: MarketCategory;
  likes_count: number;
  replies_count: number;
  created_at: string;
  profile?: {
    display_name: string | null;
    avatar_url: string | null;
    reputation: number;
    badges: string[];
  };
  liked?: boolean;
}


export interface PostReply {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: {
    display_name: string | null;
    avatar_url: string | null;
    reputation: number;
  };
}

type FilterMode = "all" | "bullish" | "bearish";
type RoomFilter = "all" | MarketCategory;

export function useCommunityPosts() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [roomFilter, setRoomFilter] = useState<RoomFilter>("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPosts = useCallback(async () => {
    let query = supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (filter !== "all") {
      query = query.eq("sentiment", filter);
    }
    if (roomFilter !== "all") {
      query = query.eq("market_category", roomFilter);
    }
    if (tagFilter) {
      query = query.contains("asset_tags", [tagFilter]);
    }

    const { data, error } = await query;
    if (error) { console.error(error); setLoading(false); return; }

    const userIds = [...new Set((data || []).map((p: any) => p.user_id))];
    let profilesMap: Record<string, any> = {};
    let badgesMap: Record<string, string[]> = {};
    if (userIds.length > 0) {
      const [profilesRes, badgesRes] = await Promise.all([
        supabase.from("profiles").select("user_id, display_name, avatar_url, reputation").in("user_id", userIds),
        supabase.from("user_badges").select("user_id, badge").in("user_id", userIds),
      ]);
      if (profilesRes.data) profilesRes.data.forEach((p: any) => { profilesMap[p.user_id] = p; });
      if (badgesRes.data) badgesRes.data.forEach((b: any) => {
        if (!badgesMap[b.user_id]) badgesMap[b.user_id] = [];
        badgesMap[b.user_id].push(b.badge);
      });
    }

    const { data: { user } } = await supabase.auth.getUser();
    let likesSet = new Set<string>();
    if (user && data && data.length > 0) {
      const { data: likes } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", user.id)
        .in("post_id", data.map((p: any) => p.id));
      if (likes) likes.forEach((l: any) => likesSet.add(l.post_id));
    }

    setPosts((data || []).map((p: any) => ({
      ...p,
      profile: {
        ...(profilesMap[p.user_id] || { display_name: null, avatar_url: null, reputation: 0 }),
        badges: badgesMap[p.user_id] || [],
      },
      liked: likesSet.has(p.id),
    })));
    setLoading(false);
  }, [filter, roomFilter, tagFilter]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // Real-time
  useEffect(() => {
    const channel = supabase
      .channel("community-posts")
      .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, () => fetchPosts())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchPosts]);

  const createPost = async (content: string, sentiment: "bullish" | "bearish" | null, assetTags: string[], marketCategory: MarketCategory = "general") => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to post.", variant: "destructive" });
      return false;
    }

    // Rate limiting: check last hour's posts
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const { count } = await supabase
      .from("community_posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", oneHourAgo);
    
    if (count && count >= 10) {
      toast({ title: "Rate limited", description: "Max 10 posts per hour. Please wait.", variant: "destructive" });
      return false;
    }

    const { error } = await supabase.from("community_posts").insert({
      user_id: user.id,
      content: content.trim(),
      sentiment,
      asset_tags: assetTags,
      market_category: marketCategory,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return false;
    }
    return true;
  };

  const toggleLike = async (postId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to like posts.", variant: "destructive" });
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (post?.liked) {
      await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
    } else {
      await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
    }
    fetchPosts();
  };

  const fetchReplies = async (postId: string): Promise<PostReply[]> => {
    const { data } = await supabase
      .from("post_replies")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (!data || data.length === 0) return [];

    const userIds = [...new Set(data.map((r: any) => r.user_id))];
    let profilesMap: Record<string, any> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url, reputation")
        .in("user_id", userIds);
      if (profiles) profiles.forEach((p: any) => { profilesMap[p.user_id] = p; });
    }

    return data.map((r: any) => ({
      ...r,
      profile: profilesMap[r.user_id] || { display_name: null, avatar_url: null, reputation: 0 },
    }));
  };

  const addReply = async (postId: string, content: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Sign in required", variant: "destructive" });
      return false;
    }
    const { error } = await supabase.from("post_replies").insert({
      post_id: postId,
      user_id: user.id,
      content: content.trim(),
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return false;
    }
    fetchPosts();
    return true;
  };

  // Sentiment stats
  const bullishCount = posts.filter(p => p.sentiment === "bullish").length;
  const bearishCount = posts.filter(p => p.sentiment === "bearish").length;
  const total = bullishCount + bearishCount;
  const bullishPercent = total > 0 ? Math.round((bullishCount / total) * 100) : 50;

  return {
    posts, loading, createPost, toggleLike, fetchReplies, addReply,
    filter, setFilter, roomFilter, setRoomFilter, tagFilter, setTagFilter,
    bullishPercent, bearishPercent: 100 - bullishPercent,
  };
}
