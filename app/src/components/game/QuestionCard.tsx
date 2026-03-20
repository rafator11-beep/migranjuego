import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Question } from '@/types/game';
import { QuestionVote } from './QuestionVote';

interface QuestionCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  timeLimit?: number;
  playerName: string;
}

export function QuestionCard({ question, onAnswer, timeLimit = 30, playerName }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (timeLimit <= 0 || showResult) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimit, showResult]);

  const handleTimeUp = () => {
    if (!showResult) {
      setShowResult(true);
      setIsCorrect(false);
      setTimeout(() => onAnswer(false), 2000);
    }
  };

  const handleSelectAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer && question.type !== 'social') return;
    
    const correct = question.type === 'social' 
      ? true // Social questions are always "correct" as they're for discussion
      : selectedAnswer === question.correct_answer;
    
    setIsCorrect(correct);
    setShowResult(true);
    setTimeout(() => onAnswer(correct), 2000);
  };

  const getTimerColor = () => {
    if (timeLeft > 20) return 'text-green-500';
    if (timeLeft > 10) return 'text-yellow-500';
    return 'text-red-500';
  };

  const renderOptions = () => {
    if (question.type === 'test' && question.options) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(question.options as string[]).map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = question.correct_answer === option;

            let bgClass = 'bg-white/10 hover:bg-white/20 border-transparent';
            if (showResult) {
              if (isCorrectAnswer) bgClass = 'bg-green-500/30 border-green-500';
              else if (isSelected && !isCorrectAnswer) bgClass = 'bg-red-500/30 border-red-500';
            } else if (isSelected) {
              bgClass = 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-white/20';
            }

            return (
              <motion.button
                key={option}
                whileHover={!showResult ? { scale: 1.02 } : {}}
                whileTap={!showResult ? { scale: 0.98 } : {}}
                onClick={() => handleSelectAnswer(option)}
                disabled={showResult}
                className={`p-4 rounded-xl border-2 text-left transition-all ${bgClass} text-white`}
              >
                <span className="font-bold text-purple-400 mr-2">{letter}.</span>
                {option}
              </motion.button>
            );
          })}
        </div>
      );
    }

    if (question.type === 'true_false') {
      return (
        <div className="flex gap-4 justify-center">
          {['Verdadero', 'Falso'].map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = question.correct_answer === option;

            let bgClass = 'bg-white/10 hover:bg-white/20 border-transparent';
            if (showResult) {
              if (isCorrectAnswer) bgClass = 'bg-green-500/30 border-green-500';
              else if (isSelected && !isCorrectAnswer) bgClass = 'bg-red-500/30 border-red-500';
            } else if (isSelected) {
              bgClass = 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-white/20';
            }

            return (
              <motion.button
                key={option}
                whileHover={!showResult ? { scale: 1.05 } : {}}
                whileTap={!showResult ? { scale: 0.95 } : {}}
                onClick={() => handleSelectAnswer(option)}
                disabled={showResult}
                className={`px-8 py-4 rounded-xl border-2 font-semibold text-lg transition-all ${bgClass} text-white`}
              >
                {option === 'Verdadero' ? '✓' : '✗'} {option}
              </motion.button>
            );
          })}
        </div>
      );
    }

    if (question.type === 'social') {
      return (
        <div className="text-center py-4">
          <p className="text-white/60 mb-4">
            Esta es una pregunta de debate. Discutidla entre todos y cuando estéis listos, continúa.
          </p>
          <Button onClick={handleSubmit} size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border border-white/10 backdrop-blur-sm">
            Hemos debatido, continuar
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-xl border border-white/10 max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white rounded-full font-medium border border-white/10 backdrop-blur-sm">
            {question.category}
          </span>
          <span className="text-sm text-white/60">
            Dificultad: {'⭐'.repeat(question.difficulty)}
          </span>
        </div>
        
        {timeLimit > 0 && !showResult && (
          <div className={`flex items-center gap-2 ${getTimerColor()}`}>
            <Timer className="h-5 w-5" />
            <span className="font-mono text-xl font-bold text-white">{timeLeft}s</span>
          </div>
        )}
      </div>

      {/* Player Turn */}
      <div className="text-center mb-4">
        <span className="text-sm text-white/60">Turno de</span>
        <h3 className="text-lg font-semibold text-white">{playerName}</h3>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-center leading-relaxed text-white">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      {renderOptions()}

      {/* Submit button for non-social questions */}
      {question.type !== 'social' && !showResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedAnswer ? 1 : 0.5 }}
          className="mt-6 text-center"
        >
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border border-white/10 backdrop-blur-sm"
          >
            Confirmar Respuesta
          </Button>
        </motion.div>
      )}

      {/* Result feedback */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-6 p-4 rounded-xl text-center ${
              isCorrect ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' : 'bg-gradient-to-r from-red-500/20 to-rose-500/20'
            } border border-white/10 backdrop-blur-sm`}
          >
            {isCorrect ? (
              <div className="flex items-center justify-center gap-2 text-green-400">
                <CheckCircle2 className="h-6 w-6" />
                <span className="font-semibold text-lg text-white">¡Correcto!</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-red-400">
                <div className="flex items-center gap-2">
                  <XCircle className="h-6 w-6" />
                  <span className="font-semibold text-lg text-white">Incorrecto</span>
                </div>
                {question.correct_answer && (
                  <p className="text-sm text-white/80">
                    La respuesta correcta era: <strong>{question.correct_answer}</strong>
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question voting */}
      {showResult && (
        <QuestionVote
          questionText={question.question}
          questionCategory={question.category}
          voterName={playerName}
        />
      )}
    </motion.div>
  );
}
