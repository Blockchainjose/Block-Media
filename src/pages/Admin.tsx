import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, ToggleLeft, ToggleRight, Save, Trash2, Plus,
  BarChart3, Eye, MousePointerClick, Percent, ArrowLeft, Settings,
  Image as ImageIcon, Link2, Calendar, RefreshCw, Loader2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdSlotAdmin {
  id: string;
  slot_key: string;
  name: string;
  slot_type: string;
  ad_code: string | null;
  is_active: boolean;
  display_rules: Record<string, any>;
  fallback_type: string | null;
  fallback_image_url: string | null;
  fallback_link: string | null;
  size_desktop: string | null;
  size_mobile: string | null;
}

interface SponsorAdmin {
  id?: string;
  slot_key: string;
  title: string;
  image_url: string | null;
  link_url: string;
  is_active: boolean;
  display_start: string | null;
  display_end: string | null;
  display_order: number;
  label: string;
}

interface AnalyticsData {
  [slotKey: string]: { impressions: number; clicks: number };
}

async function adminFetch(action: string, body?: any, params?: Record<string, string>) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const urlParams = new URLSearchParams({ action, ...params });
  const url = `https://${projectId}.supabase.co/functions/v1/ad-admin?${urlParams}`;

  const res = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export default function Admin() {
  const [slots, setSlots] = useState<AdSlotAdmin[]>([]);
  const [sponsors, setSponsors] = useState<SponsorAdmin[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [analyticsRange, setAnalyticsRange] = useState("7");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [slotsData, sponsorsData, analyticsData] = await Promise.all([
        adminFetch("get-slots"),
        adminFetch("get-sponsors"),
        adminFetch("analytics", undefined, { days: analyticsRange }),
      ]);
      setSlots(slotsData || []);
      setSponsors(sponsorsData || []);
      setAnalytics(analyticsData || {});
      setIsAdmin(true);
    } catch (err: any) {
      if (err.message === "Forbidden" || err.message === "Not authenticated") {
        setIsAdmin(false);
      } else {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  }, [analyticsRange, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSlotUpdate = async (slot: AdSlotAdmin) => {
    try {
      setSaving(slot.id);
      await adminFetch("update-slot", slot);
      toast({ title: "Saved", description: `${slot.name} updated successfully.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(null);
    }
  };

  const handleSponsorSave = async (sponsor: SponsorAdmin) => {
    try {
      setSaving(sponsor.id || "new");
      const result = await adminFetch("upsert-sponsor", sponsor);
      await loadData();
      toast({ title: "Saved", description: `${sponsor.title} saved.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(null);
    }
  };

  const handleSponsorDelete = async (id: string) => {
    try {
      await adminFetch("delete-sponsor", { id });
      setSponsors((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "Deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have admin access to this page.</p>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-display font-bold">Ad Management</h1>
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs defaultValue="slots">
            <TabsList className="mb-6">
              <TabsTrigger value="slots">
                <LayoutDashboard className="w-4 h-4 mr-1" /> Ad Slots
              </TabsTrigger>
              <TabsTrigger value="sponsors">
                <ImageIcon className="w-4 h-4 mr-1" /> Sponsors
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="w-4 h-4 mr-1" /> Analytics
              </TabsTrigger>
            </TabsList>

            {/* AD SLOTS TAB */}
            <TabsContent value="slots">
              <div className="space-y-4">
                {slots.map((slot) => (
                  <AdSlotEditor
                    key={slot.id}
                    slot={slot}
                    saving={saving === slot.id}
                    onChange={(updated) =>
                      setSlots((prev) =>
                        prev.map((s) => (s.id === updated.id ? updated : s))
                      )
                    }
                    onSave={handleSlotUpdate}
                  />
                ))}
              </div>
            </TabsContent>

            {/* SPONSORS TAB */}
            <TabsContent value="sponsors">
              <div className="space-y-4">
                {sponsors.map((sp) => (
                  <SponsorEditor
                    key={sp.id}
                    sponsor={sp}
                    saving={saving === sp.id}
                    onChange={(updated) =>
                      setSponsors((prev) =>
                        prev.map((s) => (s.id === updated.id ? updated : s))
                      )
                    }
                    onSave={handleSponsorSave}
                    onDelete={() => sp.id && handleSponsorDelete(sp.id)}
                  />
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    setSponsors((prev) => [
                      ...prev,
                      {
                        slot_key: "sponsor-sidebar-widget",
                        title: "New Partner",
                        image_url: null,
                        link_url: "https://",
                        is_active: true,
                        display_start: null,
                        display_end: null,
                        display_order: prev.length,
                        label: "Partner",
                      },
                    ])
                  }
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Sponsor Banner
                </Button>
              </div>
            </TabsContent>

            {/* ANALYTICS TAB */}
            <TabsContent value="analytics">
              <div className="mb-4 flex items-center gap-3">
                <Label>Time range:</Label>
                <Select value={analyticsRange} onValueChange={setAnalyticsRange}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Last 24 hours</SelectItem>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={loadData}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Slot</TableHead>
                        <TableHead className="text-right">
                          <Eye className="w-4 h-4 inline mr-1" /> Impressions
                        </TableHead>
                        <TableHead className="text-right">
                          <MousePointerClick className="w-4 h-4 inline mr-1" /> Clicks
                        </TableHead>
                        <TableHead className="text-right">
                          <Percent className="w-4 h-4 inline mr-1" /> CTR
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(analytics).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            No data yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        Object.entries(analytics)
                          .sort((a, b) => b[1].impressions - a[1].impressions)
                          .map(([key, data]) => {
                            const ctr =
                              data.impressions > 0
                                ? ((data.clicks / data.impressions) * 100).toFixed(2)
                                : "0.00";
                            return (
                              <TableRow key={key}>
                                <TableCell className="font-medium">{key}</TableCell>
                                <TableCell className="text-right">{data.impressions.toLocaleString()}</TableCell>
                                <TableCell className="text-right">{data.clicks.toLocaleString()}</TableCell>
                                <TableCell className="text-right">{ctr}%</TableCell>
                              </TableRow>
                            );
                          })
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
      <Footer />
    </div>
  );
}

// --- Sub-components ---

function AdSlotEditor({
  slot,
  saving,
  onChange,
  onSave,
}: {
  slot: AdSlotAdmin;
  saving: boolean;
  onChange: (s: AdSlotAdmin) => void;
  onSave: (s: AdSlotAdmin) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base">{slot.name}</CardTitle>
            <Badge variant={slot.is_active ? "default" : "secondary"}>
              {slot.is_active ? "Active" : "Inactive"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {slot.slot_key}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={slot.is_active}
              onCheckedChange={(checked) => onChange({ ...slot, is_active: checked })}
            />
            <Button size="sm" onClick={() => onSave(slot)} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
              Save
            </Button>
          </div>
        </div>
        <CardDescription>
          Desktop: {slot.size_desktop || "responsive"} · Mobile: {slot.size_mobile || "hidden"} · Fallback: {slot.fallback_type || "none"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-xs mb-1 block">Custom Ad Code (HTML/JavaScript)</Label>
          <Textarea
            value={slot.ad_code || ""}
            onChange={(e) => onChange({ ...slot, ad_code: e.target.value || null })}
            placeholder="Paste AdSense, Media.net, or any ad network code here..."
            className="font-mono text-xs min-h-[80px]"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <Label className="text-xs mb-1 block">Fallback Type</Label>
            <Select
              value={slot.fallback_type || "newsletter"}
              onValueChange={(v) => onChange({ ...slot, fallback_type: v })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="app">Mobile App</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1 block">Pages</Label>
            <Input
              value={(slot.display_rules as any)?.pages || "all"}
              onChange={(e) =>
                onChange({
                  ...slot,
                  display_rules: { ...slot.display_rules, pages: e.target.value },
                })
              }
              className="h-8 text-xs"
              placeholder="all, home, article"
            />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Device</Label>
            <Select
              value={(slot.display_rules as any)?.device || "all"}
              onValueChange={(v) =>
                onChange({
                  ...slot,
                  display_rules: { ...slot.display_rules, device: v === "all" ? undefined : v },
                })
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="desktop">Desktop Only</SelectItem>
                <SelectItem value="mobile">Mobile Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1 block">Fallback Image URL</Label>
            <Input
              value={slot.fallback_image_url || ""}
              onChange={(e) => onChange({ ...slot, fallback_image_url: e.target.value || null })}
              className="h-8 text-xs"
              placeholder="https://..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SponsorEditor({
  sponsor,
  saving,
  onChange,
  onSave,
  onDelete,
}: {
  sponsor: SponsorAdmin;
  saving: boolean;
  onChange: (s: SponsorAdmin) => void;
  onSave: (s: SponsorAdmin) => void;
  onDelete: () => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{sponsor.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Switch
              checked={sponsor.is_active}
              onCheckedChange={(checked) => onChange({ ...sponsor, is_active: checked })}
            />
            <Button size="sm" onClick={() => onSave(sponsor)} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
              Save
            </Button>
            {sponsor.id && (
              <Button size="sm" variant="destructive" onClick={onDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <Label className="text-xs mb-1 block">Title</Label>
          <Input
            value={sponsor.title}
            onChange={(e) => onChange({ ...sponsor, title: e.target.value })}
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Link URL</Label>
          <Input
            value={sponsor.link_url}
            onChange={(e) => onChange({ ...sponsor, link_url: e.target.value })}
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Image URL</Label>
          <Input
            value={sponsor.image_url || ""}
            onChange={(e) => onChange({ ...sponsor, image_url: e.target.value || null })}
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Slot</Label>
          <Select
            value={sponsor.slot_key}
            onValueChange={(v) => onChange({ ...sponsor, slot_key: v })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sponsor-header">Header</SelectItem>
              <SelectItem value="sponsor-article-footer">Article Footer</SelectItem>
              <SelectItem value="sponsor-sidebar-widget">Sidebar Widget</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs mb-1 block">Display Start</Label>
          <Input
            type="date"
            value={sponsor.display_start?.split("T")[0] || ""}
            onChange={(e) =>
              onChange({ ...sponsor, display_start: e.target.value ? new Date(e.target.value).toISOString() : null })
            }
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Display End</Label>
          <Input
            type="date"
            value={sponsor.display_end?.split("T")[0] || ""}
            onChange={(e) =>
              onChange({ ...sponsor, display_end: e.target.value ? new Date(e.target.value).toISOString() : null })
            }
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Label</Label>
          <Input
            value={sponsor.label || "Sponsored"}
            onChange={(e) => onChange({ ...sponsor, label: e.target.value })}
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Order</Label>
          <Input
            type="number"
            value={sponsor.display_order}
            onChange={(e) => onChange({ ...sponsor, display_order: parseInt(e.target.value) || 0 })}
            className="h-8 text-xs"
          />
        </div>
      </CardContent>
    </Card>
  );
}
