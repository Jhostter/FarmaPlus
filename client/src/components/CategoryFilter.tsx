import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string, checked: boolean) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

export function CategoryFilter({
  categories,
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  onClearFilters,
}: CategoryFilterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl">Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 lg:space-y-6">
        <div className="space-y-3 lg:space-y-4">
          <h3 className="font-medium text-xs lg:text-sm uppercase tracking-wide text-muted-foreground">
            Categorías
          </h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category} className="flex items-center gap-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) =>
                    onCategoryChange(category, checked as boolean)
                  }
                  data-testid={`checkbox-category-${category}`}
                />
                <Label
                  htmlFor={`category-${category}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 lg:space-y-4">
          <h3 className="font-medium text-xs lg:text-sm uppercase tracking-wide text-muted-foreground">
            Rango de Precio
          </h3>
          <div className="space-y-4">
            <Slider
              min={0}
              max={200}
              step={5}
              value={[priceRange[0], priceRange[1]]}
              onValueChange={(value) => onPriceRangeChange([value[0], value[1]])}
              data-testid="slider-price-range"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span data-testid="text-min-price">${priceRange[0]}</span>
              <span data-testid="text-max-price">${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={onClearFilters}
          data-testid="button-clear-filters"
        >
          Limpiar Filtros
        </Button>
      </CardContent>
    </Card>
  );
}
