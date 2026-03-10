import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Icons } from "../components/Icons";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/Button";
import { Product } from "../types";
import {
  productService,
  type Product as ApiProduct,
} from "../src/services/productService";
import {
  categoryService,
  type Category,
} from "../src/services/categoryService";

interface ProductsPageProps {
  onNavigate: (page: string, productId?: string) => void;
}

// Sidebar Component
const FilterSidebar: React.FC<{
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}> = ({ categories, selectedCategory, onCategoryChange }) => {
  const [openCategory, setOpenCategory] = useState(true);
  const [openRating, setOpenRating] = useState(true);
  const [openDate, setOpenDate] = useState(true);

  return (
    <div className="w-full space-y-6 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      {/* Category Filter */}
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => setOpenCategory(!openCategory)}
          className="flex w-full items-center justify-between py-2 text-sm font-bold text-gray-900"
        >
          Category
          {openCategory ? (
            <Icons.ChevronUp className="h-4 w-4" />
          ) : (
            <Icons.ChevronDown className="h-4 w-4" />
          )}
        </button>
        {openCategory && (
          <div className="mt-2 space-y-2">
            <div
              onClick={() => onCategoryChange("")}
              className={`flex items-center justify-between text-sm cursor-pointer ${
                !selectedCategory
                  ? "font-bold text-gray-900"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              <span>All Categories</span>
            </div>
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`flex items-center justify-between text-xs cursor-pointer ${
                  selectedCategory === cat.id
                    ? "font-bold text-primary"
                    : "text-gray-500 hover:text-primary"
                }`}
              >
                <span>{cat.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => setOpenRating(!openRating)}
          className="flex w-full items-center justify-between py-2 text-sm font-bold text-gray-900"
        >
          Rating
          {openRating ? (
            <Icons.ChevronUp className="h-4 w-4" />
          ) : (
            <Icons.ChevronDown className="h-4 w-4" />
          )}
        </button>
        {openRating && (
          <div className="mt-2 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
              />
              <span className="text-xs text-gray-500">View All</span>
              <span className="ml-auto text-xs text-gray-400">(1859)</span>
            </label>
            {[1, 2, 3, 4, 5].map((star) => (
              <label
                key={star}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="rating"
                  className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                />
                <span className="text-xs text-gray-500">
                  {star} Star and above
                </span>
                <span className="ml-auto text-xs text-gray-400">
                  ({Math.floor(Math.random() * 8000)})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const ProductsPage: React.FC<ProductsPageProps> = ({ onNavigate }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  // Load categories on mount and set initial category, page, and search from URL
  useEffect(() => {
    loadCategories();
    const categoryFromUrl = searchParams.get("categoryId");
    const pageFromUrl = searchParams.get("page");
    const searchFromUrl = searchParams.get("search");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    if (pageFromUrl) {
      setCurrentPage(parseInt(pageFromUrl, 10));
    }
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load products when filters change
  useEffect(() => {
    loadProducts();
  }, [debouncedSearchTerm, selectedCategory, currentPage]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getActiveCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Start with minimal params to test if ANY products exist
      const params: any = {
        page: currentPage,
        limit,
      };

      // Only add filters if they exist
      if (debouncedSearchTerm) {
        params.search = debouncedSearchTerm;
        console.log(
          "🔍 [ProductsPage] Adding search filter:",
          debouncedSearchTerm
        );
      }
      if (selectedCategory) {
        params.categoryId = selectedCategory;
        console.log(
          "🔍 [ProductsPage] Adding category filter:",
          selectedCategory
        );
      }

      console.log("🔍 [ProductsPage] Final params being sent:", params);

      const response = await productService.getProducts(params);

      console.log("📦 [ProductsPage] Response structure:", {
        hasProducts: !!response.products,
        isArray: Array.isArray(response.products),
        productsCount: response.products?.length,
        meta: response.meta,
        totalPages: response.meta?.totalPages,
      });

      // Log the first product to see what images look like
      if (response.products.length > 0) {
        console.log(
          "🖼️ [ProductsPage] First product raw data:",
          response.products[0]
        );
        console.log(
          "🖼️ [ProductsPage] Product images field:",
          response.products[0].product_images
        );
        console.log(
          "🖼️ [ProductsPage] All product fields:",
          Object.keys(response.products[0])
        );
        // Check for alternative field names
        console.log(
          "🖼️ [ProductsPage] Checking alternative fields - images:",
          response.products[0].images
        );
        console.log(
          "🖼️ [ProductsPage] Checking alternative fields - productImages:",
          response.products[0].productImages
        );
      }

      // Convert API products to app Product type
      const convertedProducts: Product[] = response.products.map(
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
          images: Array.isArray(apiProduct.product_images)
            ? apiProduct.product_images.map((img: any) => ({
                id: img.id,
                product_id: apiProduct.id,
                image_url: img.image_url,
                display_order: img.display_order || 0,
                created_at: img.created_at || new Date().toISOString(),
              }))
            : [],
          author: apiProduct.businesses?.business_name || "Unknown",
          rating: apiProduct.average_rating || 0,
          sales: apiProduct.total_reviews || 0,
        })
      );

      console.log(
        "✅ [ProductsPage] Converted products:",
        convertedProducts.slice(0, 2)
      );
      console.log(
        "✅ [ProductsPage] First product images:",
        convertedProducts[0]?.images
      );
      setProducts(convertedProducts);
      setTotalPages(response.meta.totalPages || 1);

      if (convertedProducts.length === 0) {
        console.warn(
          "⚠️ [ProductsPage] No products found with params:",
          params
        );
      }
    } catch (error) {
      console.error("❌ [ProductsPage] Failed to load products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // When searching, clear category to search across all products
    if (value && selectedCategory) {
      console.log(
        "🔍 [ProductsPage] Search initiated, clearing category filter"
      );
      setSelectedCategory("");
      // Update URL to remove categoryId
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("categoryId");
      setSearchParams(newParams);
    }
    // Page reset happens in the debounce useEffect
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page on category change
    // Update URL
    const newParams = new URLSearchParams();
    newParams.set("page", "1");
    if (categoryId) {
      newParams.set("categoryId", categoryId);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSelectedCategory("");
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
    console.log("🧹 [ProductsPage] Cleared all filters");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Update URL with page parameter
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    if (selectedCategory) {
      newParams.set("categoryId", selectedCategory);
    }
    setSearchParams(newParams);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const gridProducts = products;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 py-16">
        <div className="absolute left-[10%] top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-gradient-to-tr from-cyan-300 to-blue-400 opacity-80 blur-sm"></div>
        <div className="absolute right-[10%] top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-gradient-to-tr from-violet-300 to-purple-400 opacity-80 blur-sm"></div>

        <div className="container relative mx-auto px-4 text-center z-10">
          <h1 className="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            100k+ Construction Resources <br /> Available
          </h1>
          <p className="mb-8 text-sm text-gray-500">
            Starting a construction project? Don't worry, we got you covered.
          </p>

          <div className="mx-auto flex max-w-xl items-center rounded-full bg-white p-1.5 shadow-lg shadow-blue-100/50">
            <input
              type="text"
              placeholder="Search Construction Material & more..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-transparent px-6 py-2 text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none"
            />
            <button
              onClick={() => loadProducts()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600 shadow-md shadow-blue-500/30"
              aria-label="Search products"
              title="Search products"
            >
              <Icons.Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Column - Filters */}
          <div className="w-full lg:w-64 flex-shrink-0 hidden lg:block">
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* Right Column - Content */}
          <div className="flex-1">
            {/* Filter Top Bar */}
            <div className="mb-6 space-y-4">
              {/* Active Filters Display */}
              {(searchTerm || selectedCategory) && (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-gray-600 font-medium">
                    Active filters:
                  </span>
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      <Icons.Search className="h-3 w-3" />
                      Search: "{searchTerm}"
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                      <Icons.Filter className="h-3 w-3" />
                      Category:{" "}
                      {categories.find((c) => c.id === selectedCategory)
                        ?.name || "Selected"}
                    </span>
                  )}
                </div>
              )}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="gap-2 rounded-xl px-4 py-2 text-sm text-primary border-primary/20 bg-primary/5 hover:bg-primary/10"
                  >
                    <Icons.Filter className="h-4 w-4" /> Filters
                  </Button>
                  {(searchTerm || selectedCategory) && (
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="gap-2 rounded-xl px-4 py-2 text-sm text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
                    >
                      <Icons.Close className="h-4 w-4" /> Clear All
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {[
                    "All Items",
                    "Best Match",
                    "Best Rating",
                    "Trending",
                    "Best Offers",
                    "Best Selling",
                  ].map((filter, i) => (
                    <button
                      key={filter}
                      className={`rounded-full px-4 py-1.5 text-xs font-medium border transition-colors ${
                        i === 0
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                  <div className="ml-2 flex items-center gap-1 border-l pl-4 border-gray-200">
                    <button
                      className="p-1.5 text-gray-400 hover:text-gray-900"
                      title="List view"
                      aria-label="List view"
                    >
                      <Icons.List className="h-5 w-5" />
                    </button>
                    <button
                      className="p-1.5 text-white bg-slate-900 rounded"
                      title="Grid view"
                      aria-label="Grid view"
                    >
                      <Icons.Grid className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Secondary Filters */}
              <div className="flex flex-wrap items-center gap-4 border-t border-b border-gray-100 py-4">
                <div className="flex items-center gap-4 text-xs font-medium text-gray-900">
                  <span>Tag</span>
                  <div className="relative">
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by tag..."
                      className="w-64 rounded-md border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs focus:border-primary focus:outline-none"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                  <p className="mt-4 text-sm text-gray-500">
                    Loading products...
                  </p>
                </div>
              </div>
            ) : gridProducts.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Icons.Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-lg font-medium text-gray-900">
                    No products found
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Try adjusting your filters or search term
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {gridProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="grid"
                    showPlaceholder={true}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && gridProducts.length > 0 && (
              <div className="mt-12 flex justify-end">
                <div className="flex gap-2">
                  {currentPage > 1 && (
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="flex h-8 items-center gap-1 rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <Icons.ArrowLeft className="h-3 w-3" /> Prev
                    </button>
                  )}

                  {(() => {
                    // Calculate page range to display
                    const maxPagesToShow = 5;
                    let startPage = Math.max(
                      1,
                      currentPage - Math.floor(maxPagesToShow / 2)
                    );
                    let endPage = Math.min(
                      totalPages,
                      startPage + maxPagesToShow - 1
                    );

                    // Adjust start if we're near the end
                    if (endPage - startPage + 1 < maxPagesToShow) {
                      startPage = Math.max(1, endPage - maxPagesToShow + 1);
                    }

                    return Array.from(
                      { length: endPage - startPage + 1 },
                      (_, i) => startPage + i
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`h-8 w-8 rounded-md text-xs font-medium ${
                          page === currentPage
                            ? "bg-slate-900 text-white shadow-md"
                            : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ));
                  })()}

                  {currentPage < totalPages && (
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="flex h-8 items-center gap-1 rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-500 hover:bg-gray-50"
                    >
                      Next <Icons.ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
