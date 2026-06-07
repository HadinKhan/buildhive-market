const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";

type ImageSource = {
  images?: Array<{ image_url?: string | null }>;
  product_images?: Array<{ image_url?: string | null }>;
  image_url?: string | null;
  image?: string | null;
  thumbnail?: string | null;
};

export const resolveMarketplaceImageSrc = (source: ImageSource | null | undefined) => {
  const rawImage =
    source?.images?.[0]?.image_url ||
    source?.product_images?.[0]?.image_url ||
    source?.image_url ||
    source?.image ||
    source?.thumbnail ||
    null;

  if (!rawImage || typeof rawImage !== "string") {
    return null;
  }

  if (
    rawImage.startsWith("http://") ||
    rawImage.startsWith("https://") ||
    rawImage.startsWith("data:") ||
    rawImage.startsWith("blob:")
  ) {
    return rawImage;
  }

  if (rawImage.startsWith("/")) {
    return `${API_BASE_URL}${rawImage}`;
  }

  if (SUPABASE_URL && /^(product-images|products|public)\//i.test(rawImage)) {
    const cleanPath = rawImage.replace(/^public\//i, "");
    return `${SUPABASE_URL.replace(/\/+$/, "")}/storage/v1/object/public/${cleanPath}`;
  }

  return rawImage;
};

export const getMarketplaceInitials = (label?: string | null) => {
  const text = (label || "").trim();
  if (!text) {
    return "BH";
  }

  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};
