// Contenido para el nuevo archivo famousCallsExtra.ts
import { FamousCall } from './famousCalls';

export const extraFamousCalls: FamousCall[] = [
  {
    name: "Leonardo da Vinci",
    role: "Polímata",
    avatar: "🎨",
    getHint: (correct, options) => `La proporción áurea me dice que la respuesta tiene ${correct.length} letras.`
  }
];