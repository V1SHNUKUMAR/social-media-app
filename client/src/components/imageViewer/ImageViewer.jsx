import { useState } from "react";
import { ExternalLink, ImageOff, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";

// Full-size lightbox for a profile or cover picture.
// variant="avatar" shows a large circle; variant="cover" shows the whole wide image.
const ImageViewer = ({ open, onOpenChange, variant = "cover", ...props }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      showCloseButton={false}
      overlayClassName="bg-black/80 supports-backdrop-filter:backdrop-blur-md"
      className={cn(
        "flex flex-col items-center gap-4 bg-transparent p-0 text-white ring-0 shadow-none",
        variant === "avatar" ? "sm:max-w-md" : "sm:max-w-5xl"
      )}
    >
      <ViewerBody key={props.src} variant={variant} {...props} />
    </DialogContent>
  </Dialog>
);

// Mounted only while the dialog is open, so the load status starts fresh each time.
const ViewerBody = ({ src, title, subtitle, variant }) => {
  const [status, setStatus] = useState("loading");
  const isAvatar = variant === "avatar";

  return (
    <>
      <div
        className={cn(
          "relative flex w-full items-center justify-center overflow-hidden bg-white/5 shadow-2xl ring-1 ring-white/10",
          isAvatar ? "aspect-square max-w-[min(28rem,80vh)] rounded-full" : "min-h-40 rounded-2xl"
        )}
      >
        {status === "loading" && (
          <Loader2 className="absolute size-8 animate-spin text-white/70" aria-hidden />
        )}
        {status === "error" ? (
          <div className="flex flex-col items-center gap-2 p-10 text-sm text-white/70">
            <ImageOff className="size-8" />
            Couldn't load this image.
          </div>
        ) : (
          <img
            src={src}
            alt={title}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
            className={cn(
              "transition-opacity duration-200",
              status === "loaded" ? "opacity-100" : "opacity-0",
              isAvatar ? "size-full object-cover" : "max-h-[78vh] w-full object-contain"
            )}
          />
        )}
      </div>

      <div className="flex w-full items-center justify-between gap-3 px-1">
        <div className="min-w-0">
          <DialogTitle className="truncate text-base font-semibold text-white">{title}</DialogTitle>
          <DialogDescription className="truncate text-white/60">{subtitle}</DialogDescription>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {status === "loaded" && (
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="flex size-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-3 focus-visible:ring-white/40 focus-visible:outline-none"
              aria-label="Open original in new tab"
              title="Open original"
            >
              <ExternalLink className="size-4.5" />
            </a>
          )}
          <DialogClose
            className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:ring-3 focus-visible:ring-white/40 focus-visible:outline-none"
            aria-label="Close"
          >
              <X className="size-5" />
            </DialogClose>
          </div>
        </div>
    </>
  );
};

export default ImageViewer;
