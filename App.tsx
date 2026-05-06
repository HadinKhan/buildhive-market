import React, { useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { Icons } from "./components/Icons";
import { Header, Footer } from "./components/Layout";
import { Category, Product, CartItem, User } from "./types";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ContactPage } from "./pages/ContactPage";
import { AboutPage } from "./pages/AboutPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogDetailPage } from "./pages/BlogDetailPage";
import { SignInPage } from "./pages/SignInPage";
import { GetStartedPage } from "./pages/GetStartedPage";
import { AccountPage } from "./pages/AccountPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { ServicesPage } from "./pages/ServicesPage";
import { NotificationPage } from "./pages/NotificationPage";
import { SettingsPage } from "./pages/SettingsPage";
import { MessagesPage } from "./src/pages/Messages";
import { SupportPage } from "./src/pages/Support";
import { productService } from "./src/services/productService";
import { cartService } from "./src/services/cartService";
import api from "./src/services/api";

// Protected Route wrapper
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  redirectTo?: string;
}> = ({ children, redirectTo = "/signin" }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to={redirectTo} replace />
  );
};

// Wrapper component to fetch product by ID
const ProductDetailWrapper: React.FC<{
  onNavigate: (page: string, productId?: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}> = ({ onNavigate, onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        const apiProduct = await productService.getProductById(id);
        const productImages = (apiProduct.product_images || [])
          .filter(
            (image) =>
              !("product_id" in image) || image.product_id === apiProduct.id,
          )
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          .map((image) => ({
            id: image.id,
            product_id: apiProduct.id,
            image_url: image.image_url,
            display_order: image.display_order || 0,
            created_at: image.created_at || "",
          }));

        const converted: Product = {
          id: apiProduct.id,
          business_id: apiProduct.business_id,
          seller_id:
            apiProduct.seller_id ||
            apiProduct.businesses?.user_id ||
            apiProduct.businesses?.userId,
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
          images: productImages,
          author: apiProduct.businesses?.business_name || "Unknown",
          rating: apiProduct.average_rating || 0,
          sales: apiProduct.total_reviews || 0,
        };
        setProduct(converted);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleMessageSeller = async (currentProduct: Product) => {
    const sellerId = currentProduct.seller_id;

    if (!sellerId) {
      toast.error("Seller information is unavailable right now.");
      return;
    }

    navigate(`/messages?participantId=${encodeURIComponent(sellerId)}`);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found
      </div>
    );

  return (
    <ProductDetailPage
      product={product}
      onNavigate={onNavigate}
      onAddToCart={onAddToCart}
      onMessageSeller={handleMessageSeller}
    />
  );
};

const BlogDetailWrapper: React.FC<{
  onNavigate: (page: string) => void;
}> = ({ onNavigate }) => {
  const { postId } = useParams<{ postId: string }>();

  return (
    <BlogDetailPage
      postId={postId || ""}
      onNavigate={onNavigate}
      onBack={() => onNavigate(postId ? `blog?post=${postId}` : "blog")}
    />
  );
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(false);

  // Debug: Monitor cart state changes
  React.useEffect(() => {
    console.log("🔍 [CART STATE CHANGED]", {
      cartLength: cart.length,
      items: cart.map((item) => ({
        id: item.id,
        product: item.product?.name,
        quantity: item.quantity,
      })),
      timestamp: new Date().toISOString(),
    });
  }, [cart]);

  // Debug: Monitor authentication state changes
  React.useEffect(() => {
    console.log("🔐 [AUTH STATE CHANGED]", {
      isAuthenticated,
      user: user?.fullName,
      timestamp: new Date().toISOString(),
    });
  }, [isAuthenticated, user]);

  // Load cart from API when user is authenticated
  React.useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        try {
          setLoadingCart(true);
          const cartItems = await cartService.getCartItems();
          console.log(
            "📦 Loaded cart items from API:",
            cartItems?.length || 0,
            "items",
          );
          console.log("📝 Cart items data:", cartItems);

          // Ensure cartItems is an array
          if (!Array.isArray(cartItems)) {
            console.error(
              "⚠️ Cart items is not an array:",
              typeof cartItems,
              cartItems,
            );
            setCart([]);
            return;
          }

          // Transform API cart items to match CartItem type
          const transformedItems: CartItem[] = cartItems.map((item) => ({
            id: item.id,
            user_id: item.user_id,
            product_id: item.product_id,
            quantity: item.quantity,
            product: item.product
              ? {
                  id: item.product.id,
                  name: item.product.name,
                  slug: item.product.slug,
                  price: item.product.price,
                  compare_at_price: item.product.compare_at_price,
                  quantity: item.product.quantity,
                  images: [],
                  author: item.product.business_name || "Unknown",
                  category_id: "",
                  description: "",
                  track_quantity: true,
                  weight_unit: "kg",
                  requires_shipping: true,
                  is_physical: true,
                  status: "approved",
                  is_active: true,
                  is_featured: false,
                  created_at: "",
                  updated_at: "",
                  rating: 0,
                  sales: 0,
                  business_id:
                    (item.product as any).business_id ||
                    (item.product as any).businessId ||
                    "",
                }
              : undefined,
            created_at: item.created_at,
            updated_at: item.updated_at,
          }));
          setCart(transformedItems);
          console.log(
            "✅ Cart state updated:",
            transformedItems.length,
            "items",
          );
        } catch (error) {
          console.error("❌ Failed to load cart:", error);
          console.error("Error details:", {
            message: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
          });
          // Set empty cart on error
          setCart([]);
        } finally {
          setLoadingCart(false);
        }
      } else {
        // Don't clear cart when logged out - it's stored in backend
        console.log("👤 User not authenticated, keeping current cart state");
      }
    };
    loadCart();
  }, [isAuthenticated]);

  const navigateTo = (page: string, productId?: string) => {
    if (page === "product-detail" && productId) {
      navigate(`/product-detail/${productId}`);
    } else {
      navigate(`/${page === "home" ? "" : page}`);
    }
    window.scrollTo(0, 0);
  };

  const handleLogin = (name: string, email: string) => {
    // This is now handled by AuthContext, just navigate
    navigateTo("home");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Cart Functions
  const addToCart = async (product: Product, quantity: number) => {
    console.log("🛒 [addToCart] Called with:", {
      productId: product.id,
      productName: product.name,
      quantity,
      isAuthenticated,
    });

    if (!isAuthenticated) {
      // Redirect to sign in
      console.log(
        "❌ [addToCart] User not authenticated, redirecting to signin",
      );
      toast.info("Please sign in to add items to cart");
      navigate("/signin");
      return;
    }

    try {
      console.log("CART BUSINESS CHECK:", {
        existing: cart[0]?.product?.business_id,
        new: product.business_id,
      });

      if (
        cart.length > 0 &&
        cart[0]?.product?.business_id !== product.business_id
      ) {
        const confirmed = window.confirm(
          "Cart has items from another seller. Clear cart and continue?",
        );
        if (!confirmed) return;
        await cartService.clearCart();
        setCart([]);
      }

      console.log("📤 [addToCart] Calling API to add item...");
      const cartItem = await cartService.addToCart({
        productId: product.id,
        quantity: quantity,
      });
      console.log("✅ [addToCart] API response:", cartItem);

      // Update local cart state
      setCart((prevCart) => {
        console.log(
          "🔄 [addToCart] Updating cart state. Previous cart:",
          prevCart.length,
          "items",
        );
        const existingItem = prevCart.find(
          (item) => item.product_id === product.id,
        );
        if (existingItem) {
          console.log("♻️ [addToCart] Item exists, updating quantity");
          return prevCart.map((item) =>
            item.product_id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
        console.log("➕ [addToCart] Adding new item to cart");
        const newCart = [
          ...prevCart,
          {
            id: cartItem.id,
            user_id: cartItem.user_id,
            product_id: product.id,
            quantity: quantity,
            product: {
              ...product,
              business_id: product.business_id,
            },
            created_at: cartItem.created_at,
            updated_at: cartItem.updated_at,
          },
        ];
        console.log("📦 [addToCart] New cart state:", newCart.length, "items");
        return newCart;
      });

      toast.success(`${product.name} added to cart!`);
    } catch (error: any) {
      console.error("Failed to add to cart:", error);
      console.error("Error response:", error.response?.data);
      console.error("Validation errors:", error.response?.data?.errors);
      const validationErrors =
        error.response?.data?.errors
          ?.map((e: any) => e.message || e)
          .join(", ") || "";
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to add item to cart. Please try again.";
      toast.error(
        `${errorMessage}${validationErrors ? ": " + validationErrors : ""}`,
      );
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    console.log(
      "🗑️ [removeFromCart] Called with cartItemId:",
      cartItemId,
      "isAuthenticated:",
      isAuthenticated,
    );
    if (!isAuthenticated) return;

    try {
      console.log("📤 [removeFromCart] Calling API to remove item...");
      await cartService.removeFromCart(cartItemId);
      console.log("✅ [removeFromCart] API call successful");

      // Reload cart to ensure IDs are fresh
      const cartItems = await cartService.getCartItems();
      if (Array.isArray(cartItems)) {
        const transformedItems: CartItem[] = cartItems.map((item) => ({
          id: item.id,
          user_id: item.user_id,
          product_id: item.product_id,
          quantity: item.quantity,
          product: item.product
            ? {
                id: item.product.id,
                name: item.product.name,
                slug: item.product.slug,
                price: item.product.price,
                compare_at_price: item.product.compare_at_price,
                quantity: item.product.quantity,
                images: [],
                author: item.product.business_name || "Unknown",
                category_id: "",
                description: "",
                track_quantity: true,
                weight_unit: "kg",
                requires_shipping: true,
                is_physical: true,
                status: "approved",
                is_active: true,
                is_featured: false,
                created_at: "",
                updated_at: "",
                rating: 0,
                sales: 0,
              }
            : undefined,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
        setCart(transformedItems);
      }

      toast.success("Item removed from cart");
    } catch (error) {
      console.error("❌ [removeFromCart] Failed to remove from cart:", error);
      toast.error("Failed to remove item from cart.");
    }
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    console.log("🔢 [updateQuantity] Called with:", {
      cartItemId,
      newQuantity,
      isAuthenticated,
    });
    if (newQuantity < 1 || !isAuthenticated) return;

    // Optimistically update UI first
    const previousCart = cart;
    setCart((prevCart) => {
      console.log(
        "🔄 [updateQuantity] Optimistically updating cart state. Previous:",
        prevCart.length,
        "items",
      );
      const newCart = prevCart.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item,
      );
      console.log(
        "📦 [updateQuantity] New cart state:",
        newCart.length,
        "items",
      );
      return newCart;
    });

    try {
      console.log("📤 [updateQuantity] Calling API to update quantity...");
      await cartService.updateCartItem(cartItemId, { quantity: newQuantity });
      console.log("✅ [updateQuantity] API call successful");
    } catch (error) {
      console.error("❌ [updateQuantity] Failed to update quantity:", error);
      // Revert optimistic update on error
      setCart(previousCart);
      toast.error("Failed to update quantity.");
    }
  };

  const clearCart = async () => {
    console.log("🧹 [clearCart] Called. isAuthenticated:", isAuthenticated);
    if (!isAuthenticated) return;

    // Confirmation dialog
    if (!window.confirm("Are you sure you want to clear your entire cart?")) {
      console.log("❌ [clearCart] User cancelled");
      return;
    }

    try {
      console.log("📤 [clearCart] Calling API to clear cart...");
      await cartService.clearCart();
      console.log("✅ [clearCart] API call successful");
      console.log("🗑️ [clearCart] Setting cart to empty array");
      setCart([]);
      console.log("📦 [clearCart] Cart cleared");
      toast.success("Cart cleared successfully");
    } catch (error) {
      console.error("❌ [clearCart] Failed to clear cart:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/** Keep the header highlight tied to the current router path */}
      <Header
        onNavigate={navigateTo}
        activePage={
          location.pathname.replace(/^\/+/, "").split("/")[0] || "home"
        }
        cartItemCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        user={user}
        onLogout={handleLogout}
      />

      <Routes>
        <Route path="/" element={<HomePage onNavigate={navigateTo} />} />

        <Route
          path="/products"
          element={
            <ProductsPage
              onNavigate={navigateTo}
              initialCategory={new URLSearchParams(location.search).get(
                "categoryId",
              )}
              onAddToCart={addToCart}
            />
          }
        />

        {/* Categories page removed per project cleanup */}

        <Route
          path="/services"
          element={<ServicesPage onNavigate={navigateTo} />}
        />

        <Route
          path="/contact"
          element={<ContactPage onNavigate={navigateTo} />}
        />

        <Route path="/about" element={<AboutPage onNavigate={navigateTo} />} />

        <Route path="/blog" element={<BlogPage onNavigate={navigateTo} />} />

        <Route
          path="/blog/:postId"
          element={<BlogDetailWrapper onNavigate={navigateTo} />}
        />

        <Route
          path="/product-detail/:id"
          element={
            <ProductDetailWrapper
              onNavigate={navigateTo}
              onAddToCart={addToCart}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage
                cartItems={cart}
                onNavigate={navigateTo}
                onRemoveFromCart={removeFromCart}
                onUpdateQuantity={updateQuantity}
                onClearCart={clearCart}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationPage onNavigate={navigateTo} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage
                cartItems={cart}
                onNavigate={navigateTo}
                onPlaceOrder={clearCart}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/signin"
          element={<SignInPage onNavigate={navigateTo} onLogin={handleLogin} />}
        />

        <Route
          path="/get-started"
          element={
            <GetStartedPage onNavigate={navigateTo} onRegister={handleLogin} />
          }
        />

        <Route
          path="/account"
          element={
            user ? (
              <AccountPage
                user={user}
                onNavigate={navigateTo}
                onLogout={() => {
                  handleLogout();
                  navigate("/");
                }}
              />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />

        <Route path="/terms" element={<TermsPage />} />

        <Route path="/privacy" element={<PrivacyPage />} />

        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <SupportPage />
            </ProtectedRoute>
          }
        />

        {/* FAQ page removed per project cleanup */}

        <Route
          path="/settings"
          element={<SettingsPage onNavigate={navigateTo} />}
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        aria-label="Notifications"
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
