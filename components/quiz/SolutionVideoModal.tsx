"use client";

import { Calculator, ExternalLink, X } from "lucide-react";
import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import AppCalculator from "../AppCalculator";
import CopyLink from "../CopyLink";
import VideoPlayer from "../pages/recordings/VideoPlayer";
import { DraggableModal } from "../shared/modal/DraggableModal";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface SolutionVideoModalProps {
  open: boolean;
  videoSrc: any;
  onClose: () => void;
}

export default function SolutionVideoModal({
  open,
  videoSrc,
  onClose,
}: SolutionVideoModalProps) {
  const pathname = usePathname();
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [open]);

  // Trap focus inside modal when open
  useEffect(() => {
    if (!open || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    firstElement?.focus();
    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [open]);

  // Validate video source
  useEffect(() => {
    if (open && (!videoSrc || videoSrc.trim() === "")) {
      toast.error("No solution video available.");
      onClose();
    }
  }, [open, videoSrc, onClose]);

  const handleOpenInNewTab = useCallback(() => {
    if (videoSrc) {
      window.open(videoSrc, "_blank", "noopener,noreferrer");
    }
  }, [videoSrc]);

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose],
  );

  const handleCalculatorToggle = useCallback(() => {
    setIsCalculatorOpen((prev) => !prev);
  }, []);

  const headerButtons = useMemo(
    () => [
      {
        icon: <Calculator className="w-5 h-5" />,
        onClick: handleCalculatorToggle,
        title: "Calculator",
        "aria-label": "Open calculator",
        variant: "ghost" as const,
      },
      {
        component: <CopyLink key="copy-link" />,
      },
      {
        icon: <ExternalLink className="w-5 h-5" />,
        onClick: handleOpenInNewTab,
        title: "Open in new tab",
        "aria-label": "Open video in new tab",
        variant: "ghost" as const,
      },
      {
        icon: <X className="w-5 h-5" />,
        onClick: onClose,
        "aria-label": "Close modal",
        variant: "ghost" as const,
      },
    ],
    [handleCalculatorToggle, handleOpenInNewTab, onClose],
  );

  if (!open) return null;

  return (
    <>
      {/* Overlay with animation */}
      <div ref={overlayRef} onClick={handleOverlayClick} aria-hidden="true" />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="solution-video-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        <div
          ref={modalRef}
          className={cn(
            "bg-white dark:bg-gray-950 rounded-xl shadow-2xl",
            "w-full max-w-4xl max-h-[85vh]",
            "flex flex-col overflow-hidden",
            "border border-gray-200 dark:border-gray-800",
            "animate-in fade-in-0 zoom-in-95 duration-300",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-950 z-10 shrink-0">
            <h2
              id="solution-video-title"
              className="truncate text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              Solution Video
            </h2>
            <div className="flex items-center gap-1">
              {headerButtons.map((button, index) =>
                button.component ? (
                  <div key={`button-${index}`}>{button.component}</div>
                ) : (
                  <Button
                    key={`button-${index}`}
                    variant={button.variant}
                    size="icon"
                    onClick={button.onClick}
                    title={button.title}
                    aria-label={button["aria-label"]}
                    className="h-9 w-9"
                  >
                    {button.icon}
                  </Button>
                ),
              )}
            </div>
          </div>

          {/* Video Container */}
          <div>
            {videoSrc ? (
              <VideoPlayer videoUrl={videoSrc} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <p>Video unavailable</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 text-sm border-t border-gray-200 dark:border-gray-800 shrink-0">
            <a target="_blank" href={pathname}>
              <button className="text-blue-600 font-semibold">
                Click here to take the test
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Calculator Modal */}
      <DraggableModal
        open={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        title="Calculator"
      >
        <AppCalculator />
      </DraggableModal>
    </>
  );
}
