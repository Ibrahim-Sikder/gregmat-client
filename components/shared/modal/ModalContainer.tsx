"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { cn } from "@/lib/utils";

interface ModalContainerProps {
  trigger?: React.ReactNode;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showClose?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  width?: string;
  height?: string;
  className?: string;
}

export default function ModalContainer({
  trigger,
  title,
  description,
  children,
  footer,
  showClose = true,
  open,
  onOpenChange,
  width = "max-w-full md:max-w-3xl",
  height = "max-h-[90vh]",
  className,
}: ModalContainerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          `
            ${width} ${height}
            w-full mx-auto
            overflow-y-auto rounded-2xl p-4 sm:p-6
            bg-white
            scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent
          `,
          className,
        )}
      >
        {(title || description || showClose) && (
          <DialogHeader className="flex flex-col gap-2 sm:gap-3">
            <div>
              {title ? <DialogTitle>{title}</DialogTitle> : <DialogTitle />}
              {description && (
                <DialogDescription
                  aria-describedby={""}
                  className="mt-1 text-sm sm:text-base"
                >
                  {description}
                </DialogDescription>
              )}
            </div>
          </DialogHeader>
        )}

        <div>{children}</div>

        {footer && (
          <DialogFooter className="pt-4 sm:pt-6">{footer}</DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
