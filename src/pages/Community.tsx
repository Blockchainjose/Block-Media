import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, X, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePostForm } from "@/components/community/CreatePostForm";
import { PostCard } from "@/components/community/PostCard";
import { SentimentBar } from "@/components/community/SentimentBar";
import { useCommunityPosts } from "@/hooks/useCommunityPosts";
import { ROOM_TABS } from "@/lib/market-utils";
import { AdSlot } from "@/components/ads/AdSlot";
import { SponsorWidget } from "@/components/ads/SponsorWidget";

export default function Community() {
  const {
    posts, loading, createPost, toggleLike, fetchReplies, addReply,
    filter, setFilter, roomFilter, setRoomFilter, tagFilter, setTagFilter,
    bullishPercent, bearishPercent,
  } = useCommunityPosts();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Community Discussion - Market Sentiment & Analysis"
        description="Join the Block Media community. Share market insights, discuss assets, and see real-time community sentiment on crypto and global markets."
        canonicalPath="/community"
      />
      <Header />

      <main className="container mx-auto px-4 py-8 mt-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Page header */}
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-display font-bold">Community</h1>
          </div>

          {/* Room tabs */}
          <div className="mb-6 overflow-x-auto">
            <Tabs value={roomFilter} onValueChange={(v) => setRoomFilter(v as any)}>
              <TabsList className="h-9 bg-muted/50">
                {ROOM_TABS.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value} className="text-xs px-3">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main feed */}
            <div className="lg:col-span-2 space-y-4">
              <CreatePostForm onSubmit={createPost} />

              {/* Sentiment + tag filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="all" className="text-xs h-7">All</TabsTrigger>
                    <TabsTrigger value="bullish" className="text-xs h-7 data-[state=active]:text-green-500">🟢 Bullish</TabsTrigger>
                    <TabsTrigger value="bearish" className="text-xs h-7 data-[state=active]:text-red-500">🔴 Bearish</TabsTrigger>
                  </TabsList>
                </Tabs>

                {tagFilter && (
                  <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setTagFilter(null)}>
                    {tagFilter}
                    <X className="h-3 w-3" />
                  </Badge>
                )}
              </div>

              {/* Posts */}
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No posts yet. Be the first to share your market take!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={toggleLike}
                      onTagClick={setTagFilter}
                      fetchReplies={fetchReplies}
                      addReply={addReply}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-4">
              <AdSlot slotKey="sidebar" page="community" fallbackOrientation="vertical" />
              <SentimentBar bullishPercent={bullishPercent} bearishPercent={bearishPercent} />

              <div className="p-4 rounded-xl bg-card border border-border">
                <h3 className="text-sm font-medium mb-3">Trending Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {getPopularTags(posts).map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary/20 text-xs"
                      onClick={() => setTagFilter(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {getPopularTags(posts).length === 0 && (
                    <p className="text-xs text-muted-foreground">No tags yet</p>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border">
                <h3 className="text-sm font-medium mb-2">Community Guidelines</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Keep discussions respectful and on-topic</li>
                  <li>• Use $TICKER tags to reference assets</li>
                  <li>• Max 500 characters per post</li>
                  <li>• No financial advice — share opinions only</li>
                  <li>• Rate limit: max 10 posts per hour</li>
                </ul>
              </div>
            </aside>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

function getPopularTags(posts: any[]): string[] {
  const tagCount: Record<string, number> = {};
  posts.forEach(p => p.asset_tags?.forEach((t: string) => {
    tagCount[t] = (tagCount[t] || 0) + 1;
  }));
  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);
}
