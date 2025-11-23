import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import type { CartItem } from "@shared/schema";
import { Link } from "wouter";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export function CartSheet({
  open,
  onOpenChange,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartSheetProps) {
  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col" data-testid="sheet-cart">
        <SheetHeader>
          <SheetTitle className="text-2xl">Carrito de Compras</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12" data-testid="empty-cart">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              Tu carrito está vacío
            </p>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
              Explora nuestros productos y agrega lo que necesites
            </p>
            <Button onClick={() => onOpenChange(false)} data-testid="button-continue-shopping">
              Continuar Comprando
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4"
                  data-testid={`cart-item-${item.product.id}`}
                >
                  <div className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      data-testid={`img-cart-${item.product.id}`}
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between gap-2">
                      <h4 className="font-medium text-sm line-clamp-2" data-testid={`text-cart-name-${item.product.id}`}>
                        {item.product.name}
                      </h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0"
                        onClick={() => onRemoveItem(item.product.id)}
                        data-testid={`button-remove-${item.product.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                          }
                          data-testid={`button-decrease-${item.product.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium" data-testid={`text-quantity-${item.product.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          data-testid={`button-increase-${item.product.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-bold text-primary" data-testid={`text-item-total-${item.product.id}`}>
                        ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <SheetFooter className="flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-primary" data-testid="text-cart-total">
                  ${total.toFixed(2)}
                </span>
              </div>
              <Link href="/checkout" onClick={() => onOpenChange(false)}>
                <Button size="lg" className="w-full" data-testid="button-checkout">
                  Proceder al Pago
                </Button>
              </Link>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
