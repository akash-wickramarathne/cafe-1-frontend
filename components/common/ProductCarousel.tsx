"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
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
  const [imageError, setImageError] = React.useState(false);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={() => plugin.current.stop()}
        onMouseLeave={() => plugin.current.reset()}
      >
        <CarouselContent>
          {productImages.map((image, index) => (
            <CarouselItem
              key={index}
              className="flex justify-center items-center w-full"
              // style={{ minWidth: "100%" }} // Ensure each item takes full width
            >
              <Card className="w-full max-w-md">
                <CardContent className="relative h-60">
                  {imageError ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <NotFound />
                    </div>
                  ) : (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${image}`}
                      alt={`Food Image ${index + 1}`}
                      layout="fill"
                      className=" object-scale-down" // Ensure image covers the area without distortion
                      onError={handleImageError}
                    />
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg">
          Previous
        </CarouselPrevious>
        <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg">
          Next
        </CarouselNext> */}
      </Carousel>
    </div>
  );
}
