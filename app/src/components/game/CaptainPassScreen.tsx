import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CaptainPassScreenProps {
  captainName?: string;
  targetPlayerName?: string;
  onComplete: () => void;
}

export function CaptainPassScreen({
  captainName = "Capitán",
  targetPlayerName = "Siguiente Jugador",
  onComplete
}: CaptainPassScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-center text-white border border-white/20"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="inline-block mb-6"
        >
          <AlertTriangle className="w-16 h-16 text-yellow-300" />
        </motion.div>

        <h2 className="text-2xl font-bold mb-4">
          ¡ATENCIÓN {captainName.toUpperCase()}!
        </h2>

        <p className="text-lg mb-6 leading-relaxed">
          La respuesta de este reto es <span className="font-bold text-yellow-300">SECRETA</span>.
        </p>

        <div className="bg-white/20 rounded-xl p-4 mb-6">
          <p className="text-base">
            📱 Lee el reto en voz alta y pásale el móvil a <span className="font-bold text-yellow-300">{targetPlayerName}</span> para que responda sin que tú veas.
          </p>
        </div>

        <Button
          onClick={onComplete}
          className="w-full py-6 text-lg bg-white text-orange-600 hover:bg-gray-100"
        >
          <span>Entendido, continuar</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
