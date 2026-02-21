import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentType: "post" | "comment" | "reply";
  contentId: string;
}

const REASONS = [
  "Spam or misleading",
  "Harassment or abuse",
  "Inappropriate content",
  "Financial scam or fraud",
  "Other",
];

export function ReportDialog({ open, onOpenChange, contentType, contentId }: ReportDialogProps) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!reason) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Sign in required", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("content_reports").insert({
      reporter_id: user.id,
      content_type: contentType,
      content_id: contentId,
      reason: `${reason}${details ? `: ${details}` : ""}`,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Report submitted", description: "Thank you for helping keep the community safe." });
      onOpenChange(false);
      setReason("");
      setDetails("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report {contentType}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {REASONS.map(r => (
              <Button
                key={r}
                variant={reason === r ? "default" : "outline"}
                size="sm"
                onClick={() => setReason(r)}
                className="text-xs"
              >
                {r}
              </Button>
            ))}
          </div>
          <Textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Additional details (optional)..."
            className="min-h-[60px] text-sm"
            maxLength={500}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!reason || submitting}>
            {submitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
