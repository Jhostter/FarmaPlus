import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Package, Clock } from "lucide-react";
import type { Order, OrderItem } from "@shared/schema";

export default function OrderConfirmation() {
  const [, params] = useRoute("/confirmacion/:id");
  const orderId = params?.id;

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ["/api/orders", orderId],
    enabled: !!orderId,
  });

  const { data: orderItems } = useQuery<OrderItem[]>({
    queryKey: ["/api/orders", orderId, "items"],
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="p-12">
              <Skeleton className="h-12 w-12 mx-auto mb-4 rounded-full" />
              <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-lg mb-4">Pedido no encontrado</p>
            <Link href="/">
              <Button>Volver a la tienda</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Message */}
        <Card className="mb-8">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" data-testid="icon-success" />
            </div>
            <h1 className="text-3xl font-semibold mb-2" data-testid="text-confirmation-title">
              ¡Pedido Confirmado!
            </h1>
            <p className="text-muted-foreground mb-6">
              Hemos recibido tu pedido y lo procesaremos pronto
            </p>
            <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-md">
              <span className="text-sm text-muted-foreground">Número de pedido:</span>
              <Badge variant="outline" className="font-mono" data-testid="badge-order-id">
                {order.id.slice(0, 8).toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detalles del Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Cliente</p>
                <p className="font-medium" data-testid="text-customer-name">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium" data-testid="text-customer-email">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Teléfono</p>
                <p className="font-medium" data-testid="text-customer-phone">{order.customerPhone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Estado</p>
                <Badge variant="secondary" data-testid="badge-order-status">
                  {order.status === "pending" ? "Pendiente" : order.status}
                </Badge>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground mb-1">Dirección de Entrega</p>
              <p className="font-medium" data-testid="text-delivery-address">
                {order.deliveryAddress}, {order.deliveryCity}, {order.deliveryPostalCode}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground mb-3">Productos</p>
              <div className="space-y-3">
                {orderItems?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                    data-testid={`order-item-${item.id}`}
                  >
                    <span className="text-muted-foreground">
                      {item.productName} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-primary" data-testid="text-order-total">
                ${parseFloat(order.total).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Información de Entrega</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Preparación del pedido</h4>
                  <p className="text-sm text-muted-foreground">
                    Verificamos y preparamos tus productos cuidadosamente
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Entrega estimada</h4>
                  <p className="text-sm text-muted-foreground">
                    24-48 horas hábiles desde la confirmación del pedido
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full" data-testid="button-continue-shopping">
              Continuar Comprando
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
