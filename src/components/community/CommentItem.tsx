import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "./UserAvatar";
import type { Comment } from "@/hooks/useComments";

interface CommentItemProps {
  comment: Comment;
  onVote: (commentId: string, voteType: 1 | -1) => void;
  onReply: (content: string, parentId: string) => Promise<boolean>;
  depth?: number;
}

export function CommentItem({ comment, onVote, onReply, depth = 0 }: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(depth < 2);
  const [submitting, setSubmitting] = useState(false);

  const score = comment.upvotes - comment.downvotes;
  const timeAgo = getTimeAgo(comment.created_at);
  const displayName = comment.profile?.display_name || "Anonymous";

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    setSubmitting(true);
    const success = await onReply(replyContent, comment.id);
    if (success) {
      setReplyContent("");
      setShowReplyInput(false);
    }
    setSubmitting(false);
  };

  // Apply basic formatting: **bold** and *italic*
  const formatContent = (text: string) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
  };

  return (
    <div className={`${depth > 0 ? "ml-6 pl-4 border-l-2 border-border" : ""}`}>
      <div className="flex gap-3 py-3">
        <UserAvatar displayName={displayName} avatarUrl={comment.profile?.avatar_url || null} className="h-8 w-8 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">{displayName}</span>
            {comment.profile?.reputation !== undefined && comment.profile.reputation > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                +{comment.profile.reputation}
              </span>
            )}
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>

          <div
            className="text-sm text-foreground/90 mb-2"
            dangerouslySetInnerHTML={{ __html: formatContent(comment.content) }}
          />

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2 ${comment.userVote === 1 ? "text-green-500" : "text-muted-foreground"}`}
              onClick={() => onVote(comment.id, 1)}
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              {comment.upvotes > 0 && comment.upvotes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2 ${comment.userVote === -1 ? "text-red-500" : "text-muted-foreground"}`}
              onClick={() => onVote(comment.id, -1)}
            >
              <ThumbsDown className="h-3 w-3 mr-1" />
              {comment.downvotes > 0 && comment.downvotes}
            </Button>
            <span className="text-xs font-medium text-muted-foreground mx-1">
              {score > 0 ? `+${score}` : score}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-muted-foreground"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Reply
            </Button>
          </div>

          {showReplyInput && (
            <div className="mt-2 space-y-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply... (use **bold** and *italic*)"
                className="min-h-[60px] text-sm bg-muted/30"
                maxLength={2000}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleReply} disabled={submitting || !replyContent.trim()}>
                  {submitting ? "Posting..." : "Reply"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowReplyInput(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div>
          {depth >= 2 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-muted-foreground ml-6"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
              {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
            </Button>
          )}
          {showReplies && comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onVote={onVote}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function getTimeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
