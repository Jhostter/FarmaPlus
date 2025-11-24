import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { CartSheet } from "@/components/CartSheet";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Pill, Heart, ShieldCheck, Truck, PhoneCall, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";
import heroImage from "@assets/generated_images/professional_pharmacy_hero_image.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [contactData, setContactData] = useState({ name: "", email: "", message: "" });
  const [isSendingContact, setIsSendingContact] = useState(false);
  const { cart, cartItemCount, addToCart, updateQuantity, removeItem } = useCart();
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const featuredProducts = products?.slice(0, 8) || [];

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setCartOpen(true);
  };

  const handleSendContact = async () => {
    if (!contactData.name || !contactData.email || !contactData.message) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor completa todos los campos.",
      });
      return;
    }

    setIsSendingContact(true);
    
    try {
      // Simular envío de email - en producción aquí iría a un endpoint real
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Mensaje Enviado",
        description: "Nos pondremos en contacto pronto. ¡Gracias!",
      });
      
      setContactData({ name: "", email: "", message: "" });
      setContactOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar el mensaje.",
      });
    } finally {
      setIsSendingContact(false);
    }
  };

  const categories = [
    { name: "Medicamentos", icon: Pill, color: "text-blue-600" },
    { name: "Suplementos", icon: Heart, color: "text-green-600" },
    { name: "Cuidado Personal", icon: ShieldCheck, color: "text-purple-600" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartItemCount={cartItemCount}
        onCartClick={() => setCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[50vh] sm:h-[60vh] min-h-[350px] sm:min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Farmacia profesional"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
          </div>
          <div className="relative h-full flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold text-white mb-4 sm:mb-6" data-testid="text-hero-title">
                Tu Salud, Nuestra Prioridad
              </h2>
              <p className="text-sm sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
                Encuentra medicamentos, suplementos y productos de cuidado personal
                con la mejor atención y entrega rápida
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
                <Link href="/productos">
                  <Button
                    size="default"
                    variant="outline"
                    className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                    data-testid="button-hero-products"
                  >
                    Ver Productos
                  </Button>
                </Link>
                <Button
                  size="default"
                  variant="outline"
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                  data-testid="button-hero-contact"
                  onClick={() => setContactOpen(true)}
                >
                  Contactar
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 sm:py-12 bg-muted/30 w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 w-full">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-6 sm:mb-8" data-testid="text-categories-title">
              Nuestras Categorías
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full">
              {categories.map((category) => (
                <Link key={category.name} href="/productos">
                  <Card className="hover-elevate active-elevate-2 cursor-pointer h-full" data-testid={`card-category-${category.name}`}>
                    <CardContent className="flex flex-col items-center justify-center p-6 sm:p-8 text-center">
                      <div className={`${category.color} mb-3 sm:mb-4`}>
                        <category.icon className="h-8 sm:h-12 w-8 sm:w-12" />
                      </div>
                      <h4 className="text-base sm:text-lg md:text-xl font-medium">{category.name}</h4>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-8 sm:py-12 w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold" data-testid="text-featured-title">
                Productos Destacados
              </h3>
              <Link href="/productos">
                <Button variant="outline" data-testid="button-view-all" className="flex-shrink-0">
                  Ver Todos
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 w-full">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="flex flex-col h-full">
                    <Skeleton className="aspect-square rounded-t-md" />
                    <div className="p-3 sm:p-4 space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-8 w-full mt-auto" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 w-full">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-8 sm:py-12 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="flex flex-col items-center text-center" data-testid="trust-shipping">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Envío Rápido</h4>
                <p className="text-sm text-muted-foreground">
                  Entrega en 24-48 horas en toda la ciudad
                </p>
              </div>
              <div className="flex flex-col items-center text-center" data-testid="trust-certified">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Productos Certificados</h4>
                <p className="text-sm text-muted-foreground">
                  Todos nuestros productos están aprobados y certificados
                </p>
              </div>
              <div className="flex flex-col items-center text-center" data-testid="trust-support">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <PhoneCall className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Atención al Cliente</h4>
                <p className="text-sm text-muted-foreground">
                  Soporte profesional disponible para tus consultas
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-lg mb-4">FarmaPlus</h4>
              <p className="text-sm text-muted-foreground">
                Tu farmacia de confianza con productos certificados y atención
                profesional.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Atención al Cliente</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Teléfono: +34 900 123 456</li>
                <li>Email: info@farmaplus.com</li>
                <li>Lun-Vie: 9:00 - 20:00</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Términos y Condiciones</li>
                <li>Política de Privacidad</li>
                <li>Certificaciones</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground border-t pt-8">
            <p>© 2024 FarmaPlus. Todos los derechos reservados.</p>
            <p className="mt-2">
              Los productos farmacéuticos deben ser usados bajo supervisión médica.
            </p>
          </div>
        </div>
      </footer>

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />

      {/* Contact Modal */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="w-full max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Contáctanos</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre *</label>
              <Input
                placeholder="Tu nombre"
                value={contactData.name}
                onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                data-testid="input-contact-name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email *</label>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                data-testid="input-contact-email"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Mensaje *</label>
              <Textarea
                placeholder="Cuéntanos cómo podemos ayudarte..."
                value={contactData.message}
                onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                className="min-h-[120px] resize-none"
                data-testid="input-contact-message"
              />
            </div>

            <Button
              onClick={handleSendContact}
              disabled={isSendingContact}
              className="w-full"
              data-testid="button-send-contact"
            >
              {isSendingContact ? "Enviando..." : "Enviar Mensaje"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
