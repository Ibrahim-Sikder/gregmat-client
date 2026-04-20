import { useEffect } from "react";
import ContentVideoCore from "@/components/pre-swift/ContentVideoCore";

interface Props {
  contentSlug: string;
  courseId: string;
  courseSlug: string;
  categoryId: string;
  onClose?: () => void;
}

export default function ContentVideoDialog(props: Props) {
  useEffect(() => {
    // Lock scroll on mount
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // Revert scroll on unmount
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't close if in fullscreen mode
    if (document.fullscreenElement) {
      return;
    }

    // Close dialog if clicking on the backdrop (not the content)
    if (e.target === e.currentTarget) {
      props.onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-5xl h-[90vh] flex flex-col">
        <ContentVideoCore
          initialSlug={props.contentSlug}
          courseId={props.courseId}
          categoryId={props.categoryId}
          showClose
          courseSlug={props.courseSlug}
          onClose={props.onClose}
        />
      </div>
    </div>
  );
}
