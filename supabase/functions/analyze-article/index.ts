import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ArticleAnalysis {
  biasPercentages: { left: number; center: number; right: number };
  leftPerspective: string;
  rightPerspective: string;
  centerPerspective: string;
  aiSummary: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content, source } = await req.json();

    if (!title) {
      return new Response(
        JSON.stringify({ error: "Title is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a balanced political news analyst. Your job is to analyze news articles and provide:
1. A bias analysis with percentages for left, center, and right perspectives (must total 100)
2. A summary from the left-leaning perspective (what liberal/progressive viewpoints would emphasize)
3. A summary from the right-leaning perspective (what conservative viewpoints would emphasize)
4. A center/balanced summary focusing on what BOTH sides would agree on and factual common ground
5. A neutral AI summary of the key facts

Be fair, accurate, and highlight genuine differences and agreements between perspectives.`;

    const userPrompt = `Analyze this news article:

Title: ${title}
Source: ${source || "Unknown"}
Content: ${content || "No content provided - analyze based on title and source"}

Respond with a JSON object in this exact format:
{
  "biasPercentages": { "left": number, "center": number, "right": number },
  "leftPerspective": "2-3 sentence summary from left-leaning viewpoint",
  "rightPerspective": "2-3 sentence summary from right-leaning viewpoint", 
  "centerPerspective": "2-3 sentence summary of what both sides agree on",
  "aiSummary": "Neutral 2-3 sentence summary of key facts"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_article",
              description: "Analyze a news article for political bias and provide multi-perspective summaries",
              parameters: {
                type: "object",
                properties: {
                  biasPercentages: {
                    type: "object",
                    properties: {
                      left: { type: "number", description: "Percentage of left-leaning bias (0-100)" },
                      center: { type: "number", description: "Percentage of center/neutral content (0-100)" },
                      right: { type: "number", description: "Percentage of right-leaning bias (0-100)" },
                    },
                    required: ["left", "center", "right"],
                  },
                  leftPerspective: { type: "string", description: "Summary from left-leaning viewpoint" },
                  rightPerspective: { type: "string", description: "Summary from right-leaning viewpoint" },
                  centerPerspective: { type: "string", description: "Summary of what both sides agree on" },
                  aiSummary: { type: "string", description: "Neutral summary of key facts" },
                },
                required: ["biasPercentages", "leftPerspective", "rightPerspective", "centerPerspective", "aiSummary"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_article" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const aiResponse = await response.json();
    
    // Extract the tool call result
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error("Invalid AI response format");
    }

    const analysis: ArticleAnalysis = JSON.parse(toolCall.function.arguments);

    // Normalize percentages to ensure they sum to 100
    const total = analysis.biasPercentages.left + analysis.biasPercentages.center + analysis.biasPercentages.right;
    if (total !== 100) {
      const factor = 100 / total;
      analysis.biasPercentages.left = Math.round(analysis.biasPercentages.left * factor);
      analysis.biasPercentages.center = Math.round(analysis.biasPercentages.center * factor);
      analysis.biasPercentages.right = 100 - analysis.biasPercentages.left - analysis.biasPercentages.center;
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("analyze-article error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
