import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  updated_at: string;
  profile?: {
    display_name: string | null;
    avatar_url: string | null;
    reputation: number;
  };
  replies?: Comment[];
  userVote?: number | null;
}

type SortMode = "newest" | "upvoted" | "discussed";

export function useComments(articleId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const { toast } = useToast();

  const fetchComments = useCallback(async () => {
    const { data: commentsData, error } = await supabase
      .from("article_comments")
      .select("*")
      .eq("article_id", articleId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
      setLoading(false);
      return;
    }

    // Fetch profiles for all unique user_ids
    const userIds = [...new Set((commentsData || []).map((c: any) => c.user_id))];
    let profilesMap: Record<string, any> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url, reputation")
        .in("user_id", userIds);
      if (profiles) {
        profiles.forEach((p: any) => { profilesMap[p.user_id] = p; });
      }
    }

    // Fetch current user's votes
    const { data: { user } } = await supabase.auth.getUser();
    let votesMap: Record<string, number> = {};
    if (user) {
      const commentIds = (commentsData || []).map((c: any) => c.id);
      if (commentIds.length > 0) {
        const { data: votes } = await supabase
          .from("comment_votes")
          .select("comment_id, vote_type")
          .eq("user_id", user.id)
          .in("comment_id", commentIds);
        if (votes) {
          votes.forEach((v: any) => { votesMap[v.comment_id] = v.vote_type; });
        }
      }
    }

    // Build threaded structure
    const allComments: Comment[] = (commentsData || []).map((c: any) => ({
      ...c,
      profile: profilesMap[c.user_id] || { display_name: null, avatar_url: null, reputation: 0 },
      userVote: votesMap[c.id] ?? null,
      replies: [],
    }));

    const commentMap: Record<string, Comment> = {};
    const rootComments: Comment[] = [];
    allComments.forEach((c) => { commentMap[c.id] = c; });
    allComments.forEach((c) => {
      if (c.parent_id && commentMap[c.parent_id]) {
        commentMap[c.parent_id].replies!.push(c);
      } else {
        rootComments.push(c);
      }
    });

    setComments(rootComments);
    setLoading(false);
  }, [articleId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`comments-${articleId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "article_comments",
        filter: `article_id=eq.${articleId}`,
      }, () => {
        fetchComments();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [articleId, fetchComments]);

  const addComment = async (content: string, parentId?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to comment.", variant: "destructive" });
      return false;
    }

    const { error } = await supabase.from("article_comments").insert({
      article_id: articleId,
      user_id: user.id,
      content: content.trim(),
      parent_id: parentId || null,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to post comment.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const voteComment = async (commentId: string, voteType: 1 | -1) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to vote.", variant: "destructive" });
      return;
    }

    // Check existing vote
    const { data: existing } = await supabase
      .from("comment_votes")
      .select("id, vote_type")
      .eq("comment_id", commentId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      if (existing.vote_type === voteType) {
        // Remove vote
        await supabase.from("comment_votes").delete().eq("id", existing.id);
      } else {
        // Delete old, insert new
        await supabase.from("comment_votes").delete().eq("id", existing.id);
        await supabase.from("comment_votes").insert({ comment_id: commentId, user_id: user.id, vote_type: voteType });
      }
    } else {
      await supabase.from("comment_votes").insert({ comment_id: commentId, user_id: user.id, vote_type: voteType });
    }
    fetchComments();
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortMode === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortMode === "upvoted") return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    if (sortMode === "discussed") return (b.replies?.length || 0) - (a.replies?.length || 0);
    return 0;
  });

  return { comments: sortedComments, loading, addComment, voteComment, sortMode, setSortMode, totalCount: comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0) };
}
