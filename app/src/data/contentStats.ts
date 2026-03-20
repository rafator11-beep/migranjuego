
import {
  clasico,
  yoNunca,
  picante,
  nostalgia,
  quienEsMasProbable,
  pacovers,
  enLaCamaY,
  categoriasLetras,
  categoriasReto,
  getMegamixWithTrivia,
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

import { cultureQuestions, allExtraCultureQuestions } from '@/data/cultureQuestions';
import { footballQuestions } from '@/data/footballQuestionsNew';

export function getTotalContentCount(mode: string): number {
  switch (mode) {
    case 'clasico':
      return (
        clasico.length +
        clasicoExtra.length +
        enLaCamaY.length +
        enLaCamaYExtra.length +
        categoriasLetras.length +
        categoriasLetrasExtra.length +
        categoriasReto.length +
        categoriasRetoExtra.length
      );

    case 'yo_nunca':
      return yoNunca.length + yoNuncaExtra.length;

    case 'picante':
      return picante.length + picanteExtra.length;

    case 'espana':
      return nostalgia.length; // pacoversExtra is separate mode in app

    case 'votacion':
      return quienEsMasProbable.length + masProbableExtra.length;

    case 'pacovers':
      return pacovers.length + pacoversExtra.length;

    case 'megamix': {
      // Deck is mixed: party prompts + trivia. We estimate using your current generator.
      const partyAndTrivia = getMegamixWithTrivia(500, [...cultureQuestions, ...allExtraCultureQuestions], footballQuestions);
      return partyAndTrivia.length;
    }

    case 'trivia_futbol':
      return footballQuestions.length;

    case 'cultura':
      return cultureQuestions.length + allExtraCultureQuestions.length;

    default:
      return 0;
  }
}
