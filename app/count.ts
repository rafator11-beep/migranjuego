import {
    clasico, yoNunca, picante, masProbable, pacovers, nostalgia,
    enLaCamaY, categoriasLetras, categoriasReto, normasRonda
} from './src/data/gameContent';
import {
    clasicoExtra, yoNuncaExtra, picanteExtra, masProbableExtra,
    pacoversExtra, enLaCamaYExtra, categoriasLetrasExtra, categoriasRetoExtra
} from './src/data/gameContentExtra';
import { footballQuestions } from './src/data/footballQuestionsNew';
import { cultureQuestions } from './src/data/cultureQuestions';
import { customPartyRetos } from './src/data/customPartyRetos';

const stats = {
    Clásico: clasico.length + (clasicoExtra?.length || 0),
    YoNunca: yoNunca.length + (yoNuncaExtra?.length || 0),
    Picante: picante.length + (picanteExtra?.length || 0),
    MasProbable: masProbable.length + (masProbableExtra?.length || 0),
    Pacovers: pacovers.length + (pacoversExtra?.length || 0),
    NostalgiaEspana: nostalgia.length,
    EnLaCama: enLaCamaY.length + (enLaCamaYExtra?.length || 0),
    CategoriasLetras: categoriasLetras.length + (categoriasLetrasExtra?.length || 0),
    CategoriasReto: categoriasReto.length + (categoriasRetoExtra?.length || 0),
    RetosPersonalizados: customPartyRetos?.length || 0,
    Normas: normasRonda.length,
    TriviaFutbol: footballQuestions?.length || 0,
    TriviaCultura: cultureQuestions?.length || 0
};

console.log("=== RECUENTO DE CARTAS ===\n");
Object.entries(stats).forEach(([key, val]) => {
    console.log(`${key}: ${val} cartas`);
});

const totalMegamixPool = stats.Clásico + stats.YoNunca + stats.Picante + stats.MasProbable +
    stats.Pacovers + stats.EnLaCama + stats.CategoriasLetras + stats.CategoriasReto + stats.RetosPersonalizados;

console.log(`\nCartas Base de Megamix (sin contar Trivia, Virus, Mímica, Normas): ${totalMegamixPool}`);
const grandTotal = Object.values(stats).reduce((acc, curr) => acc + curr, 0);
console.log(`\nTotal Absoluto (En toda la app): ${grandTotal} cartas`);
