import React, { useState, useEffect, useRef } from "react";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";
import { User } from "../types";
import { useAuth } from "../src/context/AuthContext";
import {
  userService,
  UserProfile,
  UpdateProfileData,
  Address,
  CreateAddressData,
} from "../src/services/userService";
import {
  Order,
  OrderTracking,
  orderService,
} from "../src/services/orderService";

interface AccountPageProps {
  user: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  user,
  onNavigate,
  onLogout,
}) => {
  const { refreshUser } = useAuth();

  // Orders state for dashboard and orders tab
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [orderTracking, setOrderTracking] = useState<OrderTracking | null>(
    null
  );
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    // Fetch orders for the logged-in user only
    const fetchOrders = async () => {
      setOrdersLoading(true);
      setOrdersError(null);
      try {
        // Use the correct response shape: { orders, meta }
        const data = await (
          await import("../src/services/orderService")
        ).orderService.getOrders();
        // Filter to only show orders for the logged-in user
        const userOrders = Array.isArray(data.orders)
          ? data.orders.filter((order: Order) => order.user_id === user.id)
          : [];

        // Debug: Log first order to see actual data structure
        if (userOrders.length > 0) {
        }

        setOrders(userOrders);
      } catch (err: any) {
        setOrdersError("Failed to load orders");
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [user.id]);
  const [activeTab, setActiveTab] = useState("dashboard");
  // Use user prop data directly instead of fetching from API to avoid 403 errors
  // Handle both camelCase (from AuthContext) and snake_case (from types.ts) user objects
  const profileImage = (user as any).profileImage || user.profile_image || null;
  const fullName = (user as any).fullName || user.full_name || "";

  console.log("👤 User object:", user);
  console.log("👤 Profile image:", profileImage);

  const [profile, setProfile] = useState<UserProfile | null>({
    id: user.id,
    email: user.email,
    full_name: fullName,
    phone: user.phone,
    role: user.role,
    email_verified: true,
    phone_verified: false,
    profile_image: profileImage,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [editProfile, setEditProfile] = useState<UpdateProfileData>({
    full_name: fullName,
    phone: user.phone,
    profile_image: profileImage,
  });

  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [profileImageUploading, setProfileImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Address state
  const [address, setAddress] = useState<Address | null>(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState<CreateAddressData>({
    address_type: "shipping",
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Pakistan",
    is_default: true,
  });
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressSuccess, setAddressSuccess] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Status filter for orders page
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditProfile({ ...editProfile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditSuccess(null);
    setEditError(null);
    try {
      const updated = await userService.updateProfile(user.id, editProfile);
      setProfile(updated);
      setEditSuccess("Profile updated successfully.");
    } catch (err: any) {
      setEditError("Failed to update profile.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setProfileImageUploading(true);
    setEditError(null);
    try {
      const url = await userService.uploadProfileImage(user.id, file);
      console.log("📸 Profile image URL received:", url);
      // If URL doesn't start with http, prepend base URL
      const imageUrl = url.startsWith("http")
        ? url
        : `http://localhost:3000${url}`;
      console.log("📸 Full image URL:", imageUrl);
      setEditProfile((prev) => ({ ...prev, profile_image: imageUrl }));
      setProfile((prev) =>
        prev ? { ...prev, profile_image: imageUrl } : prev
      );

      // Refresh user in AuthContext to update profile image globally
      try {
        await refreshUser();
        console.log("✅ AuthContext user refreshed with new profile image");
      } catch (refreshErr) {
        console.warn("⚠️ Failed to refresh AuthContext user:", refreshErr);
      }

      setEditSuccess("Profile image updated successfully.");
    } catch (err: any) {
      setEditError("Failed to upload image.");
    } finally {
      setProfileImageUploading(false);
    }
  };

  const handleDeleteProfileImage = async () => {
    if (
      !window.confirm("Are you sure you want to remove your profile picture?")
    )
      return;
    setProfileImageUploading(true);
    setEditError(null);
    try {
      await userService.deleteProfileImage(user.id);
      setEditProfile((prev) => ({ ...prev, profile_image: "" }));
      setProfile((prev) => (prev ? { ...prev, profile_image: "" } : prev));

      // Refresh user in AuthContext to update profile image globally
      try {
        await refreshUser();
        console.log(
          "✅ AuthContext user refreshed after deleting profile image"
        );
      } catch (refreshErr) {
        console.warn("⚠️ Failed to refresh AuthContext user:", refreshErr);
      }

      setEditSuccess("Profile image removed successfully.");
    } catch (err: any) {
      setEditError("Failed to remove image.");
    } finally {
      setProfileImageUploading(false);
    }
  };

  // Fetch user address
  useEffect(() => {
    const fetchAddress = async () => {
      setAddressLoading(true);
      try {
        const addresses = await userService.getAddresses(user.id);
        // Get the first address (single address only)
        if (addresses.length > 0) {
          setAddress(addresses[0]);
          setAddressForm({
            address_type: addresses[0].address_type,
            full_name: addresses[0].full_name,
            phone: addresses[0].phone,
            address_line1: addresses[0].address_line1,
            address_line2: addresses[0].address_line2 || "",
            city: addresses[0].city,
            state: addresses[0].state,
            postal_code: addresses[0].postal_code,
            country: addresses[0].country,
            is_default: addresses[0].is_default,
          });
        }
      } catch (error) {
        console.error("Failed to fetch address:", error);
      } finally {
        setAddressLoading(false);
      }
    };
    fetchAddress();
  }, []);

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressSaving(true);
    setAddressSuccess(null);
    setAddressError(null);
    try {
      if (address) {
        // Update existing address
        console.log("📍 Updating address:", addressForm);
        const updated = await userService.updateAddress(
          user.id,
          address.id,
          addressForm
        );
        setAddress(updated);
        setAddressSuccess("Address updated successfully!");
      } else {
        // Create new address
        console.log("📍 Creating address:", addressForm);
        const created = await userService.createAddress(user.id, addressForm);
        setAddress(created);
        setAddressSuccess("Address added successfully!");
      }
      setEditingAddress(false);
    } catch (error: any) {
      console.error("❌ Address error:", error.response?.data);
      setAddressError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to save address"
      );
    } finally {
      setAddressSaving(false);
    }
  };

  const handleDeleteAddress = async () => {
    if (!address) return;
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    try {
      await userService.deleteAddress(user.id, address.id);
      setAddress(null);
      setAddressForm({
        address_type: "shipping",
        full_name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "Pakistan",
        is_default: true,
      });
      setAddressSuccess("Address deleted successfully!");
    } catch (error: any) {
      setAddressError(
        error.response?.data?.message || "Failed to delete address"
      );
    }
  };

  const handleEditAddress = () => {
    setEditingAddress(true);
    setAddressSuccess(null);
    setAddressError(null);
  };

  const handleCancelEditAddress = () => {
    setEditingAddress(false);
    if (address) {
      // Reset form to current address
      setAddressForm({
        address_type: address.address_type,
        full_name: address.full_name,
        phone: address.phone,
        address_line1: address.address_line1,
        address_line2: address.address_line2 || "",
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country,
        is_default: address.is_default,
      });
    }
    setAddressSuccess(null);
    setAddressError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccess(null);
    setPasswordError(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      setPasswordLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      setPasswordLoading(false);
      return;
    }

    try {
      const { authService } = await import("../src/services/authService");
      await authService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      setPasswordSuccess("Password updated successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      setPasswordError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order);
    setShowInvoiceModal(true);

    // Fetch tracking info if order is shipped or delivered
    if (order.status === "shipped" || order.status === "delivered") {
      setTrackingLoading(true);
      try {
        const tracking = await orderService.getOrderTracking(order.id);
        setOrderTracking(tracking);
      } catch (error) {
        console.log("Tracking not available:", error);
        setOrderTracking(null);
      } finally {
        setTrackingLoading(false);
      }
    } else {
      setOrderTracking(null);
    }
  };

  // Calculate dashboard stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) =>
      o.status === "pending_payment" ||
      o.status === "pending" ||
      o.status === "processing"
  ).length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Icons.Dashboard },
    { id: "orders", label: "My Orders", icon: Icons.Package },
    { id: "profile", label: "Profile Settings", icon: Icons.Settings },
    { id: "addresses", label: "Addresses", icon: Icons.MapPin },
    { id: "password", label: "Change Password", icon: Icons.Lock },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icons.Package className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {ordersLoading ? "..." : totalOrders}
                </div>
                <div className="text-sm text-gray-500">Total Orders</div>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <Icons.Clock className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {ordersLoading ? "..." : pendingOrders}
                </div>
                <div className="text-sm text-gray-500">Pending Orders</div>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <Icons.Banknote className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {ordersLoading ? "..." : `PKR ${totalSpent.toLocaleString()}`}
                </div>
                <div className="text-sm text-gray-500">Total Spent</div>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Recent Orders
                </h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Order ID</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Total</th>
                      <th className="px-4 py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id}>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          #{order.order_number}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(order.created_at).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-700"
                                : order.status === "processing"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1).replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          PKR {(order.total_amount || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="text-primary hover:underline"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "orders":
        const filteredOrders =
          statusFilter === "all"
            ? orders
            : orders.filter((o) => o.status === statusFilter);

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                aria-label="Filter orders by status"
              >
                <option value="all">All Orders</option>
                <option value="pending_payment">Pending Payment</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Total</th>
                    <th className="px-6 py-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        #{order.order_number}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "processing"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1).replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        PKR {(order.total_amount || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewOrder(order)}
                        >
                          View Invoice
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Profile Settings
            </h2>
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm max-w-2xl">
              {profileLoading ? (
                <div>Loading...</div>
              ) : profileError ? (
                <div className="text-red-600">{profileError}</div>
              ) : profile ? (
                <form className="space-y-4" onSubmit={handleProfileSubmit}>
                  {editSuccess && (
                    <div className="bg-green-100 text-green-700 p-2 rounded">
                      {editSuccess}
                    </div>
                  )}
                  {editError && (
                    <div className="bg-red-100 text-red-700 p-2 rounded">
                      {editError}
                    </div>
                  )}
                  <div className="flex items-center gap-6 mb-4">
                    <div className="relative">
                      <img
                        src={
                          editProfile.profile_image || "/avatar-placeholder.png"
                        }
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border"
                      />
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 shadow"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={profileImageUploading}
                        title="Change profile picture"
                      >
                        <Icons.User className="h-5 w-5" />
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleProfileImageChange}
                        disabled={profileImageUploading}
                        aria-label="Upload profile picture"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      {profileImageUploading && (
                        <span className="text-sm text-gray-600">
                          Uploading...
                        </span>
                      )}
                      {editProfile.profile_image && (
                        <button
                          type="button"
                          onClick={handleDeleteProfileImage}
                          disabled={profileImageUploading}
                          className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={editProfile.full_name || ""}
                        onChange={handleProfileChange}
                        aria-label="Full Name"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={editProfile.phone || ""}
                        onChange={handleProfileChange}
                        aria-label="Phone Number"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      aria-label="Email Address"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500"
                    />
                  </div>
                  <Button type="submit" className="mt-4" disabled={editLoading}>
                    {editLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              ) : null}
            </div>
          </div>
        );
      case "addresses":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Address</h2>

            {addressSuccess && (
              <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
                {addressSuccess}
              </div>
            )}
            {addressError && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
                {addressError}
              </div>
            )}

            {addressLoading ? (
              <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-sm text-gray-600">Loading address...</p>
              </div>
            ) : editingAddress || !address ? (
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {address ? "Edit Address" : "Add Address"}
                </h3>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={addressForm.full_name}
                        onChange={handleAddressChange}
                        required
                        aria-label="Full Name"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={addressForm.phone}
                        onChange={handleAddressChange}
                        required
                        aria-label="Phone Number"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="address_line1"
                      value={addressForm.address_line1}
                      onChange={handleAddressChange}
                      required
                      aria-label="Address Line 1"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      name="address_line2"
                      value={addressForm.address_line2}
                      onChange={handleAddressChange}
                      placeholder="Address Line 2 (optional)"
                      title="Address Line 2 (optional)"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        required
                        aria-label="City"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressChange}
                        required
                        aria-label="State or Province"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postal_code"
                        value={addressForm.postal_code}
                        onChange={handleAddressChange}
                        required
                        aria-label="Postal Code"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={addressForm.country}
                        onChange={handleAddressChange}
                        required
                        aria-label="Country"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={addressSaving}>
                      {addressSaving
                        ? "Saving..."
                        : address
                        ? "Update Address"
                        : "Add Address"}
                    </Button>
                    {address && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEditAddress}
                        disabled={addressSaving}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              <div className="rounded-xl border border-primary bg-primary/5 p-6 relative">
                <div className="absolute top-4 right-4">
                  <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                    Default
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">
                  {address.full_name}
                </h3>
                <p className="text-sm text-gray-600 space-y-1">
                  <span className="block">{address.address_line1}</span>
                  {address.address_line2 && (
                    <span className="block">{address.address_line2}</span>
                  )}
                  <span className="block">
                    {address.city}, {address.state} {address.postal_code}
                  </span>
                  <span className="block">{address.country}</span>
                  <span className="block font-medium mt-2">
                    Phone: {address.phone}
                  </span>
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleEditAddress}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteAddress}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case "password":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Change Password
            </h2>
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm max-w-xl">
              {passwordSuccess && (
                <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
                  {passwordSuccess}
                </div>
              )}
              {passwordError && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
                  {passwordError}
                </div>
              )}
              <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    aria-label="Current Password"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    aria-label="New Password"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    aria-label="Confirm New Password"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <Button
                  type="submit"
                  className="mt-4"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Invoice Modal */}
      {showInvoiceModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Invoice
                </h2>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close invoice modal"
                >
                  <Icons.Close className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Order Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-semibold text-gray-900">
                    #{selectedOrder.order_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedOrder.created_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      selectedOrder.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : selectedOrder.status === "processing"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {selectedOrder.status.charAt(0).toUpperCase() +
                      selectedOrder.status.slice(1).replace("_", " ")}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      selectedOrder.payment_status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {selectedOrder.payment_status.charAt(0).toUpperCase() +
                      selectedOrder.payment_status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shipping_address && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Shipping Address
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.shipping_address.full_name}
                    <br />
                    {selectedOrder.shipping_address.address_line1}
                    {selectedOrder.shipping_address.address_line2 && (
                      <>, {selectedOrder.shipping_address.address_line2}</>
                    )}
                    <br />
                    {selectedOrder.shipping_address.city},{" "}
                    {selectedOrder.shipping_address.state}{" "}
                    {selectedOrder.shipping_address.postal_code}
                    <br />
                    {selectedOrder.shipping_address.country}
                    <br />
                    Phone: {selectedOrder.shipping_address.phone}
                  </p>
                </div>
              )}

              {/* Tracking Information */}
              {(selectedOrder.status === "shipped" ||
                selectedOrder.status === "delivered") && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Tracking Information
                  </h3>
                  {trackingLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2 text-sm text-gray-600">
                        Loading tracking info...
                      </span>
                    </div>
                  ) : orderTracking ? (
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">
                              Tracking Number:
                            </span>
                            <p className="font-semibold text-gray-900">
                              {orderTracking.tracking_number}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Carrier:</span>
                            <p className="font-semibold text-gray-900">
                              {orderTracking.carrier}
                            </p>
                          </div>
                          {orderTracking.estimated_delivery && (
                            <div>
                              <span className="text-gray-600">
                                Est. Delivery:
                              </span>
                              <p className="font-semibold text-gray-900">
                                {new Date(
                                  orderTracking.estimated_delivery
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {orderTracking.tracking_url && (
                            <div className="col-span-2">
                              <a
                                href={orderTracking.tracking_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-sm font-medium"
                              >
                                Track Package →
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tracking History */}
                      {orderTracking.tracking_history &&
                        orderTracking.tracking_history.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">
                              Tracking History
                            </p>
                            <div className="space-y-2">
                              {orderTracking.tracking_history.map(
                                (event, index) => (
                                  <div key={index} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                      <div
                                        className={`w-2 h-2 rounded-full ${
                                          index === 0
                                            ? "bg-primary"
                                            : "bg-gray-300"
                                        }`}
                                      ></div>
                                      {index <
                                        orderTracking.tracking_history!.length -
                                          1 && (
                                        <div className="w-px h-full bg-gray-200 my-1"></div>
                                      )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                      <p className="text-sm font-medium text-gray-900">
                                        {event.status}
                                      </p>
                                      {event.location && (
                                        <p className="text-xs text-gray-500">
                                          {event.location}
                                        </p>
                                      )}
                                      {event.description && (
                                        <p className="text-xs text-gray-600">
                                          {event.description}
                                        </p>
                                      )}
                                      <p className="text-xs text-gray-400 mt-1">
                                        {new Date(
                                          event.timestamp
                                        ).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  ) : selectedOrder.tracking_number ? (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Tracking Number:</p>
                      <p className="font-semibold text-gray-900">
                        {selectedOrder.tracking_number}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Tracking information not available yet.
                    </p>
                  )}
                </div>
              )}

              {/* Order Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Order Items
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.product?.name || "Product"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          PKR {item.subtotal.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    PKR {selectedOrder.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">
                    PKR {(selectedOrder.tax_amount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">
                    PKR {(selectedOrder.shipping_fee || 0).toLocaleString()}
                  </span>
                </div>
                {selectedOrder.discount_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">
                      - PKR {selectedOrder.discount_amount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-primary">
                    PKR {(selectedOrder.total_amount || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowInvoiceModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-slate-50 py-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar */}
            <div className="w-full lg:w-72 flex-shrink-0">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sticky top-24">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icons.User className="h-6 w-6" />
                  </div>
                  <div className="overflow-hidden">
                    <h2 className="font-bold text-gray-900 truncate">
                      {user.full_name}
                    </h2>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === item.id
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  ))}
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <button
                      onClick={onLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Icons.LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </div>
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1">{renderContent()}</div>
          </div>
        </div>
      </div>
    </>
  );
};
