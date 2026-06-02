const AI_BASE = "https://ai-backend-production-d13d.up.railway.app";

const requestJson = async (url: string, init?: RequestInit) => {
  const res = await fetch(url, init);
  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const message =
      payload && typeof payload === "object"
        ? String(
            (payload as Record<string, unknown>).error ??
              (payload as Record<string, unknown>).message ??
              "Request failed.",
          )
        : "Request failed.";
    throw new Error(message);
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

  getPhases: async () => {
    return await requestJson(`${AI_BASE}/phases`);
  },

  getEstimatorConfig: async () => {
    return await requestJson(`${AI_BASE}/estimator-config`);
  },
};
