"use client";

import parse, { domToReact, HTMLReactParserOptions } from "html-react-parser";
import Link from "next/link";
import DOMPurify from "dompurify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Props = {
  html: string;
};

const IMAGE_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "svg",
  "webp",
  "bmp",
  "avif",
];

const isImageUrl = (url: string) => {
  try {
    const urlWithoutQuery = url.split("?")[0].split("#")[0];
    const extension = urlWithoutQuery.split(".").pop()?.toLowerCase();
    return extension && IMAGE_EXTENSIONS.includes(extension);
  } catch (e) {
    return false;
  }
};

const ImageViewer = ({
  src,
  alt,
  children,
}: {
  src: string;
  alt: string | undefined;
  children: React.ReactNode;
}) => (
  <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent className="max-w-[95vw] sm:max-w-4xl p-1 overflow-hidden">
      <DialogHeader className="sr-only">
        <DialogTitle>Image Preview</DialogTitle>
      </DialogHeader>
      <div className="flex items-center justify-center">
        <img
          src={src}
          alt={alt || "Preview"}
          className="max-w-full max-h-[85vh] object-contain rounded-md"
        />
      </div>
    </DialogContent>
  </Dialog>
);

export default function RichText({ html }: Props) {
  // sanitize to prevent XSS
  const cleanHtml = DOMPurify.sanitize(html);

  const options: HTMLReactParserOptions = {
    replace: (domNode: any) => {
      // 🔗 Handle links
      if (domNode.name === "a" && domNode.attribs?.href) {
        const href: string = domNode.attribs.href;

        // 🖼️ Case 1: Link points to an image
        if (isImageUrl(href)) {
          return (
            <ImageViewer src={href} alt="Preview">
              <button
                type="button"
                className="text-blue-600 underline hover:text-blue-800 transition-colors cursor-zoom-in text-left"
              >
                {domToReact(domNode.children, options)}
              </button>
            </ImageViewer>
          );
        }

        const isExternal =
          href.startsWith("http://") ||
          href.startsWith("https://") ||
          href.startsWith("//");

        // 🔗 Case 2: External links → normal <a>, new tab
        if (isExternal) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800 transition-colors"
            >
              {domToReact(domNode.children, options)}
            </a>
          );
        }

        // 🔗 Case 3: Internal links → Next.js Link
        return (
          <Link
            href={href}
            className="text-blue-600 underline hover:text-blue-800 transition-colors"
          >
            {domToReact(domNode.children, options)}
          </Link>
        );
      }

      // 🖼️ Handle standalone images (not wrapped in an image link already)
      if (domNode.name === "img" && domNode.attribs?.src) {
        const src: string = domNode.attribs.src;

        // Check if parent is an image link to avoid nested dialogs
        let parent = domNode.parent;
        let isInsideImgLink = false;
        while (parent) {
          if (
            parent.name === "a" &&
            parent.attribs?.href &&
            isImageUrl(parent.attribs.href)
          ) {
            isInsideImgLink = true;
            break;
          }
          parent = parent.parent;
        }

        if (!isInsideImgLink) {
          return (
            <ImageViewer src={src} alt={domNode.attribs.alt}>
              <img
                {...domNode.attribs}
                className={cn(
                  "cursor-zoom-in hover:opacity-90 transition-opacity",
                  domNode.attribs.className,
                )}
                alt={domNode.attribs.alt || "Image"}
              />
            </ImageViewer>
          );
        }
      }
    },
  };

  return (
    <div className="prose prose-sm max-w-none text-gray-700 mt-2 text-lg">
      {parse(cleanHtml, options)}
    </div>
  );
}
