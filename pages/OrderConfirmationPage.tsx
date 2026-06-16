import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";
import { Order, orderService } from "../src/services/orderService";
import api from "../src/services/api";

const formatPkr = (value: unknown) =>
  `PKR ${Number(value || 0).toLocaleString("en-PK")}`;

const getOrderItems = (order: Order | null) => {
  const rawItems = order?.items || (order as any)?.order_items;
  const itemsArray = Array.isArray(rawItems) ? rawItems : [];
  return itemsArray.map((item: any) => ({
    ...item,
    product: item.product || (item.products ? {
      name: item.products.name,
      slug: item.products.slug,
      business_name: (order as any)?.businesses?.business_name || (order as any)?.businessName || "Seller"
    } : undefined)
  }));
};

const getSellerNames = (order: Order | null) => {
  const names = getOrderItems(order)
    .map((item) => item.product?.business_name)
    .filter(Boolean);
  return Array.from(new Set(names)).join(", ") || "BuildHive seller";
};

export default function OrderConfirmationPage({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const { orderId = "" } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadOrder = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await orderService.getOrderById(orderId);
        if (!cancelled) setOrder(data);
      } catch (loadError: any) {
        // Check if this is a project/service order (404 on orders endpoint)
        try {
          const projectResponse = await api.get(`/projects/${orderId}`);
          const project = projectResponse.data?.data ?? projectResponse.data;
          if (project) {
            const mappedOrder: Order = {
              id: project.id,
              order_number: project.id.substring(0, 8).toUpperCase(),
              user_id: project.client_id,
              business_id: project.contractor_id,
              shipping_address_line1: "Service Order",
              shipping_city: "N/A",
              shipping_state: "N/A",
              shipping_postal_code: "N/A",
              shipping_country: "Pakistan",
              shipping_phone: "N/A",
              subtotal: project.budget,
              tax_amount: project.budget * 0.05,
              shipping_fee: 0,
              discount_amount: 0,
              total_amount: project.budget * 1.05,
              status: project.status === "pending" ? "pending_payment" : (project.status === "cancelled" ? "cancelled" : "processing"),
              payment_status: project.payment_status === "paid" ? "paid" : "pending",
              payment_method: "cod",
              created_at: project.created_at,
              updated_at: project.updated_at,
              items: [
                {
                  id: project.id,
                  order_id: project.id,
                  product_id: project.service_id || "service",
                  quantity: 1,
                  price: project.budget,
                  subtotal: project.budget,
                  created_at: project.created_at,
                  product: {
                    name: project.title,
                    slug: "service",
                    business_name: project.contractor?.full_name || "Contractor"
                  }
                }
              ]
            };
            if (!cancelled) setOrder(mappedOrder);
            return;
          }
        } catch (projError) {
          console.error("Failed to load as project:", projError);
        }
        if (!cancelled) {
          setError(loadError?.message || "Unable to load order confirmation.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (orderId) {
      void loadOrder();
    } else {
      setLoading(false);
      setError("Order ID is missing.");
    }

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const items = useMemo(() => getOrderItems(order), [order]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Loading your order...
          </h1>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <Icons.AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900">
            Order confirmation unavailable
          </h1>
          <p className="mt-2 text-gray-500">{error || "Order not found."}</p>
          <Button className="mt-6" onClick={() => onNavigate("products")}>
            Continue Shopping
          </Button>
        </div>
      </main>
    );
  }

  const pm = String(order.payment_method || "").toLowerCase();
  const isCod = pm === "cod" || pm === "cash_on_delivery";
  const isCard = !isCod && ["card", "stripe", "online"].includes(pm);
  const isPaid = order.payment_status === "paid" || (order.payment_status as string) === "completed";
  const isCancelled = order.status === "cancelled";

  let statusIcon = (
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
      <Icons.Check className="h-7 w-7" />
    </div>
  );
  let statusTitle = "Order confirmed";
  let statusDesc = `Order #${order.order_number || order.id}`;

  if (isCancelled) {
    statusIcon = (
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <Icons.AlertCircle className="h-7 w-7" />
      </div>
    );
    statusTitle = "Order cancelled";
    statusDesc = `Your order #${order.order_number || order.id} has been cancelled due to a failed or abandoned payment.`;
  } else if (isCod) {
    statusTitle = "Order placed successfully!";
    statusDesc = `Order #${order.order_number || order.id} — Pay on delivery when your items arrive.`;
  } else if (isCard && !isPaid) {
    statusIcon = (
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <Icons.AlertCircle className="h-7 w-7" />
      </div>
    );
    statusTitle = "Payment pending or failed";
    statusDesc = `Order #${order.order_number || order.id} requires payment confirmation. Please check your purchase history to retry.`;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-3xl bg-white p-8 text-center shadow-sm">
          {statusIcon}
          <h1 className="text-3xl font-bold text-gray-900">
            {statusTitle}
          </h1>
          <p className="mt-2 text-gray-500">
            {statusDesc}
          </p>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-gray-50 p-4 text-center">
              <p className="text-xs font-bold uppercase text-gray-400">
                Seller
              </p>
              <p className="mt-1 font-semibold text-gray-900">
                {getSellerNames(order)}
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4 text-center">
              <p className="text-xs font-bold uppercase text-gray-400">
                Total
              </p>
              <p className="mt-1 font-semibold text-gray-900 font-mono">
                {formatPkr(order.total_amount || (order as any).totalAmount)}
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4 text-center">
              <p className="text-xs font-bold uppercase text-gray-400">
                Payment
              </p>
              <p className="mt-1 font-semibold text-gray-900">
                {isCod ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    Cash on Delivery
                  </span>
                ) : isPaid ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                    Pending
                  </span>
                )}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            Items ordered
          </h2>
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 py-4 text-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {item.product?.name || item.product_name || item.name || "Product"}
                  </p>
                  <p className="text-xs text-gray-400">
                    by {item.product?.business_name || "Seller"}
                  </p>
                </div>
                <div className="text-center text-gray-500 px-4">
                  {item.quantity} × {formatPkr(item.price || item.unit_price)}
                </div>
                <div className="text-right font-bold text-gray-900 font-mono">
                  {formatPkr(item.subtotal || item.total_price || (Number(item.price || item.unit_price || 0) * item.quantity))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="flex-1" onClick={() => onNavigate("account?tab=orders")}>
            View Full Order Details
          </Button>
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => onNavigate("products")}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </main>
  );
}
