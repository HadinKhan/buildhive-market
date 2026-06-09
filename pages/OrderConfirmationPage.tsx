import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Icons } from "../components/Icons";
import { Button } from "../components/Button";
import { Order, orderService } from "../src/services/orderService";

const formatPkr = (value: unknown) =>
  `PKR ${Number(value || 0).toLocaleString("en-PK")}`;

const getOrderItems = (order: Order | null) =>
  Array.isArray(order?.items) ? order.items : [];

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
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">
                Seller
              </p>
              <p className="mt-1 font-semibold text-gray-900">
                {getSellerNames(order)}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">
                Total
              </p>
              <p className="mt-1 font-semibold text-gray-900">
                {formatPkr(order.total_amount)}
              </p>
            </div>
            <div>
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
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">
              Item details are not available for this order.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {item.product?.name || "Product"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty {item.quantity} - {item.product?.business_name || "Seller"}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatPkr(item.subtotal || item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          )}
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
