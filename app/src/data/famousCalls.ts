// Llamadas a famosos para el comodín de Cultura General
// Dan pistas crípticas/complicadas como en ¿Quién quiere ser millonario?

import { extraFamousCalls } from './famousCallsExtra';

export interface FamousCall {
  name: string;
  role: string;
  avatar: string;
  getHint: (correctAnswer: string, options: string[]) => string;
}

const baseFamousCalls: FamousCall[] = [
  {
    name: "Albert Einstein",
    role: "Físico teórico",
    avatar: "🧑‍🔬",
    getHint: (correct, options) => {
      const hints = [
        `"Hmm... E=mc² me dice que la energía de esta pregunta es... confusa. ¿Quizás algo relacionado con '${correct.charAt(0)}'? O tal vez no. El tiempo es relativo."`,
        `"Según mis cálculos cuánticos... no puedo estar en dos respuestas a la vez. Aunque en otra dimensión, ${options[Math.floor(Math.random() * options.length)]} podría ser correcta..."`,
        `"Mi bigote vibra cuando hay verdad cerca. Ahora vibra... un poco. ¿O es el café? La respuesta podría tener ${correct.length} letras. O no."`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  },
  {
    name: "Cleopatra",
    role: "Reina de Egipto",
    avatar: "👸",
    getHint: (correct, options) => {
      const hints = [
        `"Por Isis y Osiris... Mis astrólogos dicen algo sobre '${correct.charAt(0)}', pero también predijeron que Marco Antonio ganaría. Ya ves cómo acabó eso."`,
        `"En mis papiros hay una profecía confusa... Habla de ${options[Math.floor(Math.random() * options.length)]}... o quizás de serpientes. No estoy segura."`,
        `"El Nilo fluye hacia el Mediterráneo, como la respuesta fluye hacia... ¿algún sitio? Mis esclavos sugieren cosas diferentes."`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  },
  {
    name: "Sherlock Holmes",
    role: "Detective consultor",
    avatar: "🔍",
    getHint: (correct, options) => {
      const hints = [
        `"Elemental... o quizás no. Watson juraría que es ${options[Math.floor(Math.random() * options.length)]}, pero él también pensaba que yo había muerto en Reichenbach."`,
        `"He deducido 47 posibilidades. 3 implican alienígenas. La respuesta tiene... algunas letras. Eso seguro."`,
        `"Después de inyectarme mi solución al 7%, veo que la respuesta empieza por... algo. El resto está borroso."`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  },
  {
    name: "Yoda",
    role: "Maestro Jedi",
    avatar: "🧙",
    getHint: (correct, options) => {
      const hints = [
        `"Hmm... Difícil de ver, el futuro siempre es. Correcta, una respuesta es. Cuál, saber no puedo. Fuerte la confusión es."`,
        `"La Fuerza, sentirla intento. ${options[Math.floor(Math.random() * options.length)]}, dice... Pero equivocada la Fuerza ha estado antes, sí."`,
        `"900 años tengo, y recordar todo no puedo. Con '${correct.charAt(0)}' algo empieza... o termina. Seguro no estoy."`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  },
  {
    name: "Marie Curie",
    role: "Científica Nobel",
    avatar: "👩‍🔬",
    getHint: (correct, options) => {
      const hints = [
        `"Mis mediciones de radiactividad sugieren... interferencias. Podría ser cualquier respuesta, todas emiten algo."`,
        `"Gané dos Nobel y aún así esta pregunta me confunde. ¿${options[Math.floor(Math.random() * options.length)]}? Mi contador Geiger no ayuda."`,
        `"La respuesta brilla en la oscuridad de mi mente... pero el brillo podría ser el uranio que almorcé."`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  },
  {
    name: "Steve Jobs",
    role: "Fundador de Apple",
    avatar: "🍎",
    getHint: (correct, options) => {
      const hints = [
        `"La respuesta es revolucionaria. Como el iPhone. O como ${options[Math.floor(Math.random() * options.length)]}. O ninguna. Think different."`,
        `"Esto habría sido más fácil con Siri. Pero Siri no existe aún. ¿O sí? El tiempo es un bucle."`,
        `"Stay hungry, stay foolish. Pero no tan foolish como para estar seguro de nada."`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  },
  {
    name: "Cervantes",
    role: "Escritor español",
    avatar: "✍️",
    getHint: (correct, options) => {
      const hints = [
        `"En un lugar de la memoria, de cuyo nombre no me acuerdo... La respuesta empezaba por algo..."`,
        `"Sancho diría ${options[Math.floor(Math.random() * options.length)]}, pero él confundía molinos con gigantes. Yo también, a veces."`,
        `"Con mi brazo manco escribí el Quijote. Con mi memoria manca, olvido la respuesta."`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  },
  {
    name: "Bob Esponja",
    role: "Cocinero de Fondo de Bikini",
    avatar: "🧽",
    getHint: (correct, options) => {
      const hints = [
        `"¡Estoy listo! ¡Estoy listo! ...para no saber la respuesta."`,
        `"Patricio me dice que ${options[Math.floor(Math.random() * options.length)]}. Pero Patricio vive bajo una piedra."`,
        `"La fórmula secreta no me preparó para esto. ¡Gary, ayúdame! ...Miau."`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  },
  {
    name: "Don Quijote",
    role: "Caballero andante",
    avatar: "🛡️",
    getHint: (correct, options) => {
      const hints = [
        `"¡Gigantes! ¡Veo gigantes en las respuestas! ...Sancho dice que son molinos. Y opciones."`,
        `"Mi Dulcinea del Toboso sabe la respuesta. Pero no existe. Según Sancho."`,
        `"En mi locura veo claro que es ${options[Math.floor(Math.random() * options.length)]}. Pero mi locura ve muchas cosas."`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  },
  {
    name: "Frodo Bolsón",
    role: "Portador del Anillo",
    avatar: "🧝",
    getHint: (correct, options) => {
      const hints = [
        `"El Anillo Único me susurra... ${options[Math.floor(Math.random() * options.length)]}... o quizás me tienta."`,
        `"Un mago nunca llega tarde, ni responde pronto. Yo no soy mago, así que no sé nada."`,
        `"Gandalf diría 'Fly, you fools!' pero eso no responde la pregunta."`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  },
  {
    name: "Bruce Lee",
    role: "Maestro de artes marciales",
    avatar: "🥋",
    getHint: (correct, options) => {
      const hints = [
        `"Sé como el agua, amigo. La respuesta también fluye... hacia algún lado."`,
        `"No temo al hombre que sabe 10.000 respuestas, sino al que no sabe ninguna. Como yo ahora."`,
        `"El bambú que se dobla es más fuerte que el roble. ¿Eso ayuda? No, verdad."`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  },
  {
    name: "Rosalia",
    role: "Motomami",
    avatar: "🦋",
    getHint: (correct, options) => {
      const hints = [
        `"Chica, qué dices... Saoko, papi, saoko. ¿Es ${options[Math.floor(Math.random() * options.length)]}? Trá trá."`,
        `"He mirao' en el retrovisor y la respuesta empieza por '${correct.charAt(0)}'. Pero voy en una Kawasaki, no me fío."`,
        `"Un poquito de altura, por favor. Esta pregunta es muy 'Despechá'. ¡Suerte, motopapi!"`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  },
  {
    name: "Bad Bunny",
    role: "El Conejo Malo",
    avatar: "🐰",
    getHint: (correct, options) => {
      const hints = [
        `"Ey, ey... Titi me preguntó si sabía la respuesta y le dije que quizás era ${options[Math.floor(Math.random() * options.length)]}. Pero no sé, ando en el Bugatti."`,
        `"Baby, la vida es un ciclo... y la respuesta empieza con '${correct.charAt(0)}'. Hoy se bebe, hoy se sale, pero no se sabe la respuesta."`,
        `"Hago lo que me da la gana, y ahora mismo me da la gana de decirte que... ni idea, brother."`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  },
  {
    name: "Belén Esteban",
    role: "Patrona de España",
    avatar: "🥘",
    getHint: (correct, options) => {
      const hints = [
        `"¡¿PERO QUÉ INVENTO ES ESTO?! Por mi hija MA-TO, pero por esta pregunta no. ¿Será ${options[Math.floor(Math.random() * options.length)]}?"`,
        `"¡PÁ-GA-ME! Ah, que no eres Toño. Mira, la respuesta empieza por '${correct.charAt(0)}'... ¡Y EL QUE NO ME CREA QUE NO ME ESCUCHE!"`,
        `"Yo no soy una de estas que sabe de todo, pero me suena que la respuesta tiene ${correct.length} letras. ¿Me entiendes?"`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  },
  {
    name: "Batman",
    role: "El Caballero Oscuro",
    avatar: "🦇",
    getHint: (correct, options) => {
      const hints = [
        `"No es quien soy bajo la máscara, sino lo que hago lo que me define. Y ahora mismo estoy buscando en la Bat-computadora si es ${options[Math.floor(Math.random() * options.length)]}."`,
        `"Gotham me necesita, no tengo tiempo para tests. La respuesta empieza por '${correct.charAt(0)}'. Alfred, prepara el coche."`,
        `"¿Has bailado con el demonio a la luz de la luna? Él sabía la respuesta, yo solo sé que hay que hacer justicia."`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  },
  {
    name: "Marie Kondo",
    role: "Gurú del orden",
    avatar: "✨",
    getHint: (correct, options) => {
      const hints = [
        `"Toca esta pregunta. ¿Te produce felicidad? Si no es ${options[Math.floor(Math.random() * options.length)]}, deberías darles las gracias y dejarla ir."`,
        `"He organizado tus opciones por colores. La que empieza por '${correct.charAt(0)}' es la que más chispas de alegría me da."`,
        `"Demos gracias a la pregunta por su servicio antes de marcar la opción incorrecta."`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  },
  {
    name: "Julio César",
    role: "Emperador Romano",
    avatar: "🏛️",
    getHint: (correct, options) => {
      const hints = [
        `"Veni, vidi, vici... pero esta pregunta no la vi venir. Creo que es ${options[Math.floor(Math.random() * options.length)]}."`,
        `"La suerte está echada (Alea iacta est), y mi suerte dice que la respuesta empieza por '${correct.charAt(0)}'."`,
        `"¿Tú también, Bruto? ¿Tampoco sabes la respuesta? ¡Qué traición!"`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  },
  {
    name: "Salvador Dalí",
    role: "Genio surrealista",
    avatar: "🎨",
    getHint: (correct, options) => {
      const hints = [
        `"Mis relojes se están derritiendo, igual que mi paciencia con esta pregunta. Veo una '${correct.charAt(0)}' flotando en un huevo."`,
        `"No tomes drogas, yo soy la droga. Y mi alucinación me dice que marques ${options[Math.floor(Math.random() * options.length)]}."`,
        `"Lo importante es que hablen de uno, aunque sea para decir que no tienes ni idea de la respuesta."`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  },
  {
    name: "Super Mario",
    role: "Fontanero saltarín",
    avatar: "🍄",
    getHint: (correct, options) => {
      const hints = [
        `"¡Mamma mia! La respuesta que buscas está en otro castillo. Pero prueba con ${options[Math.floor(Math.random() * options.length)]}."`,
        `"¡It's-a me, Mario! He saltado sobre muchos bloques y de uno ha salido la letra '${correct.charAt(0)}'."`,
        `"Wahoo! He comido un champiñón y ahora veo claro que la respuesta tiene ${correct.length} letras."`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  },
  {
    name: "Kratos",
    role: "Dios de la Guerra",
    avatar: "🪓",
    getHint: (correct, options) => {
      const hints = [
        `"¡MUCHACHO! Escucha... la respuesta no importa, solo la victoria. Pero sospecho de ${options[Math.floor(Math.random() * options.length)]}."`,
        `"He destruido el Olimpo por menos que esta pregunta. Empieza por '${correct.charAt(0)}', o sufrirá mi ira."`,
        `"No cierres tu corazón a la respuesta, ciérralo al miedo. La verdad está ante ti."`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  },
  {
    name: "Pikachu",
    role: "Pokémon eléctrico",
    avatar: "⚡",
    getHint: (correct, options) => {
      const hints = [
        `"¡Pika-pika! Pi-kaaa-chu (Traducción: Mi cola brilla cerca de ${options[Math.floor(Math.random() * options.length)]})."`,
        `"Pikachuuuuuuu... (Te ha dado un calambre y ahora crees que empieza por '${correct.charAt(0)}')."`,
        `"Pika? Pika pika... (Pone cara de duda y señala la opción que tiene ${correct.length} letras)."`,
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
  }
];

// Merge base + extra famous calls
export const famousCalls: FamousCall[] = [
  ...baseFamousCalls,
  ...extraFamousCalls,
];

export const getRandomFamousCall = (): FamousCall => {
  return famousCalls[Math.floor(Math.random() * famousCalls.length)];
};

export const getFamousHint = (correctAnswer: string, options: string[]): { famous: FamousCall, hint: string } => {
  const famous = getRandomFamousCall();
  return {
    famous,
    hint: famous.getHint(correctAnswer, options)
  };
};