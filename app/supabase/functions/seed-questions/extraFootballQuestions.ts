export type SeedQuestionRow = {
  mode: string;
  category: string;
  question: string;
  type: 'test';
  options: string[];
  correct_answer: string;
  difficulty: number;
};

// Preguntas extra aportadas por el usuario para Fútbol (usadas para Tic Tac Toe Fútbol)
export const extraFootballSeedQuestions: SeedQuestionRow[] = [
  { mode: 'futbol', category: 'LaLiga', question: '¿Quién marcó el gol 6000 del Real Madrid en LaLiga?', type: 'test', options: ['Cristiano Ronaldo', 'Asensio', 'Benzema', 'Raúl'], correct_answer: 'Asensio', difficulty: 2 },
  { mode: 'futbol', category: 'LaLiga', question: '¿En qué equipo debutó Kun Agüero en España?', type: 'test', options: ['FC Barcelona', 'Atlético de Madrid', 'Sevilla', 'Villarreal'], correct_answer: 'Atlético de Madrid', difficulty: 1 },
  { mode: 'futbol', category: 'Segunda', question: '¿Qué equipo batió el récord de puntos en Segunda (91 pts) en la 2011-12?', type: 'test', options: ['Deportivo', 'Valladolid', 'Elche', 'Eibar'], correct_answer: 'Deportivo', difficulty: 3 },
  { mode: 'futbol', category: 'LaLiga', question: '¿Quién fue el \'Pichichi\' de la temporada 2007-2008?', type: 'test', options: ["Eto'o", 'Dani Güiza', 'Raúl', 'Forlán'], correct_answer: 'Dani Güiza', difficulty: 2 },
  { mode: 'futbol', category: 'LaLiga', question: '¿Qué estadio estrenó el Atlético de Madrid en 2017?', type: 'test', options: ['Vicente Calderón', 'Metropolitano', 'La Peineta', 'Nuevo Arcángel'], correct_answer: 'Metropolitano', difficulty: 1 },
  { mode: 'futbol', category: 'Segunda', question: '¿Qué equipo andaluz regresó a Primera en 2024 tras años de ausencia?', type: 'test', options: ['Málaga CF', 'Granada CF', 'Almería', 'Córdoba CF'], correct_answer: 'Málaga CF', difficulty: 2 },
  { mode: 'futbol', category: 'LaLiga', question: '¿Cuántos goles marcó Messi en su récord histórico de 2011-12?', type: 'test', options: ['45', '50', '48', '55'], correct_answer: '50', difficulty: 1 },
  { mode: 'futbol', category: 'LaLiga', question: '¿Qué portero ganó el Zamora con el Getafe en 2007?', type: 'test', options: ['Abbondanzieri', 'Casillas', 'Valdés', 'Cañizares'], correct_answer: 'Abbondanzieri', difficulty: 3 },

  { mode: 'futbol', category: 'Premier', question: '¿Qué equipo ganó la Premier 2015-16 dando la gran sorpresa?', type: 'test', options: ['Leicester City', 'Tottenham', 'Everton', 'West Ham'], correct_answer: 'Leicester City', difficulty: 1 },
  { mode: 'futbol', category: 'Premier', question: '¿Quién es el máximo goleador histórico de la Premier (260 goles)?', type: 'test', options: ['Harry Kane', 'Wayne Rooney', 'Alan Shearer', 'Thierry Henry'], correct_answer: 'Alan Shearer', difficulty: 1 },
  { mode: 'futbol', category: 'Premier', question: '¿En qué equipo inglés jugó Xabi Alonso antes del Real Madrid?', type: 'test', options: ['Chelsea', 'Arsenal', 'Liverpool', 'Man City'], correct_answer: 'Liverpool', difficulty: 1 },
  { mode: 'futbol', category: 'Premier', question: '¿Quién era el entrenador del Man United en su último título (2013)?', type: 'test', options: ['Mourinho', 'Van Gaal', 'Alex Ferguson', 'David Moyes'], correct_answer: 'Alex Ferguson', difficulty: 1 },
  { mode: 'futbol', category: 'Premier', question: '¿Qué jugador fue apodado \'The King\' en el Manchester United?', type: 'test', options: ['Eric Cantona', 'Cristiano Ronaldo', 'David Beckham', 'George Best'], correct_answer: 'Eric Cantona', difficulty: 2 },
  { mode: 'futbol', category: 'Premier', question: '¿En qué año se fundó el Manchester City tal como lo conocemos (compra de Abu Dhabi)?', type: 'test', options: ['2005', '2008', '2010', '2003'], correct_answer: '2008', difficulty: 2 },

  { mode: 'futbol', category: 'Bundesliga', question: '¿Quién marcó 41 goles en una temporada superando a Gerd Müller?', type: 'test', options: ['Robert Lewandowski', 'Harry Kane', 'Aubameyang', 'Mario Gómez'], correct_answer: 'Robert Lewandowski', difficulty: 1 },
  { mode: 'futbol', category: 'Bundesliga', question: '¿Qué equipo es conocido como \'Los Die Roten\'?', type: 'test', options: ['Dortmund', 'Bayern Múnich', 'Leverkusen', 'Mainz'], correct_answer: 'Bayern Múnich', difficulty: 1 },
  { mode: 'futbol', category: 'Bundesliga', question: '¿En qué equipo alemán brilló Raúl González tras dejar el Madrid?', type: 'test', options: ['Schalke 04', 'Wolfsburgo', 'Hamburgo', 'Werder Bremen'], correct_answer: 'Schalke 04', difficulty: 1 },
  { mode: 'futbol', category: 'Bundesliga', question: '¿Qué entrenador llevó al Dortmund a dos ligas seguidas (2011-2012)?', type: 'test', options: ['Tuchel', 'Nagelsmann', 'Jürgen Klopp', 'Hansi Flick'], correct_answer: 'Jürgen Klopp', difficulty: 1 },

  { mode: 'futbol', category: 'Ligue 1', question: '¿Qué equipo dominó la Ligue 1 ganando 7 títulos seguidos (2002-2008)?', type: 'test', options: ['PSG', 'Marsella', 'Lyon', 'Mónaco'], correct_answer: 'Lyon', difficulty: 2 },
  { mode: 'futbol', category: 'Ligue 1', question: '¿De qué equipo francés fichó el Real Madrid a Karim Benzema?', type: 'test', options: ['Marsella', 'Lille', 'Lyon', 'Burdeos'], correct_answer: 'Lyon', difficulty: 1 },
  { mode: 'futbol', category: 'Ligue 1', question: '¿Quién fue el máximo goleador histórico del PSG antes de ser superado por Mbappé?', type: 'test', options: ['Pauleta', 'Ibrahimovic', 'Cavani', 'Neymar'], correct_answer: 'Cavani', difficulty: 1 },
  { mode: 'futbol', category: 'Ligue 1', question: '¿Qué equipo ganó la Ligue 1 en 2021 interrumpiendo al PSG?', type: 'test', options: ['Lille', 'Niza', 'Mónaco', 'Lens'], correct_answer: 'Lille', difficulty: 1 },

  { mode: 'futbol', category: 'LaLiga', question: '¿Qué jugador ganó el Balón de Oro 2022 jugando en LaLiga?', type: 'test', options: ['Modric', 'Benzema', 'Lewandowski', 'Vinícius'], correct_answer: 'Benzema', difficulty: 1 },
  { mode: 'futbol', category: 'Premier', question: '¿A qué equipo se unió Erling Haaland en 2022?', type: 'test', options: ['Man United', 'Liverpool', 'Chelsea', 'Man City'], correct_answer: 'Man City', difficulty: 1 },
  { mode: 'futbol', category: 'Ligue 1', question: '¿En qué año debutó Leo Messi con el PSG?', type: 'test', options: ['2020', '2021', '2022', '2019'], correct_answer: '2021', difficulty: 1 },
  { mode: 'futbol', category: 'Segunda', question: '¿Quién fue el campeón de Segunda División en la temporada 2023-24?', type: 'test', options: ['Leganés', 'Valladolid', 'Espanyol', 'Eibar'], correct_answer: 'Leganés', difficulty: 2 },
  { mode: 'futbol', category: 'LaLiga', question: '¿En qué año se retiró Gerard Piqué del fútbol profesional?', type: 'test', options: ['2021', '2022', '2023', '2024'], correct_answer: '2022', difficulty: 1 },
  { mode: 'futbol', category: 'Bundesliga', question: '¿Qué joven estrella inglesa dejó el Dortmund por el Real Madrid en 2023?', type: 'test', options: ['Sancho', 'Bellingham', 'Musiala', 'Foden'], correct_answer: 'Bellingham', difficulty: 1 },
  { mode: 'futbol', category: 'Premier', question: '¿Qué equipo descendió de la Premier en 2023 tras ganar la liga en 2016?', type: 'test', options: ['Leicester City', 'Everton', 'Leeds', 'Southampton'], correct_answer: 'Leicester City', difficulty: 1 },
  { mode: 'futbol', category: 'LaLiga', question: '¿Quién es el máximo goleador histórico de LaLiga?', type: 'test', options: ['Cristiano Ronaldo', 'Messi', 'Zarra', 'Hugo Sánchez'], correct_answer: 'Messi', difficulty: 1 },
  { mode: 'futbol', category: 'Ligue 1', question: '¿Qué equipo de la Ligue 1 juega sus partidos en el Estadio Vélodrome?', type: 'test', options: ['PSG', 'Lyon', 'Marsella', 'Saint-Étienne'], correct_answer: 'Marsella', difficulty: 1 },
  { mode: 'futbol', category: 'Bundesliga', question: '¿Qué jugador español fue clave en el Leverkusen de Xabi Alonso (2023-24)?', type: 'test', options: ['Grimaldo', 'Isco', 'Morata', 'Dani Olmo'], correct_answer: 'Grimaldo', difficulty: 2 },
  { mode: 'futbol', category: 'Premier', question: '¿Cómo se llama el estadio del Tottenham inaugurado en 2019?', type: 'test', options: ['White Hart Lane', 'Tottenham Hotspur Stadium', 'Wembley', 'Emirates'], correct_answer: 'Tottenham Hotspur Stadium', difficulty: 1 },
  { mode: 'futbol', category: 'LaLiga', question: '¿Qué equipo ganó la Europa League 7 veces hasta 2023?', type: 'test', options: ['Villarreal', 'Sevilla FC', 'Atlético', 'Valencia'], correct_answer: 'Sevilla FC', difficulty: 1 },
  { mode: 'futbol', category: 'Segunda', question: '¿Qué mítico portero jugó en el Oviedo en Segunda recientemente?', type: 'test', options: ['Casillas', 'Santi Cazorla', 'Michu', 'Esteban'], correct_answer: 'Esteban', difficulty: 3 },
  { mode: 'futbol', category: 'Premier', question: '¿Qué jugador tiene el récord de más asistencias en una temporada Premier (20)?', type: 'test', options: ['De Bruyne', 'Özil', 'Fabregas', 'Henry/De Bruyne'], correct_answer: 'Henry/De Bruyne', difficulty: 3 },
  { mode: 'futbol', category: 'Ligue 1', question: '¿Quién era el entrenador del Mónaco de Mbappé en 2017?', type: 'test', options: ['Leonardo Jardim', 'Thierry Henry', 'Pochettino', 'Ranieri'], correct_answer: 'Leonardo Jardim', difficulty: 2 },
  { mode: 'futbol', category: 'Bundesliga', question: '¿Cuántas Bundesligas ganó Pep Guardiola con el Bayern?', type: 'test', options: ['2', '3', '4', '1'], correct_answer: '3', difficulty: 2 },
  { mode: 'futbol', category: 'LaLiga', question: '¿Qué jugador del Barça ganó el Golden Boy 2021?', type: 'test', options: ['Gavi', 'Pedri', 'Ansu Fati', 'Yamal'], correct_answer: 'Pedri', difficulty: 1 },
  { mode: 'futbol', category: 'Premier', question: '¿Qué equipo inglés es conocido como \'The Gunners\'?', type: 'test', options: ['Chelsea', 'Man City', 'Arsenal', 'Fulham'], correct_answer: 'Arsenal', difficulty: 1 },
  { mode: 'futbol', category: 'Ligue 1', question: '¿Qué jugador brasileño costó 222 millones al PSG en 2017?', type: 'test', options: ['Ronaldinho', 'Neymar', 'Vinícius', 'Rodrygo'], correct_answer: 'Neymar', difficulty: 1 },
  { mode: 'futbol', category: 'LaLiga', question: '¿Quién marcó el gol de la victoria en el Clásico que dio LaLiga al Madrid en 2012?', type: 'test', options: ['Benzema', 'Özil', 'Cristiano Ronaldo', 'Khedira'], correct_answer: 'Cristiano Ronaldo', difficulty: 2 },
  { mode: 'futbol', category: 'Bundesliga', question: '¿Qué equipo alemán llegó a la final de la Champions 2024?', type: 'test', options: ['Bayern', 'Dortmund', 'Leverkusen', 'Leipzig'], correct_answer: 'Dortmund', difficulty: 1 },
  { mode: 'futbol', category: 'Premier', question: '¿En qué año ganó el Liverpool su primera Premier League (formato actual)?', type: 'test', options: ['2018', '2019', '2020', '2021'], correct_answer: '2020', difficulty: 1 },

  { mode: 'futbol', category: 'Segunda', question: '¿Qué histórico equipo bajó a Segunda B en 2020 tras un polémico partido contra el Fuenlabrada?', type: 'test', options: ['Deportivo de La Coruña', 'Racing de Santander', 'Numancia', 'Extremadura'], correct_answer: 'Deportivo de La Coruña', difficulty: 3 },
  { mode: 'futbol', category: 'Segunda', question: '¿Quién fue el máximo goleador de Segunda con el Rayo Vallecano en la 2017-18?', type: 'test', options: ['Raúl de Tomás', 'Jaime Mata', 'Borja Iglesias', 'Sergi Enrich'], correct_answer: 'Jaime Mata', difficulty: 3 },
  { mode: 'futbol', category: 'Segunda', question: '¿Qué equipo ostenta el récord de más temporadas consecutivas en Segunda División?', type: 'test', options: ['Murcia', 'Sporting de Gijón', 'Tenerife', 'Eibar'], correct_answer: 'Murcia', difficulty: 3 },
  { mode: 'futbol', category: 'Segunda', question: '¿En qué equipo de Segunda destacó el canario Jonathan Viera antes de irse a China?', type: 'test', options: ['UD Las Palmas', 'Tenerife', 'Lugo', 'Alcorcón'], correct_answer: 'UD Las Palmas', difficulty: 2 },
  { mode: 'futbol', category: 'Segunda', question: '¿Qué ciudad representa el equipo de la SD Ponferradina?', type: 'test', options: ['León', 'Ponferrada', 'Vigo', 'Gijón'], correct_answer: 'Ponferrada', difficulty: 1 },
  { mode: 'futbol', category: 'Segunda', question: '¿Quién era el entrenador del Elche en su ascenso mediante Play-off en 2020?', type: 'test', options: ['Pacheta', 'Francisco', 'Almirón', 'Bordalás'], correct_answer: 'Pacheta', difficulty: 3 },
  { mode: 'futbol', category: 'Segunda', question: '¿Qué equipo madrileño logró el histórico \'Alcorconazo\' contra el Real Madrid estando en Segunda B?', type: 'test', options: ['Leganés', 'Getafe', 'Alcorcón', 'Rayo Majadahonda'], correct_answer: 'Alcorcón', difficulty: 1 },
  { mode: 'futbol', category: 'Segunda', question: '¿Cómo se llama el estadio del Real Oviedo?', type: 'test', options: ['El Molinón', 'Carlos Tartiere', 'Lasesarre', 'El Sardinero'], correct_answer: 'Carlos Tartiere', difficulty: 1 },
  { mode: 'futbol', category: 'Segunda', question: '¿Qué equipo subió a Primera por primera vez en su historia en 2018?', type: 'test', options: ['Huesca', 'Eibar', 'Girona', 'Leganés'], correct_answer: 'Huesca', difficulty: 1 },
  { mode: 'futbol', category: 'Segunda', question: '¿Qué mítico delantero uruguayo jugó en el Albacete en la temporada 2003-04?', type: 'test', options: ['Diego Alonso', 'Pacheco', 'Zalayeta', 'Pandiani'], correct_answer: 'Pacheco', difficulty: 3 },
  { mode: 'futbol', category: 'Segunda', question: '¿Quién es el máximo goleador histórico de la Segunda División Española?', type: 'test', options: ['Nino', 'Rubén Castro', 'Quini', 'Charles'], correct_answer: 'Rubén Castro', difficulty: 2 },
  { mode: 'futbol', category: 'Segunda', question: '¿En qué equipo de Segunda jugó Pedri antes de fichar por el Barça?', type: 'test', options: ['Las Palmas', 'Tenerife', 'Mallorca', 'Zaragoza'], correct_answer: 'Las Palmas', difficulty: 2 },
  { mode: 'futbol', category: 'Segunda', question: '¿Qué equipo ganó la Liga Adelante (Segunda) en la 2013-14?', type: 'test', options: ['Eibar', 'Deportivo', 'Betis', 'Levante'], correct_answer: 'Eibar', difficulty: 3 },
  { mode: 'futbol', category: 'Segunda', question: '¿Qué portero del Leganés fue clave en su primer ascenso a Primera en 2016?', type: 'test', options: ['Jon Ander Serantes', 'Cuéllar', 'Iago Herrerín', 'Diego Conde'], correct_answer: 'Jon Ander Serantes', difficulty: 3 },
  { mode: 'futbol', category: 'Segunda', question: '¿Cómo se conoce popularmente al derbi entre Oviedo y Sporting?', type: 'test', options: ['Derbi Asturiano', 'Derbi del Norte', 'Derbi de la Sidra', 'Clásico de Plata'], correct_answer: 'Derbi Asturiano', difficulty: 1 },

  { mode: 'futbol', category: 'Ligue 1', question: '¿Qué equipo interrumpió la hegemonía del PSG ganando la liga en 2017?', type: 'test', options: ['Mónaco', 'Lille', 'Niza', 'Marsella'], correct_answer: 'Mónaco', difficulty: 1 },
  { mode: 'futbol', category: 'Ligue 1', question: '¿Cuál es el único equipo francés que ha ganado la Champions League?', type: 'test', options: ['PSG', 'Marsella', 'Lyon', 'Reims'], correct_answer: 'Marsella', difficulty: 1 },
  { mode: 'futbol', category: 'Ligue 1', question: '¿Qué apodo recibe el clásico entre PSG y Marsella?', type: 'test', options: ['Le Classique', 'Le Derby', 'La Bataille', 'Le Choc'], correct_answer: 'Le Classique', difficulty: 1 },
  { mode: 'futbol', category: 'Ligue 1', question: '¿Quién fue el máximo goleador de la Ligue 1 por 5 años seguidos (2019-2023)?', type: 'test', options: ['Mbappé', 'Neymar', 'Ben Yedder', 'Lacazette'], correct_answer: 'Mbappé', difficulty: 1 },
  { mode: 'futbol', category: 'Ligue 1', question: '¿En qué equipo francés jugaba Eden Hazard antes de irse al Chelsea?', type: 'test', options: ['Lille', 'Lyon', 'PSG', 'Saint-Étienne'], correct_answer: 'Lille', difficulty: 1 },
  { mode: 'futbol', category: 'Ligue 1', question: '¿Qué equipo tiene más títulos de liga en Francia tras el PSG?', type: 'test', options: ['Saint-Étienne', 'Lyon', 'Nantes', 'Burdeos'], correct_answer: 'Saint-Étienne', difficulty: 3 },
  { mode: 'futbol', category: 'Ligue 1', question: "¿Qué ciudad representa el equipo de 'Les Dogues'?", type: 'test', options: ['Lille', 'Niza', 'Rennes', 'Metz'], correct_answer: 'Lille', difficulty: 1 },
  { mode: 'futbol', category: 'Ligue 1', question: '¿En qué estadio juega el Lyon desde 2016?', type: 'test', options: ['Gerland', 'Groupama Stadium', 'Parc des Princes', 'Vélodrome'], correct_answer: 'Groupama Stadium', difficulty: 2 },
  { mode: 'futbol', category: 'Ligue 1', question: '¿Qué delantero colombiano brilló en el Mónaco entre 2013 y 2019?', type: 'test', options: ['Radamel Falcao', 'James Rodríguez', 'Carlos Bacca', 'Luis Díaz'], correct_answer: 'Radamel Falcao', difficulty: 1 },
  { mode: 'futbol', category: 'Ligue 1', question: '¿Qué equipo de la Ligue 1 es propiedad del grupo INEOS?', type: 'test', options: ['Niza', 'Lorient', 'Estrasburgo', 'Rennes'], correct_answer: 'Niza', difficulty: 2 },
  { mode: 'futbol', category: 'Ligue 1', question: '¿Quién era el portero titular del PSG antes de la llegada de Donnarumma?', type: 'test', options: ['Keylor Navas', 'Areola', 'Sirigu', 'Trapp'], correct_answer: 'Keylor Navas', difficulty: 1 },
  { mode: 'futbol', category: 'Ligue 1', question: '¿En qué equipo francés jugó Mario Balotelli tras dejar el Liverpool?', type: 'test', options: ['Niza', 'Marsella', 'Lyon', 'Ambos (Niza y Marsella)'], correct_answer: 'Ambos (Niza y Marsella)', difficulty: 3 },
  { mode: 'futbol', category: 'Ligue 1', question: '¿Qué club francés es conocido por su color morado?', type: 'test', options: ['Toulouse', 'Montpellier', 'Brest', 'Lens'], correct_answer: 'Toulouse', difficulty: 2 },
  { mode: 'futbol', category: 'Ligue 1', question: '¿Qué jugador argentino es el máximo asistente histórico del PSG?', type: 'test', options: ['Pastore', 'Di María', 'Messi', 'Lavezzi'], correct_answer: 'Di María', difficulty: 3 },
  { mode: 'futbol', category: 'Ligue 1', question: '¿En qué año se fundó el PSG (Paris Saint-Germain)?', type: 'test', options: ['1970', '1902', '1945', '1988'], correct_answer: '1970', difficulty: 1 },

  { mode: 'futbol', category: 'Bundesliga', question: '¿Cómo se llama el famoso muro de la afición del Dortmund?', type: 'test', options: ['Gelbe Wand', 'Rote Wand', 'Black Wall', 'Südkurve'], correct_answer: 'Gelbe Wand', difficulty: 2 },
  { mode: 'futbol', category: 'Bundesliga', question: '¿Qué portero alemán ha ganado más Bundesligas?', type: 'test', options: ['Manuel Neuer', 'Oliver Kahn', 'Sepp Maier', 'Ter Stegen'], correct_answer: 'Manuel Neuer', difficulty: 2 },
  { mode: 'futbol', category: 'Bundesliga', question: '¿Qué equipo de la Bundesliga juega en el estadio An der Alten Försterei?', type: 'test', options: ['Union Berlin', 'Hertha Berlin', 'Mainz', 'Friburgo'], correct_answer: 'Union Berlin', difficulty: 3 },
];
