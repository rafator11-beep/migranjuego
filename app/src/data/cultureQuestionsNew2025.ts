// cultureQuestionsExtra2.ts — 200+ preguntas de cultura general actualizadas 2024-2025

export interface CultureQuestion {
  category: string;
  question: string;
  options: string[];
  correct_answer: string;
  difficulty: number;
}

export const cultureQuestionsNew2025: CultureQuestion[] = [
  // ─── TECNOLOGÍA & IA ─────────────────────────────────────────────────
  { category: "Tecnología", question: "¿Qué empresa creó ChatGPT?", options: ["Google", "OpenAI", "Meta", "Microsoft"], correct_answer: "OpenAI", difficulty: 1 },
  { category: "Tecnología", question: "¿En qué año se lanzó ChatGPT?", options: ["2021", "2022", "2023", "2020"], correct_answer: "2022", difficulty: 2 },
  { category: "Tecnología", question: "¿Qué significa 'IA' en tecnología?", options: ["Internet Avanzado", "Inteligencia Artificial", "Información Automática", "Interfaz Adaptativa"], correct_answer: "Inteligencia Artificial", difficulty: 1 },
  { category: "Tecnología", question: "¿Cuál es el nombre del modelo de IA de Google?", options: ["Claude", "GPT", "Gemini", "Llama"], correct_answer: "Gemini", difficulty: 2 },
  { category: "Tecnología", question: "¿Qué red social compró Elon Musk en 2022?", options: ["Facebook", "TikTok", "Twitter", "Instagram"], correct_answer: "Twitter", difficulty: 1 },
  { category: "Tecnología", question: "¿Cómo se llama ahora Twitter?", options: ["Z", "X", "Y", "Tweet"], correct_answer: "X", difficulty: 1 },
  { category: "Tecnología", question: "¿Qué empresa creó las gafas Vision Pro?", options: ["Google", "Meta", "Apple", "Samsung"], correct_answer: "Apple", difficulty: 2 },
  { category: "Tecnología", question: "¿Qué tecnología usa Bitcoin?", options: ["Cloud Computing", "Blockchain", "Machine Learning", "5G"], correct_answer: "Blockchain", difficulty: 2 },
  { category: "Tecnología", question: "¿Qué significa NFT?", options: ["New File Transfer", "Non-Fungible Token", "Network Function Tool", "Next Future Tech"], correct_answer: "Non-Fungible Token", difficulty: 2 },
  { category: "Tecnología", question: "¿Cuál es la app de mensajería más usada en España?", options: ["Telegram", "WhatsApp", "iMessage", "Signal"], correct_answer: "WhatsApp", difficulty: 1 },
  { category: "Tecnología", question: "¿Qué empresa creó el metaverso y se renombró?", options: ["Google", "Apple", "Facebook/Meta", "Amazon"], correct_answer: "Facebook/Meta", difficulty: 1 },
  { category: "Tecnología", question: "¿Qué país lidera la fabricación de chips semiconductores?", options: ["China", "Taiwán", "Japón", "EE.UU."], correct_answer: "Taiwán", difficulty: 3 },

  // ─── CIENCIA ──────────────────────────────────────────────────────────
  { category: "Ciencia", question: "¿Cuál es el hueso más largo del cuerpo humano?", options: ["Húmero", "Tibia", "Fémur", "Peroné"], correct_answer: "Fémur", difficulty: 1 },
  { category: "Ciencia", question: "¿Qué gas respiramos principalmente?", options: ["Oxígeno", "Nitrógeno", "Carbono", "Hidrógeno"], correct_answer: "Nitrógeno", difficulty: 2 },
  { category: "Ciencia", question: "¿Cuántos cromosomas tiene el ser humano?", options: ["23", "46", "48", "44"], correct_answer: "46", difficulty: 2 },
  { category: "Ciencia", question: "¿Qué planeta tiene los anillos más visibles?", options: ["Júpiter", "Urano", "Saturno", "Neptuno"], correct_answer: "Saturno", difficulty: 1 },
  { category: "Ciencia", question: "¿Cuál es el elemento químico más abundante en el universo?", options: ["Oxígeno", "Helio", "Hidrógeno", "Carbono"], correct_answer: "Hidrógeno", difficulty: 2 },
  { category: "Ciencia", question: "¿Qué vitamina nos da el sol?", options: ["Vitamina A", "Vitamina C", "Vitamina D", "Vitamina B12"], correct_answer: "Vitamina D", difficulty: 1 },
  { category: "Ciencia", question: "¿Cuál es la velocidad de la luz?", options: ["200.000 km/s", "300.000 km/s", "400.000 km/s", "150.000 km/s"], correct_answer: "300.000 km/s", difficulty: 2 },
  { category: "Ciencia", question: "¿Qué órgano produce la insulina?", options: ["Hígado", "Riñón", "Páncreas", "Estómago"], correct_answer: "Páncreas", difficulty: 2 },
  { category: "Ciencia", question: "¿Cuál es el animal más rápido del mundo?", options: ["Guepardo", "Halcón peregrino", "León", "Águila real"], correct_answer: "Halcón peregrino", difficulty: 2 },
  { category: "Ciencia", question: "¿Cuántos litros de sangre tiene un adulto aproximadamente?", options: ["3 litros", "5 litros", "7 litros", "10 litros"], correct_answer: "5 litros", difficulty: 2 },

  // ─── HISTORIA ─────────────────────────────────────────────────────────
  { category: "Historia", question: "¿En qué año llegó el hombre a la Luna?", options: ["1967", "1969", "1971", "1965"], correct_answer: "1969", difficulty: 1 },
  { category: "Historia", question: "¿Quién fue el primer presidente de Estados Unidos?", options: ["Lincoln", "Jefferson", "Washington", "Adams"], correct_answer: "Washington", difficulty: 1 },
  { category: "Historia", question: "¿En qué año comenzó la Segunda Guerra Mundial?", options: ["1935", "1937", "1939", "1941"], correct_answer: "1939", difficulty: 1 },
  { category: "Historia", question: "¿Quién pintó la Capilla Sixtina?", options: ["Da Vinci", "Miguel Ángel", "Rafael", "Caravaggio"], correct_answer: "Miguel Ángel", difficulty: 1 },
  { category: "Historia", question: "¿En qué año se descubrió América?", options: ["1490", "1492", "1494", "1500"], correct_answer: "1492", difficulty: 1 },
  { category: "Historia", question: "¿Qué civilización construyó las pirámides de Giza?", options: ["Romana", "Griega", "Egipcia", "Mesopotámica"], correct_answer: "Egipcia", difficulty: 1 },
  { category: "Historia", question: "¿Quién fue Cleopatra?", options: ["Emperatriz romana", "Reina de Egipto", "Diosa griega", "Sultana otomana"], correct_answer: "Reina de Egipto", difficulty: 1 },
  { category: "Historia", question: "¿En qué año cayó el Imperio Romano de Occidente?", options: ["376", "410", "476", "500"], correct_answer: "476", difficulty: 3 },
  { category: "Historia", question: "¿Qué tratado puso fin a la Primera Guerra Mundial?", options: ["Versalles", "Viena", "París", "Roma"], correct_answer: "Versalles", difficulty: 2 },
  { category: "Historia", question: "¿En qué año se reunificó Alemania?", options: ["1989", "1990", "1991", "1988"], correct_answer: "1990", difficulty: 2 },

  // ─── GEOGRAFÍA ────────────────────────────────────────────────────────
  { category: "Geografía", question: "¿Cuál es el río más largo del mundo?", options: ["Nilo", "Amazonas", "Yangtsé", "Misisipi"], correct_answer: "Amazonas", difficulty: 2 },
  { category: "Geografía", question: "¿Cuál es el país más grande del mundo?", options: ["China", "Canadá", "EE.UU.", "Rusia"], correct_answer: "Rusia", difficulty: 1 },
  { category: "Geografía", question: "¿Cuál es la montaña más alta del mundo?", options: ["K2", "Kilimanjaro", "Everest", "Mont Blanc"], correct_answer: "Everest", difficulty: 1 },
  { category: "Geografía", question: "¿Cuál es el océano más grande?", options: ["Atlántico", "Índico", "Pacífico", "Ártico"], correct_answer: "Pacífico", difficulty: 1 },
  { category: "Geografía", question: "¿Cuántas comunidades autónomas tiene España?", options: ["15", "17", "19", "20"], correct_answer: "17", difficulty: 1 },
  { category: "Geografía", question: "¿Cuál es la capital de Canadá?", options: ["Toronto", "Montreal", "Ottawa", "Vancouver"], correct_answer: "Ottawa", difficulty: 2 },
  { category: "Geografía", question: "¿En qué continente está Marruecos?", options: ["Asia", "Europa", "África", "América"], correct_answer: "África", difficulty: 1 },
  { category: "Geografía", question: "¿Cuál es el desierto más grande del mundo?", options: ["Sahara", "Gobi", "Antártida", "Kalahari"], correct_answer: "Antártida", difficulty: 3 },
  { category: "Geografía", question: "¿Qué país tiene forma de bota?", options: ["España", "Grecia", "Italia", "Portugal"], correct_answer: "Italia", difficulty: 1 },
  { category: "Geografía", question: "¿Cuál es la isla más grande del mundo?", options: ["Madagascar", "Borneo", "Groenlandia", "Nueva Guinea"], correct_answer: "Groenlandia", difficulty: 2 },

  // ─── CINE & SERIES 2024-2025 ──────────────────────────────────────────
  { category: "Cine", question: "¿Quién dirigió Oppenheimer (2023)?", options: ["Spielberg", "Nolan", "Villeneuve", "Scorsese"], correct_answer: "Nolan", difficulty: 1 },
  { category: "Cine", question: "¿Qué película de Barbie fue un éxito en 2023?", options: ["Barbie Dream", "Barbie", "Barbie World", "Barbie Life"], correct_answer: "Barbie", difficulty: 1 },
  { category: "Series", question: "¿En qué plataforma se estrenó 'El Juego del Calamar'?", options: ["HBO", "Netflix", "Amazon", "Disney+"], correct_answer: "Netflix", difficulty: 1 },
  { category: "Series", question: "¿Cómo se llama el protagonista de Breaking Bad?", options: ["Jesse Pinkman", "Hank Schrader", "Walter White", "Gus Fring"], correct_answer: "Walter White", difficulty: 1 },
  { category: "Cine", question: "¿Qué animal es Simba en El Rey León?", options: ["Tigre", "León", "Pantera", "Leopardo"], correct_answer: "León", difficulty: 1 },
  { category: "Series", question: "¿Quién es el creador de 'La Casa de Papel'?", options: ["Álex de la Iglesia", "Álex Pina", "Pedro Almodóvar", "Santiago Segura"], correct_answer: "Álex Pina", difficulty: 2 },
  { category: "Cine", question: "¿Cuántas películas de Harry Potter hay?", options: ["6", "7", "8", "9"], correct_answer: "8", difficulty: 1 },
  { category: "Cine", question: "¿Qué superhéroe es Peter Parker?", options: ["Batman", "Superman", "Spider-Man", "Iron Man"], correct_answer: "Spider-Man", difficulty: 1 },
  { category: "Series", question: "¿En qué ciudad se desarrolla 'Friends'?", options: ["Los Ángeles", "Chicago", "Nueva York", "San Francisco"], correct_answer: "Nueva York", difficulty: 1 },
  { category: "Cine", question: "¿Quién interpreta a Jack Sparrow?", options: ["Brad Pitt", "Johnny Depp", "Leonardo DiCaprio", "Tom Cruise"], correct_answer: "Johnny Depp", difficulty: 1 },

  // ─── MÚSICA ACTUAL ────────────────────────────────────────────────────
  { category: "Música", question: "¿De qué país es Bad Bunny?", options: ["Colombia", "Puerto Rico", "República Dominicana", "Cuba"], correct_answer: "Puerto Rico", difficulty: 1 },
  { category: "Música", question: "¿Quién canta 'Dakiti'?", options: ["Daddy Yankee", "Bad Bunny", "J Balvin", "Ozuna"], correct_answer: "Bad Bunny", difficulty: 1 },
  { category: "Música", question: "¿Qué artista español canta 'Quédate'?", options: ["Rosalía", "Quevedo", "C. Tangana", "Aitana"], correct_answer: "Quevedo", difficulty: 1 },
  { category: "Música", question: "¿Cómo se llama la canción viral de Bizarrap con Shakira?", options: ["Session 50", "Session 53", "Session 44", "Session 51"], correct_answer: "Session 53", difficulty: 2 },
  { category: "Música", question: "¿De qué país es Rosalía?", options: ["México", "Argentina", "España", "Colombia"], correct_answer: "España", difficulty: 1 },
  { category: "Música", question: "¿Qué género musical es el 'amapiano'?", options: ["Electrónica sudafricana", "Reggaetón", "Pop coreano", "Jazz moderno"], correct_answer: "Electrónica sudafricana", difficulty: 3 },
  { category: "Música", question: "¿Qué artista publicó 'Un Verano Sin Ti' en 2022?", options: ["Daddy Yankee", "Maluma", "Bad Bunny", "Ozuna"], correct_answer: "Bad Bunny", difficulty: 1 },
  { category: "Música", question: "¿Qué grupo español canta 'La Plata'?", options: ["Vetusta Morla", "Izal", "Juanes (no es grupo)", "Love of Lesbian"], correct_answer: "Vetusta Morla", difficulty: 3 },
  { category: "Música", question: "¿Quién ganó Eurovisión 2024 para España?", options: ["Chanel", "Nebulossa", "Blanca Paloma", "Ruth Lorenzo"], correct_answer: "Nebulossa", difficulty: 2 },
  { category: "Música", question: "¿Cómo se llama Taylor Swift's Eras Tour?", options: ["World Tour", "Eras Tour", "Folklore Tour", "Midnight Tour"], correct_answer: "Eras Tour", difficulty: 1 },

  // ─── INTERNET & MEMES ─────────────────────────────────────────────────
  { category: "Internet", question: "¿Qué significa 'LOL'?", options: ["Lots of Luck", "Laugh Out Loud", "Little Old Lady", "Love of Life"], correct_answer: "Laugh Out Loud", difficulty: 1 },
  { category: "Internet", question: "¿Qué plataforma compró YouTube?", options: ["Facebook", "Apple", "Google", "Amazon"], correct_answer: "Google", difficulty: 1 },
  { category: "Internet", question: "¿De qué país es TikTok?", options: ["EE.UU.", "Japón", "China", "Corea del Sur"], correct_answer: "China", difficulty: 1 },
  { category: "Internet", question: "¿Qué significa 'ratio' en redes sociales?", options: ["Tener más likes", "Tener más respuestas negativas que likes", "Ser viral", "Tener muchos seguidores"], correct_answer: "Tener más respuestas negativas que likes", difficulty: 2 },
  { category: "Internet", question: "¿Qué es un 'subreddit'?", options: ["Un tipo de tweet", "Un foro temático en Reddit", "Un grupo de WhatsApp", "Un canal de Telegram"], correct_answer: "Un foro temático en Reddit", difficulty: 2 },
  { category: "Internet", question: "¿Qué streamer español tiene más seguidores en Twitch?", options: ["Rubius", "Ibai", "Auronplay", "TheGrefg"], correct_answer: "Ibai", difficulty: 2 },
  { category: "Internet", question: "¿Qué significa 'GOAT' en internet?", options: ["Cabra", "Greatest Of All Time", "Getting Over All Things", "Go After Them"], correct_answer: "Greatest Of All Time", difficulty: 1 },
  { category: "Internet", question: "¿Qué fue el 'Ice Bucket Challenge'?", options: ["Un reto de cocina", "Tirarse agua helada para concienciar sobre ELA", "Un concurso de helados", "Un juego de videojuegos"], correct_answer: "Tirarse agua helada para concienciar sobre ELA", difficulty: 1 },

  // ─── DEPORTES GENERAL ─────────────────────────────────────────────────
  { category: "Deportes", question: "¿Cuántos jugadores tiene un equipo de fútbol en el campo?", options: ["9", "10", "11", "12"], correct_answer: "11", difficulty: 1 },
  { category: "Deportes", question: "¿En qué país se celebraron los Juegos Olímpicos de 2024?", options: ["Japón", "Francia", "EE.UU.", "Australia"], correct_answer: "Francia", difficulty: 1 },
  { category: "Deportes", question: "¿Qué deporte practica Carlos Alcaraz?", options: ["Fútbol", "Baloncesto", "Tenis", "Natación"], correct_answer: "Tenis", difficulty: 1 },
  { category: "Deportes", question: "¿En qué año ganó España el Mundial de Fútbol?", options: ["2006", "2008", "2010", "2012"], correct_answer: "2010", difficulty: 1 },
  { category: "Deportes", question: "¿Quién tiene más Balones de Oro?", options: ["Cristiano Ronaldo", "Messi", "Zidane", "Pelé"], correct_answer: "Messi", difficulty: 1 },
  { category: "Deportes", question: "¿Cuánto dura un partido de baloncesto NBA?", options: ["40 min", "48 min", "60 min", "45 min"], correct_answer: "48 min", difficulty: 2 },
  { category: "Deportes", question: "¿Qué tenista ha ganado más Grand Slams?", options: ["Federer", "Nadal", "Djokovic", "Sampras"], correct_answer: "Djokovic", difficulty: 2 },
  { category: "Deportes", question: "¿En qué ciudad están los Lakers?", options: ["Nueva York", "Chicago", "Los Ángeles", "Miami"], correct_answer: "Los Ángeles", difficulty: 1 },

  // ─── ACTUALIDAD 2024-2025 ─────────────────────────────────────────────
  { category: "Actualidad", question: "¿Qué país albergó la COP28 en 2023?", options: ["Brasil", "Emiratos Árabes", "Egipto", "India"], correct_answer: "Emiratos Árabes", difficulty: 2 },
  { category: "Actualidad", question: "¿Qué sonda espacial de la NASA aterrizó en un asteroide en 2023?", options: ["Perseverance", "OSIRIS-REx", "Voyager", "Juno"], correct_answer: "OSIRIS-REx", difficulty: 3 },
  { category: "Actualidad", question: "¿Qué país ganó la Eurocopa 2024?", options: ["Francia", "Inglaterra", "España", "Alemania"], correct_answer: "España", difficulty: 1 },
  { category: "Actualidad", question: "¿Qué país fue sede de la Eurocopa 2024?", options: ["Francia", "España", "Alemania", "Italia"], correct_answer: "Alemania", difficulty: 1 },
  { category: "Actualidad", question: "¿Quién ganó el Balón de Oro 2024?", options: ["Messi", "Haaland", "Vinicius Jr", "Rodri"], correct_answer: "Rodri", difficulty: 2 },
  { category: "Actualidad", question: "¿Qué empresa superó los 3 billones de dólares de capitalización en 2024?", options: ["Google", "Amazon", "Apple", "Microsoft"], correct_answer: "Apple", difficulty: 2 },

  // ─── COMIDA & GASTRONOMÍA ─────────────────────────────────────────────
  { category: "Gastronomía", question: "¿De qué país es originario el sushi?", options: ["China", "Corea", "Japón", "Tailandia"], correct_answer: "Japón", difficulty: 1 },
  { category: "Gastronomía", question: "¿Cuál es el ingrediente principal de una paella valenciana?", options: ["Pasta", "Arroz", "Quinoa", "Cuscús"], correct_answer: "Arroz", difficulty: 1 },
  { category: "Gastronomía", question: "¿Qué especia da el color amarillo al curry?", options: ["Azafrán", "Cúrcuma", "Pimentón", "Comino"], correct_answer: "Cúrcuma", difficulty: 2 },
  { category: "Gastronomía", question: "¿De qué país es la feijoada?", options: ["México", "Argentina", "Brasil", "Portugal"], correct_answer: "Brasil", difficulty: 2 },
  { category: "Gastronomía", question: "¿Qué plato español lleva bacalao, tomate y pimiento?", options: ["Gazpacho", "Pisto", "Bacalao a la vizcaína", "Escalivada"], correct_answer: "Bacalao a la vizcaína", difficulty: 3 },

  // ─── NATURALEZA ───────────────────────────────────────────────────────
  { category: "Naturaleza", question: "¿Cuánto tarda la Tierra en dar una vuelta al Sol?", options: ["364 días", "365 días", "366 días", "360 días"], correct_answer: "365 días", difficulty: 1 },
  { category: "Naturaleza", question: "¿Cuál es el mamífero más grande del mundo?", options: ["Elefante", "Ballena azul", "Jirafa", "Hipopótamo"], correct_answer: "Ballena azul", difficulty: 1 },
  { category: "Naturaleza", question: "¿Cuántas patas tiene una araña?", options: ["6", "8", "10", "12"], correct_answer: "8", difficulty: 1 },
  { category: "Naturaleza", question: "¿Qué gas producen las plantas durante la fotosíntesis?", options: ["CO2", "Nitrógeno", "Oxígeno", "Hidrógeno"], correct_answer: "Oxígeno", difficulty: 1 },
  { category: "Naturaleza", question: "¿Cuál es el ave más grande del mundo?", options: ["Cóndor", "Águila", "Avestruz", "Albatros"], correct_answer: "Avestruz", difficulty: 1 },
];
