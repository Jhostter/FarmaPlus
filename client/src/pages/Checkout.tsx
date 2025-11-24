import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Checkout() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { cart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryPostalCode: "",
  });

  const total = cart.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El carrito está vacío.",
      });
      return;
    }

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || 
        !formData.deliveryAddress || !formData.deliveryCity || !formData.deliveryPostalCode) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor completa todos los campos.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          deliveryAddress: formData.deliveryAddress,
          deliveryCity: formData.deliveryCity,
          deliveryPostalCode: formData.deliveryPostalCode,
          total: total.toFixed(2),
          items: cart.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: Number(item.quantity),
            price: String(item.product.price),
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error creating order");
      }

      const order = await response.json();
      clearCart();
      navigate(`/confirmacion/${order.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo procesar el pedido.",
      });
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-lg mb-4">Tu carrito está vacío</p>
            <Link href="/">
              <Button>Volver a la tienda</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Link href="/">
          <Button variant="ghost" className="mb-4 sm:mb-6" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>

        <h1 className="text-2xl sm:text-4xl font-semibold mb-6 sm:mb-8" data-testid="text-checkout-title">
          Finalizar Pedido
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Nombre Completo *</label>
                      <Input
                        name="customerName"
                        placeholder="Juan Pérez"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        data-testid="input-name"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Email *</label>
                        <Input
                          name="customerEmail"
                          type="email"
                          placeholder="juan@example.com"
                          value={formData.customerEmail}
                          onChange={handleInputChange}
                          data-testid="input-email"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Teléfono *</label>
                        <Input
                          name="customerPhone"
                          type="tel"
                          placeholder="+34 600 123 456"
                          value={formData.customerPhone}
                          onChange={handleInputChange}
                          data-testid="input-phone"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Dirección de Entrega *</label>
                      <Input
                        name="deliveryAddress"
                        placeholder="Calle Principal 123, Piso 2"
                        value={formData.deliveryAddress}
                        onChange={handleInputChange}
                        data-testid="input-address"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Ciudad *</label>
                        <Input
                          name="deliveryCity"
                          placeholder="Madrid"
                          value={formData.deliveryCity}
                          onChange={handleInputChange}
                          data-testid="input-city"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Código Postal *</label>
                        <Input
                          name="deliveryPostalCode"
                          placeholder="28001"
                          value={formData.deliveryPostalCode}
                          onChange={handleInputChange}
                          data-testid="input-postal-code"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                    data-testid="button-submit-order"
                  >
                    {isSubmitting ? "Procesando..." : "Confirmar Pedido"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 lg:top-24">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm" data-testid={`summary-item-${item.product.id}`}>
                      <span className="text-muted-foreground">
                        {item.product.name} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary" data-testid="text-summary-total">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>* Envío incluido</p>
                  <p>* Entrega en 24-48 horas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
