import { ShoppingCart, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function Header({ cartItemCount, onCartClick, searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-2 md:gap-4 py-4">
          <Link href="/" className="hover-elevate active-elevate-2 rounded-md flex-shrink-0">
            <h1 className="text-lg md:text-2xl font-semibold text-primary" data-testid="text-logo">
              FarmaPlus
            </h1>
          </Link>

          <div className="flex-1 max-w-2xl hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Link href="/admin/login">
              <Button
                variant="ghost"
                size="icon"
                data-testid="button-admin-login"
                title="Panel de administración"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="default"
              className="relative"
              onClick={onCartClick}
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center p-0 px-1"
                  data-testid="badge-cart-count"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="sm:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              data-testid="input-search-mobile"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
