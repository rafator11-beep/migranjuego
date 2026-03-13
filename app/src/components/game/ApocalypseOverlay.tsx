
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

type Kind = "legendary" | "chaos" | "cursed";

export function ApocalypseOverlay({
  open,
  kind,
  title,
  subtitle,
  onClose,
}: {
  open: boolean;
  kind: Kind;
  title: string;
  subtitle?: string;
  onClose: () => void;
}) {
  const glow =
    kind === "legendary"
      ? "from-yellow-500/30 via-yellow-500/10 to-transparent"
      : kind === "chaos"
      ? "from-red-500/30 via-red-500/10 to-transparent"
      : "from-purple-600/30 via-purple-600/10 to-transparent";

  const badge =
    kind === "legendary" ? "LEGENDARY" : kind === "chaos" ? "CHAOS" : "CURSED";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-black/70 overflow-hidden shadow-2xl"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
          >
            <div className={`h-2 bg-gradient-to-r ${glow}`} />
            <div className="p-5">
              <div className="text-xs tracking-[0.2em] text-white/60 font-semibold">
                {badge}
              </div>
              <div className="mt-2 text-2xl font-extrabold text-white">
                {title}
              </div>
              {subtitle && (
                <div className="mt-2 text-sm text-white/70">{subtitle}</div>
              )}
              <div className="mt-5 flex justify-end">
                <Button onClick={onClose} className="rounded-xl">
                  Continuar
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
