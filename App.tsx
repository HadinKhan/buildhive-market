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
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import { ContactPage } from "./pages/ContactPage";
import { AboutPage } from "./pages/AboutPage";
import { SignInPage } from "./pages/SignInPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import EmailVerifyPage from "./pages/EmailVerifyPage";
import { GetStartedPage } from "./pages/GetStartedPage";
import { AccountPage } from "./pages/AccountPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { ServicesPage } from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import { ContractorsPage } from "./pages/ContractorsPage";
import { ContractorProfilePage } from "./pages/ContractorProfilePage";
import { NotificationPage } from "./pages/NotificationPage";
import { SettingsPage } from "./pages/SettingsPage";
import { CostEstimatorPage } from "./pages/CostEstimatorPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { MessagesPage } from "./src/pages/Messages";
import { SupportPage } from "./src/pages/Support";
import { AIChatWidget } from "./components/AIChatWidget";
import { productService } from "./src/services/productService";
import { cartService } from "./src/services/cartService";
import api from "./src/services/api";

// Protected Route wrapper
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  redirectTo?: string;
}> = ({ children, redirectTo = "/signin" }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#07070b",
          color: "#e2e8f0",
          fontSize: "18px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid rgba(124, 58, 237, 0.2)",
              borderTop: "3px solid #a78bfa",
              borderRadius: "50%",
              margin: "0 auto 16px",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p>Loading...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate
      to={`${redirectTo}?returnUrl=${encodeURIComponent(
        `${location.pathname}${location.search}`,
      )}`}
      replace
    />
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
      } catch {
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

    navigate(`/account?tab=messages&participantId=${encodeURIComponent(sellerId)}`);
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

const AccountRoute = ({
  onNavigate,
  onLogout,
}: {
  onNavigate: (page: string, productId?: string) => void;
  onLogout: () => Promise<void>;
}): JSX.Element | null => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#07070b",
          color: "#e2e8f0",
          fontSize: "18px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid rgba(124, 58, 237, 0.2)",
              borderTop: "3px solid #a78bfa",
              borderRadius: "50%",
              margin: "0 auto 16px",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p>Loading...</p>
          <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
        </div>
      </div>
    );
  }

  return user ? (
    <AccountPage user={user} onNavigate={onNavigate} onLogout={onLogout} />
  ) : (
    <Navigate to="/signin" replace />
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

  // Load cart from API when user is authenticated
  React.useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        try {
          setLoadingCart(true);
          const cartItems = await cartService.getCartItems();

          // Ensure cartItems is an array
          if (!Array.isArray(cartItems)) {
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
        } catch {
          // Set empty cart on error
          setCart([]);
        } finally {
          setLoadingCart(false);
        }
      } else {
        // Don't clear cart when logged out - it's stored in backend
      }
    };
    loadCart();
  }, [isAuthenticated]);

  const navigateTo = (page: string, productId?: string) => {
    if (page === "product-detail" && productId) {
      navigate(`/product-detail/${productId}`);
    } else if (page === "contractor-detail" && productId) {
      navigate(`/contractors/${productId}`);
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
    if (!isAuthenticated) {
      toast.info("Please sign in to add items to cart");
      navigate(
        `/signin?returnUrl=${encodeURIComponent(
          `${location.pathname}${location.search}`,
        )}`,
      );
      return;
    }

    try {
      const cartItem = await cartService.addToCart({
        productId: product.id,
        quantity: quantity,
      });

      // Update local cart state
      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product_id === product.id,
        );
        if (existingItem) {
          return prevCart.map((item) =>
            item.product_id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
        return [
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
      });

      toast.success(`${product.name} added to cart!`);
    } catch (error: any) {
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
    if (!isAuthenticated) return;

    try {
      await cartService.removeFromCart(cartItemId);

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
    } catch {
      toast.error("Failed to remove item from cart.");
    }
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1 || !isAuthenticated) return;

    // Optimistically update UI first
    const previousCart = cart;
    setCart((prevCart) => {
      return prevCart.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item,
      );
    });

    try {
      await cartService.updateCartItem(cartItemId, { quantity: newQuantity });
    } catch {
      // Revert optimistic update on error
      setCart(previousCart);
      toast.error("Failed to update quantity.");
    }
  };

  const clearCart = async (silent = false) => {
    if (!isAuthenticated) return;

    const previousCart = cart;
    setCart([]);
    try {
      await cartService.clearCart();
      if (!silent) {
        toast.success("Cart cleared successfully");
      }
    } catch {
      setCart(previousCart);
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

        <Route path="/cost-estimator" element={<CostEstimatorPage />} />

        <Route path="/services/:id" element={<ServiceDetailPage />} />

        <Route path="/contractors" element={<ContractorsPage />} />

        <Route path="/contractors/:id" element={<ContractorProfilePage />} />

        <Route
          path="/contact"
          element={<ContactPage onNavigate={navigateTo} />}
        />

        <Route path="/about" element={<AboutPage onNavigate={navigateTo} />} />

        <Route path="/recommendations" element={<RecommendationsPage />} />

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
                onPlaceOrder={() => clearCart(true)}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-confirmation/:orderId"
          element={
            <ProtectedRoute>
              <OrderConfirmationPage onNavigate={navigateTo} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/signin"
          element={<SignInPage onNavigate={navigateTo} onLogin={handleLogin} />}
        />

        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/verify-email" element={<EmailVerifyPage />} />
        <Route path="/auth/verify-email" element={<EmailVerifyPage />} />

        <Route
          path="/get-started"
          element={
            <GetStartedPage onNavigate={navigateTo} onRegister={handleLogin} />
          }
        />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountRoute onNavigate={navigateTo} onLogout={handleLogout} />
            </ProtectedRoute>
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

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
      <AIChatWidget />
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
