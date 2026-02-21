import { useState } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommentItem } from "./CommentItem";
import { useComments } from "@/hooks/useComments";

interface CommentSectionProps {
  articleId: string;
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const { comments, loading, addComment, voteComment, sortMode, setSortMode, totalCount } = useComments(articleId);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    const success = await addComment(newComment);
    if (success) setNewComment("");
    setSubmitting(false);
  };

  const handleReply = async (content: string, parentId: string) => {
    return addComment(content, parentId);
  };

  return (
    <section className="mt-8 p-6 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Discussion ({totalCount})
        </h2>
        <Tabs value={sortMode} onValueChange={(v) => setSortMode(v as any)}>
          <TabsList className="h-8">
            <TabsTrigger value="newest" className="text-xs h-7">Newest</TabsTrigger>
            <TabsTrigger value="upvoted" className="text-xs h-7">Top</TabsTrigger>
            <TabsTrigger value="discussed" className="text-xs h-7">Discussed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* New comment input */}
      <div className="mb-6 space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts... (use **bold** and *italic*)"
          className="min-h-[80px] bg-muted/30"
          maxLength={2000}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{newComment.length}/2000</p>
          <Button onClick={handleSubmit} disabled={submitting || !newComment.trim()} size="sm">
            {submitting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
            Post Comment
          </Button>
        </div>
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <div className="divide-y divide-border">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onVote={voteComment}
              onReply={handleReply}
            />
          ))}
        </div>
      )}
    </section>
  );
}
