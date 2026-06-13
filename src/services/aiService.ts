const AI_BASE = "https://ai-backend-b3yd.onrender.com";

const debugAi = (label: string, payload: unknown) => {
  if (import.meta.env.DEV) {
    console.debug(`[BuildHive AI] ${label}`, payload);
  }
};

const requestJson = async (url: string, init?: RequestInit) => {
  debugAi("request", {
    url,
    method: init?.method || "GET",
    body: init?.body ? JSON.parse(String(init.body)) : undefined,
  });

  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    throw new Error("AI assistant is unavailable right now. Please try again later.");
  }

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  debugAi("raw response", { url, status: res.status, payload });

  if (!res.ok) {
    const message =
      payload && typeof payload === "object"
        ? String(
            (payload as Record<string, unknown>).error ??
              (payload as Record<string, unknown>).message ??
              "Request failed.",
          )
        : "Request failed.";
    throw new Error(message || "AI assistant is unavailable right now.");
  }

  return payload;
};

export const aiService = {
  chat: async (query: string, conversationId?: string) => {
    const data = await requestJson(`${AI_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        user_role: "buyer",
        conversation_id: conversationId ?? null,
        use_llm: true,
      }),
    });

    return {
      answer: (data as Record<string, unknown>)?.answer ??
        "Sorry, I could not process that.",
      suggestedFollowUps:
        (data as Record<string, unknown>)?.suggested_follow_ups ?? [],
      responseId: (data as Record<string, unknown>)?.response_id ?? null,
    };
  },

  estimateCost: async (params: {
    sqft?: number;
    floors?: number;
    quality?: string;
    city?: string;
    bhk?: number;
    bedrooms?: number;
    washrooms?: number;
    kitchens?: number;
    projectType?: string;
    area?: string;
  }) => {
    return await requestJson(`${AI_BASE}/estimate-cost`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sqft: params.sqft,
        floors: params.floors ?? 1,
        quality: params.quality ?? "Standard",
        city: params.city ?? "Lahore",
        bhk: params.bhk,
        bedrooms: params.bedrooms,
        washrooms: params.washrooms,
        kitchens: params.kitchens,
        area: params.area,
        project_type: params.projectType ?? "Full Construction",
        use_llm: false,
      }),
    });
  },

  compareQualities: async (sqft: number, floors: number, city: string) => {
    return await requestJson(
      `${AI_BASE}/estimate-cost/compare?sqft=${sqft}&floors=${floors}&city=${encodeURIComponent(city)}`,
    );
  },

  searchProducts: async (query: string, limit: number = 10) => {
    return await requestJson(
      `${AI_BASE}/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    );
  },

  getRecommendations: async (params: {
    description: string;
    city?: string;
    quality?: string;
    area?: string;
    budget?: string;
    limit?: number;
  }) => {
    const quality = params.quality ?? "Standard";
    const finishingTier = quality.toLowerCase();

    return await requestJson(`${AI_BASE}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: params.description,
        city: params.city ?? null,
        quality: quality === "Luxury" ? "Premium" : quality,
        area: params.area || params.description,
        budget: params.budget || null,
        finishing_tier: finishingTier,
        top_n_per_cat: params.limit ?? 8,
        use_llm: true,
      }),
    });
  },

  getPhases: async () => {
    return await requestJson(`${AI_BASE}/phases`);
  },

  getEstimatorConfig: async () => {
    return await requestJson(`${AI_BASE}/estimator-config`);
  },
};
