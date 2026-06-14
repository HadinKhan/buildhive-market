import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";
import { Order, orderService } from "../src/services/orderService";

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

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Icons.Check className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Order confirmed
          </h1>
          <p className="mt-2 text-gray-500">
            Order #{order.order_number || order.id}
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
                Estimated Delivery
              </p>
              <p className="mt-1 font-semibold text-gray-900">
                3-5 business days
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
            variant="outline"
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
