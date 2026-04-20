"use client";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";

export default function CopyLink({ link }: { link?: string }) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(link || window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Button
      variant={"ghost"}
      onClick={handleCopyLink}
      aria-label="Copy link"
      title="Copy link"
    >
      <Copy className="w-4 h-4" />
    </Button>
  );
}
