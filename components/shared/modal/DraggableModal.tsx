"use client";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface DraggableWindowProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function DraggableModal({
  title,
  open,
  onClose,
  children,
}: DraggableWindowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [initialMousePosition, setInitialMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [isCentered, setIsCentered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Center the modal when it opens
  useEffect(() => {
    if (open && modalRef.current && !isCentered) {
      const modalRect = modalRef.current.getBoundingClientRect();
      const centerX = (window.innerWidth - modalRect.width) / 2;
      const centerY = (window.innerHeight - modalRect.height) / 2;
      setPosition({ x: centerX, y: centerY });
      setIsCentered(true);
      // Make visible after a tiny delay to ensure position is set
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }
    if (!open) {
      setIsCentered(false);
      setIsVisible(false);
    }
  }, [open, isCentered]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent text selection while dragging
    e.preventDefault();
    setIsDragging(true);
    setInitialMousePosition({ x: e.clientX, y: e.clientY });
    setInitialPosition({ x: position.x, y: position.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaMove = {
        x: e.clientX - initialMousePosition.x,
        y: e.clientY - initialMousePosition.y,
      };

      // Calculate new position
      let newX = initialPosition.x + deltaMove.x;
      let newY = initialPosition.y + deltaMove.y;

      // Constrain to viewport
      if (modalRef.current) {
        const modalRect = modalRef.current.getBoundingClientRect();
        const maxX = window.innerWidth - modalRect.width;
        const maxY = window.innerHeight - modalRect.height;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
      }

      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, initialMousePosition, initialPosition]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-100">
      <div
        ref={modalRef}
        className="draggable-modal-content fixed bg-white dark:bg-neutral-900 shadow-2xl rounded-xl pointer-events-auto border border-gray-200 dark:border-gray-700 transition-opacity duration-200"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          opacity: isVisible ? 1 : 0,
        }}
      >
        {/* Draggable Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 select-none cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {title || "Modal Title"}
          </h3>
          <div className="flex items-center space-x-2">
            <Link
              href="/tools/calculator"
              target="_blank"
              className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
              title="Open Full Page"
            >
              <ExternalLink size={14} />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-7 w-7 text-gray-600 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
