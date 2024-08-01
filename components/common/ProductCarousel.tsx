"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image"; // Make sure you import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import NotFound from "@/app/(app)/notfound";

export function ProductCarousel({
  productImages,
}: {
  productImages: string[];
}) {
  const [imageError, setImageError] = React.useState(false); // State to handle image load errors
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-xs"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {productImages.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  {imageError ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <NotFound />
                    </div>
                  ) : (
                    <Image
                      layout="fill"
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${image}`} // Adjust path as needed
                      alt={`Food Image ${index + 1}`}
                      className="w-full h-full object-scale-down"
                      onError={handleImageError}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  );
}
