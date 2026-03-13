import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, Phone, RefreshCw, Check, X, Trophy, Users } from 'lucide-react';
import { useGameContext } from '@/contexts/GameContext';
import { Player } from '@/types/game';
import { Button } from '@/components/ui/button';
import { cultureQuestions, CultureQuestion, getRandomCultureQuestions } from '@/data/cultureQuestions';

interface Lifeline {
  id: 'fifty' | 'hint' | 'change';
  icon: React.ElementType;
  name: string;
  used: boolean;
}

export default function CultureGame() {
  const navigate = useNavigate();
  const { players } = useGameContext();
  const currentPlayers = players;
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [questions, setQuestions] = useState<CultureQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [correctStreak, setCorrectStreak] = useState(0);
  
  const [lifelines, setLifelines] = useState<Record<string, Lifeline[]>>({});

  const currentPlayer = currentPlayers[currentPlayerIndex];
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (currentPlayers.length < 2) {
      navigate('/');
      return;
    }

    const shuffledQuestions = getRandomCultureQuestions(30);
    setQuestions(shuffledQuestions);

    const initialScores: Record<string, number> = {};
    const initialLifelines: Record<string, Lifeline[]> = {};
    
    currentPlayers.forEach(player => {
      initialScores[player.id] = 0;
      initialLifelines[player.id] = [
        { id: 'fifty', icon: Phone, name: '50:50', used: false },
        { id: 'hint', icon: Lightbulb, name: 'Pista', used: false },
        { id: 'change', icon: RefreshCw, name: 'Cambiar', used: false },
      ];
    });
    
    setScores(initialScores);
    setLifelines(initialLifelines);
  }, [currentPlayers, navigate]);

  const useLifeline = useCallback((lifelineId: 'fifty' | 'hint' | 'change') => {
    if (!currentPlayer || !currentQuestion) return;

    const playerLifelines = lifelines[currentPlayer.id];
    const lifeline = playerLifelines?.find(l => l.id === lifelineId);
    
    if (!lifeline || lifeline.used) return;

    setLifelines(prev => ({
      ...prev,
      [currentPlayer.id]: prev[currentPlayer.id].map(l =>
        l.id === lifelineId ? { ...l, used: true } : l
      ),
    }));

    switch (lifelineId) {
      case 'fifty': {
        const wrongOptions = currentQuestion.options
          .map((_, i) => i)
          .filter(i => i !== currentQuestion.correctIndex);
        const toEliminate = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 2);
        setEliminatedOptions(toEliminate);
        break;
      }
      case 'hint': {
        setShowHint(true);
        break;
      }
      case 'change': {
        const availableQuestions = cultureQuestions.filter(
          q => !questions.includes(q) && q.difficulty <= (currentQuestion?.difficulty || 3)
        );
        if (availableQuestions.length > 0) {
          const newQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
          setQuestions(prev => {
            const updated = [...prev];
            updated[currentQuestionIndex] = newQuestion;
            return updated;
          });
          setEliminatedOptions([]);
          setShowHint(false);
        }
        break;
      }
    }
  }, [currentPlayer, currentQuestion, currentQuestionIndex, lifelines, questions]);

  const handleAnswer = (answerIndex: number) => {
    if (showResult || selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect = answerIndex === currentQuestion.correctIndex;
    
    if (isCorrect) {
      const diffNum = typeof currentQuestion.difficulty === 'number' ? currentQuestion.difficulty : parseInt(String(currentQuestion.difficulty), 10) || 1;
      const points = diffNum * 10 * (correctStreak + 1);
      setScores(prev => ({
        ...prev,
        [currentPlayer.id]: prev[currentPlayer.id] + points,
      }));
      setCorrectStreak(prev => prev + 1);
    } else {
      setCorrectStreak(0);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setEliminatedOptions([]);
    setShowHint(false);

    if (currentQuestionIndex >= questions.length - 1) {
      setGameOver(true);
      return;
    }

    setCurrentQuestionIndex(prev => prev + 1);
    setCurrentPlayerIndex(prev => (prev + 1) % currentPlayers.length);
  };

  const handleEndGame = () => {
    navigate('/');
  };

  if (!currentPlayer || !currentQuestion) return null;

  const playerLifelines = lifelines[currentPlayer.id] || [];
  
   const getDifficultyLabel = (diff: number | string) => {
    const d = typeof diff === 'number' ? diff : parseInt(String(diff), 10) || 1;
    const labels = ['1º Primaria', '3º Primaria', '6º Primaria', 'ESO', 'Bachillerato'];
    return labels[d - 1] || 'Difícil';
  };

  const getDifficultyColor = (diff: number | string) => {
    const d = typeof diff === 'number' ? diff : parseInt(String(diff), 10) || 1;
    const colors = ['text-green-400', 'text-cyan-400', 'text-yellow-400', 'text-orange-400', 'text-pink-400'];
    return colors[d - 1] || 'text-pink-400';
  };

  if (gameOver) {
    const sortedPlayers = [...currentPlayers].sort(
      (a, b) => (scores[b.id] || 0) - (scores[a.id] || 0)
    );

    return (
      <div className="min-h-screen pb-24 pt-8 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8 animate-slide-up">
            <span className="text-6xl block mb-4">🏆</span>
            <h1 className="text-3xl font-bold text-primary mb-2">
              ¡Fin del Juego!
            </h1>
            <p className="text-muted-foreground">
              Resultados de Cultura General
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`bg-card rounded-2xl p-4 flex items-center gap-4 animate-slide-up border ${
                  index === 0 ? 'ring-2 ring-primary' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg">{player.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {scores[player.id] || 0} puntos
                  </p>
                </div>
                {index === 0 && <Trophy className="w-8 h-8 text-primary" />}
              </div>
            ))}
          </div>

          <Button onClick={handleEndGame} className="w-full text-xl py-6">
            Volver al Menú
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-muted-foreground"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-primary">
              Cultura General
            </h1>
            <p className={`text-sm ${getDifficultyColor(currentQuestion.difficulty)}`}>
              {getDifficultyLabel(currentQuestion.difficulty)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Pregunta</p>
            <p className="font-bold">{currentQuestionIndex + 1}/{questions.length}</p>
          </div>
        </div>

        {/* Current Player */}
        <div className="flex items-center justify-center gap-3 mb-6 animate-slide-up">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden ring-4 ring-primary/50">
            {currentPlayer.avatar_url ? (
              <img src={currentPlayer.avatar_url} alt={currentPlayer.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl">{currentPlayer.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Turno de</p>
            <p className="text-xl font-bold text-primary">{currentPlayer.name}</p>
            <p className="text-sm text-accent-foreground">{scores[currentPlayer.id] || 0} pts</p>
          </div>
        </div>

        {/* Lifelines */}
        <div className="flex justify-center gap-3 mb-6">
          {playerLifelines.map(lifeline => (
            <button
              key={lifeline.id}
              onClick={() => useLifeline(lifeline.id)}
              disabled={lifeline.used || showResult}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                lifeline.used
                  ? 'opacity-30 bg-secondary cursor-not-allowed'
                  : 'bg-card border hover:bg-primary/20 cursor-pointer'
              }`}
            >
              <lifeline.icon className={`w-6 h-6 ${lifeline.used ? 'text-muted-foreground' : 'text-primary'}`} />
              <span className="text-xs">{lifeline.name}</span>
            </button>
          ))}
        </div>

        {/* Question Card */}
        <div className="bg-card rounded-3xl p-6 border mb-6">
          <p className="text-xl font-bold text-center mb-6">
            {currentQuestion.question}
          </p>

          {showHint && currentQuestion.hint && (
            <div className="bg-accent/20 rounded-xl p-3 mb-4 text-center">
              <p className="text-sm">
                <Lightbulb className="w-4 h-4 inline mr-2 text-accent-foreground" />
                {currentQuestion.hint}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isEliminated = eliminatedOptions.includes(index);
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctIndex;
              
              let buttonClass = 'bg-secondary p-4 rounded-xl text-left transition-all w-full border';
              
              if (isEliminated) {
                buttonClass += ' opacity-30 cursor-not-allowed';
              } else if (showResult) {
                if (isCorrect) {
                  buttonClass += ' bg-green-500/30 ring-2 ring-green-500';
                } else if (isSelected && !isCorrect) {
                  buttonClass += ' bg-destructive/30 ring-2 ring-destructive';
                }
              } else {
                buttonClass += ' hover:bg-primary/20 cursor-pointer';
              }

              return (
                <button
                  key={index}
                  onClick={() => !isEliminated && handleAnswer(index)}
                  disabled={isEliminated || showResult}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showResult && isCorrect && <Check className="w-6 h-6 text-green-500" />}
                    {showResult && isSelected && !isCorrect && <X className="w-6 h-6 text-destructive" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Result & Next Button */}
        {showResult && (
          <div>
            <div className={`text-center mb-4 p-4 rounded-xl ${
              selectedAnswer === currentQuestion.correctIndex
                ? 'bg-green-500/20'
                : 'bg-destructive/20'
            }`}>
              <span className="text-3xl block mb-2">
                {selectedAnswer === currentQuestion.correctIndex ? '🎉' : '😅'}
              </span>
              <p className="font-bold">
                {selectedAnswer === currentQuestion.correctIndex
                  ? `¡Correcto! +${(typeof currentQuestion.difficulty === 'number' ? currentQuestion.difficulty : parseInt(String(currentQuestion.difficulty), 10) || 1) * 10 * correctStreak} puntos`
                  : 'Incorrecto'}
              </p>
            </div>
            <Button onClick={handleNext} className="w-full text-lg py-5">
              Siguiente
            </Button>
          </div>
        )}

        {/* Players strip */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <Users className="w-4 h-4 text-muted-foreground" />
          {currentPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`text-center transition-all ${
                index === currentPlayerIndex ? 'scale-110' : 'opacity-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${
                index === currentPlayerIndex ? 'ring-2 ring-primary' : ''
              }`}>
                {player.avatar_url ? (
                  <img src={player.avatar_url} alt={player.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-xs font-bold">{player.name.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <p className="text-xs mt-1">{scores[player.id] || 0}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
