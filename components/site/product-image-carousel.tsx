"use client";
import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductImageCarousel({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const list = images.length ? images : ["/placeholder.svg"];
  const [emblaRef, embla] = useEmblaCarousel({ loop: list.length > 1 });
  const [selected, setSelected] = React.useState(0);

  React.useEffect(() => {
    if (!embla) return;
    const onSel = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSel);
    onSel();
    return () => { embla.off("select", onSel); };
  }, [embla]);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border" ref={emblaRef}>
        <div className="flex">
          {list.map((src, i) => (
            <div key={i} className="relative flex-[0_0_100%] aspect-[4/4]">
              <Image src={src} alt={`${alt} ${i + 1}`} fill priority={i === 0} sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
        {list.length > 1 && (
          <>
            <button onClick={() => embla?.scrollPrev()} className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-smooth" aria-label="Anterior">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => embla?.scrollNext()} className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-smooth" aria-label="Próximo">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {list.map((src, i) => (
            <button
              key={i}
              onClick={() => embla?.scrollTo(i)}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-smooth",
                selected === i ? "border-primary" : "border-border hover:border-primary/40"
              )}
            >
              <Image src={src} alt={`thumb ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
