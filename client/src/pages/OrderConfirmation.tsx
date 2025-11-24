import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Package, Clock, Download, FileText } from "lucide-react";
import type { Order, OrderItem } from "@shared/schema";

export default function OrderConfirmation() {
  const [, params] = useRoute("/confirmacion/:id");
  const orderId = params?.id;
  const [paymentStatus, setPaymentStatus] = useState<"processing" | "success">("processing");

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ["/api/orders", orderId],
    enabled: !!orderId,
  });

  const { data: orderItems } = useQuery<OrderItem[]>({
    queryKey: ["/api/orders", orderId, "items"],
    enabled: !!orderId,
  });

  // Simular procesamiento de pago
  useEffect(() => {
    const timer = setTimeout(() => {
      setPaymentStatus("success");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Generar factura digital en PDF
  const generateInvoicePDF = () => {
    if (!order || !orderItems) return;

    const invoiceContent = `
FARMAPLUS - FACTURA DIGITAL
========================================
Fecha: ${new Date(order.createdAt).toLocaleDateString('es-ES')}
Número de Factura: ${order.id.slice(0, 8).toUpperCase()}

DATOS DEL CLIENTE
========================================
Nombre: ${order.customerName}
Email: ${order.customerEmail}
Teléfono: ${order.customerPhone}
Dirección: ${order.deliveryAddress}
Ciudad: ${order.deliveryCity}
Código Postal: ${order.deliveryPostalCode}

DETALLES DEL PEDIDO
========================================
${orderItems.map(item => 
  `${item.productName} x ${item.quantity} ............................ $${(parseFloat(item.price) * item.quantity).toFixed(2)}`
).join('\n')}

SUBTOTAL: $${(parseFloat(order.total) * 0.9).toFixed(2)}
ENVÍO: Incluido
TOTAL: $${parseFloat(order.total).toFixed(2)}

========================================
Estado: ${order.status === 'pending' ? 'Pendiente' : order.status}
Entrega estimada: 24-48 horas hábiles

¡Gracias por tu compra en FarmaPlus!
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(invoiceContent));
    element.setAttribute('download', `factura-${order.id.slice(0, 8).toUpperCase()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

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
        {/* Payment Processing / Success Message */}
        <Card className="mb-8">
          <CardContent className="pt-12 pb-12 text-center">
            <div className={`h-16 w-16 rounded-full ${paymentStatus === "processing" ? "bg-blue-100 dark:bg-blue-900/20 animate-pulse" : "bg-green-100 dark:bg-green-900/20"} flex items-center justify-center mx-auto mb-6`}>
              <CheckCircle2 className={`h-10 w-10 ${paymentStatus === "processing" ? "text-blue-600 dark:text-blue-500" : "text-green-600 dark:text-green-500"}`} data-testid="icon-success" />
            </div>
            <h1 className="text-3xl font-semibold mb-2" data-testid="text-confirmation-title">
              {paymentStatus === "processing" ? "Procesando Pago..." : "¡Pago Confirmado!"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {paymentStatus === "processing" 
                ? "Estamos procesando tu pago de forma segura..." 
                : "Tu pago fue procesado exitosamente. Hemos recibido tu pedido y lo procesaremos pronto."}
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

        {/* Invoice */}
        {paymentStatus === "success" && (
          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Factura Digital
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-md space-y-3 font-mono text-sm">
                <div className="text-center font-bold mb-4">FARMAPLUS</div>
                <div>Fecha: {new Date(order.createdAt).toLocaleDateString('es-ES')}</div>
                <div>Factura: {order.id.slice(0, 8).toUpperCase()}</div>
                <Separator />
                <div className="space-y-1">
                  <div><span className="font-semibold">Cliente:</span> {order.customerName}</div>
                  <div><span className="font-semibold">Email:</span> {order.customerEmail}</div>
                  <div><span className="font-semibold">Entrega:</span> {order.deliveryAddress}, {order.deliveryCity}</div>
                </div>
                <Separator />
                <div className="space-y-2">
                  {orderItems?.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.productName} x{item.quantity}</span>
                      <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>TOTAL:</span>
                  <span>${parseFloat(order.total).toFixed(2)}</span>
                </div>
              </div>
              <Button 
                onClick={generateInvoicePDF}
                className="w-full"
                data-testid="button-download-invoice"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Factura
              </Button>
            </CardContent>
          </Card>
        )}

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
