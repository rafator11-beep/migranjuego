
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
  playerName?: string;
}

export function ImagePreviewDialog({ open, onOpenChange, imageUrl, playerName }: Props) {
  if (!imageUrl) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-4 bg-black/90 border border-white/10" aria-describedby={undefined}>
        <DialogHeader className="sr-only">
          <DialogTitle>Vista previa de imagen</DialogTitle>
          <DialogDescription id="image-preview-description">Vista ampliada del avatar del jugador</DialogDescription>
        </DialogHeader>
        <div className="w-full flex items-center justify-center">
          {/* Smaller + circular to avoid showing compression artifacts */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden ring-2 ring-white/15 bg-white/5">
            <img
              src={imageUrl}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              alt={playerName || "avatar"}
              className="w-full h-full object-cover animate-in zoom-in-95 duration-200"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
        <div className="mt-2 text-xs text-white/60 text-center">Si no se ve la foto: asegúrate de que la URL sea pública (Supabase Storage → public) o usa una URL directa.</div>
      </DialogContent>
    </Dialog>
  );
}
