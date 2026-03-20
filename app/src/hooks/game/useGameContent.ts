import { useState, useEffect, useCallback } from 'react';
import { GameMode } from '@/types/game';
import {
    normasRonda,
    clasico,
    yoNunca,
    picante,
    nostalgia,
    quienEsMasProbable,
    pacovers,
    getMegamixContent,
    getStructuredMegamix,
    enLaCamaY,
    categoriasLetras,
    categoriasReto,
} from '@/data/gameContent';
import {
    clasicoExtra,
    yoNuncaExtra,
    picanteExtra,
    masProbableExtra,
    pacoversExtra,
    enLaCamaYExtra,
    categoriasLetrasExtra,
    categoriasRetoExtra,
} from '@/data/gameContentExtra';
import {
    quienEsMasProbableExtra2,
    yoNuncaExtra2,
    categoriasRetoExtra2,
    picanteExtra2,
    clasicoExtra2,
    pacoversExtra2,
    enLaCamaYExtra2,
    categoriasLetrasExtra2,
} from '@/data/gameContentExtra2';
import {
    clasicoExtra3, yoNuncaExtra3, picanteExtra3, masProbableExtra3,
    pacoversExtra3, espanaExtra3, enLaCamaYExtra3,
    categoriasLetrasExtra3, categoriasRetoExtra3,
} from '@/data/gameContentExtra3';
import { customPartyRetos as importedCustomRetos } from '@/data/customPartyRetos';
import { footballQuestions } from '@/data/footballQuestionsNew';
import { cultureQuestions } from '@/data/cultureQuestions';
import { cultureQuestionsNew2025 } from '@/data/cultureQuestionsNew2025';
import { buildGodDeck } from '@/lib/godDeck';

// Deep Shuffle: Multi-pass Fisher-Yates with random sort final pass
function shuffleArray<T>(array: T[]): T[] {
    let shuffled = [...array];
    // Three passes of Fisher-Yates for maximum entropy
    for (let pass = 0; pass < 3; pass++) {
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
    }
    // Final random sort to break any remaining patterns
    return shuffled.sort(() => Math.random() - 0.5);
}

function normalizeDeckEntries(items: any[]): string[] {
    return items
        .map(item => typeof item === 'string' ? item : String(item ?? ''))
        .map(item => item.replace(/\s+/g, ' ').trim())
        .filter(item => item.length > 0 && item !== 'undefined' && item !== 'null');
}

function applyVoteWeights(items: string[], category: string): string[] {
    try {
        const raw = localStorage.getItem('fiesta-party-votes');
        if (!raw) return items;
        const data = JSON.parse(raw);
        const scores: Record<string, number> = data?.[category] || {};
        const out: string[] = [];
        for (const t of items) {
            const s = scores[t] || 0;
            if (s <= -3) continue;
            out.push(t);
            if (s >= 3) out.push(t);
        }
        return out.length ? out : items;
    } catch {
        return items;
    }
}

export const useGameContent = (mode: GameMode, currentIndex: number, currentPlayerName: string, playersCount: number = 4) => {
    const [content, setContent] = useState<string[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<any | null>(null);
    const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());
    const [questionNumber, setQuestionNumber] = useState(0);
    // Key that forces re-shuffle on each new game (changes on mount)
    const [reshuffleKey] = useState(() => Date.now());

    useEffect(() => {
        let modeContent: any[] = [];

        switch (mode) {
            case 'megamix':
                modeContent = getStructuredMegamix(500, playersCount);
                break;
            case 'clasico':
                modeContent = shuffleArray([
                    ...clasico,
                    ...clasicoExtra,
                    ...clasicoExtra2,
                    ...clasicoExtra3,
                    ...yoNunca.map(q => `🙈 ${q}`),
                    ...yoNuncaExtra.map(q => `🙈 ${q}`),
                    ...yoNuncaExtra2.map(q => `🙈 ${q}`),
                    ...yoNuncaExtra3.map(q => `🙈 ${q}`),
                    ...picante.map(q => `🌶️ ${q}`),
                    ...picanteExtra.map(q => `🌶️ ${q}`),
                    ...picanteExtra2.map(q => `🌶️ ${q}`),
                    ...picanteExtra3.map(q => `🌶️ ${q}`),
                    ...pacovers.map(q => `🇪🇸 ${q}`),
                    ...pacoversExtra.map(q => `🇪🇸 ${q}`),
                    ...pacoversExtra2.map(q => `🇪🇸 ${q}`),
                    ...pacoversExtra3.map(q => `🇪🇸 ${q}`),
                    ...quienEsMasProbable.map(q => `🗳️ ${q}`),
                    ...masProbableExtra.map(q => `🗳️ ${q}`),
                    ...quienEsMasProbableExtra2.map(q => `🗳️ ${q}`),
                    ...masProbableExtra3.map(q => `🗳️ ${q}`),
                    ...enLaCamaY.map(q => `🛌 ${q}`),
                    ...enLaCamaYExtra.map(q => `🛌 ${q}`),
                    ...enLaCamaYExtra2.map(q => `🛌 ${q}`),
                    ...enLaCamaYExtra3.map(q => `🛌 ${q}`),
                    ...categoriasLetras.map(q => `🔤 ${q}`),
                    ...categoriasLetrasExtra.map(q => `🔤 ${q}`),
                    ...categoriasLetrasExtra2.map(q => `🔤 ${q}`),
                    ...categoriasLetrasExtra3.map(q => `🔤 ${q}`),
                    ...categoriasReto.map(q => `🎯 ${q}`),
                    ...categoriasRetoExtra.map(q => `🎯 ${q}`),
                    ...categoriasRetoExtra2.map(q => `🎯 ${q}`),
                    ...categoriasRetoExtra3.map(q => `🎯 ${q}`),
                    ...espanaExtra3.map(q => `🇪🇸 ${q}`),
                    ...normasRonda.map(q => `NORMA: ${q}`),
                    ...importedCustomRetos,
                ]);
                break;
            case 'yo_nunca':
            case 'yo_nunca_equipos':
                modeContent = shuffleArray([...yoNunca, ...yoNuncaExtra, ...yoNuncaExtra2, ...yoNuncaExtra3]);
                break;
            case 'picante':
                modeContent = shuffleArray([...picante, ...picanteExtra, ...picanteExtra2, ...picanteExtra3]);
                break;
            case 'espana':
                modeContent = shuffleArray([...nostalgia, ...pacoversExtra, ...pacoversExtra2, ...espanaExtra3]);
                break;
            case 'votacion':
                modeContent = shuffleArray([...quienEsMasProbable, ...masProbableExtra, ...quienEsMasProbableExtra2, ...masProbableExtra3]);
                break;
            case 'pacovers':
                modeContent = shuffleArray([...pacovers, ...pacoversExtra, ...pacoversExtra2, ...pacoversExtra3]);
                break;
            default:
                modeContent = getMegamixContent(200);
        }

        const cleanedContent = normalizeDeckEntries(modeContent as any[]);
        const weighted = normalizeDeckEntries(applyVoteWeights(cleanedContent, mode));
        setContent(weighted);

        // Reset used questions for fresh game
        setUsedQuestionIds(new Set());
        setQuestionNumber(0);

        // Pre-load first trivia question synchronously to avoid 'Cargando pregunta' flash
        if (mode === 'trivia_futbol' || mode === 'cultura') {
            const isFootball = mode === 'trivia_futbol';
            const sourceQuestions = (isFootball ? footballQuestions : [...cultureQuestions, ...cultureQuestionsNew2025]) as any[];
            if (sourceQuestions && sourceQuestions.length > 0) {
                const shuffled = shuffleArray(sourceQuestions);
                setCurrentQuestion(shuffled[0]);
                setUsedQuestionIds(new Set([shuffled[0].question]));
                setQuestionNumber(1);
            }
        }
    }, [mode, reshuffleKey, playersCount]);

    const loadNextQuestion = useCallback(() => {
        setQuestionNumber(prev => prev + 1);

        const isFootball = mode === 'trivia_futbol';
        const sourceQuestions = (isFootball ? footballQuestions : [...cultureQuestions, ...cultureQuestionsNew2025]) as any[];

        // Safety check
        if (!sourceQuestions || sourceQuestions.length === 0) {
            return;
        }

        const shuffledQuestions = shuffleArray(sourceQuestions);
        const availableQuestions = shuffledQuestions.filter(q => !usedQuestionIds.has(q.question));

        if (availableQuestions.length > 0) {
            const randomQ = availableQuestions[0];
            setCurrentQuestion(randomQ);
            setUsedQuestionIds(prev => new Set([...prev, randomQ.question]));
        } else {
            setUsedQuestionIds(new Set());
            const randomQ = shuffledQuestions[0];
            setCurrentQuestion(randomQ);
        }
    }, [mode, usedQuestionIds]);

    const loadSpecificQuestion = useCallback((category: 'futbol' | 'cultura') => {
        const isFootball = category === 'futbol';
        const sourceQuestions = (isFootball ? footballQuestions : [...cultureQuestions, ...cultureQuestionsNew2025]) as any[];

        // Safety check
        if (!sourceQuestions || sourceQuestions.length === 0) {
            console.error("No questions found for category:", category);
            // Set a fallback question so the game doesn't hang
            setCurrentQuestion({
                question: `Error: No hay preguntas de ${category} disponibles.`,
                options: ["Continuar"],
                correctIndex: 0,
                category: "Error",
                difficulty: 1
            });
            return;
        }

        const shuffledQuestions = shuffleArray(sourceQuestions);
        const availableQuestions = shuffledQuestions.filter(q => !usedQuestionIds.has(q.question));

        if (availableQuestions.length > 0) {
            const randomQ = availableQuestions[0];
            setCurrentQuestion(randomQ);
            setUsedQuestionIds(prev => new Set([...prev, randomQ.question]));
        } else {
            setUsedQuestionIds(new Set());
            const randomQ = shuffledQuestions[0];
            setCurrentQuestion(randomQ);
        }
    }, [usedQuestionIds]);

    const getCurrentContent = () => {
        if (mode === 'trivia_futbol' || mode === 'cultura') {
            return currentQuestion?.question || 'Cargando pregunta...';
        }
        const validContent = content.length > 0
            ? content.find((item, idx) => idx >= (currentIndex % content.length) && typeof item === 'string' && item.trim().length > 0)
              || content.find((item) => typeof item === 'string' && item.trim().length > 0)
            : undefined;
        return validContent?.replace(/{player}/g, currentPlayerName) || 'Siguiente carta';
    };

    const getNextPreview = (showTrivia: boolean) => {
        if (mode !== 'megamix' || showTrivia) return null;
        const nextBase = content[(currentIndex + 1) % Math.max(content.length, 1)];
        if (!nextBase) return null;
        return nextBase.replace(/{player}/g, currentPlayerName);
    };

    return {
        content,
        currentQuestion,
        setCurrentQuestion, // Expose setter for useGameEffects
        usedQuestionIds,
        setUsedQuestionIds,
        loadNextQuestion,
        loadSpecificQuestion,
        getCurrentContent,
        getNextPreview,
        questionNumber
    };
};
