// Rondas de Impostor para MEGAMIX
// Un jugador es el impostor: ve una pregunta/tema distinto y debe disimular
// Al final el grupo vota quién creen que es el impostor

export interface ImpostorRound {
  category: string;
  normalQuestion: string;  // Lo que ven los jugadores normales
  impostorQuestion: string;  // Lo que ve el impostor (relacionado pero diferente)
  hint: string;  // Pista para el grupo sobre qué buscar
}

export const impostorRounds: ImpostorRound[] = [
  // Películas
  { category: "Películas", normalQuestion: "Di una película de Marvel", impostorQuestion: "Di una película de DC", hint: "¿Alguien mencionó algo de otro universo?" },
  { category: "Películas", normalQuestion: "Di una película de Disney animada", impostorQuestion: "Di una película de Pixar", hint: "Ojo con los estudios..." },
  { category: "Películas", normalQuestion: "Di una película de terror", impostorQuestion: "Di una película de suspense", hint: "Terror vs suspense, ¿notas algo?" },
  { category: "Películas", normalQuestion: "Di una película de los 90", impostorQuestion: "Di una película de los 80", hint: "¿Las décadas cuadran?" },
  { category: "Películas", normalQuestion: "Di una película de Tom Hanks", impostorQuestion: "Di una película de Tom Cruise", hint: "¿Todos hablan del mismo Tom?" },
  
  // Música
  { category: "Música", normalQuestion: "Di una canción de reggaetón", impostorQuestion: "Di una canción de trap", hint: "¿Es reggaetón de verdad?" },
  { category: "Música", normalQuestion: "Di un grupo de rock español", impostorQuestion: "Di un grupo de pop español", hint: "Rock vs Pop, escucha bien..." },
  { category: "Música", normalQuestion: "Di una canción de los 80", impostorQuestion: "Di una canción de los 2000", hint: "¿La época encaja?" },
  { category: "Música", normalQuestion: "Di una canción de Bad Bunny", impostorQuestion: "Di una canción de J Balvin", hint: "¿Seguro que es de Bad Bunny?" },
  { category: "Música", normalQuestion: "Di una canción para bodas", impostorQuestion: "Di una canción de ruptura", hint: "¿Esa canción es para una boda?" },
  
  // Comida
  { category: "Comida", normalQuestion: "Di un plato italiano", impostorQuestion: "Di un plato francés", hint: "¿Italia o Francia?" },
  { category: "Comida", normalQuestion: "Di una marca de cerveza", impostorQuestion: "Di una marca de refresco", hint: "¿Eso es cerveza?" },
  { category: "Comida", normalQuestion: "Di un postre", impostorQuestion: "Di un desayuno", hint: "¿Postre o desayuno?" },
  { category: "Comida", normalQuestion: "Di una fruta tropical", impostorQuestion: "Di una fruta de temporada de invierno", hint: "¿Esa fruta es tropical?" },
  { category: "Comida", normalQuestion: "Di un restaurante de comida rápida", impostorQuestion: "Di una cadena de cafeterías", hint: "¿Sirven hamburguesas ahí?" },
  
  // Fútbol
  { category: "Fútbol", normalQuestion: "Di un jugador del Real Madrid", impostorQuestion: "Di un jugador del Barcelona", hint: "¿En qué equipo juega ese?" },
  { category: "Fútbol", normalQuestion: "Di un delantero", impostorQuestion: "Di un portero", hint: "¿Ese jugador mete goles?" },
  { category: "Fútbol", normalQuestion: "Di un equipo de La Liga", impostorQuestion: "Di un equipo de la Premier League", hint: "¿Ese equipo es español?" },
  { category: "Fútbol", normalQuestion: "Di un Mundial que ganó España", impostorQuestion: "Di un Mundial que ganó Brasil", hint: "¿España ganó ese año?" },
  { category: "Fútbol", normalQuestion: "Di un estadio español", impostorQuestion: "Di un estadio inglés", hint: "¿Ese estadio está en España?" },
  
  // Marcas y productos
  { category: "Marcas", normalQuestion: "Di una marca de coches alemana", impostorQuestion: "Di una marca de coches japonesa", hint: "¿Esa marca es alemana?" },
  { category: "Marcas", normalQuestion: "Di una marca de ropa deportiva", impostorQuestion: "Di una marca de ropa de lujo", hint: "¿Para hacer deporte?" },
  { category: "Marcas", normalQuestion: "Di un iPhone modelo", impostorQuestion: "Di un Samsung modelo", hint: "¿Eso es de Apple?" },
  { category: "Marcas", normalQuestion: "Di una red social", impostorQuestion: "Di una app de mensajería", hint: "¿Es red social o mensajería?" },
  { category: "Marcas", normalQuestion: "Di una consola de videojuegos de Sony", impostorQuestion: "Di una consola de Nintendo", hint: "¿Esa consola es de Sony?" },
  
  // Series
  { category: "Series", normalQuestion: "Di una serie de Netflix", impostorQuestion: "Di una serie de HBO", hint: "¿Esa serie está en Netflix?" },
  { category: "Series", normalQuestion: "Di un personaje de Los Simpson", impostorQuestion: "Di un personaje de Padre de Familia", hint: "¿Ese personaje sale en Los Simpson?" },
  { category: "Series", normalQuestion: "Di una serie española", impostorQuestion: "Di una serie mexicana", hint: "¿Esa serie es de España?" },
  { category: "Series", normalQuestion: "Di una sitcom americana", impostorQuestion: "Di una serie de drama", hint: "¿Eso es comedia?" },
  { category: "Series", normalQuestion: "Di un personaje de Breaking Bad", impostorQuestion: "Di un personaje de Better Call Saul", hint: "¿Ese personaje salía en Breaking Bad?" },
  
  // Geografía
  { category: "Geografía", normalQuestion: "Di una capital europea", impostorQuestion: "Di una capital asiática", hint: "¿Esa ciudad está en Europa?" },
  { category: "Geografía", normalQuestion: "Di una provincia española", impostorQuestion: "Di una región de Italia", hint: "¿Eso es de España?" },
  { category: "Geografía", normalQuestion: "Di una playa de España", impostorQuestion: "Di una playa del Caribe", hint: "¿Esa playa está en España?" },
  { category: "Geografía", normalQuestion: "Di un río de España", impostorQuestion: "Di un río de Sudamérica", hint: "¿Ese río pasa por España?" },
  { category: "Geografía", normalQuestion: "Di una montaña de los Pirineos", impostorQuestion: "Di una montaña de los Alpes", hint: "¿Eso está en los Pirineos?" },
  
  // Famosos
  { category: "Famosos", normalQuestion: "Di un actor español", impostorQuestion: "Di un actor latinoamericano", hint: "¿Ese actor es español?" },
  { category: "Famosos", normalQuestion: "Di un futbolista retirado", impostorQuestion: "Di un futbolista en activo", hint: "¿Ese jugador ya se retiró?" },
  { category: "Famosos", normalQuestion: "Di un influencer español", impostorQuestion: "Di un youtuber mexicano", hint: "¿Es español ese influencer?" },
  { category: "Famosos", normalQuestion: "Di un presentador de TV español", impostorQuestion: "Di un periodista deportivo", hint: "¿Presenta programas de TV?" },
  { category: "Famosos", normalQuestion: "Di un cantante que haya ido a Eurovisión por España", impostorQuestion: "Di un cantante que haya ido por otro país", hint: "¿Fue por España?" },
  
  // Más variado
  { category: "Animales", normalQuestion: "Di un animal que vive en el agua", impostorQuestion: "Di un animal que vive en el desierto", hint: "¿Ese animal nada?" },
  { category: "Deportes", normalQuestion: "Di un deporte de equipo", impostorQuestion: "Di un deporte individual", hint: "¿Ese deporte es de equipo?" },
  { category: "Historia", normalQuestion: "Di un rey de España", impostorQuestion: "Di un rey de Inglaterra", hint: "¿Ese rey era español?" },
  { category: "Colores", normalQuestion: "Di un color cálido", impostorQuestion: "Di un color frío", hint: "¿Ese color es cálido?" },
  { category: "Profesiones", normalQuestion: "Di una profesión de oficina", impostorQuestion: "Di una profesión al aire libre", hint: "¿Trabaja en una oficina?" },
  
  // Extras divertidos
  { category: "Random", normalQuestion: "Di algo que llevas en el bolsillo", impostorQuestion: "Di algo que llevas en la mochila", hint: "¿Eso cabe en un bolsillo?" },
  { category: "Random", normalQuestion: "Di algo que se compra en el supermercado", impostorQuestion: "Di algo que se compra en una farmacia", hint: "¿Eso se vende en el súper?" },
  { category: "Random", normalQuestion: "Di algo que huele bien", impostorQuestion: "Di algo que huele mal", hint: "¿Eso huele bien de verdad?" },
  { category: "Random", normalQuestion: "Di algo típico de Navidad", impostorQuestion: "Di algo típico de Halloween", hint: "¿Eso es de Navidad?" },
  { category: "Random", normalQuestion: "Di algo que harías en verano", impostorQuestion: "Di algo que harías en invierno", hint: "¿Eso se hace en verano?" },
];

export const getRandomImpostorRound = (): ImpostorRound => {
  return impostorRounds[Math.floor(Math.random() * impostorRounds.length)];
};

export const getImpostorRounds = (count: number = 10): ImpostorRound[] => {
  const shuffled = [...impostorRounds].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
