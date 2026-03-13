// Auto-generated: custom retos injected for PartyGame
export type PartyReto = {
  id: string;
  text: string;
  tags?: string[];
  weight?: number; // optional weight for random selection
};

// You can expand this list anytime. The game will merge these with built-in retos.
export const customPartyRetos: PartyReto[] = [
  { id: "custom-001", text: "Si has enviado un audio de WhatsApp porque te daba pereza escribir, bebe.", tags: ["vida"], weight: 1 },
  { id: "custom-002", text: "Si has dicho 'estoy muy mayor para esto' hoy, bebe.", tags: ["vida"], weight: 1 },
  { id: "custom-003", text: "Si has cancelado un plan y te has alegrado, bebe.", tags: ["vida"], weight: 1 },
  { id: "custom-004", text: "Si has abierto la nevera sin saber qué buscabas, bebe.", tags: ["vida"], weight: 1 },
  { id: "custom-005", text: "Si has dicho 'una y nos vamos' y al final fueron cinco, bebe doble.", tags: ["vida"], weight: 1 },
];
