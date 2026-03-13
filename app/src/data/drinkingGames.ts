// Drinking mini-games for Megamix and Clasico modes

export interface DrinkingGame {
  name: string;
  emoji: string;
  description: string;
  type: 'cascade' | 'coin' | 'challenge' | 'group' | 'impostor' | 'mimica' | 'bocacerrada';
}

// Cascada / Waterfall games
export const cascadeGames: DrinkingGame[] = [
  {
    name: "¡CASCADA!",
    emoji: "🌊",
    description: "{player} empieza a beber. El de su DERECHA empieza cuando él empiece, y así sucesivamente. ¡Nadie puede parar hasta que el de su IZQUIERDA pare!",
    type: 'cascade',
  },
  {
    name: "CASCADA INVERSA",
    emoji: "⬆️",
    description: "{player} empieza la cascada hacia la IZQUIERDA. El de tu izquierda no puede parar hasta que tú pares.",
    type: 'cascade',
  },
  {
    name: "CASCADA DEL PERDEDOR",
    emoji: "💀",
    description: "El jugador con MENOS puntos inicia la cascada. Los demás siguen en orden de puntuación (de peor a mejor).",
    type: 'cascade',
  },
  {
    name: "CASCADA ALEATORIA",
    emoji: "🎲",
    description: "¡Todos empiezan a beber a la vez! El último en dejar de beber pierde y bebe otro trago extra.",
    type: 'cascade',
  },
  {
    name: "MINI CASCADA",
    emoji: "💧",
    description: "{player} bebe 3 segundos, luego el siguiente 2, luego 1. ¡Rapidito!",
    type: 'cascade',
  },
];

// Coin flip games
export const coinGames: DrinkingGame[] = [
  {
    name: "MONEDA AL AIRE",
    emoji: "🪙",
    description: "{player} lanza una moneda (o elige alguien cara/cruz). Cara = el de tu derecha bebe. Cruz = el de tu izquierda bebe.",
    type: 'coin',
  },
  {
    name: "DOBLE O NADA",
    emoji: "🎰",
    description: "{player} lanza la moneda. Si acierta, el grupo bebe. Si falla, bebe el doble solo.",
    type: 'coin',
  },
  {
    name: "RULETA DE MONEDA",
    emoji: "🎯",
    description: "Cada jugador elige cara o cruz. {player} lanza. Los que pierdan beben.",
    type: 'coin',
  },
  {
    name: "MONEDA MALDITA",
    emoji: "👻",
    description: "{player} lanza la moneda SIN mirarla. El grupo decide si es cara o cruz. Si {player} lo adivina, todos beben. Si falla, bebe el triple.",
    type: 'coin',
  },
  {
    name: "CADENA DE MONEDAS",
    emoji: "⛓️",
    description: "Empezando por {player}, cada uno lanza una moneda. El primero que falle (según lo que diga el anterior) bebe todo.",
    type: 'coin',
  },
];

// Group challenges
export const groupChallenges: DrinkingGame[] = [
  {
    name: "CUENTA REGRESIVA",
    emoji: "🔢",
    description: "Todos cuentan de 10 a 1 en voz alta A LA VEZ. El que se equivoque o diga un número diferente, bebe.",
    type: 'group',
  },
  {
    name: "PIEDRA, PAPEL, TIJERA MASIVO",
    emoji: "✂️",
    description: "Todos juegan a piedra, papel, tijera a la vez. Los que pierdan contra la mayoría, beben.",
    type: 'group',
  },
  {
    name: "EL ÚLTIMO EN PIE",
    emoji: "🧍",
    description: "Todos se levantan. El último en sentarse cuando {player} diga '¡YA!' bebe.",
    type: 'group',
  },
  {
    name: "TELÉFONO ROTO EXPRESS",
    emoji: "📞",
    description: "{player} susurra una palabra al de su izquierda. El último dice en voz alta lo que entendió. Si es diferente, todos beben.",
    type: 'group',
  },
  {
    name: "ESTATUAS",
    emoji: "🗿",
    description: "Todos se quedan inmóviles. El primero que se mueva o ría bebe 3 tragos.",
    type: 'group',
  },
  {
    name: "APLAUSO SINCRONIZADO",
    emoji: "👏",
    description: "Cuando {player} diga ya, todos aplauden UNA vez. El que aplauda más de una vez o fuera de tiempo, bebe.",
    type: 'group',
  },
  {
    name: "CORO DESAFINADO",
    emoji: "🎤",
    description: "Todos cantan 'Cumpleaños feliz' al jugador con más puntos. El que desafine más (votación rápida) bebe.",
    type: 'group',
  },
  {
    name: "MEMORIA FLASH",
    emoji: "🧠",
    description: "{player} dice un objeto. El siguiente lo repite y añade otro. Así hasta que alguien falle. ¡El que falle bebe!",
    type: 'group',
  },
  {
    name: "EL IMITADOR",
    emoji: "🎭",
    description: "{player} hace un gesto. Todos deben imitarlo EXACTAMENTE. El peor imitador (votación) bebe.",
    type: 'group',
  },
  {
    name: "RITMO INFERNAL",
    emoji: "🥁",
    description: "{player} marca un ritmo con palmadas. Todos siguen. El primero que pierda el ritmo bebe.",
    type: 'group',
  },
];

// Individual challenges
export const individualChallenges: DrinkingGame[] = [
  {
    name: "VERDAD INCÓMODA",
    emoji: "😳",
    description: "{player} debe confesar algo vergonzoso que nunca haya contado. Si el grupo no queda satisfecho, bebe el doble.",
    type: 'challenge',
  },
  {
    name: "IMITACIÓN OBLIGADA",
    emoji: "🐒",
    description: "{player} debe imitar al jugador de su derecha durante los próximos 2 turnos. Si falla, bebe.",
    type: 'challenge',
  },
  {
    name: "LENGUA TRABADA",
    emoji: "👅",
    description: "{player} debe decir '3 tristes tigres comen trigo en un trigal' sin equivocarse. Si falla, bebe.",
    type: 'challenge',
  },
  {
    name: "BAILE ÉPICO",
    emoji: "💃",
    description: "{player} debe bailar 10 segundos con el móvil en la cabeza. Si se cae, bebe 3 tragos.",
    type: 'challenge',
  },
  {
    name: "CANTA O BEBE",
    emoji: "🎵",
    description: "{player} debe cantar el estribillo de una canción elegida por el grupo. Sin letra = bebe.",
    type: 'challenge',
  },
  {
    name: "PIROPO CREATIVO",
    emoji: "💕",
    description: "{player} debe decir un piropo original al jugador de su izquierda. Si es malo, ambos beben.",
    type: 'challenge',
  },
  {
    name: "ACENTO FALSO",
    emoji: "🌍",
    description: "{player} debe hablar con acento francés durante 1 minuto. Cada error = un trago.",
    type: 'challenge',
  },
  {
    name: "EQUILIBRISTA",
    emoji: "🎪",
    description: "{player} debe mantener una cuchara en la nariz 10 segundos. Si cae, bebe.",
    type: 'challenge',
  },
  {
    name: "MONEDA GIRATORIA",
    emoji: "🌀",
    description: "{player} hace girar la moneda en la mesa. Debe beber mientras la moneda siga girando. Si se cae, para.",
    type: 'coin',
  },
  {
    name: "EL VIDENTE",
    emoji: "🔮",
    description: "{player} debe predecir 3 lanzamientos seguidos. Si acierta los 3, manda 5 tragos. Si falla uno, bebe lo que lleve acumulado.",
    type: 'coin',
  },
  {
    name: "PAR O IMPAR",
    emoji: "📅",
    description: "Mira el año de la moneda. Si es PAR, beben los chicos. Si es IMPAR, beben las chicas.",
    type: 'coin',
  },
  {
    name: "MONEDA TRAICIONERA",
    emoji: "😈",
    description: "{player} lanza. Cara = bebe el jugador con menos puntos. Cruz = bebe el jugador con más puntos.",
    type: 'coin',
  },
  {
    name: "DUELO DE MONEDAS",
    emoji: "⚔️",
    description: "{player} elige un rival. Ambos lanzan una moneda. Si salen iguales, no beben. Si salen diferentes, ambos beben.",
    type: 'coin',
  },
  {
    name: "LA MEDUSA",
    emoji: "🐍",
    description: "Todos miran abajo. A la de 3, miran a otro jugador. Si cruzas la mirada con alguien, ambos gritáis '¡MEDUSA!' y bebéis.",
    type: 'group',
  },
  {
    name: "EL SUELO ES LAVA",
    emoji: "🌋",
    description: "Cuando {player} termine de leer esto, cuenta 5 segundos. Quien toque el suelo después de la cuenta, bebe.",
    type: 'group',
  },
  {
    name: "SIN DIENTES",
    emoji: "😬",
    description: "Durante esta ronda, todos deben hablar cubriendo sus dientes con los labios. El primero que enseñe los dientes, bebe.",
    type: 'group',
  },
  {
    name: "CATEGORÍAS",
    emoji: "📋",
    description: "{player} elige un tema (ej: marcas de coches). En sentido horario, cada uno dice una. El que repita o dude, bebe.",
    type: 'group',
  },
  {
    name: "EL PARÁSITO",
    emoji: "🦠",
    description: "Todos eligen a una pareja. Durante 3 rondas, si uno bebe, su pareja también debe beber.",
    type: 'group',
  },
  {
    name: "MAYORÍA ABSOLUTA",
    emoji: "🙋‍♂️",
    description: "{player} hace una pregunta de 'sí o no'. A la de 3, todos levantan la mano (sí) o no (no). La minoría bebe.",
    type: 'group',
  },
  {
    name: "FOTO GRUPAL",
    emoji: "📸",
    description: "Tomaos un selfie grupal poniendo la cara más fea posible. El que salga 'demasiado guapo' o normal, bebe.",
    type: 'group',
  },
  {
    name: "EL MUDO",
    emoji: "🤐",
    description: "{player} no puede hablar hasta su próximo turno. Si emite cualquier sonido, bebe doble.",
    type: 'challenge',
  },
  {
    name: "DJ HUMANO",
    emoji: "🎧",
    description: "{player} debe tararear una canción. El primero que la adivine manda 2 tragos. Si nadie la adivina en 30s, {player} bebe.",
    type: 'challenge',
  },
  {
    name: "MANO CAMBIADA",
    emoji: "✋",
    description: "{player} debe beber con su mano no dominante el resto del juego. Si usa la normal, ¡fondo!",
    type: 'challenge',
  },
  {
    name: "COMERCIAL TV",
    emoji: "📺",
    description: "{player} tiene 30 segundos para 'vendernos' el objeto que tenga a su izquierda como si fuera un anuncio de TV. Si es aburrido, bebe.",
    type: 'challenge',
  },
  {
    name: "EL CHISTE",
    emoji: "🤡",
    description: "{player} cuenta un chiste. Si nadie se ríe, bebe. Si al menos una persona se ríe, todos los demás beben.",
    type: 'challenge',
  },
  {
    name: "FONDO DE PANTALLA",
    emoji: "📱",
    description: "{player} debe mostrar su última foto de la galería o beber 3 tragos.",
    type: 'challenge',
  },
  {
    name: "ESTATUA GRIEGA",
    emoji: "🏛️",
    description: "{player} debe quedarse congelado en una pose épica mientras los demás intentan hacerle reír. Si se mueve o ríe, bebe.",
    type: 'challenge',
  },
  {
    name: "EL MAYORDOMO",
    emoji: "🤵",
    description: "{player} debe servir la bebida a cualquiera que tenga el vaso vacío hasta que le vuelva a tocar el turno.",
    type: 'challenge',
  },
  {
    name: "YO NUNCA RÁPIDO",
    emoji: "☝️",
    description: "{player} dice un 'Yo nunca' rápido. Quien lo haya hecho, bebe. Si nadie bebe, bebe {player}.",
    type: 'group',
  },
  {
    name: "EL FRANCOTIRADOR",
    emoji: "🔫",
    description: "{player} hace forma de pistola con las manos y apunta a alguien. Esa persona debe agacharse. Si no lo hace en 3 segundos, bebe.",
    type: 'group',
  },
  {
    name: "CARA O CRUZ EXTREMO",
    emoji: "☠️",
    description: "{player} elige una víctima. Lanzan moneda. Si sale CARA, la víctima bebe 5 tragos. Si sale CRUZ, {player} bebe 5.",
    type: 'coin',
  },
  {
    name: "MODO AVIÓN",
    emoji: "✈️",
    description: "{player} debe poner su móvil en modo avión hasta su próximo turno. Si se niega, se termina su copa.",
    type: 'challenge',
  },
  {
    name: "LA PALABRA PROHIBIDA",
    emoji: "🚫",
    description: "El grupo elige una palabra común (ej: 'beber', 'yo', 'no'). Quien la diga antes del próximo turno de {player}, bebe.",
    type: 'group',
  },
  {
    name: "MONEDA SALVADORA",
    emoji: "🛡️",
    description: "{player} lanza una moneda. CARA: Consigue una tarjeta 'Inmune' para usar luego. CRUZ: Bebe 2 tragos ahora.",
    type: 'coin',
  },
  {
    name: "EL TIC NERVIOSO",
    emoji: "🤪",
    description: "{player} elige un gesto (ej: rascarse la nariz). Cada vez que lo haga, todos deben hacerlo. El último bebe.",
    type: 'challenge',
  },
  {
    name: "CASCADA",
    emoji: "🌊",
    description: "Todos empiezan a beber a la vez. Nadie puede parar hasta que pare el de su derecha. {player} manda cuándo parar primero.",
    type: 'group',
  },
  {
    name: "SÍ O NO",
    emoji: "🤐",
    description: "El grupo hace preguntas a {player} durante 1 minuto. No puede decir 'SÍ' ni 'NO'. Por cada fallo, un trago.",
    type: 'challenge',
  },
  {
    name: "GUERRA DE PULGARES",
    emoji: "👍",
    description: "{player} reta a un duelo de pulgares a la persona de su izquierda. El perdedor bebe 3.",
    type: 'challenge',
  },
  {
    name: "LANZAMIENTO CIEGO",
    emoji: "🙈",
    description: "Todos cierran los ojos. {player} lanza la moneda. Si suena al caer (mesa), beben los chicos. Si cae al suelo o la coge al vuelo, beben las chicas.",
    type: 'coin',
  },
  {
    name: "EL CHIVATO",
    emoji: "📢",
    description: "{player} envía un audio de WhatsApp a la 3ª persona de su lista de chats cantando una canción. Si no, bebe 4.",
    type: 'challenge',
  },
  {
    name: "MARCAS",
    emoji: "🏷️",
    description: "{player} dice una categoría de marcas (ej: zapatillas). Rueda rápida. El que repita o se quede en blanco, bebe.",
    type: 'group',
  },
  {
    name: "OJOS DE SERPIENTE",
    emoji: "🐍",
    description: "Si alguien mira a los ojos a {player} antes de que vuelva a ser su turno, esa persona bebe.",
    type: 'challenge',
  },
  {
    name: "LA MONEDA DECIDE",
    emoji: "⚖️",
    description: "{player} hace una pregunta al grupo. Lanza moneda: CARA = Verdad, CRUZ = Mentira. El grupo debe adivinar si la respuesta de {player} sigue la moneda.",
    type: 'coin',
  },
];

// Impostor games (player must say a word for others to guess)
export const impostorGames: DrinkingGame[] = [
  {
    name: "EL IMPOSTOR",
    emoji: "🕵️",
    description: "{player} es el IMPOSTOR. Se le asigna una PALABRA SECRETA. Debe describirla SIN decirla. Si el grupo no adivina en 1 minuto, el impostor bebe. Si adivinan, todos beben.",
    type: 'impostor',
  },
];

// Palabras para el impostor
export const impostorWords: string[] = [
  "Elefante", "Pizza", "Astronauta", "Discoteca", "Reggaetón",
  "Suegra", "Resaca", "Tinder", "Influencer", "Borracho",
  "Dentista", "Funeral", "Bikini", "Ronquidos", "Peluca",
  "Karaoke", "Tatuaje", "Unicornio", "Zombi", "Stripper",
  "Albornoz", "Calcetines", "Tortilla", "Messi", "Cristiano Ronaldo",
  "McDonald's", "Netflix", "WhatsApp", "Selfie", "Gimnasio",
  "Lunes", "Cuñado", "Gato", "Cerveza", "Playa",
  "Croquetas", "Siesta", "Abuela", "Hipopótamo", "Vampiro",
];

// Get a random drinking game
export const getRandomDrinkingGame = (): DrinkingGame => {
  const allGames = [...cascadeGames, ...coinGames, ...groupChallenges, ...individualChallenges];
  return allGames[Math.floor(Math.random() * allGames.length)];
};

// Get a specific type of drinking game
export const getRandomCascade = (): DrinkingGame => cascadeGames[Math.floor(Math.random() * cascadeGames.length)];
export const getRandomCoinGame = (): DrinkingGame => coinGames[Math.floor(Math.random() * coinGames.length)];
export const getRandomGroupChallenge = (): DrinkingGame => groupChallenges[Math.floor(Math.random() * groupChallenges.length)];
export const getRandomIndividualChallenge = (): DrinkingGame => individualChallenges[Math.floor(Math.random() * individualChallenges.length)];
export const getRandomImpostorGame = (): DrinkingGame => impostorGames[0];
export const getRandomImpostorWord = (): string => impostorWords[Math.floor(Math.random() * impostorWords.length)];

// Format game text with player name
export const formatDrinkingGame = (game: DrinkingGame, playerName: string): string => {
  return `${game.emoji} ${game.name}\n\n${game.description.replace(/{player}/g, playerName)}`;
};
