import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ImageGalleryProps {
  images: string[];
  productName: string;
  testId?: string;
}

export function ImageGallery({ images, productName, testId }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const zoomImageRef = useRef<HTMLImageElement>(null);

  // Usar imageUrl como fallback si no hay imágenes
  const imageList = images && images.length > 0 ? images : [];

  if (imageList.length === 0) {
    return (
      <div className="aspect-square relative overflow-hidden rounded-t-md bg-muted flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Sin imágenes</div>
      </div>
    );
  }

  const currentImage = imageList[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isZoomed || !zoomImageRef.current) return;

    const rect = zoomImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    zoomImageRef.current.style.transformOrigin = `${x}% ${y}%`;
  };

  return (
    <div className="aspect-square relative overflow-hidden rounded-t-md bg-muted group">
      <img
        src={currentImage}
        alt={`${productName} - imagen ${currentIndex + 1}`}
        className="w-full h-full object-cover"
        data-testid={testId ? `${testId}-image-${currentIndex}` : undefined}
      />

      {/* Controles del carrusel */}
      {imageList.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            data-testid="button-gallery-prev"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            data-testid="button-gallery-next"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Indicadores de página */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {imageList.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-white w-6" : "bg-white/50 w-2"
                }`}
                data-testid={`button-gallery-dot-${index}`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Botón de zoom */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogTrigger asChild>
          <button
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            data-testid="button-zoom"
            aria-label="Ver imagen ampliada"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl p-0 bg-black border-0">
          <div className="relative w-full h-screen max-h-screen flex flex-col items-center justify-center">
            <img
              ref={zoomImageRef}
              src={currentImage}
              alt={`${productName} - zoom - imagen ${currentIndex + 1}`}
              className="w-full h-full object-contain cursor-zoom-in transition-transform duration-200 hover:scale-150"
              onMouseMove={handleMouseMove}
              data-testid={`img-zoom-${currentIndex}`}
            />

            {/* Controles en el modal de zoom */}
            {imageList.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-all"
                  data-testid="button-zoom-prev"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-all"
                  data-testid="button-zoom-next"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Indicador de página */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {currentIndex + 1} / {imageList.length}
            </div>

            {/* Cerrar */}
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-all"
              data-testid="button-close-zoom"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
