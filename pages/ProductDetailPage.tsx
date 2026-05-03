import React, { useMemo, useState } from "react";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";
import { Product } from "../types";

interface ProductDetailPageProps {
  product: Product;
  onNavigate: (page: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onNavigate,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedImage, setSelectedImage] = useState(0);

  const galleryImages = useMemo(
    () =>
      (product.images || [])
        .filter((img) => img.product_id === product.id && Boolean(img.image_url))
        .sort((a, b) => a.display_order - b.display_order)
        .map((img) => img.image_url),
    [product.id, product.images]
  );
  const activeImage = galleryImages[selectedImage] || galleryImages[0] || "";

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  const handleBuyNow = () => {
    onAddToCart(product, quantity);
    onNavigate("checkout");
  };

  return (
    <div className="min-h-screen bg-white pb-20 pt-6">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <span
            className="cursor-pointer hover:text-primary"
            onClick={() => onNavigate("home")}
          >
            Shop
          </span>
          <Icons.ChevronRight className="h-4 w-4" />
          <span
            className="cursor-pointer hover:text-primary"
            onClick={() => onNavigate("products")}
          >
            Products
          </span>
          <Icons.ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900 truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Images */}
          <div className="flex flex-col gap-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-gray-100">
              <img
                src={activeImage}
                alt={product.title}
                className="h-full w-full object-cover transition-all duration-500"
              />
              <button
                aria-label="Add to wishlist"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-500 backdrop-blur-sm transition-colors hover:text-red-500"
              >
                <Icons.Heart className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  aria-label={`View image ${idx + 1}`}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square overflow-hidden rounded-2xl border-2 transition-all ${
                    selectedImage === idx
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <div className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-500">
              Construction Material
            </div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              {product.name}
            </h1>

            <div className="mb-6 flex items-center gap-2">
              <div className="flex text-yellow-400">
                <Icons.Star className="h-4 w-4 fill-current" />
                <span className="ml-1 font-bold text-gray-900">
                  {product.rating || 0}
                </span>
              </div>
              <span className="text-gray-400">
                ({product.sales || 0} reviews)
              </span>
            </div>

            <div className="mb-8 text-3xl font-bold text-gray-900">
              PKR {product.price.toLocaleString()}
              {product.compare_at_price && (
                <span className="ml-3 text-lg font-medium text-gray-400 line-through">
                  PKR {product.compare_at_price.toLocaleString()}
                </span>
              )}
            </div>

            <p className="mb-8 text-base leading-relaxed text-gray-500">
              {product.description ||
                "Designed for professional durability and performance, this construction essential meets all safety standards. Ideal for heavy-duty applications, providing reliability when you need it most."}
            </p>

            <Button
              className="mb-8 w-full bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30 sm:w-auto"
              size="lg"
              onClick={handleAddToCart}
            >
              <Icons.Cart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>

            {/* Stock Status */}
            <div className="mb-8">
              <div className="flex items-center gap-2">
                {product.quantity > 0 ? (
                  <>
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600">
                      {product.quantity} items in stock
                    </span>
                  </>
                ) : (
                  <>
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <span className="text-sm text-gray-600">Out of stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <div className="mb-3 text-sm font-medium text-gray-900">
                Quantity
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-white hover:text-primary hover:shadow-sm"
                  >
                    <Icons.Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-white hover:text-primary hover:shadow-sm"
                  >
                    <Icons.Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {product.stock || 50} pieces available
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex gap-2 rounded-full bg-gray-100 p-1">
                {["Overview", "Specs", "Guide", "Reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      activeTab === tab
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="mt-6">
                {activeTab === "Overview" && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900">
                      About this product
                    </h3>
                    <p className="text-sm text-gray-500">
                      The {product.title} is designed with industry
                      professionals in mind. Whether you are managing a
                      large-scale commercial project or a home renovation, this
                      tool provides the efficiency and safety you expect.
                    </p>
                    <h3 className="font-bold text-gray-900">
                      Feature Highlights
                    </h3>
                    <ul className="list-inside list-disc space-y-2 text-sm text-gray-500">
                      <li>Industrial grade durability</li>
                      <li>Certified safety standards (ISO 9001)</li>
                      <li>High efficiency performance</li>
                      <li>All-weather protection</li>
                      <li>1 Year Manufacturer Warranty</li>
                    </ul>
                  </div>
                )}
                {activeTab === "Specs" && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="font-medium text-gray-900">Weight</div>
                    <div className="text-gray-500">15 kg</div>
                    <div className="font-medium text-gray-900">Dimensions</div>
                    <div className="text-gray-500">45 x 30 x 20 cm</div>
                    <div className="font-medium text-gray-900">Material</div>
                    <div className="text-gray-500">
                      Reinforced Steel / Composite
                    </div>
                    <div className="font-medium text-gray-900">Origin</div>
                    <div className="text-gray-500">Imported</div>
                  </div>
                )}
                {activeTab === "Guide" && (
                  <p className="text-sm text-gray-500">
                    User manuals and safety guides are available for download
                    after purchase.
                  </p>
                )}
                {activeTab === "Reviews" && (
                  <p className="text-sm text-gray-500">No reviews yet.</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                className="flex-1 bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30"
                size="lg"
                onClick={handleAddToCart}
              >
                <Icons.Cart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-gray-300 hover:border-gray-900 hover:bg-gray-50"
                size="lg"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
