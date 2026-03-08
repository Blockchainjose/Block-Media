import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAILS = ["admin@blockmediacorp.com"]; // Add your email here

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify admin
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user || !ADMIN_EMAILS.includes(user.email || "")) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // --- Ad Slots CRUD ---
    if (action === "get-slots") {
      const { data } = await supabase
        .from("ad_slots")
        .select("*")
        .order("slot_key");
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update-slot") {
      const body = await req.json();
      const { id, ...updates } = body;
      const { data, error } = await supabase
        .from("ad_slots")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Sponsor Banners CRUD ---
    if (action === "get-sponsors") {
      const { data } = await supabase
        .from("sponsor_banners")
        .select("*")
        .order("display_order");
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "upsert-sponsor") {
      const body = await req.json();
      const { data, error } = await supabase
        .from("sponsor_banners")
        .upsert(body)
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete-sponsor") {
      const body = await req.json();
      const { error } = await supabase
        .from("sponsor_banners")
        .delete()
        .eq("id", body.id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Analytics ---
    if (action === "analytics") {
      const days = parseInt(url.searchParams.get("days") || "7");
      const since = new Date(
        Date.now() - days * 24 * 60 * 60 * 1000
      ).toISOString();

      const { data } = await supabase
        .from("ad_events")
        .select("slot_key, event_type, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(10000);

      // Aggregate
      const stats: Record<
        string,
        { impressions: number; clicks: number }
      > = {};
      (data || []).forEach((e: any) => {
        if (!stats[e.slot_key])
          stats[e.slot_key] = { impressions: 0, clicks: 0 };
        if (e.event_type === "impression") stats[e.slot_key].impressions++;
        else if (e.event_type === "click") stats[e.slot_key].clicks++;
      });

      return new Response(JSON.stringify(stats), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
