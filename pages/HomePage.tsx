import React, { useState, useEffect } from "react";
import { Icons } from "../components/Icons";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/Button";
import { Category, Product } from "../types";
import {
  productService,
  type Product as ApiProduct,
} from "../src/services/productService";
import { categoryService } from "../src/services/categoryService";

interface HomePageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("All Items");
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  useEffect(() => {
    loadFeaturedProducts();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const apiCategories = await categoryService.getActiveCategories();
      setCategories(apiCategories);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategories([]);
    }
  };

  const loadFeaturedProducts = async () => {
    try {
      const apiProducts = await productService.getFeaturedProducts(8);

      // Convert API products to app Product type
      const converted: Product[] = apiProducts.map(
        (apiProduct: ApiProduct) => ({
          id: apiProduct.id,
          business_id: apiProduct.business_id,
          category_id: apiProduct.category_id,
          name: apiProduct.name,
          slug: apiProduct.slug,
          description: apiProduct.description,
          price: apiProduct.price,
          compare_at_price: apiProduct.compare_at_price,
          track_quantity: apiProduct.track_quantity,
          quantity: apiProduct.quantity,
          weight: apiProduct.weight,
          weight_unit: apiProduct.weight_unit,
          requires_shipping: apiProduct.requires_shipping,
          is_physical: apiProduct.is_physical,
          status: apiProduct.status,
          is_active: apiProduct.is_active,
          is_featured: apiProduct.is_featured,
          created_at: apiProduct.created_at,
          updated_at: apiProduct.updated_at,
          images:
            apiProduct.product_images?.map((img) => ({
              id: img.id,
              product_id: apiProduct.id,
              image_url: img.image_url,
              display_order: img.display_order,
              created_at: img.created_at || new Date().toISOString(),
            })) || [],
          author: apiProduct.businesses?.business_name || "Unknown",
          rating: apiProduct.average_rating || 0,
          sales: apiProduct.total_reviews || 0,
        })
      );

      setFeaturedProducts(converted);
    } catch (error) {
      console.error("Failed to load featured products:", error);
      setFeaturedProducts([]);
    } finally {
      setLoadingFeatured(false);
    }
  };

  const displayProducts = featuredProducts;

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 py-20 lg:py-32">
        {/* Decorative Blobs */}
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-cyan-200 blur-3xl opacity-30"></div>
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-pink-200 blur-3xl opacity-30"></div>

        <div className="container relative mx-auto px-4 text-center">
          {/* Floating Stats Cards - Desktop Only positioning */}
          <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 ml-10">
            <div
              className="relative z-10 w-48 rounded-2xl bg-white p-6 shadow-xl animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              <div className="mb-2 text-3xl font-bold">4500+</div>
              <div className="text-xs text-gray-500">Sellers</div>
              <div className="absolute -bottom-10 -right-10 -z-10 h-24 w-24 rounded-full bg-cyan-100 blur-xl"></div>
            </div>
          </div>

          <div className="hidden lg:block absolute left-32 top-32 ml-10">
            <div className="relative z-10 w-40 rounded-2xl bg-white p-6 shadow-lg rotate-[-6deg]">
              <div className="mb-2 text-2xl font-bold">5000+</div>
              <div className="text-xs text-gray-500">Resources</div>
            </div>
          </div>

          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 mr-10">
            <div
              className="relative z-10 w-48 rounded-2xl bg-white p-6 shadow-xl animate-bounce"
              style={{ animationDuration: "4s" }}
            >
              <div className="mb-2 text-3xl font-bold">Free</div>
              <div className="text-xs text-gray-500">Cost Estimation</div>
              <div className="absolute -bottom-10 -left-10 -z-10 h-24 w-24 rounded-full bg-purple-100 blur-xl"></div>
            </div>
          </div>

          <div className="hidden lg:block absolute right-32 top-32 mr-10">
            <div className="relative z-10 w-40 rounded-2xl bg-white p-6 shadow-lg rotate-[6deg]">
              <div className="mb-2 text-2xl font-bold">35k+</div>
              <div className="text-xs text-gray-500">Equipment</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-20 mx-auto max-w-3xl">
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              100k+ Construction <br />{" "}
              <span className="text-gray-900">Resources</span>
            </h1>
            <p className="mb-10 text-lg text-gray-500">
              Everything you need for your Construction Project
            </p>

            {/* Search Bar */}
            <div className="mx-auto flex max-w-2xl items-center rounded-full bg-white p-2 shadow-lg ring-1 ring-gray-100">
              <div className="hidden sm:flex border-r border-gray-200 px-4">
                <select
                  className="bg-transparent text-sm font-medium text-gray-600 focus:outline-none"
                  aria-label="Select Category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option>All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                placeholder="Search construction material & more..."
                className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const params = new URLSearchParams();
                    if (searchQuery) params.set("search", searchQuery);
                    if (selectedCategory !== "All Categories") {
                      const cat = categories.find(
                        (c) => c.name === selectedCategory
                      );
                      if (cat) params.set("categoryId", cat.id);
                    }
                    window.location.href = `/products?${params.toString()}`;
                  }
                }}
              />
              <button
                onClick={() => {
                  const params = new URLSearchParams();
                  if (searchQuery) params.set("search", searchQuery);
                  if (selectedCategory !== "All Categories") {
                    const cat = categories.find(
                      (c) => c.name === selectedCategory
                    );
                    if (cat) params.set("categoryId", cat.id);
                  }
                  window.location.href = `/products?${params.toString()}`;
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600"
                aria-label="Search Products"
              >
                <Icons.Search className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm text-gray-500">
              <span className="font-semibold text-gray-900">
                Popular Search:
              </span>
              {[
                "Excavator",
                "Cement",
                "Drill",
                "Safety Vest",
                "Bricks",
                "Steel",
              ].map((tag) => (
                <span
                  key={tag}
                  onClick={() => {
                    window.location.href = `/products?search=${tag}`;
                  }}
                  className="rounded-full bg-white px-3 py-1 text-xs shadow-sm cursor-pointer hover:bg-gray-50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Popular Categories</h2>
            <div className="flex gap-2">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-gray-50"
                aria-label="Previous Category"
              >
                <Icons.ArrowLeft className="h-4 w-4" />
              </button>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-gray-50"
                aria-label="Next Category"
              >
                <Icons.ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <div
                onClick={() => onNavigate("products")}
                key={cat.id}
                className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-6 transition-all hover:border-primary/20 hover:shadow-lg"
              >
                <div
                  className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 transition-transform group-hover:scale-110`}
                >
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    <Icons.Tools className="h-8 w-8 text-primary" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("products");
              }}
              className="text-sm font-semibold underline decoration-2 underline-offset-4 hover:text-primary"
            >
              Explore More
            </a>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-slate-50 py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-12 text-center">
            <h2 className="mb-6 text-3xl font-bold">New Arrivals</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "All Items",
                "Tools",
                "Machinery",
                "Cement",
                "Bricks",
                "Safety",
                "Plumbing",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-black text-white"
                      : "bg-white text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {loadingFeatured ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="mt-4 text-sm text-gray-500">
                  Loading products...
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {displayProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button
              variant="gradient"
              size="lg"
              onClick={() => onNavigate("products")}
            >
              View All Products
            </Button>
          </div>
        </div>

        {/* Background Decorative Element */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10">
          <svg width="100" height="200" viewBox="0 0 100 200" fill="none">
            <path
              d="M10 10C50 50 10 90 50 130"
              stroke="#EC4899"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto flex flex-col-reverse gap-16 px-6 lg:flex-row lg:items-center">
          {/* Left Grid */}
          <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2">
            {displayProducts.slice(0, 4).map((product, idx) => (
              <ProductCard
                key={`feat-${idx}`}
                product={product}
                onNavigate={onNavigate}
              />
            ))}
          </div>

          {/* Right Text */}
          <div className="flex-1 space-y-6">
            <div className="relative">
              <div className="absolute -right-6 -top-20 h-64 w-64 rounded-full border-[30px] border-slate-50"></div>
              <h2 className="relative text-3xl font-bold sm:text-4xl">
                Featured Construction Equipment
              </h2>
            </div>
            <p className="max-w-md text-gray-500 leading-relaxed">
              Every month we pick the best machinery and tools for you. This
              month's top industrial equipment has arrived, chosen by our site
              engineers.
            </p>
            <Button
              variant="gradient"
              size="lg"
              onClick={() => onNavigate("products")}
            >
              View All Items
            </Button>
          </div>
        </div>
      </section>

      {/* Weekly Best Selling (Dark) */}
      <section className="bg-dark py-20 text-white relative overflow-hidden">
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 800 400">
            <path
              d="M0 200 Q200 100 400 200 T800 200"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0 250 Q200 150 400 250 T800 250"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0 300 Q200 200 400 300 T800 300"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="mb-4 text-3xl font-bold">
                Weekly Best Selling Products
              </h2>
              <p className="max-w-xl text-gray-400">
                High-demand materials and tools loved by contractors across the
                region.
              </p>
            </div>
            <Button variant="gradient" onClick={() => onNavigate("products")}>
              View All Items
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayProducts.slice(0, 3).map((product, idx) => (
              <div
                key={`dark-${idx}`}
                onClick={() => onNavigate("product-detail", product.id)}
                className="group cursor-pointer relative bg-slate-800 rounded-2xl p-4 hover:bg-slate-750 transition-colors border border-slate-700"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-700 mb-4">
                  {product.images?.[0]?.image_url ? (
                    <img
                      src={product.images[0].image_url}
                      className="h-full w-full object-cover"
                      alt={product.name}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-500">
                      <Icons.Image className="h-12 w-12 stroke-1" />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white max-w-[70%]">
                    {product.name}
                  </h3>
                  <button
                    className="h-8 w-8 rounded-full bg-white text-dark flex items-center justify-center hover:scale-110 transition-transform"
                    aria-label="View Product Details"
                  >
                    <Icons.ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  by {product.author}
                </p>
                <div className="flex items-center justify-between border-t border-slate-700 pt-4">
                  <div>
                    <span className="text-xl font-bold">
                      PKR {(product.price * 3).toLocaleString()}
                    </span>
                    <span className="ml-2 text-xs text-gray-500 line-through">
                      PKR 950,000
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-slate-600 text-white hover:bg-slate-700 hover:text-white"
                    >
                      Explore
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                  <span>1200 Sales</span>
                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Icons.Star key={s} className="h-3 w-3 fill-current" />
                    ))}
                    <span className="ml-1 text-gray-400">(18)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
