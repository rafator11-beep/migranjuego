import { futbolQuestions1 } from './futbol-1';
import { futbolQuestions2 } from './futbol-2';
import { futbolQuestions3 } from './futbol-3';
import { huescaSegundaQuestions } from './huesca-segunda';

// Combine all questions including Huesca and Segunda División
export const allFutbolQuestions = [
  ...futbolQuestions1,
  ...futbolQuestions2,
  ...futbolQuestions3,
  ...huescaSegundaQuestions,
];

// Sample questions for other modes (to be expanded)
export const espanaQuestions = [
  { category: "Televisión", question: "¿Quién presentaba 'Un, dos, tres... responda otra vez'?", options: ["Chicho Ibáñez Serrador", "Mayra Gómez Kemp", "Kiko Ledgard", "Jordi Hurtado"], correct_answer: "Kiko Ledgard", difficulty: 2 },
  { category: "Televisión", question: "¿En qué año empezó 'Saber y Ganar'?", options: ["1995", "1997", "1999", "2001"], correct_answer: "1997", difficulty: 2 },
  { category: "Música", question: "¿Qué grupo español cantó 'La flaca'?", options: ["Héroes del Silencio", "Jarabe de Palo", "El Canto del Loco", "La Oreja de Van Gogh"], correct_answer: "Jarabe de Palo", difficulty: 1 },
  { category: "Series", question: "¿Cómo se llamaba el bar de 'Aquí no hay quien viva'?", options: ["Bar Pepe", "Baqueira", "El descansillo", "No había bar"], correct_answer: "No había bar", difficulty: 2 },
  { category: "Anuncios", question: "¿Qué marca usaba el eslogan 'El algodón no engaña'?", options: ["Skip", "Ariel", "Tenn", "Fairy"], correct_answer: "Tenn", difficulty: 1 },
];

export const culturaQuestions = [
  { category: "Historia", question: "¿En qué año cayó el Muro de Berlín?", options: ["1987", "1989", "1991", "1993"], correct_answer: "1989", difficulty: 1 },
  { category: "Geografía", question: "¿Cuál es la capital de Australia?", options: ["Sídney", "Melbourne", "Canberra", "Brisbane"], correct_answer: "Canberra", difficulty: 2 },
  { category: "Ciencia", question: "¿Cuál es el planeta más grande del Sistema Solar?", options: ["Saturno", "Júpiter", "Neptuno", "Urano"], correct_answer: "Júpiter", difficulty: 1 },
  { category: "Arte", question: "¿Quién pintó 'La noche estrellada'?", options: ["Monet", "Picasso", "Van Gogh", "Dalí"], correct_answer: "Van Gogh", difficulty: 1 },
  { category: "Literatura", question: "¿Quién escribió 'Don Quijote de la Mancha'?", options: ["Lope de Vega", "Cervantes", "Quevedo", "Calderón"], correct_answer: "Cervantes", difficulty: 1 },
];

export const mixQuestions = [
  ...allFutbolQuestions.slice(0, 50),
  ...espanaQuestions,
  ...culturaQuestions,
];

export const socialQuestions = [
  { category: "Debate", question: "¿Las redes sociales han mejorado la comunicación humana?", type: "social", difficulty: 1 },
  { category: "Debate", question: "¿Debería ser obligatorio votar en las elecciones?", type: "social", difficulty: 1 },
  { category: "Debate", question: "¿El teletrabajo es mejor que el trabajo presencial?",  type: "social", difficulty: 1 },
  { category: "Opinión", question: "¿Cuál creéis que será el próximo gran avance tecnológico?", type: "social", difficulty: 1 },
  { category: "Opinión", question: "¿La inteligencia artificial reemplazará trabajos humanos?", type: "social", difficulty: 1 },
];

export type QuestionInput = {
  category: string;
  question: string;
  options?: string[];
  correct_answer?: string;
  difficulty: number;
  type?: string;
};

export const getQuestionsForMode = (mode: string): QuestionInput[] => {
  switch (mode) {
    case 'futbol': return allFutbolQuestions;
    case 'espana': return espanaQuestions;
    case 'cultura': return culturaQuestions;
    case 'mix': return mixQuestions;
    case 'social': return socialQuestions;
    default: return [];
  }
};
export * from './customPartyRetos';
