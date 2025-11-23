import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ShoppingCart } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="flex flex-col h-full hover-elevate" data-testid={`card-product-${product.id}`}>
      <CardHeader className="p-0">
        <div className="aspect-square relative overflow-hidden rounded-t-md bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            data-testid={`img-product-${product.id}`}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-base line-clamp-2" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
        </div>
        <Badge variant="secondary" className="text-xs uppercase tracking-wide" data-testid={`badge-category-${product.id}`}>
          {product.category}
        </Badge>
        <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-description-${product.id}`}>
          {product.description}
        </p>
        {product.requiresPrescription === 1 && (
          <Badge variant="outline" className="text-xs" data-testid={`badge-prescription-${product.id}`}>
            Receta requerida
          </Badge>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
            ${parseFloat(product.price).toFixed(2)}
          </span>
        </div>
        <Button
          size="default"
          onClick={() => onAddToCart(product)}
          data-testid={`button-add-cart-${product.id}`}
        >
          <Plus className="h-4 w-4 mr-1" />
          Agregar
        </Button>
      </CardFooter>
    </Card>
  );
}
