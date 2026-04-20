"use client";

import {
  Calculator,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import VideoPlayer from "./VideoPlayer";
import AppCalculator from "@/components/AppCalculator";
import { DraggableModal } from "@/components/shared/modal/DraggableModal";
import CopyLink from "@/components/CopyLink";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { createPortal } from "react-dom";
import { Viewer } from "react-latex-editor";

type ClassResource =
  | string
  | {
      url?: string;
      image?: string;
      link?: string;
      src?: string;
      title?: string;
      alt?: string;
      name?: string;
    };

interface ClassData {
  _id: string;
  title: string;
  slug: string;
  description: string;
  video: string;
  img: string;
  classType: string;
  groupId: string;
  order: number;
  plusOnly: boolean;
  thumbnailSize: number;
  createdAt: string;
  updatedAt: string;
  homeworks: string;
  resources?: ClassResource[];
  course: {
    _id: string;
    title: string;
    slug: string;
  };
}

interface ClassVideoDialogProps {
  classData: ClassData;
  prevClass: ClassData | null;
  nextClass: ClassData | null;
}

export default function ClassVideoDialog({
  classData,
  prevClass,
  nextClass,
}: ClassVideoDialogProps) {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeResourceIndex, setActiveResourceIndex] = useState(0);
  const [selectedResourceImage, setSelectedResourceImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const resourceImages = (classData.resources ?? [])
    .map((resource, index) => {
      if (typeof resource === "string") {
        return {
          id: `${resource}-${index}`,
          src: resource,
          alt: `${classData.title} resource ${index + 1}`,
        };
      }

      const src =
        resource.image ?? resource.url ?? resource.link ?? resource.src ?? "";

      if (!src) {
        return null;
      }

      return {
        id: `${src}-${index}`,
        src,
        alt:
          resource.alt ??
          resource.title ??
          resource.name ??
          `${classData.title} resource ${index + 1}`,
      };
    })
    .filter(
      (
        resource,
      ): resource is {
        id: string;
        src: string;
        alt: string;
      } => Boolean(resource),
    );

  const handleClose = () => {
    if (ref && typeof ref === "string" && ref === "recordings") {
      window.location.href = `/course/${classData.course.slug}`;
    } else {
      router.back();
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock scroll on mount
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const handleSelect = () => {
      setActiveResourceIndex(carouselApi.selectedScrollSnap());
    };

    handleSelect();
    carouselApi.on("select", handleSelect);
    carouselApi.on("reInit", handleSelect);

    return () => {
      carouselApi.off("select", handleSelect);
      carouselApi.off("reInit", handleSelect);
    };
  }, [carouselApi]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="rounded-xl bg-white dark:bg-gray-950 shadow-2xl flex flex-col w-full max-w-4xl max-h-[90vh] border overflow-hidden"
      >
        {/* Header */}
        <header className="flex items-center justify-between p-5 border-b bg-white dark:bg-gray-950 z-10 shrink-0">
          <h2 className="flex-1 mr-4 text-xl font-semibold truncate">
            {classData.title}
          </h2>

          <div className="flex items-center gap-1">
            {ref && typeof ref === "string" && ref === "recordings" && (
              <>
                <Button
                  variant="ghost"
                  disabled={!prevClass}
                  onClick={() =>
                    router.push(`/class/${prevClass!.slug}?ref=recordings`)
                  }
                  title="Previous class"
                >
                  <ChevronLeft />
                </Button>

                <Button
                  variant="ghost"
                  disabled={!nextClass}
                  onClick={() =>
                    router.push(`/class/${nextClass!.slug}?ref=recordings`)
                  }
                  title="Next class"
                >
                  <ChevronRight />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              onClick={() => setIsCalculatorOpen(true)}
              title="Calculator"
            >
              <Calculator />
            </Button>

            <CopyLink />

            <Button
              variant="ghost"
              onClick={() => window.open(`/class/${classData.slug}`, "_blank")}
              title="Open in new tab"
            >
              <ExternalLink />
            </Button>

            <Button variant="ghost" onClick={handleClose} title="Close">
              <X />
            </Button>
          </div>
        </header>

        {/* Scrollable Area (Video + Content) */}
        <div className="flex-1 overflow-y-auto">
          {/* Video */}
          {classData.video && (
            <div className="w-full aspect-video bg-black">
              <VideoPlayer videoUrl={classData.video} />
            </div>
          )}

          {/* Content */}
          <section className="p-6">
            {classData.homeworks ? (
              <Viewer content={classData.homeworks} />
            ) : resourceImages.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No homework or additional resources.
              </p>
            ) : null}

            {resourceImages.length > 0 && (
              <div className="mt-8 space-y-4">
                <Carousel
                  opts={{
                    align: "start",
                    loop: resourceImages.length > 1,
                  }}
                  setApi={setCarouselApi}
                  className="w-full"
                >
                  <CarouselContent>
                    {resourceImages.map((resource, index) => (
                      <CarouselItem key={resource.id}>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedResourceImage({
                              src: resource.src,
                              alt: resource.alt,
                            })
                          }
                          className="block w-full cursor-zoom-in"
                          aria-label={`Open resource image ${index + 1} in modal`}
                        >
                          <div className="relative mx-auto aspect-[16/10] w-full max-w-2xl overflow-hidden rounded-xl">
                            <Image
                              src={resource.src}
                              alt={resource.alt}
                              fill
                              sizes="(max-width: 1024px) 100vw, 672px"
                              className="object-contain"
                            />
                          </div>
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {resourceImages.length > 1 && (
                    <>
                      <CarouselPrevious className="left-3" />
                      <CarouselNext className="right-3" />
                    </>
                  )}
                </Carousel>

                {resourceImages.length > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-2">
                    {resourceImages.map((resource, index) => (
                      <button
                        key={`${resource.id}-dot`}
                        type="button"
                        onClick={() => carouselApi?.scrollTo(index)}
                        className={`h-2.5 w-2.5 rounded-full transition-colors ${
                          activeResourceIndex === index
                            ? "bg-primary"
                            : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Calculator */}
        <DraggableModal
          open={isCalculatorOpen}
          onClose={() => setIsCalculatorOpen(false)}
          title="Calculator"
        >
          <AppCalculator />
        </DraggableModal>

        {selectedResourceImage && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm cursor-zoom-out"
            onClick={() => setSelectedResourceImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Resource image preview"
          >
            <div
              className="relative w-full max-w-4xl rounded-xl border bg-white dark:bg-gray-950 p-2"
              onClick={(event) => event.stopPropagation()}
            >
              <Button
                variant="ghost"
                onClick={() => setSelectedResourceImage(null)}
                className="absolute top-2 right-2 z-10"
                title="Close image preview"
              >
                <X />
              </Button>

              <div className="relative mx-auto h-[70vh] max-h-[calc(85vh-1rem)] w-full overflow-hidden rounded-md">
                <Image
                  src={selectedResourceImage.src}
                  alt={selectedResourceImage.alt}
                  fill
                  sizes="95vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
