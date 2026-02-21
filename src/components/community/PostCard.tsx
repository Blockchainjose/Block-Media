import { useState } from "react";
import { Heart, MessageCircle, Share2, TrendingUp, TrendingDown, ChevronDown, ChevronUp, Loader2, Send, Flag } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "./UserAvatar";
import { ReportDialog } from "./ReportDialog";
import { getTagColorClass, getCategoryLabel, getCategoryColorClass, BADGE_LABELS, type MarketCategory } from "@/lib/market-utils";
import type { CommunityPost, PostReply } from "@/hooks/useCommunityPosts";

interface PostCardProps {
  post: CommunityPost;
  onLike: (postId: string) => void;
  onTagClick: (tag: string) => void;
  fetchReplies: (postId: string) => Promise<PostReply[]>;
  addReply: (postId: string, content: string) => Promise<boolean>;
}

export function PostCard({ post, onLike, onTagClick, fetchReplies, addReply }: PostCardProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<PostReply[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const displayName = post.profile?.display_name || "Anonymous";
  const timeAgo = getTimeAgo(post.created_at);

  const handleToggleReplies = async () => {
    if (!showReplies) {
      setLoadingReplies(true);
      const data = await fetchReplies(post.id);
      setReplies(data);
      setLoadingReplies(false);
    }
    setShowReplies(!showReplies);
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    setSubmittingReply(true);
    const success = await addReply(post.id, replyContent);
    if (success) {
      setReplyContent("");
      const data = await fetchReplies(post.id);
      setReplies(data);
    }
    setSubmittingReply(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/community?post=${post.id}`);
  };

  const renderContent = (text: string) => {
    return text.replace(/(\$[A-Z]{1,10})/g, '<span class="text-primary font-semibold cursor-pointer hover:underline">$1</span>');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors"
    >
      <div className="flex items-start gap-3">
        <UserAvatar displayName={displayName} avatarUrl={post.profile?.avatar_url || null} className="h-10 w-10" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{displayName}</span>
            {post.profile?.reputation !== undefined && post.profile.reputation > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">+{post.profile.reputation}</span>
            )}
            {/* Badges */}
            {post.profile?.badges && post.profile.badges.length > 0 && (
              <div className="flex gap-1">
                {post.profile.badges.slice(0, 2).map(b => {
                  const info = BADGE_LABELS[b];
                  return info ? (
                    <span key={b} className="text-xs" title={info.label}>{info.emoji}</span>
                  ) : null;
                })}
              </div>
            )}
            {/* Category badge */}
            {post.market_category && post.market_category !== "general" && (
              <Badge variant="outline" className={`text-xs ${getCategoryColorClass(post.market_category as MarketCategory)}`}>
                {getCategoryLabel(post.market_category as MarketCategory)}
              </Badge>
            )}
            {post.sentiment && (
              <Badge variant="outline" className={`text-xs ${
                post.sentiment === "bullish"
                  ? "border-green-500/50 text-green-500"
                  : "border-red-500/50 text-red-500"
              }`}>
                {post.sentiment === "bullish" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {post.sentiment}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>

          <div
            className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.tagName === "SPAN" && target.textContent?.startsWith("$")) {
                onTagClick(target.textContent);
              }
            }}
          />

          {/* Color-coded asset tags */}
          {post.asset_tags.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {post.asset_tags.map(tag => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={`text-xs cursor-pointer hover:opacity-80 ${getTagColorClass(tag)}`}
                  onClick={() => onTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 mt-3">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 px-2 ${post.liked ? "text-primary" : "text-muted-foreground"}`}
              onClick={() => onLike(post.id)}
            >
              <Heart className={`h-4 w-4 mr-1 ${post.liked ? "fill-primary" : ""}`} />
              {post.likes_count > 0 && post.likes_count}
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground" onClick={handleToggleReplies}>
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.replies_count > 0 && post.replies_count}
              {showReplies ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground" onClick={() => setShowReport(true)}>
              <Flag className="h-4 w-4" />
            </Button>
          </div>

          {/* Replies section */}
          {showReplies && (
            <div className="mt-3 pl-4 border-l-2 border-border space-y-3">
              {loadingReplies ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <>
                  {replies.map((reply) => (
                    <div key={reply.id} className="flex gap-2 py-2">
                      <UserAvatar displayName={reply.profile?.display_name || null} avatarUrl={reply.profile?.avatar_url || null} className="h-6 w-6" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{reply.profile?.display_name || "Anonymous"}</span>
                          <span className="text-xs text-muted-foreground">{getTimeAgo(reply.created_at)}</span>
                        </div>
                        <p className="text-sm text-foreground/90 mt-0.5">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="min-h-[40px] text-sm bg-muted/30"
                      maxLength={500}
                    />
                    <Button size="icon" className="h-10 w-10 flex-shrink-0" onClick={handleReply} disabled={submittingReply || !replyContent.trim()}>
                      {submittingReply ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <ReportDialog
        open={showReport}
        onOpenChange={setShowReport}
        contentType="post"
        contentId={post.id}
      />
    </motion.div>
  );
}

function getTimeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}
