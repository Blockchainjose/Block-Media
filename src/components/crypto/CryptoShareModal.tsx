import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CryptoShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: {
    id: string;
    title: string;
    url: string;
    centerPerspective?: string;
    leftPerspective?: string;
    rightPerspective?: string;
    summary?: string;
  };
}

type ShareTab = "center" | "left" | "right" | "script";

export function CryptoShareModal({ open, onOpenChange, article }: CryptoShareModalProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<ShareTab>("center");
  const [script, setScript] = useState<string | null>(null);
  const [generatingScript, setGeneratingScript] = useState(false);

  const blockMediaUrl = `https://blockmediacorp.com/crypto/${article.id}`;

  const getSummaryText = useCallback((tab: ShareTab): string => {
    switch (tab) {
      case "left":
        return article.leftPerspective || article.summary || "";
      case "right":
        return article.rightPerspective || article.summary || "";
      case "script":
        return script || "Generating script...";
      case "center":
      default:
        return article.centerPerspective || article.summary || "";
    }
  }, [article, script]);

  const getShareText = useCallback((tab: ShareTab): string => {
    const summary = getSummaryText(tab);
    return `${article.title}\n\n${summary}\n\n${blockMediaUrl}`;
  }, [article.title, blockMediaUrl, getSummaryText]);

  const generateScript = useCallback(async () => {
    if (script) return;
    setGeneratingScript(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-share-script", {
        body: {
          title: article.title,
          summary: article.centerPerspective || article.summary || article.title,
        },
      });
      if (error) throw error;
      setScript(data?.script || "Could not generate script.");
    } catch (err) {
      console.error("Script generation error:", err);
      setScript("Failed to generate script. Try again.");
    } finally {
      setGeneratingScript(false);
    }
  }, [article, script]);

  const regenerateScript = useCallback(async () => {
    setScript(null);
    setGeneratingScript(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-share-script", {
        body: {
          title: article.title,
          summary: article.centerPerspective || article.summary || article.title,
        },
      });
      if (error) throw error;
      setScript(data?.script || "Could not generate script.");
    } catch (err) {
      console.error("Script generation error:", err);
      setScript("Failed to generate script. Try again.");
    } finally {
      setGeneratingScript(false);
    }
  }, [article]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as ShareTab);
    if (tab === "script" && !script && !generatingScript) {
      generateScript();
    }
  };

  const handleCopy = async () => {
    const text = getShareText(activeTab);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied!", description: "Share text copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    const text = getShareText(activeTab);
    try {
      await navigator.share({ title: article.title, text, url: blockMediaUrl });
    } catch {
      // User cancelled
    }
  };

  const shareToX = () => {
    const text = encodeURIComponent(`${article.title}\n\n${getSummaryText(activeTab)}`);
    const url = encodeURIComponent(blockMediaUrl);
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(blockMediaUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(blockMediaUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const hasAnalysis = article.leftPerspective || article.rightPerspective || article.centerPerspective;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Article</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2 font-medium">{article.title}</p>

          {hasAnalysis ? (
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="center">Center</TabsTrigger>
                <TabsTrigger value="left">Left</TabsTrigger>
                <TabsTrigger value="right">Right</TabsTrigger>
                <TabsTrigger value="script">Script</TabsTrigger>
              </TabsList>

              {(["center", "left", "right", "script"] as ShareTab[]).map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-3">
                  <div className="relative rounded-lg bg-muted/50 border border-border p-3 min-h-[100px]">
                    {tab === "script" && generatingScript ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating social script...
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{getSummaryText(tab)}</p>
                    )}
                    {tab === "script" && script && !generatingScript && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-7"
                        onClick={regenerateScript}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Regen
                      </Button>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="rounded-lg bg-muted/50 border border-border p-3">
              <p className="text-sm">{article.summary || "No summary available"}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCopy} variant="outline" className="flex-1">
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            {typeof navigator.share === "function" && (
              <Button onClick={handleNativeShare} className="flex-1">
                Share
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={shareToX} className="flex-1 text-xs">
              𝕏 Post
            </Button>
            <Button variant="outline" size="sm" onClick={shareToFacebook} className="flex-1 text-xs">
              Facebook
            </Button>
            <Button variant="outline" size="sm" onClick={shareToLinkedIn} className="flex-1 text-xs">
              LinkedIn
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
