import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Eye, EyeOff, Crown, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CaptainPassScreenProps {
  captainName?: string;
  targetPlayerName?: string;
  onComplete: () => void;
  isCaptainTurn?: boolean; // NEW: Is this the captain's own turn?
  challengePreview?: string; // NEW: Preview for captains on their own turn
}

export function CaptainPassScreen({
  captainName = "Capitán",
  targetPlayerName = "Siguiente Jugador",
  onComplete,
  isCaptainTurn = false,
  challengePreview
}: CaptainPassScreenProps) {
  const [showContent, setShowContent] = useState(false);

  // If it's the captain's own turn, they participate normally
  if (isCaptainTurn) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-emerald-700 to-teal-800 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-center text-white border border-white/20"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <Crown className="w-16 h-16 text-amber-300" />
          </motion.div>

          <h2 className="text-2xl font-bold mb-4">
            ¡TU TURNO, {captainName.toUpperCase()}!
          </h2>

          <p className="text-lg mb-4 leading-relaxed">
            Como <span className="font-bold text-amber-300">Capitán</span>, también juegas. 
            Este reto es <span className="font-bold text-emerald-300">TUYO</span>.
          </p>

          {challengePreview && (
            <div className="bg-white/20 rounded-xl p-4 mb-6">
              <p className="text-base font-medium">{challengePreview}</p>
            </div>
          )}

          <Button
            onClick={onComplete}
            className="w-full py-6 text-lg bg-white text-emerald-700 hover:bg-gray-100 font-bold"
          >
            <Gamepad2 className="w-5 h-5 mr-2" />
            <span>¡A jugar!</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // Normal pass screen — captain must pass the phone to someone else
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

        <p className="text-lg mb-4 leading-relaxed">
          La respuesta de este reto es <span className="font-bold text-yellow-300">SECRETA</span>.
        </p>

        <div className="bg-white/20 rounded-xl p-4 mb-4">
          <p className="text-base mb-2">
            📱 Lee el reto en voz alta y pásale el móvil a{' '}
            <span className="font-bold text-yellow-300">{targetPlayerName}</span>{' '}
            para que responda sin que tú veas.
          </p>
        </div>

        {/* Toggle to peek (optional cheat) */}
        <button
          onClick={() => setShowContent(!showContent)}
          className="flex items-center gap-2 mx-auto text-xs text-white/40 hover:text-white/60 transition-colors mb-4"
        >
          {showContent ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {showContent ? 'Ocultar contenido' : 'Vista previa (solo capitán)'}
        </button>

        {showContent && challengePreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white/10 rounded-xl p-3 mb-4 text-sm text-white/70 border border-white/10"
          >
            <p>{challengePreview}</p>
          </motion.div>
        )}

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
