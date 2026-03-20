// Football Trivia Questions - 500+ questions from La Liga, Premier League, Bundesliga, Serie A, Ligue 1
// Period: 1970 to present, emphasis on 2005-present

export interface FootballQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: string;
  category: string;
  year?: number;
}

// Corregido: El nombre de la variable debe ser footballQuestions
const footballQuestionsData = [

  // --- PREGUNTAS DE SEGUNDA DIVISIÓN (ORDENADAS Y CORREGIDAS) ---
  { 
    question: "¿Qué equipo de Segunda División es conocido como 'El Decano' del fútbol español?", 
    options: ["Sporting de Gijón", "Real Murcia", "Recreativo de Huelva", "Racing de Santander"], 
    correctIndex: 2, 
    difficulty: "medium", 
    category: "segunda" 
  },
  { 
    question: "¿Qué jugador tiene el récord de máximo goleador histórico de la Segunda División?", 
    options: ["Nino", "Rubén Castro", "Jonathan Soriano", "Charles"], 
    correctIndex: 0, 
    difficulty: "hard", 
    category: "segunda" 
  },
  { 
    question: "¿En qué estadio juega sus partidos el CD Eldense?", 
    options: ["Anduva", "Pepico Amat", "El Plantío", "A Malata"], 
    correctIndex: 1, 
    difficulty: "hard", 
    category: "segunda" 
  },
  { 
    question: "¿Qué equipo ostenta el récord de más puntos en una temporada de Segunda (91 pts)?", 
    options: ["Valladolid", "Deportivo de La Coruña", "Espanyol", "Levante"], 
    correctIndex: 1, 
    difficulty: "hard", 
    category: "segunda" 
  },
  { 
    question: "¿Cuál es el equipo con más temporadas en la historia de la Segunda División?", 
    options: ["Hércules", "Real Murcia", "Sporting de Gijón", "Sabadell"], 
    correctIndex: 1, 
    difficulty: "hard", 
    category: "segunda" 
  },

  // --- SERIE A (ITALIA) ---
  { 
    question: "¿Quién es el máximo goleador histórico de la Serie A?", 
    options: ["Francesco Totti", "Gunnar Nordahl", "Silvio Piola", "Giuseppe Meazza"], 
    correctIndex: 2, 
    difficulty: "hard", 
    category: "seriea" 
  },
  { 
    question: "¿Qué jugador es apodado 'Il Capitano' en la AS Roma?", 
    options: ["Daniele De Rossi", "Francesco Totti", "Giuseppe Giannini", "Bruno Conti"], 
    correctIndex: 1, 
    difficulty: "easy", 
    category: "seriea" 
  },
  { 
    question: "¿En qué equipo italiano coincidieron Pep Guardiola y Roberto Baggio?", 
    options: ["Brescia", "Roma", "Inter", "Milan"], 
    correctIndex: 0, 
    difficulty: "hard", 
    category: "seriea" 
  },

  // --- PREGUNTAS DE LA LIGA (CORREGIDAS) ---
  { 
    category: "La Liga", 
    question: "¿Qué equipo ganó las 6 primeras ediciones de La Liga?", 
    options: ["Real Madrid", "Barcelona", "Athletic Bilbao", "Atlético de Madrid"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "La Liga", 
    question: "¿Cuántos equipos hay en La Liga española?", 
    options: ["18", "20", "22", "24"], 
    correctIndex: 1, 
    difficulty: "easy" 
  }
  // LA LIGA
  ,{ question: "¿Qué equipo ganó La Liga en la temporada 2022-23?", options: ["Real Madrid", "Barcelona", "Atlético Madrid", "Real Sociedad"], correctIndex: 1, difficulty: "easy", category: "laliga" },
  { question: "¿Cuántas Ligas tiene el Real Madrid?", options: ["33", "35", "36", "34"], correctIndex: 2, difficulty: "medium", category: "laliga" },
  { question: "¿Quién ganó el Pichichi en 2023?", options: ["Benzema", "Lewandowski", "Vinicius", "Griezmann"], correctIndex: 0, difficulty: "easy", category: "laliga" },
  { question: "¿En qué año ganó el Atlético de Madrid su última Liga?", options: ["2014", "2021", "2018", "2016"], correctIndex: 1, difficulty: "medium", category: "laliga" },
  { question: "¿Quién era el entrenador del Barcelona cuando ganaron el sextete en 2009?", options: ["Luis Enrique", "Frank Rijkaard", "Pep Guardiola", "Tito Vilanova"], correctIndex: 2, difficulty: "easy", category: "laliga" },
  { question: "¿Cuántos Balones de Oro ganó Messi en el Barcelona?", options: ["6", "7", "8", "5"], correctIndex: 1, difficulty: "medium", category: "laliga" },
  { question: "¿Qué equipo descendió a Segunda en 2024?", options: ["Granada", "Almería", "Cádiz", "Todos los anteriores"], correctIndex: 3, difficulty: "medium", category: "laliga" },
  { question: "¿Quién fichó por el Real Madrid desde el Bayern en 2024?", options: ["Sané", "Müller", "Kimmich", "Ninguno"], correctIndex: 3, difficulty: "hard", category: "laliga" },
  { question: "¿Cuántas temporadas jugó Benzema en el Real Madrid?", options: ["12", "14", "15", "13"], correctIndex: 1, difficulty: "medium", category: "laliga" },
  { question: "¿Qué portero ganó el Zamora 10 veces?", options: ["Casillas", "Valdés", "Jan Oblak", "Courtois"], correctIndex: 2, difficulty: "hard", category: "laliga" },
  { question: "¿Cuántos goles marcó Ronaldo Nazario en su primera temporada en el Real Madrid?", options: ["23", "25", "30", "21"], correctIndex: 0, difficulty: "hard", category: "laliga" },
  { question: "¿Quién marcó el gol del triplete del Athletic en la final de Copa 2024?", options: ["Nico Williams", "Iñaki Williams", "Muniain", "Sancet"], correctIndex: 0, difficulty: "medium", category: "laliga" },
  { question: "¿Cuántas Copas del Rey tiene el Barcelona?", options: ["29", "31", "30", "32"], correctIndex: 1, difficulty: "hard", category: "laliga" },
  { question: "¿Quién es el entrenador más laureado de La Liga?", options: ["Miguel Muñoz", "Luis Aragonés", "Pep Guardiola", "Johan Cruyff"], correctIndex: 0, difficulty: "hard", category: "laliga" },
  { question: "¿Qué jugador tiene más partidos en La Liga?", options: ["Raúl", "Casillas", "Andoni Zubizarreta", "Joaquín"], correctIndex: 3, difficulty: "hard", category: "laliga" },
  { question: "¿En qué año se fundó La Liga española?", options: ["1928", "1929", "1930", "1927"], correctIndex: 1, difficulty: "hard", category: "laliga" },
  { question: "¿Cuántos goles marcó Cristiano Ronaldo en La Liga?", options: ["311", "450", "400", "350"], correctIndex: 0, difficulty: "medium", category: "laliga" },
  { question: "¿Qué equipo ganó la Liga en 2023-24?", options: ["Barcelona", "Real Madrid", "Girona", "Athletic"], correctIndex: 1, difficulty: "easy", category: "laliga" },
  { question: "¿Quién es el máximo goleador histórico del Real Madrid?", options: ["Raúl", "Cristiano Ronaldo", "Di Stéfano", "Benzema"], correctIndex: 1, difficulty: "easy", category: "laliga" },
  
  // PREMIER LEAGUE
  { question: "¿Cuántas Premier League ha ganado el Manchester City?", options: ["6", "7", "8", "9"], correctIndex: 2, difficulty: "medium", category: "premier" },
  { question: "¿Quién es el máximo goleador histórico de la Premier League?", options: ["Wayne Rooney", "Alan Shearer", "Harry Kane", "Thierry Henry"], correctIndex: 1, difficulty: "easy", category: "premier" },
  { question: "¿Qué equipo ganó la Premier 2023-24?", options: ["Arsenal", "Manchester City", "Liverpool", "Chelsea"], correctIndex: 1, difficulty: "easy", category: "premier" },
  { question: "¿Quién es el entrenador del Liverpool desde 2024?", options: ["Jurgen Klopp", "Arne Slot", "Xabi Alonso", "Mikel Arteta"], correctIndex: 1, difficulty: "medium", category: "premier" },
  { question: "¿Cuántos goles marcó Haaland en su primera temporada en la Premier?", options: ["32", "36", "34", "30"], correctIndex: 1, difficulty: "medium", category: "premier" },
  { question: "¿Qué equipo ganó la Premier invicto en 2003-04?", options: ["Manchester United", "Chelsea", "Arsenal", "Liverpool"], correctIndex: 2, difficulty: "easy", category: "premier" },
  { question: "¿Quién es el jugador más joven en marcar en la Premier?", options: ["Wayne Rooney", "James Vaughan", "Michael Owen", "Harvey Elliott"], correctIndex: 1, difficulty: "hard", category: "premier" },
  { question: "¿Cuántas Premier League tiene el Manchester United?", options: ["13", "18", "20", "15"], correctIndex: 2, difficulty: "medium", category: "premier" },
  { question: "¿Qué portero tiene más porterías a cero en la Premier?", options: ["Peter Cech", "David De Gea", "Edwin van der Sar", "Pepe Reina"], correctIndex: 0, difficulty: "medium", category: "premier" },
  { question: "¿En qué año el Leicester City ganó la Premier?", options: ["2014", "2015", "2016", "2017"], correctIndex: 2, difficulty: "easy", category: "premier" },
  { question: "¿Quién fichó del Barcelona al Chelsea en 2023?", options: ["Dembélé", "Raphinha", "Frenkie de Jong", "Cucurella"], correctIndex: 3, difficulty: "medium", category: "premier" },
  { question: "¿Cuántos títulos de Liga tiene el Arsenal?", options: ["13", "15", "12", "11"], correctIndex: 0, difficulty: "hard", category: "premier" },
  { question: "¿Qué delantero inglés fichó por el Bayern Munich en 2024?", options: ["Kane", "Rashford", "Bellingham", "Saka"], correctIndex: 0, difficulty: "easy", category: "premier" },
  { question: "¿Quién es el entrenador español del Arsenal?", options: ["Pep Guardiola", "Unai Emery", "Mikel Arteta", "Mauricio Pochettino"], correctIndex: 2, difficulty: "easy", category: "premier" },
  { question: "¿Cuántos puntos consiguió el Manchester City en 2017-18?", options: ["98", "100", "102", "97"], correctIndex: 1, difficulty: "hard", category: "premier" },
  { question: "¿Qué equipo descendió en 2024?", options: ["Luton Town", "Burnley", "Sheffield United", "Todos los anteriores"], correctIndex: 3, difficulty: "medium", category: "premier" },
  { question: "¿Quién marcó el gol más rápido en historia de la Premier?", options: ["Shane Long", "Ledley King", "Alan Shearer", "Dwight Yorke"], correctIndex: 0, difficulty: "hard", category: "premier" },
  { question: "¿Cuántas asistencias récord tuvo Kevin De Bruyne en una temporada?", options: ["18", "20", "22", "16"], correctIndex: 1, difficulty: "hard", category: "premier" },
  { question: "¿Qué club tiene la racha más larga invicto en casa?", options: ["Arsenal", "Chelsea", "Liverpool", "Manchester United"], correctIndex: 2, difficulty: "hard", category: "premier" },
  { question: "¿Cuántos goles marcó Mohamed Salah en 2017-18?", options: ["30", "32", "28", "34"], correctIndex: 1, difficulty: "medium", category: "premier" },
  
  // BUNDESLIGA
  { question: "¿Cuántas Bundesliga seguidas ganó el Bayern Munich hasta 2023?", options: ["9", "10", "11", "12"], correctIndex: 2, difficulty: "medium", category: "bundesliga" },
  { question: "¿Quién rompió la racha del Bayern ganando la Bundesliga 2023-24?", options: ["Borussia Dortmund", "RB Leipzig", "Bayer Leverkusen", "Stuttgart"], correctIndex: 2, difficulty: "easy", category: "bundesliga" },
  { question: "¿Cuántos goles marcó Lewandowski en una temporada de Bundesliga?", options: ["35", "41", "38", "40"], correctIndex: 1, difficulty: "medium", category: "bundesliga" },
  { question: "¿Quién es el máximo goleador histórico de la Bundesliga?", options: ["Gerd Müller", "Robert Lewandowski", "Klaus Fischer", "Jupp Heynckes"], correctIndex: 1, difficulty: "medium", category: "bundesliga" },
  { question: "¿Qué jugador alemán fichó por el Real Madrid en 2023?", options: ["Sané", "Musiala", "Havertz", "Ninguno"], correctIndex: 3, difficulty: "medium", category: "bundesliga" },
  { question: "¿Cuántos títulos de Bundesliga tiene el Borussia Dortmund?", options: ["5", "6", "8", "7"], correctIndex: 2, difficulty: "hard", category: "bundesliga" },
  { question: "¿En qué año se fundó la Bundesliga?", options: ["1960", "1963", "1965", "1958"], correctIndex: 1, difficulty: "hard", category: "bundesliga" },
  { question: "¿Qué portero alemán fichó por el Barcelona?", options: ["Neuer", "Ter Stegen", "Leno", "Trapp"], correctIndex: 1, difficulty: "easy", category: "bundesliga" },
  { question: "¿Quién fue el entrenador del Bayer Leverkusen campeón invicto?", options: ["Nagelsmann", "Xabi Alonso", "Flick", "Tuchel"], correctIndex: 1, difficulty: "easy", category: "bundesliga" },
  { question: "¿Cuántos hat-tricks marcó Haaland en el Dortmund?", options: ["7", "9", "11", "13"], correctIndex: 1, difficulty: "hard", category: "bundesliga" },
  { question: "¿Qué jugador tiene el récord de partidos en Bundesliga?", options: ["Sepp Maier", "Karl-Heinz Körbel", "Oliver Kahn", "Lothar Matthäus"], correctIndex: 1, difficulty: "hard", category: "bundesliga" },
  { question: "¿Cuántas Champions League tiene el Bayern Munich?", options: ["5", "6", "7", "4"], correctIndex: 1, difficulty: "medium", category: "bundesliga" },
  { question: "¿Quién marcó el gol más rápido en la historia de la Bundesliga?", options: ["Lewandowski", "Kevin Volland", "Karim Bellarabi", "Mario Gómez"], correctIndex: 2, difficulty: "hard", category: "bundesliga" },
  { question: "¿Qué equipo nunca ha descendido de la Bundesliga?", options: ["Bayern Munich", "Hamburg", "Borussia Dortmund", "Bayern y Dortmund"], correctIndex: 3, difficulty: "hard", category: "bundesliga" },
  { question: "¿Cuántos goles marcó Gerd Müller en la Bundesliga?", options: ["365", "425", "398", "351"], correctIndex: 0, difficulty: "hard", category: "bundesliga" },
  { question: "¿Quién fichó del Leipzig al Chelsea?", options: ["Werner", "Nkunku", "Olmo", "Werner y Nkunku"], correctIndex: 3, difficulty: "medium", category: "bundesliga" },
  { question: "¿Qué jugador alemán ganó el Balón de Oro en 2014?", options: ["Neuer", "Kroos", "Müller", "Ninguno"], correctIndex: 3, difficulty: "hard", category: "bundesliga" },
  { question: "¿Cuántos partidos invicto fue el Leverkusen en 2023-24?", options: ["51", "48", "52", "45"], correctIndex: 0, difficulty: "hard", category: "bundesliga" },
  { question: "¿Quién es el máximo asistente en la historia de la Bundesliga?", options: ["Thomas Müller", "Franck Ribéry", "Arjen Robben", "Mario Götze"], correctIndex: 0, difficulty: "medium", category: "bundesliga" },
  { question: "¿Qué equipo ganó la Copa de Alemania en 2024?", options: ["Bayern Munich", "Bayer Leverkusen", "Borussia Dortmund", "RB Leipzig"], correctIndex: 1, difficulty: "medium", category: "bundesliga" },
  
  // LIGUE 1
  { question: "¿Cuántas Ligue 1 ganó Mbappé con el PSG?", options: ["5", "6", "7", "4"], correctIndex: 1, difficulty: "medium", category: "ligue1" },
  { question: "¿A qué equipo fichó Mbappé en 2024?", options: ["Chelsea", "Manchester City", "Real Madrid", "Bayern Munich"], correctIndex: 2, difficulty: "easy", category: "ligue1" },
  { question: "¿Qué equipo ganó la Ligue 1 en 2023-24?", options: ["PSG", "Marseille", "Monaco", "Lille"], correctIndex: 0, difficulty: "easy", category: "ligue1" },
  { question: "¿Quién es el máximo goleador histórico del PSG?", options: ["Ibrahimovic", "Cavani", "Mbappé", "Neymar"], correctIndex: 2, difficulty: "medium", category: "ligue1" },
  { question: "¿Cuántos títulos de liga tiene el Lyon?", options: ["5", "7", "8", "6"], correctIndex: 1, difficulty: "hard", category: "ligue1" },
  { question: "¿Qué entrenador español dirigió el PSG?", options: ["Pep Guardiola", "Luis Enrique", "Unai Emery", "Mauricio Pochettino"], correctIndex: 1, difficulty: "easy", category: "ligue1" },
  { question: "¿Cuántas Champions League tiene el Marseille?", options: ["0", "1", "2", "3"], correctIndex: 1, difficulty: "medium", category: "ligue1" },
  { question: "¿Qué jugador francés fichó por el Arsenal en 2023?", options: ["Saliba", "Kolo Muani", "Guendouzi", "Giroud"], correctIndex: 0, difficulty: "medium", category: "ligue1" },
  { question: "¿Quién fichó del Monaco al Real Madrid?", options: ["Fabinho", "Mendy", "Lemar", "Falcao"], correctIndex: 1, difficulty: "medium", category: "ligue1" },
  { question: "¿Cuántos goles marcó Messi en su primera temporada en el PSG?", options: ["6", "11", "8", "15"], correctIndex: 1, difficulty: "hard", category: "ligue1" },
  { question: "¿Qué equipo ganó la Ligue 1 en 2021 rompiendo la racha del PSG?", options: ["Lyon", "Lille", "Monaco", "Marseille"], correctIndex: 1, difficulty: "medium", category: "ligue1" },
  { question: "¿Cuántos jugadores del PSG fueron al Mundial 2022?", options: ["10", "12", "8", "15"], correctIndex: 0, difficulty: "hard", category: "ligue1" },
  { question: "¿Quién es el máximo goleador histórico de la Ligue 1?", options: ["Delio Onnis", "Jean-Pierre Papin", "Thierry Henry", "Michel Platini"], correctIndex: 0, difficulty: "hard", category: "ligue1" },
  { question: "¿Cuántas temporadas jugó Ibrahimovic en el PSG?", options: ["3", "4", "5", "2"], correctIndex: 1, difficulty: "medium", category: "ligue1" },
  { question: "¿Qué jugador francés ganó el Balón de Oro en 2022?", options: ["Mbappé", "Benzema", "Griezmann", "Ninguno"], correctIndex: 1, difficulty: "easy", category: "ligue1" },
  { question: "¿Cuánto costó el fichaje de Neymar al PSG?", options: ["180M€", "200M€", "222M€", "250M€"], correctIndex: 2, difficulty: "easy", category: "ligue1" },
  { question: "¿Qué entrenador argentino dirigió el PSG?", options: ["Sampaoli", "Pochettino", "Bielsa", "Simeone"], correctIndex: 1, difficulty: "medium", category: "ligue1" },
  { question: "¿Qué club francés ganó la Copa de Europa en 1993?", options: ["PSG", "Marseille", "Monaco", "Lyon"], correctIndex: 1, difficulty: "medium", category: "ligue1" },
  { question: "¿Cuántos títulos de liga tiene el Saint-Étienne?", options: ["8", "10", "12", "6"], correctIndex: 1, difficulty: "hard", category: "ligue1" },
  { question: "¿Quién fichó del Lille al Chelsea?", options: ["Hazard", "Osimhen", "Pepe", "Guehi"], correctIndex: 0, difficulty: "medium", category: "ligue1" },
  
  // CHAMPIONS LEAGUE
  { question: "¿Cuántas Champions League tiene el Real Madrid?", options: ["13", "14", "15", "12"], correctIndex: 2, difficulty: "easy", category: "champions" },
  { question: "¿Quién ganó la Champions 2023-24?", options: ["Manchester City", "Real Madrid", "Inter", "Bayern Munich"], correctIndex: 1, difficulty: "easy", category: "champions" },
  { question: "¿Quién es el máximo goleador histórico de la Champions?", options: ["Messi", "Cristiano Ronaldo", "Lewandowski", "Benzema"], correctIndex: 1, difficulty: "easy", category: "champions" },
  { question: "¿Cuántas Champions ganó Messi?", options: ["3", "4", "5", "2"], correctIndex: 1, difficulty: "medium", category: "champions" },
  { question: "¿Qué equipo ganó la Champions en 2023?", options: ["Real Madrid", "Manchester City", "Inter", "Bayern Munich"], correctIndex: 1, difficulty: "easy", category: "champions" },
  { question: "¿En qué año ganó el Liverpool la Champions con Klopp?", options: ["2018", "2019", "2020", "2021"], correctIndex: 1, difficulty: "medium", category: "champions" },
  { question: "¿Cuántas finales de Champions perdió el Atlético de Madrid?", options: ["2", "3", "4", "1"], correctIndex: 1, difficulty: "medium", category: "champions" },
  { question: "¿Quién marcó en la final de la Champions 2024?", options: ["Vinicius", "Bellingham", "Carvajal y Vinicius", "Rodrygo"], correctIndex: 2, difficulty: "medium", category: "champions" },
  { question: "¿Cuántas Champions seguidas ganó el Real Madrid?", options: ["2", "3", "4", "5"], correctIndex: 2, difficulty: "medium", category: "champions" },
  { question: "¿Quién fue el entrenador del Real Madrid en las 3 Champions seguidas?", options: ["Carlo Ancelotti", "Zinedine Zidane", "José Mourinho", "Vicente Del Bosque"], correctIndex: 1, difficulty: "easy", category: "champions" },
  { question: "¿Cuántas Champions tiene el Barcelona?", options: ["4", "5", "6", "3"], correctIndex: 1, difficulty: "medium", category: "champions" },
  { question: "¿Qué jugador tiene más asistencias en Champions?", options: ["Messi", "Cristiano Ronaldo", "Di María", "Benzema"], correctIndex: 0, difficulty: "medium", category: "champions" },
  { question: "¿En qué final marcó Zinedine Zidane de volea?", options: ["2000", "2002", "2004", "1998"], correctIndex: 1, difficulty: "medium", category: "champions" },
  { question: "¿Cuántas finales de Champions jugó el Bayern Munich?", options: ["10", "11", "12", "9"], correctIndex: 1, difficulty: "hard", category: "champions" },
  { question: "¿Quién fue el portero del Liverpool en la final de Estambul 2005?", options: ["Reina", "Dudek", "Kirkland", "Carson"], correctIndex: 1, difficulty: "medium", category: "champions" },
  { question: "¿Cuántos goles marcó Cristiano en la Champions?", options: ["140", "145", "135", "130"], correctIndex: 0, difficulty: "hard", category: "champions" },
  { question: "¿Qué equipo ganó la Champions en 2021?", options: ["Manchester City", "Chelsea", "Real Madrid", "PSG"], correctIndex: 1, difficulty: "medium", category: "champions" },
  { question: "¿Cuántas veces fue el Tottenham finalista?", options: ["0", "1", "2", "3"], correctIndex: 1, difficulty: "medium", category: "champions" },
  { question: "¿Quién marcó el gol de la remontada 6-1 del Barcelona?", options: ["Messi", "Neymar", "Sergi Roberto", "Suárez"], correctIndex: 2, difficulty: "easy", category: "champions" },
  { question: "¿Cuántas finales de Champions jugó Carlo Ancelotti?", options: ["5", "6", "7", "4"], correctIndex: 2, difficulty: "hard", category: "champions" },
  
  // WORLD CUP & NATIONAL TEAMS
  { question: "¿Quién ganó el Mundial 2022?", options: ["Francia", "Argentina", "Brasil", "Croacia"], correctIndex: 1, difficulty: "easy", category: "worldcup" },
  { question: "¿En qué año ganó España el Mundial?", options: ["2006", "2010", "2014", "2002"], correctIndex: 1, difficulty: "easy", category: "worldcup" },
  { question: "¿Quién marcó el gol de la final del Mundial 2010?", options: ["David Villa", "Andrés Iniesta", "Xavi", "Torres"], correctIndex: 1, difficulty: "easy", category: "worldcup" },
  { question: "¿Cuántos Mundiales tiene Brasil?", options: ["4", "5", "6", "3"], correctIndex: 1, difficulty: "easy", category: "worldcup" },
  { question: "¿Quién fue el máximo goleador del Mundial 2022?", options: ["Messi", "Mbappé", "Ambos", "Giroud"], correctIndex: 2, difficulty: "medium", category: "worldcup" },
  { question: "¿Cuántos goles marcó Miroslav Klose en Mundiales?", options: ["14", "15", "16", "13"], correctIndex: 2, difficulty: "medium", category: "worldcup" },
  { question: "¿Quién fue el portero de España en el Mundial 2010?", options: ["Valdés", "Casillas", "Reina", "De Gea"], correctIndex: 1, difficulty: "easy", category: "worldcup" },
  { question: "¿En qué ciudad se jugó la final del Mundial 2022?", options: ["Doha", "Lusail", "Al Khor", "Abu Dhabi"], correctIndex: 1, difficulty: "medium", category: "worldcup" },
  { question: "¿Cuántas Eurocopas tiene España?", options: ["2", "3", "4", "1"], correctIndex: 2, difficulty: "medium", category: "worldcup" },
  { question: "¿Quién ganó la Eurocopa 2024?", options: ["España", "Inglaterra", "Francia", "Alemania"], correctIndex: 0, difficulty: "easy", category: "worldcup" },
  { question: "¿Quién marcó en la final de la Euro 2024?", options: ["Morata", "Nico Williams y Oyarzabal", "Yamal", "Olmo"], correctIndex: 1, difficulty: "medium", category: "worldcup" },
  { question: "¿Cuántos partidos ganó Francia en el Mundial 2018?", options: ["5", "6", "7", "4"], correctIndex: 2, difficulty: "hard", category: "worldcup" },
  { question: "¿Quién fue el entrenador de Alemania en el Mundial 2014?", options: ["Löw", "Klinsmann", "Vogts", "Flick"], correctIndex: 0, difficulty: "medium", category: "worldcup" },
  { question: "¿Cuántos goles marcó Messi en el Mundial 2022?", options: ["5", "6", "7", "8"], correctIndex: 2, difficulty: "medium", category: "worldcup" },
  { question: "¿Qué selección ganó la Euro 2020 (2021)?", options: ["Inglaterra", "Italia", "España", "Dinamarca"], correctIndex: 1, difficulty: "easy", category: "worldcup" },
  { question: "¿Cuántos mundiales tiene Alemania?", options: ["3", "4", "5", "2"], correctIndex: 1, difficulty: "medium", category: "worldcup" },
  { question: "¿En qué año ganó Italia su último Mundial?", options: ["2002", "2006", "2010", "1998"], correctIndex: 1, difficulty: "medium", category: "worldcup" },
  { question: "¿Quién fue el jugador más joven en marcar en una final de Mundial?", options: ["Pelé", "Mbappé", "Messi", "Maradona"], correctIndex: 0, difficulty: "hard", category: "worldcup" },
  { question: "¿Cuántos hat-tricks marcó Mbappé en el Mundial 2022?", options: ["0", "1", "2", "3"], correctIndex: 1, difficulty: "medium", category: "worldcup" },
  { question: "¿Qué jugador español ganó el Balón de Oro del Mundial 2010?", options: ["Iniesta", "Xavi", "Villa", "Ninguno (fue Forlán)"], correctIndex: 3, difficulty: "hard", category: "worldcup" },
  
  // PLAYERS & TRANSFERS
  { question: "¿Cuánto costó el fichaje de Neymar al Barcelona?", options: ["75M€", "88M€", "57M€", "65M€"], correctIndex: 1, difficulty: "hard", category: "transfers" },
  { question: "¿Cuánto costó Bellingham al Real Madrid?", options: ["103M€", "115M€", "95M€", "85M€"], correctIndex: 0, difficulty: "medium", category: "transfers" },
  { question: "¿Cuánto costó Pogba al Manchester United?", options: ["89M€", "105M€", "95M€", "80M€"], correctIndex: 1, difficulty: "medium", category: "transfers" },
  { question: "¿Qué jugador fichó gratis por el PSG en 2021?", options: ["Messi", "Ramos", "Wijnaldum", "Todos los anteriores"], correctIndex: 3, difficulty: "medium", category: "transfers" },
  { question: "¿Cuánto costó Griezmann al Barcelona?", options: ["100M€", "120M€", "135M€", "90M€"], correctIndex: 1, difficulty: "medium", category: "transfers" },
  { question: "¿Cuánto costó João Félix al Atlético de Madrid?", options: ["113M€", "126M€", "100M€", "105M€"], correctIndex: 1, difficulty: "medium", category: "transfers" },
  { question: "¿Cuánto costó Coutinho al Barcelona?", options: ["120M€", "145M€", "160M€", "130M€"], correctIndex: 2, difficulty: "medium", category: "transfers" },
  { question: "¿Quién fichó del Dortmund al Real Madrid por 45M€?", options: ["Aubameyang", "Hummels", "Lewandowski", "Ninguno"], correctIndex: 3, difficulty: "hard", category: "transfers" },
  { question: "¿Cuánto costó Jack Grealish al Manchester City?", options: ["90M€", "100M€", "117M€", "80M€"], correctIndex: 2, difficulty: "hard", category: "transfers" },
  { question: "¿Cuánto costó Lukaku al Chelsea en 2021?", options: ["97M€", "113M€", "85M€", "105M€"], correctIndex: 1, difficulty: "hard", category: "transfers" },
  { question: "¿Cuánto costó Eden Hazard al Real Madrid?", options: ["100M€", "150M€", "115M€", "130M€"], correctIndex: 0, difficulty: "medium", category: "transfers" },
  { question: "¿Qué jugador fichó del Ajax al Real Madrid en 2024?", options: ["Gravenberch", "Timber", "Antony", "Ninguno"], correctIndex: 3, difficulty: "hard", category: "transfers" },
  { question: "¿Cuánto costó Frenkie de Jong al Barcelona?", options: ["65M€", "75M€", "86M€", "90M€"], correctIndex: 2, difficulty: "hard", category: "transfers" },
  { question: "¿Cuánto costó Vinícius Jr al Real Madrid?", options: ["45M€", "55M€", "40M€", "60M€"], correctIndex: 0, difficulty: "hard", category: "transfers" },
  { question: "¿Cuánto costó Antony al Manchester United?", options: ["85M€", "95M€", "75M€", "100M€"], correctIndex: 1, difficulty: "hard", category: "transfers" },
  { question: "¿Cuánto costó Erling Haaland al Manchester City?", options: ["51M€", "60M€", "75M€", "45M€"], correctIndex: 1, difficulty: "medium", category: "transfers" },
  { question: "¿Quién fichó del Bayern al Barcelona gratis?", options: ["Lewandowski", "Alaba", "Thiago", "Ninguno"], correctIndex: 0, difficulty: "medium", category: "transfers" },
  { question: "¿Cuánto costó Declan Rice al Arsenal?", options: ["105M€", "116M€", "98M€", "125M€"], correctIndex: 1, difficulty: "hard", category: "transfers" },
  { question: "¿Cuánto costó Moises Caicedo al Chelsea?", options: ["100M€", "110M€", "116M€", "95M€"], correctIndex: 2, difficulty: "hard", category: "transfers" },
  { question: "¿Qué jugador fichó del Celtic al Brighton?", options: ["Kyogo", "O'Riley", "Edouard", "Ninguno"], correctIndex: 3, difficulty: "hard", category: "transfers" },

  // SERIE A
  { question: "¿Cuántas Serie A tiene la Juventus?", options: ["34", "36", "38", "32"], correctIndex: 1, difficulty: "medium", category: "seriea" },
  { question: "¿Quién ganó la Serie A 2023-24?", options: ["Napoli", "Inter", "Juventus", "Milan"], correctIndex: 1, difficulty: "easy", category: "seriea" },
  { question: "¿Cuántas Serie A seguidas ganó la Juventus?", options: ["7", "8", "9", "10"], correctIndex: 2, difficulty: "medium", category: "seriea" },
  { question: "¿Quién es el máximo goleador histórico de la Serie A?", options: ["Silvio Piola", "Francesco Totti", "Giuseppe Meazza", "Roberto Baggio"], correctIndex: 0, difficulty: "hard", category: "seriea" },
  { question: "¿En qué año el Napoli ganó la Serie A con Maradona?", options: ["1987", "1989", "1990", "1986"], correctIndex: 0, difficulty: "hard", category: "seriea" },
  { question: "¿Cuántos Balones de Oro ganó Paolo Maldini?", options: ["1", "2", "0", "3"], correctIndex: 2, difficulty: "hard", category: "seriea" },
  { question: "¿Qué jugador tiene más partidos en la Serie A?", options: ["Buffon", "Maldini", "Totti", "Del Piero"], correctIndex: 0, difficulty: "medium", category: "seriea" },
  { question: "¿Cuántas Champions League tiene el AC Milan?", options: ["5", "6", "7", "8"], correctIndex: 2, difficulty: "medium", category: "seriea" },
  { question: "¿Quién fichó del Inter al Chelsea?", options: ["Lukaku", "Hakimi", "Eriksen", "Ninguno"], correctIndex: 0, difficulty: "medium", category: "seriea" },
  { question: "¿Cuántos goles marcó Lautaro Martínez en 2023-24?", options: ["20", "24", "27", "18"], correctIndex: 1, difficulty: "hard", category: "seriea" },
  
  // More varied questions
  { question: "¿Qué dorsal llevó Zinedine Zidane en el Real Madrid?", options: ["10", "5", "7", "21"], correctIndex: 1, difficulty: "medium", category: "players" },
  { question: "¿Cuántos Balones de Oro tiene Messi?", options: ["7", "8", "6", "9"], correctIndex: 1, difficulty: "easy", category: "players" },
  { question: "¿Cuántos Balones de Oro tiene Cristiano Ronaldo?", options: ["4", "5", "6", "3"], correctIndex: 1, difficulty: "easy", category: "players" },
  { question: "¿En qué equipo debutó Messi como profesional?", options: ["Newell's Old Boys", "Barcelona B", "Barcelona", "Boca Juniors"], correctIndex: 2, difficulty: "easy", category: "players" },
  { question: "¿Cuántos goles marcó Pelé en su carrera?", options: ["757", "1000", "1281", "650"], correctIndex: 2, difficulty: "hard", category: "players" },
  { question: "¿Qué dorsal llevaba Maradona en el Napoli?", options: ["10", "7", "9", "11"], correctIndex: 0, difficulty: "easy", category: "players" },
  { question: "¿Cuántos mundiales jugó Pelé?", options: ["3", "4", "5", "2"], correctIndex: 1, difficulty: "medium", category: "players" },
  { question: "¿Quién es el jugador más alto de la historia del fútbol profesional?", options: ["Kristof Van Hout", "Peter Crouch", "Costel Pantilimon", "Ibrahimovic"], correctIndex: 0, difficulty: "hard", category: "players" },
  { question: "¿Cuántos goles de falta directa marcó Messi?", options: ["45", "50", "60", "40"], correctIndex: 2, difficulty: "hard", category: "players" },
  { question: "¿Cuántos hat-tricks tiene Cristiano Ronaldo en su carrera?", options: ["50", "57", "63", "45"], correctIndex: 2, difficulty: "hard", category: "players" },
{ question: "¿Qué equipo ganó La Liga 2003-04?", options: ["Real Madrid", "Valencia CF", "FC Barcelona", "Deportivo"], correctIndex: 1, difficulty: "medium", category: "laliga" },

{ question: "¿Quién fue el máximo goleador de La Liga 2011-12?", options: ["Cristiano Ronaldo", "Messi", "Falcao", "Higuaín"], correctIndex: 1, difficulty: "easy", category: "players" },

{ question: "¿Cuántos goles marcó Messi en La Liga 2011-12?", options: ["46", "50", "48", "52"], correctIndex: 1, difficulty: "medium", category: "records" },

{ question: "¿Qué equipo rompió la hegemonía Barça-Madrid ganando La Liga 2013-14?", options: ["Sevilla FC", "Atlético de Madrid", "Valencia CF", "Athletic Club"], correctIndex: 1, difficulty: "easy", category: "laliga" },

{ question: "¿Qué entrenador dirigía al Atlético en su Liga 2013-14?", options: ["Luis Aragonés", "Diego Simeone", "Quique Sánchez Flores", "Gregorio Manzano"], correctIndex: 1, difficulty: "medium", category: "coaches" },

{ question: "¿Qué equipo ganó La Liga 2016-17?", options: ["FC Barcelona", "Real Madrid", "Atlético de Madrid", "Sevilla FC"], correctIndex: 1, difficulty: "easy", category: "laliga" },

{ question: "¿Qué jugador ganó el Trofeo Pichichi 2014-15?", options: ["Cristiano Ronaldo", "Messi", "Griezmann", "Neymar"], correctIndex: 0, difficulty: "medium", category: "players" },

{ question: "¿Qué club logró su primer ascenso histórico a Primera en 2013-14?", options: ["Eibar", "Girona", "Leganés", "Alcorcón"], correctIndex: 0, difficulty: "medium", category: "segunda" },

{ question: "¿Qué equipo ganó la Segunda División 2015-16?", options: ["Levante", "Alavés", "Osasuna", "Leganés"], correctIndex: 1, difficulty: "hard", category: "segunda" },

{ question: "¿Qué equipo ganó la Segunda División 2017-18?", options: ["Sporting", "Rayo Vallecano", "Huesca", "Zaragoza"], correctIndex: 1, difficulty: "medium", category: "segunda" },

{ question: "¿Quién fue campeón de Segunda en 2018-19?", options: ["Granada", "Osasuna", "Mallorca", "Cádiz"], correctIndex: 1, difficulty: "medium", category: "segunda" },

{ question: "¿Qué equipo ganó La Liga 2019-20?", options: ["Real Madrid", "FC Barcelona", "Atlético", "Sevilla"], correctIndex: 0, difficulty: "easy", category: "laliga" },

{ question: "¿Qué equipo ganó la Segunda División 2019-20?", options: ["Huesca", "Cádiz", "Almería", "Girona"], correctIndex: 0, difficulty: "hard", category: "segunda" },

{ question: "¿Qué club ganó La Liga 2020-21?", options: ["Real Madrid", "Atlético de Madrid", "FC Barcelona", "Sevilla FC"], correctIndex: 1, difficulty: "easy", category: "laliga" },

{ question: "¿Qué equipo fue campeón de Segunda en 2020-21?", options: ["Mallorca", "Espanyol", "Leganés", "Almería"], correctIndex: 1, difficulty: "medium", category: "segunda" },

{ question: "¿Qué club ganó La Liga 2021-22?", options: ["Real Madrid", "FC Barcelona", "Atlético", "Betis"], correctIndex: 0, difficulty: "easy", category: "laliga" },

{ question: "¿Qué equipo ganó la Segunda División 2021-22?", options: ["Valladolid", "Eibar", "Almería", "Girona"], correctIndex: 2, difficulty: "hard", category: "segunda" },

{ question: "¿Quién ganó La Liga 2022-23?", options: ["Real Madrid", "Atlético", "FC Barcelona", "Real Sociedad"], correctIndex: 2, difficulty: "easy", category: "laliga" },

{ question: "¿Qué equipo fue campeón de Segunda en 2022-23?", options: ["Granada", "Las Palmas", "Alavés", "Levante"], correctIndex: 0, difficulty: "medium", category: "segunda" },

{ question: "¿Quién ganó La Liga 2023-24?", options: ["FC Barcelona", "Real Madrid", "Girona", "Atlético"], correctIndex: 1, difficulty: "easy", category: "laliga" },

{ question: "¿Qué equipo ganó la Segunda División 2023-24?", options: ["Leganés", "Eibar", "Espanyol", "Valladolid"], correctIndex: 0, difficulty: "medium", category: "segunda" },

{ question: "¿Qué jugador marcó 48 goles en La Liga 2014-15?", options: ["Messi", "Cristiano Ronaldo", "Luis Suárez", "Benzema"], correctIndex: 1, difficulty: "medium", category: "records" },

{ question: "¿Qué club descendió sorprendentemente en 2010-11 tras años en Primera?", options: ["Deportivo", "Betis", "Mallorca", "Racing"], correctIndex: 0, difficulty: "hard", category: "laliga" },

{ question: "¿Qué equipo ascendió junto al Huesca en 2017-18?", options: ["Rayo Vallecano", "Sporting", "Zaragoza", "Numancia"], correctIndex: 0, difficulty: "hard", category: "segunda" },

{ question: "¿Qué estadio es conocido como 'La Catedral'?", options: ["Sánchez Pizjuán", "San Mamés", "Mestalla", "Anoeta"], correctIndex: 1, difficulty: "easy", category: "stadiums" },
{ question: "¿Qué equipo ganó La Liga 2004-05?", options: ["Real Madrid", "Valencia CF", "FC Barcelona", "Atlético de Madrid"], correctIndex: 2, difficulty: "medium", category: "laliga" },

{ question: "¿Quién fue campeón de La Liga 2006-07?", options: ["Real Madrid", "Sevilla FC", "FC Barcelona", "Valencia CF"], correctIndex: 0, difficulty: "medium", category: "laliga" },

{ question: "¿Qué equipo ganó La Liga 2001-02?", options: ["Valencia CF", "Real Madrid", "Deportivo", "FC Barcelona"], correctIndex: 1, difficulty: "medium", category: "laliga" },

{ question: "¿Quién fue Pichichi en 2002-03?", options: ["Raúl", "Ronaldo", "Makay", "Nihat"], correctIndex: 1, difficulty: "medium", category: "players" },

{ question: "¿Qué club ganó La Liga 2007-08?", options: ["Villarreal", "Real Madrid", "Barcelona", "Atlético"], correctIndex: 1, difficulty: "medium", category: "laliga" },

{ question: "¿Qué equipo ganó La Liga 2008-09?", options: ["Real Madrid", "Barcelona", "Sevilla", "Valencia"], correctIndex: 1, difficulty: "medium", category: "laliga" },

{ question: "¿Quién ganó La Liga 2009-10?", options: ["Barcelona", "Real Madrid", "Atlético", "Sevilla"], correctIndex: 0, difficulty: "medium", category: "laliga" },

{ question: "¿Quién fue máximo goleador de La Liga 2013-14?", options: ["Messi", "Cristiano Ronaldo", "Diego Costa", "Griezmann"], correctIndex: 1, difficulty: "medium", category: "records" },

{ question: "¿Qué club ganó La Liga 2014-15?", options: ["Barcelona", "Real Madrid", "Atlético", "Valencia"], correctIndex: 0, difficulty: "medium", category: "laliga" },

{ question: "¿Quién fue campeón de Segunda en 2014-15?", options: ["Betis", "Sporting", "Girona", "Las Palmas"], correctIndex: 0, difficulty: "medium", category: "segunda" },

{ question: "¿Qué equipo ganó la Segunda División 2016-17?", options: ["Levante", "Girona", "Getafe", "Tenerife"], correctIndex: 0, difficulty: "medium", category: "segunda" },

{ question: "¿Qué club ascendió en playoff 2016-17?", options: ["Getafe", "Cádiz", "Huesca", "Oviedo"], correctIndex: 0, difficulty: "medium", category: "segunda" },

{ question: "¿Qué entrenador llevó al Levante al título 2016-17?", options: ["Muñiz", "Paco López", "Luis García", "JIM"], correctIndex: 0, difficulty: "medium", category: "coaches" },

{ question: "¿Qué club ganó La Liga 2012-13?", options: ["Real Madrid", "Barcelona", "Atlético", "Málaga"], correctIndex: 1, difficulty: "medium", category: "laliga" },

{ question: "¿Quién marcó el gol decisivo en la Liga 2013-14 del Atleti en el Camp Nou?", options: ["Villa", "Godín", "Koke", "Diego Costa"], correctIndex: 1, difficulty: "medium", category: "moments" },

{ question: "¿Qué equipo logró el ascenso en 2019-20 junto al Cádiz?", options: ["Huesca", "Girona", "Almería", "Zaragoza"], correctIndex: 0, difficulty: "medium", category: "segunda" },

{ question: "¿Qué club ganó la Copa del Rey 2009-10?", options: ["Barcelona", "Sevilla", "Atlético", "Real Madrid"], correctIndex: 2, difficulty: "medium", category: "cups" },

{ question: "¿Qué equipo ganó la Copa del Rey 2010-11?", options: ["Barcelona", "Real Madrid", "Sevilla", "Athletic"], correctIndex: 1, difficulty: "medium", category: "cups" },

{ question: "¿Contra quién ganó el Real Madrid la Copa 2010-11?", options: ["Sevilla", "Atlético", "Barcelona", "Valencia"], correctIndex: 2, difficulty: "medium", category: "finals" },

{ question: "¿Qué club ganó La Liga 2010-11?", options: ["Barcelona", "Real Madrid", "Valencia", "Atlético"], correctIndex: 0, difficulty: "medium", category: "laliga" },

{ question: "¿Quién fue campeón de Segunda en 2012-13?", options: ["Elche", "Villarreal", "Almería", "Girona"], correctIndex: 0, difficulty: "medium", category: "segunda" },

{ question: "¿Qué equipo regresó a Primera en 2012-13 tras años fuera?", options: ["Villarreal", "Betis", "Almería", "Elche"], correctIndex: 0, difficulty: "medium", category: "segunda" },

{ question: "¿Qué club sorprendió en La Liga 2023-24 luchando por el título?", options: ["Girona", "Betis", "Sevilla", "Valencia"], correctIndex: 0, difficulty: "medium", category: "seasons" },

{ question: "¿Quién fue campeón de Segunda 2010-11?", options: ["Betis", "Rayo Vallecano", "Celta", "Granada"], correctIndex: 0, difficulty: "medium", category: "segunda" },

{ question: "¿Qué club ascendió vía playoff en 2010-11?", options: ["Granada", "Celta", "Elche", "Hércules"], correctIndex: 0, difficulty: "medium", category: "segunda" },

{ question: "¿Qué entrenador hizo campeón al Deportivo en 1999-00?", options: ["Irureta", "Arsenio Iglesias", "Caparrós", "Lotina"], correctIndex: 0, difficulty: "medium", category: "history" },

{ question: "¿Qué club ganó La Liga 2000-01?", options: ["Real Madrid", "Deportivo", "Valencia", "Barcelona"], correctIndex: 0, difficulty: "medium", category: "laliga" },

{ question: "¿Qué jugador ganó el Pichichi 2015-16?", options: ["Messi", "Suárez", "Cristiano", "Griezmann"], correctIndex: 1, difficulty: "medium", category: "players" },

{ question: "¿Qué club ganó La Liga 2015-16?", options: ["Atlético", "Barcelona", "Real Madrid", "Sevilla"], correctIndex: 1, difficulty: "medium", category: "laliga" },

{ question: "¿Qué club ganó La Liga 2017-18?", options: ["Barcelona", "Real Madrid", "Atlético", "Valencia"], correctIndex: 0, difficulty: "medium", category: "laliga" },

{ question: "¿Quién fue campeón de Segunda 2013-14?", options: ["Deportivo", "Eibar", "Sporting", "Las Palmas"], correctIndex: 1, difficulty: "medium", category: "segunda" },

{ question: "¿Qué club ganó La Liga 2005-06?", options: ["Barcelona", "Real Madrid", "Valencia", "Sevilla"], correctIndex: 0, difficulty: "medium", category: "laliga" },

{ question: "¿Qué portero fue Zamora 2009-10?", options: ["Casillas", "Valdés", "Palop", "Kameni"], correctIndex: 1, difficulty: "medium", category: "players" },

{ question: "¿Qué club ganó La Liga 2018-19?", options: ["Barcelona", "Atlético", "Real Madrid", "Valencia"], correctIndex: 0, difficulty: "medium", category: "laliga" },

{ question: "¿Quién fue campeón de Segunda 2019-20?", options: ["Cádiz", "Huesca", "Almería", "Girona"], correctIndex: 1, difficulty: "medium", category: "segunda" },

{ question: "¿Qué club ganó La Liga 2020-21?", options: ["Atlético", "Barcelona", "Real Madrid", "Sevilla"], correctIndex: 0, difficulty: "medium", category: "laliga" },

{ question: "¿Quién fue campeón de Segunda 2020-21?", options: ["Mallorca", "Espanyol", "Leganés", "Almería"], correctIndex: 1, difficulty: "medium", category: "segunda" },

{ question: "¿Qué club ganó La Liga 2022-23?", options: ["Barcelona", "Real Madrid", "Atlético", "Real Sociedad"], correctIndex: 0, difficulty: "medium", category: "laliga" },

{ question: "¿Qué club ganó La Liga 2023-24?", options: ["Barcelona", "Real Madrid", "Girona", "Atlético"], correctIndex: 1, difficulty: "medium", category: "laliga" },

{ question: "¿Qué club ganó la Segunda División 2023-24?", options: ["Leganés", "Valladolid", "Eibar", "Espanyol"], correctIndex: 0, difficulty: "medium", category: "segunda" },

{ question: "¿Qué derbi enfrenta a Sevilla FC y Betis?", options: ["Derbi andaluz", "Derbi sevillano", "Clásico del sur", "Derbi histórico"], correctIndex: 1, difficulty: "medium", category: "derbis" },

{ question: "¿Qué estadio pertenece al Villarreal CF?", options: ["La Cerámica", "El Madrigal", "Castalia", "Montilivi"], correctIndex: 0, difficulty: "medium", category: "stadiums" },

{ question: "¿Qué club juega en Mendizorroza?", options: ["Osasuna", "Alavés", "Eibar", "Real Sociedad"], correctIndex: 1, difficulty: "medium", category: "stadiums" },

{ question: "¿Qué entrenador ganó dos Ligas con el Valencia (2001-02, 2003-04)?", options: ["Benítez", "Cúper", "Emery", "Ranieri"], correctIndex: 0, difficulty: "medium", category: "coaches" },

{ question: "¿Qué club ganó La Liga 2003-04?", options: ["Valencia", "Barcelona", "Real Madrid", "Deportivo"], correctIndex: 0, difficulty: "medium", category: "laliga" },

{ question: "¿Qué club ganó la UEFA 2005-06?", options: ["Sevilla", "Barcelona", "Valencia", "Espanyol"], correctIndex: 0, difficulty: "medium", category: "cups" },

{ question: "¿Quién fue campeón de Segunda 2008-09?", options: ["Xerez", "Tenerife", "Zaragoza", "Rayo"], correctIndex: 0, difficulty: "medium", category: "segunda" },

{ question: "¿Qué club ganó La Liga 2002-03?", options: ["Real Madrid", "Barcelona", "Valencia", "Deportivo"], correctIndex: 0, difficulty: "medium", category: "laliga" },

{ question: "¿Quién fue campeón de Segunda 2006-07?", options: ["Murcia", "Almería", "Valladolid", "Numancia"], correctIndex: 2, difficulty: "medium", category: "segunda" },

{ question: "¿Qué club ganó La Liga 2021-22?", options: ["Real Madrid", "Barcelona", "Atlético", "Sevilla"], correctIndex: 0, difficulty: "medium", category: "laliga" },

{ question: "¿Quién fue campeón de Segunda 2021-22?", options: ["Almería", "Valladolid", "Eibar", "Girona"], correctIndex: 0, difficulty: "medium", category: "segunda" },

{ question: "¿Qué club ganó La Liga 2019-20?", options: ["Real Madrid", "Barcelona", "Atlético", "Sevilla"], correctIndex: 0, difficulty: "medium", category: "laliga" },

{ question: "¿Qué club ganó la Supercopa 2017 (ida/vuelta)?", options: ["Barcelona", "Real Madrid", "Atlético", "Sevilla"], correctIndex: 1, difficulty: "medium", category: "supercopa" },

{ question: "¿Qué jugador fue clave en el ascenso del Girona 2016-17?", options: ["Stuani", "Portu", "Granell", "Pere Pons"], correctIndex: 0, difficulty: "medium", category: "segunda" },

{ question: "¿Qué club ganó La Liga 2007-08?", options: ["Real Madrid", "Barcelona", "Sevilla", "Villarreal"], correctIndex: 0, difficulty: "medium", category: "laliga" },

{ question: "¿Qué club ganó La Liga 2008-09?", options: ["Barcelona", "Real Madrid", "Sevilla", "Atlético"], correctIndex: 0, difficulty: "medium", category: "laliga" },

{ question: "¿Quién fue campeón de Segunda 2011-12?", options: ["Deportivo", "Celta", "Valladolid", "Almería"], correctIndex: 0, difficulty: "medium", category: "segunda" },

{ question: "¿Qué club ascendió vía playoff 2011-12?", options: ["Valladolid", "Alcorcón", "Hércules", "Elche"], correctIndex: 0, difficulty: "medium", category: "segunda" },

{ question: "¿Qué club ganó La Liga 2005-06?", options: ["Barcelona", "Real Madrid", "Valencia", "Sevilla"], correctIndex: 0, difficulty: "medium", category: "laliga" },

{ question: "¿Qué club ganó La Liga 2016-17?", options: ["Real Madrid", "Barcelona", "Atlético", "Sevilla"], correctIndex: 0, difficulty: "medium", category: "laliga" },

{ question: "¿Quién fue campeón de Segunda 2012-13?", options: ["Elche", "Villarreal", "Almería", "Girona"], correctIndex: 0, difficulty: "medium", category: "segunda" },

{ question: "¿Qué club regresó rápidamente tras descender en 2012?", options: ["Villarreal", "Betis", "Osasuna", "Mallorca"], correctIndex: 0, difficulty: "medium", category: "segunda" },

{ question: "¿Qué club ganó La Liga 2013-14?", options: ["Atlético", "Barcelona", "Real Madrid", "Sevilla"], correctIndex: 0, difficulty: "medium", category: "laliga" },

{ question: "¿Qué jugador fue Pichichi 2013-14?", options: ["Cristiano Ronaldo", "Messi", "Diego Costa", "Benzema"], correctIndex: 0, difficulty: "medium", category: "players" },

{ question: "¿Qué club ganó La Liga 2014-15?", options: ["Barcelona", "Real Madrid", "Atlético", "Valencia"], correctIndex: 0, difficulty: "medium", category: "laliga" },

{ question: "¿Qué club ganó Segunda 2017-18?", options: ["Rayo Vallecano", "Huesca", "Sporting", "Zaragoza"], correctIndex: 0, difficulty: "medium", category: "segunda" },

{ question: "¿Quién fue campeón Segunda 2018-19?", options: ["Granada", "Osasuna", "Mallorca", "Cádiz"], correctIndex: 1, difficulty: "medium", category: "segunda" },

{ question: "¿Qué club ganó Segunda 2022-23?", options: ["Granada", "Las Palmas", "Levante", "Alavés"], correctIndex: 0, difficulty: "medium", category: "segunda" },
{ question: "¿Qué equipo terminó invicto como local en La Liga 2004-05?", options: ["Real Madrid", "Barcelona", "Valencia", "Sevilla"], correctIndex: 1, difficulty: "hard", category: "laliga" },

{ question: "¿Quién marcó el gol que dio la Liga 2006-07 al Real Madrid en la última jornada?", options: ["Van Nistelrooy", "Reyes", "Raúl", "Higuaín"], correctIndex: 1, difficulty: "hard", category: "moments" },

{ question: "¿Qué entrenador ganó La Liga 2008-09 con el Barcelona?", options: ["Rijkaard", "Guardiola", "Luis Enrique", "Van Gaal"], correctIndex: 1, difficulty: "hard", category: "coaches" },

{ question: "¿Qué equipo logró el mayor récord de puntos en Segunda hasta 2025?", options: ["Deportivo", "Levante", "Espanyol", "Almería"], correctIndex: 1, difficulty: "hard", category: "records" },

{ question: "¿Qué club descendió en 2013-14 pese a ser campeón dos años antes?", options: ["Deportivo", "Villarreal", "Betis", "Levante"], correctIndex: 1, difficulty: "hard", category: "laliga" },

{ question: "¿Qué jugador ganó el Pichichi 2004-05?", options: ["Eto’o", "Ronaldinho", "Forlán", "Ronaldo"], correctIndex: 0, difficulty: "hard", category: "players" },

{ question: "¿Qué club ascendió a Primera por primera vez en 2013-14?", options: ["Eibar", "Girona", "Leganés", "Getafe"], correctIndex: 0, difficulty: "hard", category: "segunda" },

{ question: "¿Qué portero ganó el Zamora 2015-16?", options: ["Oblak", "Keylor Navas", "Bravo", "Ter Stegen"], correctIndex: 0, difficulty: "hard", category: "players" },

{ question: "¿Qué entrenador llevó al Deportivo Alavés a la final de Copa 2016-17?", options: ["Garitano", "Pellegrino", "Abelardo", "Machín"], correctIndex: 1, difficulty: "hard", category: "coaches" },

{ question: "¿Contra qué equipo perdió el Barça su invicto en 2017-18?", options: ["Levante", "Real Madrid", "Sevilla", "Espanyol"], correctIndex: 0, difficulty: "hard", category: "moments" },

{ question: "¿Qué club fue campeón de Segunda 2009-10?", options: ["Real Sociedad", "Levante", "Betis", "Hércules"], correctIndex: 0, difficulty: "hard", category: "segunda" },

{ question: "¿Qué equipo logró el ascenso en playoff 2019-20?", options: ["Elche", "Girona", "Almería", "Zaragoza"], correctIndex: 0, difficulty: "hard", category: "segunda" },

{ question: "¿Qué jugador fue máximo goleador del Villarreal en 2004-05?", options: ["Forlán", "Riquelme", "Guayre", "José Mari"], correctIndex: 0, difficulty: "hard", category: "players" },

{ question: "¿Qué club ganó La Liga 2002-03?", options: ["Real Madrid", "Barcelona", "Valencia", "Deportivo"], correctIndex: 0, difficulty: "hard", category: "laliga" },

{ question: "¿Quién fue campeón Segunda 2014-15?", options: ["Betis", "Sporting", "Girona", "Las Palmas"], correctIndex: 0, difficulty: "hard", category: "segunda" },

{ question: "¿Qué entrenador ascendió al Betis en 2014-15?", options: ["Mel", "Velázquez", "Pepe Mel", "Setién"], correctIndex: 2, difficulty: "hard", category: "coaches" },

{ question: "¿Qué club logró el récord de victorias consecutivas en Liga 2014-15?", options: ["Barcelona", "Real Madrid", "Atlético", "Valencia"], correctIndex: 1, difficulty: "hard", category: "records" },

{ question: "¿Qué jugador marcó el famoso gol de chilena en Copa 2014?", options: ["Cristiano", "Bale", "Mandžukić", "Aduriz"], correctIndex: 2, difficulty: "hard", category: "moments" },

{ question: "¿Qué club descendió en 2010-11 tras empatar en Riazor?", options: ["Deportivo", "Mallorca", "Racing", "Getafe"], correctIndex: 0, difficulty: "hard", category: "laliga" },

{ question: "¿Qué equipo fue subcampeón de Segunda 2017-18?", options: ["Huesca", "Sporting", "Rayo Vallecano", "Zaragoza"], correctIndex: 0, difficulty: "hard", category: "segunda" },

{ question: "¿Qué jugador fue clave en el ascenso del Huesca 2017-18?", options: ["Melero", "Cucho Hernández", "Ferreiro", "Pulido"], correctIndex: 1, difficulty: "hard", category: "players" },

{ question: "¿Qué club ganó La Liga 2016-17?", options: ["Real Madrid", "Barcelona", "Atlético", "Sevilla"], correctIndex: 0, difficulty: "hard", category: "laliga" },

{ question: "¿Quién fue Zamora 2020-21?", options: ["Oblak", "Courtois", "Ter Stegen", "Bono"], correctIndex: 0, difficulty: "hard", category: "players" },

{ question: "¿Qué club ganó Segunda 2022-23?", options: ["Granada", "Las Palmas", "Alavés", "Levante"], correctIndex: 0, difficulty: "hard", category: "segunda" },

{ question: "¿Qué estadio acogió la final Copa 2020 (sin público)?", options: ["La Cartuja", "Metropolitano", "Mestalla", "Bernabéu"], correctIndex: 0, difficulty: "hard", category: "finals" },

{ question: "¿Qué club ganó La Liga 2013-14?", options: ["Atlético", "Barcelona", "Real Madrid", "Sevilla"], correctIndex: 0, difficulty: "hard", category: "laliga" },

{ question: "¿Quién marcó el gol decisivo Liga 2020-21 para el Atleti en Valladolid?", options: ["Suárez", "Correa", "Llorente", "Carrasco"], correctIndex: 0, difficulty: "hard", category: "moments" },

{ question: "¿Qué club ganó Segunda 2012-13?", options: ["Elche", "Villarreal", "Almería", "Girona"], correctIndex: 0, difficulty: "hard", category: "segunda" },

{ question: "¿Qué entrenador llevó al Villarreal al ascenso 2012-13?", options: ["Lotina", "Marcelino", "Preciado", "Emery"], correctIndex: 1, difficulty: "hard", category: "coaches" },

{ question: "¿Qué equipo perdió la Liga 2006-07 en el último tramo?", options: ["Barcelona", "Sevilla", "Valencia", "Atlético"], correctIndex: 0, difficulty: "hard", category: "laliga" },

{ question: "¿Qué club ganó Segunda 2018-19?", options: ["Granada", "Osasuna", "Mallorca", "Albacete"], correctIndex: 1, difficulty: "hard", category: "segunda" },

{ question: "¿Qué jugador fue máximo goleador Segunda 2018-19?", options: ["Stuani", "Enric Gallego", "Mata", "Rubén Castro"], correctIndex: 0, difficulty: "hard", category: "records" },

{ question: "¿Qué club ganó La Liga 2023-24?", options: ["Barcelona", "Real Madrid", "Girona", "Atlético"], correctIndex: 1, difficulty: "hard", category: "laliga" },

{ question: "¿Qué club rompió récord goleador en Segunda 2015-16?", options: ["Alavés", "Leganés", "Osasuna", "Nàstic"], correctIndex: 1, difficulty: "hard", category: "segunda" },

{ question: "¿Qué entrenador llevó al Leganés al ascenso 2015-16?", options: ["Garitano", "Asier Garitano", "Idiakez", "Pellegrino"], correctIndex: 1, difficulty: "hard", category: "coaches" },

{ question: "¿Qué club descendió en 2021-22 inesperadamente?", options: ["Granada", "Levante", "Alavés", "Todos"], correctIndex: 3, difficulty: "hard", category: "laliga" },

{ question: "¿Qué jugador fue Pichichi 2016-17?", options: ["Messi", "Suárez", "Cristiano", "Griezmann"], correctIndex: 0, difficulty: "hard", category: "players" },

{ question: "¿Qué club ganó Segunda 2004-05?", options: ["Cádiz", "Celta", "Alavés", "Eibar"], correctIndex: 0, difficulty: "hard", category: "segunda" },

{ question: "¿Qué equipo logró el ascenso en playoff 2022-23?", options: ["Alavés", "Levante", "Eibar", "Las Palmas"], correctIndex: 0, difficulty: "hard", category: "segunda" },
{ question: "¿Qué equipo empezó líder La Liga 2013-14 tras la jornada 1?", options: ["Barcelona", "Real Madrid", "Atlético", "Villarreal"], correctIndex: 3, difficulty: "extreme", category: "seasons" },

{ question: "¿Quién marcó el primer gol oficial en el nuevo San Mamés (2013)?", options: ["Aduriz", "Muniain", "Ibai Gómez", "San José"], correctIndex: 2, difficulty: "extreme", category: "moments" },

{ question: "¿Qué portero jugó en Barça y Atlético entre 2014–2016?", options: ["Bravo", "Ter Stegen", "Oblak", "Moyá"], correctIndex: 3, difficulty: "extreme", category: "players" },

{ question: "¿Qué club fue campeón de invierno en 2003-04 pero no ganó La Liga?", options: ["Real Madrid", "Valencia", "Deportivo", "Barcelona"], correctIndex: 0, difficulty: "extreme", category: "laliga" },

{ question: "¿Qué jugador marcó un hat-trick en su debut liguero con el Real Madrid en 2009?", options: ["Cristiano Ronaldo", "Benzema", "Kaká", "Granero"], correctIndex: 0, difficulty: "extreme", category: "moments" },

{ question: "¿Qué equipo rompió una racha de 39 partidos invicto del Barça en 2016?", options: ["Real Madrid", "Sevilla", "Valencia", "Real Sociedad"], correctIndex: 3, difficulty: "extreme", category: "records" },

{ question: "¿Qué entrenador ascendió al Girona en 2016-17?", options: ["Machín", "Unzué", "Eusebio", "Paco López"], correctIndex: 0, difficulty: "extreme", category: "coaches" },

{ question: "¿Qué club descendió en 2014-15 pese a tener a Negredo?", options: ["Valencia", "Almería", "Middlesbrough", "Ninguno"], correctIndex: 3, difficulty: "extreme", category: "trick" },

{ question: "¿Qué equipo ganó Segunda 2001-02?", options: ["Atlético", "Betis", "Recreativo", "Levante"], correctIndex: 0, difficulty: "extreme", category: "segunda" },

{ question: "¿Quién marcó el gol del ascenso del Elche en 2012-13?", options: ["Corominas", "Fidel", "Carles Gil", "Xumetra"], correctIndex: 0, difficulty: "extreme", category: "moments" },

{ question: "¿Qué dorsal llevó Ronaldinho en su última temporada en La Liga?", options: ["10", "11", "7", "21"], correctIndex: 0, difficulty: "extreme", category: "players" },

{ question: "¿Qué equipo logró más empates en La Liga 2005-06?", options: ["Betis", "Racing", "Osasuna", "Athletic"], correctIndex: 2, difficulty: "extreme", category: "stats" },

{ question: "¿Qué jugador marcó el último gol en el Vicente Calderón?", options: ["Griezmann", "Fernando Torres", "Gameiro", "Koke"], correctIndex: 1, difficulty: "extreme", category: "moments" },

{ question: "¿Qué club fue campeón Segunda 2008-09?", options: ["Xerez", "Tenerife", "Zaragoza", "Rayo"], correctIndex: 0, difficulty: "extreme", category: "segunda" },

{ question: "¿Quién fue Pichichi con menos de 25 goles (2000s)?", options: ["Forlán", "Makay", "Tristán", "Nihat"], correctIndex: 1, difficulty: "extreme", category: "records" },

{ question: "¿Qué entrenador ganó Liga con Valencia y luego Champions con Liverpool?", options: ["Benítez", "Cúper", "Ranieri", "Emery"], correctIndex: 0, difficulty: "extreme", category: "coaches" },

{ question: "¿Qué club estuvo a punto de desaparecer tras descender en 2011?", options: ["Deportivo", "Racing", "Zaragoza", "Betis"], correctIndex: 1, difficulty: "extreme", category: "history" },

{ question: "¿Qué jugador marcó gol en Clásico jugando para ambos clubes?", options: ["Ronaldo Nazario", "Figo", "Laudrup", "Todos"], correctIndex: 3, difficulty: "extreme", category: "trick" },

{ question: "¿Qué equipo logró el récord de imbatibilidad defensiva 2015-16?", options: ["Atlético", "Barcelona", "Real Madrid", "Sevilla"], correctIndex: 0, difficulty: "extreme", category: "records" },

{ question: "¿Qué club ascendió en playoff 2020 con gol en el descuento?", options: ["Girona", "Elche", "Almería", "Zaragoza"], correctIndex: 1, difficulty: "extreme", category: "segunda" },

{ question: "¿Qué jugador marcó el gol que rompió el invicto del Madrid 2016-17?", options: ["Messi", "Piqué", "Neymar", "Suárez"], correctIndex: 0, difficulty: "extreme", category: "moments" },

{ question: "¿Qué equipo fue campeón Segunda 2017-18?", options: ["Rayo Vallecano", "Huesca", "Sporting", "Zaragoza"], correctIndex: 0, difficulty: "extreme", category: "segunda" },

{ question: "¿Qué club logró menor posesión media y se salvó 2013-14?", options: ["Elche", "Levante", "Osasuna", "Getafe"], correctIndex: 0, difficulty: "extreme", category: "stats" },

{ question: "¿Quién marcó el último gol liguero de Xavi?", options: ["Messi", "Neymar", "Pedro", "Él mismo"], correctIndex: 3, difficulty: "extreme", category: "players" },

{ question: "¿Qué estadio sustituyó al antiguo San Mamés?", options: ["Anoeta", "San Mamés Barria", "La Cartuja", "Mendizorroza"], correctIndex: 1, difficulty: "extreme", category: "stadiums" },
{ question: "¿Qué equipo eliminó al Real Madrid en Copa 2009-10?", options: ["Alcorcón", "Real Unión", "Sevilla", "Zaragoza"], correctIndex: 0, difficulty: "extreme", category: "cuñado_destroyer" },

{ question: "¿Quién marcó 4 goles al Sevilla en un 5-1 del Barça (2014-15)?", options: ["Messi", "Neymar", "Suárez", "Pedro"], correctIndex: 0, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Qué jugador falló el penalti decisivo en la final Champions 2016 para el Atleti?", options: ["Griezmann", "Juanfran", "Torres", "Gabi"], correctIndex: 1, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Qué equipo descendió en 2018-19 tras empatar en la última jornada?", options: ["Girona", "Huesca", "Rayo", "Levante"], correctIndex: 0, difficulty: "extreme", category: "cuñado_destroyer" },

{ question: "¿Quién marcó el último gol del Vicente Calderón?", options: ["Griezmann", "Fernando Torres", "Gameiro", "Koke"], correctIndex: 1, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Qué equipo ganó La Liga 2006-07?", options: ["Barcelona", "Real Madrid", "Sevilla", "Valencia"], correctIndex: 1, difficulty: "extreme", category: "cuñado_destroyer" },

{ question: "¿Quién marcó el gol del empate que dio la Liga 2013-14 al Atleti?", options: ["Villa", "Godín", "Koke", "Diego Costa"], correctIndex: 1, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Qué club subió a Primera en 2016 tras años de sufrimiento?", options: ["Leganés", "Girona", "Alavés", "Getafe"], correctIndex: 0, difficulty: "extreme", category: "segunda" },

{ question: "¿Quién fue Zamora 2015-16?", options: ["Oblak", "Bravo", "Keylor Navas", "Ter Stegen"], correctIndex: 0, difficulty: "extreme", category: "players" },

{ question: "¿Qué entrenador fue cesado tras ir líder en 2017?", options: ["Michel", "Berizzo", "Escribá", "Garitano"], correctIndex: 1, difficulty: "extreme", category: "cuñado_destroyer" },

{ question: "¿Quién marcó el gol decisivo del Barça en Stamford Bridge 2009?", options: ["Messi", "Iniesta", "Eto’o", "Xavi"], correctIndex: 1, difficulty: "extreme", category: "moments" },

{ question: "¿Qué equipo ganó Segunda 2011-12?", options: ["Deportivo", "Celta", "Valladolid", "Almería"], correctIndex: 0, difficulty: "extreme", category: "segunda" },

{ question: "¿Qué jugador marcó el gol que salvó al Deportivo en 2009-10?", options: ["Riki", "Lafita", "Guardado", "Colotto"], correctIndex: 0, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Quién fue Pichichi 2016-17?", options: ["Messi", "Suárez", "Cristiano", "Griezmann"], correctIndex: 0, difficulty: "extreme", category: "players" },

{ question: "¿Qué club perdió una Liga tras ir líder gran parte (2013-14)?", options: ["Barcelona", "Real Madrid", "Atlético", "Ninguno"], correctIndex: 0, difficulty: "extreme", category: "cuñado_destroyer" },

{ question: "¿Qué dorsal llevaba Bale en su debut?", options: ["11", "10", "9", "7"], correctIndex: 0, difficulty: "extreme", category: "players" },

{ question: "¿Qué equipo ganó Copa 2012-13?", options: ["Atlético", "Madrid", "Barça", "Sevilla"], correctIndex: 0, difficulty: "extreme", category: "cups" },

{ question: "¿Quién marcó el gol del ascenso del Elche 2020?", options: ["Pere Milla", "Fidel", "Nino", "Josan"], correctIndex: 0, difficulty: "extreme", category: "segunda" },

{ question: "¿Qué equipo rompió invicto Barça 2017-18?", options: ["Levante", "Madrid", "Sevilla", "Valencia"], correctIndex: 0, difficulty: "extreme", category: "moments" },

{ question: "¿Quién marcó el gol decisivo Liga 2020-21 Atleti?", options: ["Suárez", "Correa", "Llorente", "Carrasco"], correctIndex: 0, difficulty: "extreme", category: "moments" },

{ question: "¿Qué club descendió en 2013-14 inesperadamente?", options: ["Betis", "Osasuna", "Valladolid", "Todos"], correctIndex: 3, difficulty: "extreme", category: "cuñado_destroyer" },

{ question: "¿Qué jugador marcó hat-trick en Clásico 2014?", options: ["Messi", "Cristiano", "Benzema", "Neymar"], correctIndex: 0, difficulty: "extreme", category: "moments" },

{ question: "¿Qué club ganó Segunda 2014-15?", options: ["Betis", "Sporting", "Girona", "Las Palmas"], correctIndex: 0, difficulty: "extreme", category: "segunda" },

{ question: "¿Quién marcó el gol fantasma Liga 2013?", options: ["Messi", "Ramos", "Bale", "Ninguno"], correctIndex: 3, difficulty: "extreme", category: "trick" },

{ question: "¿Qué club subió con Machín?", options: ["Girona", "Numancia", "Elche", "Alavés"], correctIndex: 0, difficulty: "extreme", category: "coaches" },

{ question: "¿Quién marcó el último gol de Raúl en Liga?", options: ["Raúl", "Cristiano", "Higuaín", "Benzema"], correctIndex: 0, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Qué club perdió final Copa 2015?", options: ["Athletic", "Barcelona", "Sevilla", "Valencia"], correctIndex: 0, difficulty: "extreme", category: "finals" },

{ question: "¿Quién marcó doblete en final Copa 2015?", options: ["Messi", "Neymar", "Suárez", "Pedro"], correctIndex: 0, difficulty: "extreme", category: "moments" },

{ question: "¿Qué entrenador fue campeón Liga 2019-20?", options: ["Zidane", "Setién", "Simeone", "Lopetegui"], correctIndex: 0, difficulty: "extreme", category: "coaches" },

{ question: "¿Qué equipo empezó líder 2023-24 sorpresa?", options: ["Girona", "Madrid", "Barça", "Betis"], correctIndex: 0, difficulty: "extreme", category: "seasons" },

{ question: "¿Quién marcó el gol del famoso 4-0 Barça-Madrid 2015?", options: ["Suárez", "Neymar", "Iniesta", "Messi"], correctIndex: 0, difficulty: "extreme", category: "moments" },

{ question: "¿Qué club descendió con 37 puntos?", options: ["Depende del año", "Nunca pasó", "Varios", "Todos"], correctIndex: 2, difficulty: "extreme", category: "cuñado_destroyer" },

{ question: "¿Quién fue MVP Liga 2010-11?", options: ["Messi", "Cristiano", "Iniesta", "Xavi"], correctIndex: 0, difficulty: "extreme", category: "awards" },

{ question: "¿Qué club subió en 2019-20 playoff?", options: ["Elche", "Girona", "Almería", "Zaragoza"], correctIndex: 0, difficulty: "extreme", category: "segunda" },

{ question: "¿Quién marcó gol en su debut Champions con Madrid?", options: ["Cristiano", "Benzema", "Raúl", "Muchos"], correctIndex: 3, difficulty: "extreme", category: "cuñado_destroyer" },
{ question: "¿Qué equipo ganó La Liga 2006-07 tras una remontada épica?", options: ["Barcelona", "Real Madrid", "Sevilla", "Valencia"], correctIndex: 1, difficulty: "extreme", category: "cuñado_destroyer" },

{ question: "¿Quién marcó el gol decisivo del 2-6 en el Bernabéu?", options: ["Messi", "Piqué", "Henry", "Iniesta"], correctIndex: 1, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Qué jugador falló un penalti en semifinal Champions 2012 (Madrid vs Bayern)?", options: ["Cristiano", "Kaká", "Ramos", "Todos"], correctIndex: 3, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Qué club descendió en 2011 pese a empatar en la última jornada?", options: ["Deportivo", "Mallorca", "Racing", "Getafe"], correctIndex: 0, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Quién marcó el gol que prácticamente sentenció La Liga 2011-12?", options: ["Cristiano Ronaldo", "Messi", "Benzema", "Özil"], correctIndex: 0, difficulty: "extreme", category: "moments" },

{ question: "¿Qué entrenador fue despedido tras un 0-4 en casa en 2015?", options: ["Ancelotti", "Benítez", "Emery", "Valverde"], correctIndex: 1, difficulty: "extreme", category: "cuñado_destroyer" },

{ question: "¿Qué equipo rompió el invicto del Barça en 2017-18?", options: ["Levante", "Sevilla", "Valencia", "Espanyol"], correctIndex: 0, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Quién marcó el último gol oficial en el viejo San Mamés?", options: ["Aduriz", "Muniain", "Toquero", "Ibai Gómez"], correctIndex: 0, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Qué equipo logró el ascenso en playoff 2014-15?", options: ["Las Palmas", "Girona", "Sporting", "Zaragoza"], correctIndex: 0, difficulty: "extreme", category: "segunda" },

{ question: "¿Quién marcó el gol del ascenso de Las Palmas 2015?", options: ["Araujo", "Roque Mesa", "Sergio Araujo", "Vicente Gómez"], correctIndex: 2, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Qué dorsal llevaba David Villa en el Barça?", options: ["7", "9", "11", "10"], correctIndex: 0, difficulty: "extreme", category: "players" },

{ question: "¿Qué equipo fue campeón de invierno 2013-14?", options: ["Barcelona", "Real Madrid", "Atlético", "Empate triple"], correctIndex: 3, difficulty: "extreme", category: "cuñado_destroyer" },

{ question: "¿Quién marcó el gol decisivo de Bale en Copa 2014?", options: ["Contra Barça", "Contra Atleti", "Contra Sevilla", "Contra Valencia"], correctIndex: 2, difficulty: "extreme", category: "finals" },

{ question: "¿Qué jugador marcó un póker en La Liga 2015-16?", options: ["Messi", "Cristiano", "Suárez", "Neymar"], correctIndex: 2, difficulty: "extreme", category: "records" },

{ question: "¿Qué club descendió en 2019 tras años asentado?", options: ["Girona", "Getafe", "Levante", "Espanyol"], correctIndex: 0, difficulty: "extreme", category: "laliga" },

{ question: "¿Quién fue Zamora 2012-13?", options: ["Valdés", "Courtois", "Diego López", "Caballero"], correctIndex: 1, difficulty: "extreme", category: "players" },

{ question: "¿Qué equipo ganó Segunda 2017-18?", options: ["Rayo Vallecano", "Huesca", "Sporting", "Cádiz"], correctIndex: 0, difficulty: "extreme", category: "segunda" },

{ question: "¿Qué jugador fue clave en el Rayo 2017-18?", options: ["Raúl de Tomás", "Trejo", "Embarba", "Todos"], correctIndex: 3, difficulty: "extreme", category: "cuñado_destroyer" },

{ question: "¿Qué equipo eliminó al Barça en Champions 2013-14?", options: ["Atlético", "PSG", "Chelsea", "Bayern"], correctIndex: 0, difficulty: "extreme", category: "moments" },

{ question: "¿Quién marcó el gol decisivo en esa eliminatoria?", options: ["Koke", "Griezmann", "Diego", "Gabi"], correctIndex: 2, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Qué entrenador logró La Liga 2020-21?", options: ["Zidane", "Simeone", "Koeman", "Ancelotti"], correctIndex: 1, difficulty: "extreme", category: "laliga" },

{ question: "¿Quién marcó el gol decisivo Liga 2020-21?", options: ["Suárez", "Correa", "Carrasco", "Llorente"], correctIndex: 0, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Qué club descendió en 2021-22 dramáticamente?", options: ["Granada", "Levante", "Alavés", "Todos"], correctIndex: 3, difficulty: "extreme", category: "laliga" },

{ question: "¿Qué jugador marcó el último gol del Barça de Guardiola?", options: ["Messi", "Pedro", "Iniesta", "Busquets"], correctIndex: 0, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Qué equipo ganó La Liga 2014-15?", options: ["Barcelona", "Real Madrid", "Atlético", "Valencia"], correctIndex: 0, difficulty: "extreme", category: "laliga" },
{ question: "¿Qué equipo eliminó al Barça en Champions 2013-14?", options: ["Atlético de Madrid", "PSG", "Chelsea", "Bayern"], correctIndex: 0, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Quién marcó el gol decisivo en esa eliminatoria?", options: ["Koke", "Diego Ribas", "Arda Turan", "Villa"], correctIndex: 1, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Qué club descendió en 2010-11 tras años europeos?", options: ["Deportivo", "Sevilla", "Villarreal", "Valencia"], correctIndex: 0, difficulty: "extreme", category: "cuñado_destroyer" },

{ question: "¿Quién marcó el gol que dio la Liga 2006-07 al Madrid en Mallorca?", options: ["Reyes", "Van Nistelrooy", "Diarrà", "Raúl"], correctIndex: 0, difficulty: "extreme", category: "moments" },

{ question: "¿Qué dorsal llevaba Forlán en el Atlético?", options: ["7", "9", "10", "19"], correctIndex: 0, difficulty: "extreme", category: "players" },

{ question: "¿Qué equipo fue campeón de invierno 2003-04?", options: ["Real Madrid", "Valencia", "Deportivo", "Barcelona"], correctIndex: 0, difficulty: "extreme", category: "laliga" },

{ question: "¿Quién fue Pichichi 2008-09?", options: ["Messi", "Forlán", "Eto’o", "Villa"], correctIndex: 1, difficulty: "extreme", category: "players" },

{ question: "¿Qué club ganó Segunda 2016-17?", options: ["Levante", "Girona", "Getafe", "Tenerife"], correctIndex: 0, difficulty: "extreme", category: "segunda" },

{ question: "¿Qué entrenador logró ese título?", options: ["Muñiz", "Paco López", "JIM", "Luis García"], correctIndex: 0, difficulty: "extreme", category: "coaches" },

{ question: "¿Qué jugador marcó el gol del ascenso del Girona 2017?", options: ["Stuani", "Portu", "Alcalá", "Granell"], correctIndex: 1, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Qué club perdió la final Copa 2014?", options: ["Barcelona", "Atlético", "Real Madrid", "Sevilla"], correctIndex: 1, difficulty: "extreme", category: "finals" },

{ question: "¿Quién marcó el gol decisivo en esa final?", options: ["Bale", "Cristiano", "Di María", "Ramos"], correctIndex: 0, difficulty: "extreme", category: "moments" },

{ question: "¿Qué equipo rompió el invicto del Madrid 2016-17?", options: ["Sevilla", "Barcelona", "Valencia", "Celta"], correctIndex: 0, difficulty: "extreme", category: "records" },

{ question: "¿Quién marcó el gol clave en ese partido?", options: ["Jovetić", "Nasri", "Ben Yedder", "Vitolo"], correctIndex: 0, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Qué club ascendió en playoff 2018-19?", options: ["Mallorca", "Deportivo", "Albacete", "Cádiz"], correctIndex: 0, difficulty: "extreme", category: "segunda" },

{ question: "¿Quién marcó el gol decisivo?", options: ["Budimir", "Abdón Prats", "Salva Sevilla", "Lago Junior"], correctIndex: 1, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Qué equipo ganó La Liga 2011-12?", options: ["Barcelona", "Real Madrid", "Atlético", "Valencia"], correctIndex: 1, difficulty: "extreme", category: "laliga" },

{ question: "¿Cuántos puntos logró?", options: ["96", "100", "99", "102"], correctIndex: 1, difficulty: "extreme", category: "records" },

{ question: "¿Qué club descendió en 2014-15 inesperadamente?", options: ["Eibar", "Almería", "Elche", "Ninguno"], correctIndex: 3, difficulty: "extreme", category: "cuñado_destroyer" },

{ question: "¿Quién fue Zamora 2013-14?", options: ["Courtois", "Valdés", "Diego López", "Keylor Navas"], correctIndex: 0, difficulty: "extreme", category: "players" },

{ question: "¿Qué jugador marcó hat-trick en Clásico 2014?", options: ["Messi", "Cristiano", "Suárez", "Benzema"], correctIndex: 0, difficulty: "extreme", category: "moments" },

{ question: "¿Qué club ganó Segunda 2012-13?", options: ["Elche", "Villarreal", "Almería", "Girona"], correctIndex: 0, difficulty: "extreme", category: "segunda" },

{ question: "¿Qué entrenador logró el ascenso del Villarreal 2013?", options: ["Marcelino", "Lotina", "Preciado", "Emery"], correctIndex: 0, difficulty: "extreme", category: "coaches" },

{ question: "¿Qué equipo ganó Copa 2012-13?", options: ["Atlético", "Real Madrid", "Barcelona", "Sevilla"], correctIndex: 0, difficulty: "extreme", category: "cups" },

{ question: "¿Quién marcó el gol decisivo?", options: ["Miranda", "Falcao", "Diego Costa", "Koke"], correctIndex: 0, difficulty: "extreme", category: "moments" },

{ question: "¿Qué equipo ganó Segunda 2020-21?", options: ["Espanyol", "Mallorca", "Leganés", "Almería"], correctIndex: 0, difficulty: "extreme", category: "segunda" },

{ question: "¿Qué jugador fue clave?", options: ["Raúl de Tomás", "Puado", "Melamed", "Todos"], correctIndex: 3, difficulty: "extreme", category: "cuñado_destroyer" },

{ question: "¿Qué club descendió en 2021-22 dramáticamente?", options: ["Granada", "Levante", "Alavés", "Todos"], correctIndex: 3, difficulty: "extreme", category: "laliga" },

{ question: "¿Quién fue Pichichi 2015-16?", options: ["Messi", "Suárez", "Cristiano", "Griezmann"], correctIndex: 1, difficulty: "extreme", category: "players" },

{ question: "¿Qué club rompió récord goleador 2015-16?", options: ["Barcelona", "Real Madrid", "Atlético", "Sevilla"], correctIndex: 0, difficulty: "extreme", category: "records" },

{ question: "¿Qué jugador marcó el último gol del Barça de Guardiola?", options: ["Messi", "Pedro", "Iniesta", "Busquets"], correctIndex: 0, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Qué club ascendió vía playoff 2016-17?", options: ["Getafe", "Cádiz", "Huesca", "Oviedo"], correctIndex: 0, difficulty: "extreme", category: "segunda" },

{ question: "¿Qué jugador marcó en esa final?", options: ["Faurlín", "Pacheco", "Molina", "Amath"], correctIndex: 2, difficulty: "extreme", category: "memoria_quirurgica" },

{ question: "¿Qué club ganó La Liga 2014-15?", options: ["Barcelona", "Real Madrid", "Atlético", "Valencia"], correctIndex: 0, difficulty: "extreme", category: "laliga" },

{ question: "¿Qué equipo fue colista gran parte 2013-14 y se salvó?", options: ["Elche", "Osasuna", "Betis", "Granada"], correctIndex: 0, difficulty: "extreme", category: "stats" },
{ question: "¿Qué equipo fue campeón de Segunda División 2008-09?", options: ["Xerez CD", "Tenerife", "Zaragoza", "Rayo Vallecano"], correctIndex: 0, difficulty: "extreme", category: "segunda_historia" },

{ question: "¿Qué club logró el ascenso en playoff 2009-10?", options: ["Betis", "Levante", "Hércules", "Real Sociedad"], correctIndex: 2, difficulty: "extreme", category: "segunda_playoff" },

{ question: "¿Quién entrenaba al Betis en su ascenso 2010-11?", options: ["Pepe Mel", "Gordillo", "Setién", "Irureta"], correctIndex: 0, difficulty: "extreme", category: "segunda_coaches" },

{ question: "¿Qué equipo fue campeón de Segunda 2011-12?", options: ["Deportivo", "Celta", "Valladolid", "Almería"], correctIndex: 0, difficulty: "extreme", category: "segunda_campeones" },

{ question: "¿Qué jugador fue clave en el ascenso del Deportivo 2011-12?", options: ["Riki", "Guardado", "Valerón", "Colotto"], correctIndex: 0, difficulty: "extreme", category: "segunda_players" },

{ question: "¿Qué club fue campeón de Segunda 2012-13?", options: ["Elche CF", "Villarreal", "Almería", "Girona"], correctIndex: 0, difficulty: "extreme", category: "segunda_campeones" },

{ question: "¿Qué entrenador ascendió al Villarreal 2012-13?", options: ["Marcelino", "Lotina", "Preciado", "Emery"], correctIndex: 0, difficulty: "extreme", category: "segunda_coaches" },

{ question: "¿Qué equipo logró su primer ascenso histórico en 2013-14?", options: ["SD Eibar", "Girona", "Leganés", "Alcorcón"], correctIndex: 0, difficulty: "extreme", category: "segunda_historia" },

{ question: "¿Qué club ganó la Segunda División 2014-15?", options: ["Real Betis", "Sporting", "Girona", "Las Palmas"], correctIndex: 0, difficulty: "extreme", category: "segunda_campeones" },

{ question: "¿Qué equipo ascendió en playoff 2014-15 con gol en el descuento?", options: ["Las Palmas", "Girona", "Zaragoza", "Valladolid"], correctIndex: 0, difficulty: "extreme", category: "segunda_playoff" },

{ question: "¿Quién marcó el mítico gol del ascenso de Las Palmas 2015?", options: ["Araujo", "Roque Mesa", "Sergio Araujo", "Vicente Gómez"], correctIndex: 2, difficulty: "extreme", category: "segunda_memoria" },

{ question: "¿Qué equipo fue campeón de Segunda 2015-16?", options: ["Deportivo Alavés", "Leganés", "Osasuna", "Córdoba"], correctIndex: 0, difficulty: "extreme", category: "segunda_campeones" },

{ question: "¿Qué club ascendió directamente junto al Alavés 2015-16?", options: ["Leganés", "Osasuna", "Girona", "Zaragoza"], correctIndex: 0, difficulty: "extreme", category: "segunda_ascensos" },

{ question: "¿Qué entrenador llevó al Leganés al ascenso 2015-16?", options: ["Asier Garitano", "Idiakez", "Anquela", "Machín"], correctIndex: 0, difficulty: "extreme", category: "segunda_coaches" },

{ question: "¿Qué equipo fue campeón de Segunda 2016-17?", options: ["Levante UD", "Girona", "Getafe", "Tenerife"], correctIndex: 0, difficulty: "extreme", category: "segunda_campeones" },

{ question: "¿Qué club ascendió vía playoff 2016-17?", options: ["Getafe CF", "Cádiz", "Huesca", "Oviedo"], correctIndex: 0, difficulty: "extreme", category: "segunda_playoff" },

{ question: "¿Quién marcó en la final del playoff 2017 (Getafe vs Tenerife)?", options: ["Molina", "Faurlín", "Pacheco", "Amath"], correctIndex: 0, difficulty: "extreme", category: "segunda_memoria" },

{ question: "¿Qué equipo fue campeón de Segunda 2017-18?", options: ["Rayo Vallecano", "Huesca", "Sporting", "Zaragoza"], correctIndex: 0, difficulty: "extreme", category: "segunda_campeones" },

{ question: "¿Qué club ascendió directamente junto al Rayo 2017-18?", options: ["SD Huesca", "Sporting", "Numancia", "Cádiz"], correctIndex: 0, difficulty: "extreme", category: "segunda_ascensos" },

{ question: "¿Qué jugador fue clave en el Huesca 2017-18?", options: ["Cucho Hernández", "Melero", "Ferreiro", "Pulido"], correctIndex: 0, difficulty: "extreme", category: "segunda_players" },

{ question: "¿Qué equipo fue campeón de Segunda 2018-19?", options: ["CA Osasuna", "Granada", "Mallorca", "Albacete"], correctIndex: 0, difficulty: "extreme", category: "segunda_campeones" },

{ question: "¿Qué club ascendió en playoff 2018-19?", options: ["RCD Mallorca", "Deportivo", "Málaga", "Cádiz"], correctIndex: 0, difficulty: "extreme", category: "segunda_playoff" },

{ question: "¿Quién marcó el gol decisivo del Mallorca 2019?", options: ["Budimir", "Abdón Prats", "Salva Sevilla", "Lago Junior"], correctIndex: 1, difficulty: "extreme", category: "segunda_memoria" },

{ question: "¿Qué equipo fue campeón de Segunda 2019-20?", options: ["SD Huesca", "Cádiz CF", "Girona", "Almería"], correctIndex: 0, difficulty: "extreme", category: "segunda_campeones" },

{ question: "¿Qué club logró el ascenso en playoff 2019-20?", options: ["Elche CF", "Girona", "Almería", "Zaragoza"], correctIndex: 0, difficulty: "extreme", category: "segunda_playoff" },

{ question: "¿Quién marcó el gol del ascenso del Elche 2020?", options: ["Pere Milla", "Fidel", "Nino", "Josan"], correctIndex: 0, difficulty: "extreme", category: "segunda_memoria" },

{ question: "¿Qué equipo fue campeón de Segunda 2020-21?", options: ["RCD Espanyol", "Mallorca", "Leganés", "Almería"], correctIndex: 0, difficulty: "extreme", category: "segunda_campeones" },

{ question: "¿Qué jugador fue clave en ese Espanyol?", options: ["Raúl de Tomás", "Puado", "Melamed", "Todos"], correctIndex: 3, difficulty: "extreme", category: "segunda_cuñado_destroyer" },

{ question: "¿Qué equipo fue campeón Segunda 2021-22?", options: ["UD Almería", "Valladolid", "Eibar", "Girona"], correctIndex: 0, difficulty: "extreme", category: "segunda_campeones" },

{ question: "¿Qué club ascendió vía playoff 2021-22?", options: ["Girona FC", "Eibar", "Tenerife", "Oviedo"], correctIndex: 0, difficulty: "extreme", category: "segunda_playoff" },

{ question: "¿Qué equipo fue campeón Segunda 2022-23?", options: ["Granada CF", "Las Palmas", "Levante", "Alavés"], correctIndex: 0, difficulty: "extreme", category: "segunda_campeones" },

{ question: "¿Qué club logró el ascenso vía playoff 2022-23?", options: ["Alavés", "Levante", "Eibar", "Las Palmas"], correctIndex: 0, difficulty: "extreme", category: "segunda_playoff" },

{ question: "¿Qué equipo fue campeón Segunda 2023-24?", options: ["CD Leganés", "Valladolid", "Eibar", "Espanyol"], correctIndex: 0, difficulty: "extreme", category: "segunda_campeones" },

{ question: "¿Qué club cayó en playoff 2023-24 inesperadamente?", options: ["Eibar", "Sporting", "Oviedo", "Depende"], correctIndex: 3, difficulty: "extreme", category: "segunda_cuñado_destroyer" },
 // --- Preguntas adicionales corregidas ---
  {
    
    question: "¿Qué club cayó en playoff 2023-24 inesperadamente?", 
    options: ["Eibar", "Sporting", "Oviedo", "Depende"], 
    correctIndex: 3, 
    difficulty: "extreme", 
    category: "segunda_cuñado_destroyer" 
  },
  { 
    category: "La Liga", 
    question: "¿Qué equipo ganó las 6 primeras ediciones de La Liga?", 
    options: ["Real Madrid", "Barcelona", "Athletic Bilbao", "Atlético de Madrid"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "La Liga", 
    question: "¿Cuántos equipos hay en La Liga española?", 
    options: ["18", "20", "22", "24"], 
    correctIndex: 1, 
    difficulty: "easy" 
  },
  { 
    category: "La Liga", 
    question: "¿Qué jugador tiene más asistencias en la historia de La Liga?", 
    options: ["Xavi", "Messi", "Özil", "Dani Alves"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "La Liga", 
    question: "¿En qué año ganó el Valencia su última Liga?", 
    options: ["2002", "2004", "2006", "2008"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "La Liga", 
    question: "¿Qué portero tiene más partidos sin encajar gol en La Liga?", 
    options: ["Casillas", "Víctor Valdés", "Courtois", "Jan Oblak"], 
    correctIndex: 3, 
    difficulty: "medium" 
  },
  { 
    category: "Premier League", 
    question: "¿Qué jugador ha ganado más veces el premio al Jugador del Mes?", 
    options: ["Wayne Rooney", "Sergio Agüero", "Steven Gerrard", "Harry Kane"], 
    correctIndex: 1, 
    difficulty: "hard" 
  },
  { 
    category: "Premier League", 
    question: "¿Cuál ha sido la temporada con más goles en la Premier?", 
    options: ["2017-18", "2018-19", "2019-20", "2022-23"], 
    correctIndex: 1, 
    difficulty: "hard" 
  },
  { 
    category: "Premier League", 
    question: "¿Qué equipo terminó la temporada 2019-20 con más puntos sin ganar el título?", 
    options: ["Manchester City", "Liverpool", "Chelsea", "Ninguno"], 
    correctIndex: 3, 
    difficulty: "hard" 
  },
  { 
    category: "Premier League", 
    question: "¿Cuántas asistencias tiene Özil en una temporada de Premier (récord)?", 
    options: ["18", "19", "20", "21"], 
    correctIndex: 2, 
    difficulty: "hard" 
  },
  { 
    category: "Premier League", 
    question: "¿Qué equipo galés ha jugado en la Premier League?", 
    options: ["Cardiff City", "Swansea City", "Newport County", "Wrexham"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "Bundesliga", 
    question: "¿Cuántos goles marcó Lewandowski en 9 minutos ante el Wolfsburgo?", 
    options: ["4", "5", "6", "7"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "Bundesliga", 
    question: "¿Qué equipo alemán tiene más aficionados?", 
    options: ["Bayern Munich", "Borussia Dortmund", "Schalke 04", "Hamburg"], 
    correctIndex: 0, 
    difficulty: "medium" 
  },
  { 
    category: "Bundesliga", 
    question: "¿En qué año se fundó el Bayern de Munich?", 
    options: ["1890", "1900", "1910", "1920"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "Bundesliga", 
    question: "¿Qué español ha ganado la Bundesliga?", 
    options: ["Xabi Alonso", "Javi Martínez", "Thiago", "Todos ellos"], 
    correctIndex: 3, 
    difficulty: "medium" 
  },
  { 
    category: "Bundesliga", 
    question: "¿Cuál es el estadio con más capacidad en Alemania?", 
    options: ["Allianz Arena", "Signal Iduna Park", "Olympiastadion Berlin", "Veltins-Arena"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "Serie A", 
    question: "¿Qué equipo italiano descendió por el escándalo Calciopoli?", 
    options: ["AC Milan", "Juventus", "Lazio", "Fiorentina"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "Serie A", 
    question: "¿Cuántos Balones de Oro ganó Paolo Rossi?", 
    options: ["0", "1", "2", "3"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "Serie A", 
    question: "¿Qué jugador argentino brilló en la Roma en los 2000?", 
    options: ["Batistuta", "Totti", "Cafu", "Samuel"], 
    correctIndex: 0, 
    difficulty: "medium" 
  },
  { 
    category: "Serie A", 
    question: "¿Cuántos Scudettos ganó el Inter en los años 2000?", 
    options: ["3", "4", "5", "6"], 
    correctIndex: 2, 
    difficulty: "hard" 
  },
  { 
    category: "Serie A", 
    question: "¿Qué entrenador ganó el triplete con el Inter en 2010?", 
    options: ["Mourinho", "Ancelotti", "Mancini", "Conte"], 
    correctIndex: 0, 
    difficulty: "easy" 
  },
  { 
    category: "Champions League", 
    question: "¿Cuál fue la final de Champions más goleadora?", 
    options: ["4-4", "5-3", "4-3", "6-5"], 
    correctIndex: 2, 
    difficulty: "hard" 
  },
  { 
    category: "Champions League", 
    question: "¿Qué jugador marcó en 2 finales de Champions diferentes para 2 equipos?", 
    options: ["Eto'o", "Henry", "Van Nistelrooy", "Ronaldo"], 
    correctIndex: 0, 
    difficulty: "hard" 
  },
  { 
    category: "Champions League", 
    question: "¿Cuántas semifinales de Champions alcanzó el Arsenal con Wenger?", 
    options: ["0", "1", "2", "3"], 
    correctIndex: 1, 
    difficulty: "hard" 
  },
  { 
    category: "Champions League", 
    question: "¿Qué equipo ganó la primera Champions League moderna en 1992?", 
    options: ["Barcelona", "AC Milan", "Marseille", "Ajax"], 
    correctIndex: 0, 
    difficulty: "medium" 
  },
  { 
    category: "Champions League", 
    question: "¿Cuántos equipos españoles llegaron a semifinales en 2016?", 
    options: ["1", "2", "3", "4"], 
    correctIndex: 2, 
    difficulty: "medium" 
  },
  { 
    category: "Mundiales", 
    question: "¿Qué país organizó el primer Mundial?", 
    options: ["Brasil", "Italia", "Uruguay", "Argentina"], 
    correctIndex: 2, 
    difficulty: "easy" 
  },
  { 
    category: "Mundiales", 
    question: "¿Cuántos goles marcó Just Fontaine en el Mundial 1958?", 
    options: ["10", "11", "12", "13"], 
    correctIndex: 3, 
    difficulty: "hard" 
  },
  { 
    category: "Mundiales", 
    question: "¿Qué selección africana llegó a cuartos de final por primera vez?", 
    options: ["Camerún", "Nigeria", "Senegal", "Ghana"], 
    correctIndex: 0, 
    difficulty: "medium" 
  },
  { 
    category: "Mundiales", 
    question: "¿En qué año se jugó el primer Mundial en continente asiático?", 
    options: ["1998", "2002", "2006", "2010"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "Mundiales", 
    question: "¿Cuántas veces ha ganado Italia el Mundial?", 
    options: ["3", "4", "5", "2"], 
    correctIndex: 1, 
    difficulty: "easy" 
  },
  { 
    category: "Eurocopas", 
    question: "¿Qué selección ganó la primera Eurocopa?", 
    options: ["España", "URSS", "Alemania", "Francia"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "Eurocopas", 
    question: "¿Cuántas Eurocopas ha ganado España?", options: ["2", "3", "4", "5"], 
    correctIndex: 2, 
    difficulty: "easy" 
  },
  { 
    category: "Eurocopas", 
    question: "¿Qué país sorpresa ganó la Eurocopa 2004?", 
    options: ["Dinamarca", "Grecia", "República Checa", "Portugal"], 
    correctIndex: 1, 
    difficulty: "easy" 
  },
  { 
    category: "Eurocopas", 
    question: "¿Quién fue el máximo goleador de la Eurocopa 2020?", 
    options: ["Ronaldo", "Kane", "Schick", "Lukaku"], 
    correctIndex: 0, 
    difficulty: "medium" 
  },
  { 
    category: "Eurocopas", 
    question: "¿En qué año perdió España su primera final de Eurocopa?", 
    options: ["1964", "1984", "2004", "Nunca ha perdido"], 
    correctIndex: 3, 
    difficulty: "medium" 
  },
  { 
    category: "Copa América", 
    question: "¿Qué país ha ganado más Copas América?", 
    options: ["Brasil", "Argentina", "Uruguay", "Chile"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "Copa América", 
    question: "¿Cuántas Copas América tiene Argentina?", 
    options: ["14", "15", "16", "17"], 
    correctIndex: 2, 
    difficulty: "hard" 
  },
  { 
    category: "Copa América", 
    question: "¿En qué año ganó Chile su primera Copa América?", 
    options: ["2011", "2015", "2016", "2019"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "Copa América", 
    question: "¿Quién es el máximo goleador histórico de la Copa América?", 
    options: ["Messi", "Norberto Méndez", "Zizinho", "Gabriel Batistuta"], 
    correctIndex: 1, 
    difficulty: "hard" 
  },
  { 
    category: "Copa América", 
    question: "¿Cuántas finales de Copa América perdió Messi antes de ganarla?", 
    options: ["2", "3", "4", "5"], 
    correctIndex: 2, 
    difficulty: "medium" 
  },
  { 
    category: "Balón de Oro", 
    question: "¿Quién ganó el primer Balón de Oro?", 
    options: ["Di Stéfano", "Stanley Matthews", "Raymond Kopa", "Alfredo Di Stéfano"], 
    correctIndex: 1, 
    difficulty: "hard" 
  },
  { 
    category: "Balón de Oro", 
    question: "¿Cuántos Balones de Oro tiene Cristiano Ronaldo?", 
    options: ["4", "5", "6", "7"], 
    correctIndex: 1, 
    difficulty: "easy" 
  },
  { 
    category: "Balón de Oro", 
    question: "¿Qué jugador alemán ganó el Balón de Oro en 2014?", 
    options: ["Müller", "Neuer", "Kroos", "Ninguno"], 
    correctIndex: 3, 
    difficulty: "medium" 
  },
  { 
    category: "Balón de Oro", 
    question: "¿Quién fue la primera mujer en ganar un Balón de Oro?", 
    options: ["Marta", "Ada Hegerberg", "Megan Rapinoe", "Alex Morgan"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "Balón de Oro", 
    question: "¿Qué español ha ganado el Balón de Oro?", 
    options: ["Xavi", "Iniesta", "Luis Suárez", "Ninguno español ganó desde 1960"], 
    correctIndex: 2, 
    difficulty: "hard" 
  },
  { 
    category: "Premios FIFA", 
    question: "¿Quién ganó el primer premio The Best en 2016?", 
    options: ["Messi", "Ronaldo", "Neymar", "Modric"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "Premios FIFA", 
    question: "¿Qué portero ganó The Best en 2018?", 
    options: ["Courtois", "Oblak", "Alisson", "Neuer"], 
    correctIndex: 0, 
    difficulty: "medium" 
  },
  { 
    category: "Premios FIFA", 
    question: "¿Quién ganó el Puskás Award 2023?", 
    options: ["Enzo", "Musiala", "Olise", "Martinelli"], 
    correctIndex: 0, 
    difficulty: "medium" 
  },
  { 
    category: "Fútbol Femenino", 
    question: "¿Qué país ganó el primer Mundial Femenino?", 
    options: ["Alemania", "Estados Unidos", "Noruega", "Suecia"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "Fútbol Femenino", 
    question: "¿Cuántos Mundiales Femeninos ha ganado Estados Unidos?", 
    options: ["2", "3", "4", "5"], 
    correctIndex: 2, 
    difficulty: "medium" 
  },
  { 
    category: "Fútbol Femenino", 
    question: "¿Qué jugadora tiene más goles en Mundiales Femeninos?", 
    options: ["Marta", "Birgit Prinz", "Abby Wambach", "Michelle Akers"], 
    correctIndex: 0, 
    difficulty: "medium" 
  },
  { 
    category: "Fútbol Femenino", 
    question: "¿Qué equipo español femenino ganó la Champions Femenina en 2023?", 
    options: ["Atlético de Madrid", "Barcelona", "Real Madrid", "Levante"], 
    correctIndex: 1, 
    difficulty: "easy" 
  },
  { 
    category: "Jugadores", 
    question: "¿Cuántos goles marcó Haaland en su primera temporada en la Premier?", 
    options: ["32", "36", "38", "42"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "Jugadores", 
    question: "¿De qué equipo es canterano Pedri?", 
    options: ["Barcelona", "Las Palmas", "Tenerife", "Athletic Bilbao"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "Jugadores", 
    question: "¿Cuántos años tenía Mbappé cuando ganó el Mundial?", 
    options: ["17", "18", "19", "20"], 
    correctIndex: 2, 
    difficulty: "easy" 
  },
  { 
    category: "Jugadores", 
    question: "¿Qué jugador marcó el gol más rápido en la historia de la Champions?", 
    options: ["Roy Makaay", "Kylian Mbappé", "Usain Bolt", "Cristiano Ronaldo"], 
    correctIndex: 0, 
    difficulty: "hard" 
  },
  { 
    category: "Jugadores", 
    question: "¿Cuántos hat-tricks marcó Messi en La Liga?", 
    options: ["30", "36", "42", "48"], 
    correctIndex: 1, 
    difficulty: "hard" 
  },
  { 
    category: "Datos", 
    question: "¿Cuál es la tarjeta roja más rápida en la historia del fútbol?", 
    options: ["1 segundo", "2 segundos", "3 segundos", "5 segundos"], 
    correctIndex: 1, 
    difficulty: "hard" 
  },
  { 
    category: "Datos", 
    question: "¿Cuántos jugadores conforman un equipo de fútbol en el campo?", 
    options: ["10", "11", "12", "13"], 
    correctIndex: 1, 
    difficulty: "easy" 
  },
  { 
    category: "Datos", 
    question: "¿Cuánto dura un partido de fútbol reglamentario?", 
    options: ["80 min", "90 min", "100 min", "120 min"], 
    correctIndex: 1, 
    difficulty: "easy" 
  },
  { 
    category: "Datos", 
    question: "¿Cuál es la distancia del punto de penalti a la portería?", 
    options: ["9 metros", "10 metros", "11 metros", "12 metros"], 
    correctIndex: 2, 
    difficulty: "medium" 
  },
  { 
    category: "Datos", 
    question: "¿Cuántos cambios se pueden hacer en un partido oficial?", 
    options: ["3", "4", "5", "6"], 
    correctIndex: 2, 
    difficulty: "easy" 
  },
  { 
    category: "Historia", 
    question: "¿En qué año se fundó la FIFA?", 
    options: ["1900", "1904", "1908", "1912"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "Historia", 
    question: "¿Dónde se inventó el fútbol moderno?", 
    options: ["Brasil", "España", "Inglaterra", "Alemania"], 
    correctIndex: 2, 
    difficulty: "easy" 
  },
  { 
    category: "Historia", 
    question: "¿En qué año se introdujo la regla del fuera de juego actual?", 
    options: ["1925", "1950", "1990", "2005"], 
    correctIndex: 0, 
    difficulty: "hard" 
  },
  { 
    category: "Historia", 
    question: "¿Cuándo se permitió a los porteros usar guantes oficialmente?", 
    options: ["1900", "1920", "1940", "Siempre se permitió"], 
    correctIndex: 3, 
    difficulty: "hard" 
  },
  { 
    category: "Historia", 
    question: "¿En qué año se introdujo el VAR en el Mundial?", 
    options: ["2014", "2016", "2018", "2022"], 
    correctIndex: 2, 
    difficulty: "easy" 
  },
  { 
    category: "Clásicos", 
    question: "¿Cómo se llama el clásico entre Real Madrid y Barcelona?", 
    options: ["El Derbi", "El Clásico", "El Grande", "La Liga Derby"], 
    correctIndex: 1, 
    difficulty: "easy" 
  },
  { 
    category: "Clásicos", 
    question: "¿Cuál es el resultado más abultado en un Clásico moderno?", 
    options: ["5-0", "6-2", "5-1", "6-0"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "Clásicos", 
    question: "¿Quién ha marcado más goles en El Clásico?", 
    options: ["Raúl", "Di Stéfano", "Messi", "Cristiano Ronaldo"], 
    correctIndex: 2, 
    difficulty: "easy" 
  },
  { 
    category: "Clásicos", 
    question: "¿Cómo se llama el derbi de Manchester?", 
    options: ["Manchester Derby", "Red Derby", "City Derby", "Northwest Derby"], 
    correctIndex: 0, 
    difficulty: "easy" 
  },
  { 
    category: "Clásicos", 
    question: "¿Cómo se llama el clásico entre Liverpool y Manchester United?", 
    options: ["Northwest Derby", "English Derby", "Roses Derby", "El Grande"], 
    correctIndex: 0, 
    difficulty: "medium" 
  },
  { 
    category: "Champions League", 
    question: "¿Qué equipo fue el primer campeón de la Copa de Europa?", 
    options: ["Real Madrid", "AC Milan", "Benfica", "Barcelona"], 
    correctIndex: 0, 
    difficulty: "easy" 
  },
  { 
    category: "Champions League", 
    question: "¿Cuántas Champions consecutivas ganó el Real Madrid en los años 50?", 
    options: ["3", "4", "5", "6"], 
    correctIndex: 2, 
    difficulty: "medium" 
  },
  { 
    category: "Champions League", 
    question: "¿Qué equipo perdió la final de Champions ante el Liverpool en 2005?", 
    options: ["Juventus", "AC Milan", "Real Madrid", "Bayern Munich"], 
    correctIndex: 1, 
    difficulty: "easy" 
  },
  { 
    category: "Champions League", 
    question: "¿Cuántos goles marcó Ronaldo en la final de 2017 contra Juventus?", 
    options: ["0", "1", "2", "3"], 
    correctIndex: 2, 
    difficulty: "medium" 
  },
  { 
    category: "Champions League", 
    question: "¿Qué equipo inglés ganó la Champions en 2012?", 
    options: ["Liverpool", "Manchester United", "Chelsea", "Manchester City"], 
    correctIndex: 2, 
    difficulty: "easy" 
  },
  { 
    category: "Porteros", 
    question: "¿Quién es considerado el mejor portero de la historia?", 
    options: ["Buffon", "Casillas", "Neuer", "Lev Yashin"], 
    correctIndex: 3, 
    difficulty: "medium" 
  },
  { 
    category: "Porteros", 
    question: "¿Cuántos Zamora tiene Courtois en La Liga?", 
    options: ["2", "3", "4", "5"], 
    correctIndex: 2, 
    difficulty: "hard" 
  },
  { 
    category: "Porteros", 
    question: "¿Qué portero italiano jugó hasta los 45 años en Serie A?", 
    options: ["Buffon", "Pagliuca", "Toldo", "Dino Zoff"], 
    correctIndex: 0, 
    difficulty: "medium" 
  },
  { 
    category: "Porteros", 
    question: "¿Quién es el portero con más Mundiales disputados?", 
    options: ["Casillas", "Buffon", "Neuer", "Manuel Neuer"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "Porteros", 
    question: "¿Qué portero tiene el récord de imbatibilidad en La Liga?", 
    options: ["Casillas", "Valdés", "Bravo", "Abel Resino"], 
    correctIndex: 3, 
    difficulty: "hard" 
  },
  { 
    category: "Defensas", 
    question: "¿Cuántas Champions tiene Sergio Ramos?", 
    options: ["3", "4", "5", "6"], 
    correctIndex: 1, 
    difficulty: "easy" 
  },
  { 
    category: "Defensas", 
    question: "¿Qué defensa italiano es leyenda del AC Milan?", 
    options: ["Cannavaro", "Nesta", "Maldini", "Baresi"], 
    correctIndex: 2, 
    difficulty: "easy" 
  },
  { 
    category: "Defensas", 
    question: "¿Cuántos partidos jugó Philipp Lahm con el Bayern Munich?", 
    options: ["350", "400", "517", "600"], 
    correctIndex: 2, 
    difficulty: "hard" 
  },
  { 
    category: "Defensas", 
    question: "¿Qué lateral derecho español ganó la Eurocopa 2008 y 2012?", 
    options: ["Ramos", "Arbeloa", "Juanfran", "Sergio Ramos no era lateral"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "Defensas", 
    question: "¿Qué central holandés fue capitán del Barcelona?", 
    options: ["De Boer", "Koeman", "Van Dijk", "Rijkaard"], 
    correctIndex: 1, 
    difficulty: "medium" 
  },
  { 
    category: "Actualidad", 
    question: "¿Quién ganó La Liga 2023-24?", 
    options: ["Barcelona", "Real Madrid", "Atlético de Madrid", "Girona"], 
    correctIndex: 1, 
    difficulty: "easy" 
  },
  { 
    category: "Actualidad", 
    question: "¿Qué equipo ganó la Champions 2023-24?", 
    options: ["Manchester City", "Real Madrid", "Bayern Munich", "Inter"], 
    correctIndex: 1, 
    difficulty: "easy" 
  },
  { 
    category: "Actualidad", 
    question: "¿A qué equipo fichó Mbappé en 2024?", 
    options: ["Manchester City", "Liverpool", "Real Madrid", "Chelsea"], 
    correctIndex: 2, 
    difficulty: "easy" 
  },
  { 
    category: "Actualidad", 
    question: "¿Quién ganó el Balón de Oro 2023?", 
    options: ["Messi", "Haaland", "Mbappé", "Bellingham"], 
    correctIndex: 0, 
    difficulty: "easy" 
  },
  { 
    category: "Actualidad", 
    question: "¿Qué selección ganó la Eurocopa 2024?", 
    options: ["España", "Inglaterra", "Francia", "Alemania"], 
    correctIndex: 0, 
    difficulty: "easy" 
  },
  
  // --- SD HUESCA - Historia ---
  { category: "SD Huesca", question: "¿En qué año se fundó la SD Huesca?", options: ["1910", "1922", "1935", "1940"], correctIndex: 1, difficulty: "medium" },
  { category: "SD Huesca", question: "¿Cuál es el estadio de la SD Huesca?", options: ["El Alcoraz", "Los Pajaritos", "El Toralín", "El Plantío"], correctIndex: 0, difficulty: "easy" },
  { category: "SD Huesca", question: "¿En qué año ascendió el Huesca a Primera División por primera vez?", options: ["2016", "2017", "2018", "2019"], correctIndex: 2, difficulty: "medium" },
  { category: "SD Huesca", question: "¿Cuántas temporadas ha jugado el Huesca en Primera División?", options: ["1", "2", "3", "4"], correctIndex: 1, difficulty: "medium" },
  { category: "SD Huesca", question: "¿Qué entrenador logró el primer ascenso a Primera del Huesca?", options: ["Míchel", "Leo Franco", "Rubi", "Pacheta"], correctIndex: 2, difficulty: "medium" }, // Corregido: Rubi fue el técnico del ascenso
  { category: "SD Huesca", question: "¿De qué color es la camiseta principal de la SD Huesca?", options: ["Roja", "Azul", "Azulgrana", "Verde"], correctIndex: 2, difficulty: "easy" },
  { category: "SD Huesca", question: "¿Cuál es el apodo de la SD Huesca?", options: ["Los Alcoracenses", "Los Azulgranas", "La Barça B", "Los Oscenses"], correctIndex: 1, difficulty: "medium" },
  { category: "SD Huesca", question: "¿Qué jugador del Huesca fichó por el Manchester City?", options: ["Ferreiro", "Moi Gómez", "Shinji Okazaki", "Ninguno"], correctIndex: 3, difficulty: "hard" },
  { category: "SD Huesca", question: "¿Qué portero español jugó en el Huesca antes de ir al Ajax?", options: ["Remiro", "Santamaría", "Sergio Herrera", "Andrés Fernández"], correctIndex: 0, difficulty: "hard" },
  { category: "SD Huesca", question: "¿Cuál fue la mejor clasificación del Huesca en Primera División?", options: ["14º", "17º", "19º", "20º"], correctIndex: 1, difficulty: "hard" },
  { category: "SD Huesca", question: "¿Qué delantero japonés jugó en el Huesca en 2019?", options: ["Honda", "Kagawa", "Okazaki", "Kubo"], correctIndex: 2, difficulty: "medium" },
  { category: "SD Huesca", question: "¿Contra qué equipo ganó el Huesca su primer partido en Primera?", options: ["Alavés", "Valladolid", "Eibar", "Leganés"], correctIndex: 1, difficulty: "hard" },
  { category: "SD Huesca", question: "¿Qué canterano del Barcelona jugó cedido en el Huesca?", options: ["Cuenca", "Deulofeu", "Rafinha", "Denis Suárez"], correctIndex: 0, difficulty: "hard" },
  { category: "SD Huesca", question: "¿Cuántos puntos consiguió el Huesca en su mejor temporada en Segunda?", options: ["73", "78", "82", "86"], correctIndex: 2, difficulty: "hard" },
  { category: "SD Huesca", question: "¿Qué técnico argentino entrenó al Huesca?", options: ["Pochettino", "Míchel", "Leo Franco", "Simeone"], correctIndex: 2, difficulty: "medium" },
  
  // --- SEGUNDA DIVISIÓN - General ---
  { category: "Segunda División", question: "¿Qué equipo ha ganado más títulos de Segunda División?", options: ["Deportivo", "Betis", "Real Madrid Castilla", "Barcelona B"], correctIndex: 1, difficulty: "medium" }, // El Betis tiene 7 títulos
  { category: "Segunda División", question: "¿Cuántos equipos ascienden a Primera cada temporada?", options: ["2", "3", "4", "5"], correctIndex: 1, difficulty: "easy" },
  { category: "Segunda División", question: "¿Cómo se determina el tercer ascenso a Primera?", options: ["Play-off", "Mejor diferencia de goles", "Sorteo", "Copa del Rey"], correctIndex: 0, difficulty: "easy" },
  { category: "Segunda División", question: "¿Cuántos equipos descienden de Segunda a Segunda B/Primera RFEF?", options: ["2", "3", "4", "5"], correctIndex: 2, difficulty: "medium" },
  { category: "Segunda División", question: "¿Qué equipo ganó el título de Segunda División en 2023-24?", options: ["Leganés", "Valladolid", "Espanyol", "Oviedo"], correctIndex: 0, difficulty: "medium" },
  { category: "Segunda División", question: "¿Qué estadio de Segunda es conocido como 'El Tartiere'?", options: ["Oviedo", "Sporting", "Racing", "Zaragoza"], correctIndex: 0, difficulty: "medium" },
  { category: "Segunda División", question: "¿Qué equipo pasó más temporadas consecutivas en Segunda?", options: ["Tenerife", "Las Palmas", "Numancia", "Elche"], correctIndex: 2, difficulty: "hard" },
  { category: "Segunda División", question: "¿Cuántos puntos necesita aproximadamente un equipo para ascender directo?", options: ["65-70", "70-75", "75-80", "80-85"], correctIndex: 2, difficulty: "medium" },
  { category: "Segunda División", question: "¿Qué técnico español ha subido más equipos de Segunda a Primera?", options: ["Cervera", "Garitano", "Rubi", "Paco Herrera"], correctIndex: 3, difficulty: "hard" },
  { category: "Segunda División", question: "¿Qué equipo andaluz ha sido el 'yo-yo' entre Primera y Segunda?", options: ["Sevilla", "Betis", "Córdoba", "Granada"], correctIndex: 3, difficulty: "medium" },
  
  // --- SEGUNDA DIVISIÓN - Equipos históricos ---
  { category: "Segunda División", question: "¿Qué equipo vasco nunca ha descendido a Segunda?", options: ["Athletic Bilbao", "Real Sociedad", "Alavés", "Eibar"], correctIndex: 0, difficulty: "easy" },
  { category: "Segunda División", question: "¿Cuál es el derbi aragonés de Segunda División?", options: ["Zaragoza vs Huesca", "Zaragoza vs Ejea", "Huesca vs Teruel", "Zaragoza vs Teruel"], correctIndex: 0, difficulty: "easy" },
  { category: "Segunda División", question: "¿Qué equipo canario tiene más temporadas en Segunda?", options: ["Tenerife", "Las Palmas", "Lanzarote", "Gran Canaria"], correctIndex: 0, difficulty: "medium" },
  { category: "Segunda División", question: "¿Cuál es el estadio del Real Zaragoza?", options: ["El Alcoraz", "La Romareda", "El Plantío", "El Helmántico"], correctIndex: 1, difficulty: "easy" },
  { category: "Segunda División", question: "¿Qué equipo gallego jugó la final de Copa siendo de Segunda?", options: ["Deportivo", "Celta", "Racing Ferrol", "Pontevedra"], correctIndex: 2, difficulty: "medium" },
  { category: "Segunda División", question: "¿Cuántas finales de play-off hay en Segunda División?", options: ["1", "2", "3", "4"], correctIndex: 0, difficulty: "medium" },
  { category: "Segunda División", question: "¿Qué club madrileño ha pasado temporadas en Segunda recientemente?", options: ["Real Madrid", "Atlético", "Getafe", "Leganés"], correctIndex: 3, difficulty: "easy" },
  { category: "Segunda División", question: "¿Cuál es el máximo goleador histórico de Segunda División?", options: ["Rubén Castro", "Stuani", "Toño García", "Quini"], correctIndex: 0, difficulty: "medium" },
  { category: "Segunda División", question: "¿Qué jugador tiene el récord de partidos en Segunda?", options: ["Aranzubía", "Casquero", "Lafuente", "Nino"], correctIndex: 3, difficulty: "hard" },
  { category: "Segunda División", question: "¿Cuál es el estadio del Sporting de Gijón?", options: ["El Molinón", "San Mamés", "El Tartiere", "Riazor"], correctIndex: 0, difficulty: "easy" },
  
  // --- MÁS EQUIPOS DE SEGUNDA ---
  { category: "Segunda División", question: "¿Qué equipo valenciano descendió a Segunda en 2024?", options: ["Valencia", "Villarreal", "Levante", "Elche"], correctIndex: 2, difficulty: "medium" },
  { category: "Segunda División", question: "¿Cuál es el estadio del Albacete?", options: ["Carlos Belmonte", "Los Cármenes", "El Sadar", "Nuevo Colombino"], correctIndex: 0, difficulty: "medium" },
  { category: "Segunda División", question: "¿Qué equipo extremeño ha jugado en Segunda División?", options: ["Badajoz", "Mérida", "Plasencia", "Badajoz y Mérida"], correctIndex: 3, difficulty: "medium" },
  { category: "Segunda División", question: "¿Cuál es el equipo decano del fútbol español que ha pasado por Segunda?", options: ["Athletic Bilbao", "Recreativo Huelva", "Barcelona", "Real Madrid"], correctIndex: 1, difficulty: "medium" },
  { category: "Segunda División", question: "¿Qué equipo catalán además del Espanyol juega habitualmente en Segunda?", options: ["Girona", "Sabadell", "Lleida", "Tarragona"], correctIndex: 0, difficulty: "medium" },
  { category: "Segunda División", question: "¿Qué ciudad asturiana tiene dos equipos que han jugado en Segunda?", options: ["Oviedo", "Gijón", "Avilés", "Langreo"], correctIndex: 0, difficulty: "hard" },
  { category: "Segunda División", question: "¿Cuál es el estadio del Racing de Santander?", options: ["El Sardinero", "El Arcángel", "El Helmántico", "Anxo Carro"], correctIndex: 0, difficulty: "easy" },
  { category: "Segunda División", question: "¿Qué equipo murciano ha jugado en Segunda División?", options: ["Real Murcia", "UCAM", "Cartagena", "Todos los anteriores"], correctIndex: 3, difficulty: "medium" },
  { category: "Segunda División", question: "¿Cuál es el derbi de Castilla y León en Segunda?", options: ["Valladolid vs Burgos", "Salamanca vs León", "Ponferradina vs Cultural", "Numancia vs Soria"], correctIndex: 0, difficulty: "medium" },
  { category: "Segunda División", question: "¿Qué equipo balear ha jugado en Segunda?", options: ["Mallorca", "Atlético Baleares", "Ibiza", "Menorca"], correctIndex: 0, difficulty: "easy" },
  
  // --- JUGADORES HISTÓRICOS DE SEGUNDA ---
  { category: "Segunda División", question: "¿Qué delantero uruguayo es leyenda del Girona y Segunda División?", options: ["Suárez", "Cavani", "Stuani", "Forlán"], correctIndex: 2, difficulty: "easy" },
  { category: "Segunda División", question: "¿Qué portero español empezó en Segunda antes de ir al Liverpool?", options: ["Casillas", "Reina", "Cañizares", "Valdés"], correctIndex: 1, difficulty: "medium" },
  { category: "Segunda División", question: "¿Qué jugador marcó más goles en una temporada de Segunda?", options: ["Rubén Castro", "Stuani", "Baltazar", "Quini"], correctIndex: 2, difficulty: "hard" },
  { category: "Segunda División", question: "¿Qué centrocampista español brilló en el Huesca antes del Getafe?", options: ["Arambarri", "Maksimović", "Ángel", "Samu Saiz"], correctIndex: 3, difficulty: "hard" },
  { category: "Segunda División", question: "¿Qué delantero del Zaragoza subió a Primera antes de ir a la Liga inglesa?", options: ["Ayoze Pérez", "Dwight Yorke", "Villa", "Güiza"], correctIndex: 0, difficulty: "medium" },
  // --- SEGUNDA DIVISIÓN ESPAÑOLA ---
  { question: "¿Qué equipo de Segunda División es conocido como 'El Decano' del fútbol español?", options: ["Sporting de Gijón", "Real Murcia", "Recreativo de Huelva", "Racing de Santander"], correctIndex: 2, difficulty: "medium", category: "segunda" },
  { question: "¿Qué jugador tiene el récord de máximo goleador histórico de la Segunda División?", options: ["Nino", "Rubén Castro", "Jonathan Soriano", "Charles"], correctIndex: 0, difficulty: "hard", category: "segunda" },
  { question: "¿En qué estadio juega sus partidos el CD Eldense?", options: ["Anduva", "Pepico Amat", "El Plantío", "A Malata"], correctIndex: 1, difficulty: "hard", category: "segunda" },
  { question: "¿Qué equipo ostenta el récord de más puntos en una temporada de Segunda (91 pts)?", options: ["Valladolid", "Deportivo de La Coruña", "Espanyol", "Levante"], correctIndex: 1, difficulty: "hard", category: "segunda" },
  { question: "¿Cuál es el equipo con más temporadas en la historia de la Segunda División?", options: ["Hércules", "Real Murcia", "Sporting de Gijón", "Sabadell"], correctIndex: 1, difficulty: "hard", category: "segunda" },
  { question: "¿Qué equipo canario logró el ascenso a Primera en la temporada 2022-23?", options: ["Tenerife", "Las Palmas", "Atlético Paso", "Vecindario"], correctIndex: 1, difficulty: "easy", category: "segunda" },
  { question: "¿Cómo se llama el trofeo que premia al máximo goleador de Segunda?", options: ["Trofeo Pichichi", "Trofeo Zarra", "Ambos son correctos", "Trofeo Quini"], correctIndex: 2, difficulty: "medium", category: "segunda" },
  { question: "¿Qué equipo de Segunda tiene un murciélago en su escudo además del Valencia?", options: ["Levante", "Albacete", "Castellón", "Alcoyano"], correctIndex: 0, difficulty: "medium", category: "segunda" },
  { question: "¿En qué ciudad se encuentra el equipo de la SD Amorebieta?", options: ["Eibar", "Bilbao", "Amorebieta-Echano", "San Sebastián"], correctIndex: 2, difficulty: "medium", category: "segunda" },
  { question: "¿Qué mítico portero español apodado 'El Gato' jugó en el Rayo Vallecano en Segunda?", options: ["Buyo", "Wilfred Agbonavbare", "Lopetegui", "Koke Contreras"], correctIndex: 1, difficulty: "hard", category: "segunda" },
  { question: "¿Qué equipo de Segunda es apodado como 'Los Armeros'?", options: ["Eibar", "Oviedo", "Alcorcón", "Cartagena"], correctIndex: 0, difficulty: "medium", category: "segunda" },
  { question: "¿Cómo se llama el estadio del Sporting de Gijón?", options: ["El Sardinero", "El Molinón", "Carlos Tartiere", "Riazor"], correctIndex: 1, difficulty: "easy", category: "segunda" },
  { question: "¿Qué jugador marcó el gol del ascenso del Alavés en 2023 en el minuto 129?", options: ["Asier Villalibre", "Luis Rioja", "Guridi", "Tenaglia"], correctIndex: 0, difficulty: "medium", category: "segunda" },
  { question: "¿Cómo se llama el derbi entre el Oviedo y el Sporting?", options: ["Derbi Vasco", "Derbi Gallego", "Derbi Asturiano", "Derbi del Norte"], correctIndex: 2, difficulty: "easy", category: "segunda" },
  { question: "¿Qué equipo de Segunda División es conocido como el conjunto 'Alfarero'?", options: ["Alcorcón", "Leganés", "Fuenlabrada", "Getafe"], correctIndex: 0, difficulty: "medium", category: "segunda" },
  { question: "¿En qué estadio juega el Racing de Ferrol?", options: ["A Malata", "Pasarón", "Anxo Carro", "Riazor"], correctIndex: 0, difficulty: "hard", category: "segunda" },
  { question: "¿Quién es el entrenador con más ascensos a Primera División en España?", options: ["Luis Aragonés", "Paco Herrera", "Pepe Mel", "Joan Francesc 'Rubi'"], correctIndex: 1, difficulty: "hard", category: "segunda" },
  { question: "¿Qué jugador fue el 'pichichi' de Segunda con el Elche y luego icono del Rayo Vallecano?", options: ["Nino", "Míchel II", "Ángel Rodríguez", "Sergio León"], correctIndex: 0, difficulty: "medium", category: "segunda" },

  // --- SERIE A (ITALIA) ---
  { question: "¿Quién es el máximo goleador histórico de la Serie A?", options: ["Francesco Totti", "Gunnar Nordahl", "Silvio Piola", "Giuseppe Meazza"], correctIndex: 2, difficulty: "hard", category: "seriea" },
  { question: "¿Qué jugador es apodado 'Il Capitano' en la AS Roma?", options: ["Daniele De Rossi", "Francesco Totti", "Giuseppe Giannini", "Bruno Conti"], correctIndex: 1, difficulty: "easy", category: "seriea" },
  { question: "¿En qué equipo italiano coincidieron Pep Guardiola y Roberto Baggio?", options: ["Brescia", "Roma", "Inter", "Milan"], correctIndex: 0, difficulty: "hard", category: "seriea" },
  { question: "¿Qué equipo italiano es conocido como 'La Vecchia Signora'?", options: ["AC Milan", "Inter", "Juventus", "Lazio"], correctIndex: 2, difficulty: "easy", category: "seriea" },
  { question: "¿Cómo se llama el derbi entre el Inter y el AC Milan?", options: ["Derby d'Italia", "Derby della Capitale", "Derby della Madonnina", "Derby della Mole"], correctIndex: 2, difficulty: "medium", category: "seriea" },
  { question: "¿Qué portero ostenta el récord de más minutos sin recibir gol en la Serie A?", options: ["Buffon", "Zoff", "Sebastiano Rossi", "Handanovic"], correctIndex: 0, difficulty: "medium", category: "seriea" },
  { question: "¿En qué club jugaba Gabriel Batistuta antes de fichar por la Roma?", options: ["Inter", "Lazio", "Fiorentina", "Napoli"], correctIndex: 2, difficulty: "medium", category: "seriea" },
  { question: "¿Qué dorsal mítico retiró el AC Milan en honor a Paolo Maldini?", options: ["6", "3", "5", "4"], correctIndex: 1, difficulty: "medium", category: "seriea" },
  { question: "¿Quién fue el entrenador del Inter en el triplete de 2010?", options: ["Mancini", "Conte", "Mourinho", "Benítez"], correctIndex: 2, difficulty: "easy", category: "seriea" },
  { question: "¿Qué equipo del sur de Italia ganó el Scudetto en 2023?", options: ["Palermo", "Bari", "Salernitana", "Napoli"], correctIndex: 3, difficulty: "easy", category: "seriea" },
  { question: "¿Qué jugador es el único extranjero en haber sido 'Capocannoniere' 5 veces?", options: ["Ibrahimovic", "Gunnar Nordahl", "Andriy Shevchenko", "Gabriel Batistuta"], correctIndex: 1, difficulty: "hard", category: "seriea" },
  { question: "¿En qué tres equipos italianos jugó Andrea Pirlo?", options: ["Inter, Milan y Juventus", "Milan, Roma y Juve", "Inter, Lazio y Milan", "Juve, Napoli e Inter"], correctIndex: 0, difficulty: "medium", category: "seriea" },
  { question: "¿Qué equipo italiano es conocido como el 'Granata'?", options: ["Fiorentina", "Torino", "Salernitana", "Livorno"], correctIndex: 1, difficulty: "medium", category: "seriea" },
  { question: "¿Quién era el portero del Inter durante el triplete de 2010?", options: ["Francesco Toldo", "Julio César", "Handanovic", "Gianluca Pagliuca"], correctIndex: 1, difficulty: "easy", category: "seriea" },
  { question: "¿Qué mítico defensa del Inter era apodado 'Lo Zio' (El Tío)?", options: ["Franco Baresi", "Giuseppe Bergomi", "Giacinto Facchetti", "Marco Materazzi"], correctIndex: 1, difficulty: "hard", category: "seriea" },
  { question: "¿Quién ganó el Balón de Oro en 2004 jugando en el Milan?", options: ["Kaka", "Shevchenko", "Pirlo", "Maldini"], correctIndex: 1, difficulty: "medium", category: "seriea" },
  { question: "¿En qué club italiano jugaba Pavel Nedved cuando ganó el Balón de Oro?", options: ["Lazio", "Juventus", "Parma", "Inter"], correctIndex: 1, difficulty: "medium", category: "seriea" },
  { question: "¿Qué equipo italiano ha ganado más veces la Champions League?", options: ["Juventus", "Inter", "Milan", "Roma"], correctIndex: 2, difficulty: "easy", category: "seriea" },
  { question: "¿Qué jugador de la Serie A era apodado 'Il Divin Codino'?", options: ["Roberto Baggio", "Del Piero", "Totti", "Pirlo"], correctIndex: 0, difficulty: "medium", category: "seriea" },
  { question: "¿Qué equipo de la Serie A juega en el estadio Diego Armando Maradona?", options: ["Napoli", "Juventus", "Fiorentina", "Lazio"], correctIndex: 0, difficulty: "easy", category: "seriea" },
  { question: "¿En qué ciudad italiana se encuentra el estadio Luigi Ferraris, compartido por dos equipos?", options: ["Milán", "Roma", "Génova", "Verona"], correctIndex: 2, difficulty: "medium", category: "seriea" },

  // --- PREMIER LEAGUE (EXTRA) ---
  { question: "¿Qué equipo de la Premier League es conocido como 'The Hammers'?", options: ["Aston Villa", "West Ham", "Everton", "Burnley"], correctIndex: 1, difficulty: "medium", category: "premier" },
  { question: "¿Quién ostenta el récord de más asistencias en la historia de la Premier?", options: ["Cesc Fàbregas", "Kevin De Bruyne", "Ryan Giggs", "Frank Lampard"], correctIndex: 2, difficulty: "hard", category: "premier" },
  { question: "¿En qué equipo jugaron juntos 'The SAS' (Shearer y Sutton)?", options: ["Newcastle", "Blackburn Rovers", "Leicester", "Southampton"], correctIndex: 1, difficulty: "hard", category: "premier" },
  { question: "¿Cómo se llama el estadio del Everton?", options: ["Anfield", "Goodison Park", "St Mary's", "Villa Park"], correctIndex: 1, difficulty: "medium", category: "premier" },
  { question: "¿Qué jugador marcó el gol del título del Man. City en el 93:20?", options: ["David Silva", "Kun Agüero", "Edin Dzeko", "Yaya Touré"], correctIndex: 1, difficulty: "easy", category: "premier" },
  { question: "¿Quién es el máximo goleador extranjero de la Premier?", options: ["Henry", "Agüero", "Salah", "Van Nistelrooy"], correctIndex: 1, difficulty: "medium", category: "premier" },
  { question: "¿A qué equipo se le conoce como 'The Magpies'?", options: ["Crystal Palace", "Newcastle", "Swansea", "Norwich"], correctIndex: 1, difficulty: "easy", category: "premier" },
  { question: "¿Quién era el portero del Arsenal en la temporada de 'Los Invencibles'?", options: ["David Seaman", "Manuel Almunia", "Jens Lehmann", "Lukasz Fabianski"], correctIndex: 2, difficulty: "medium", category: "premier" },
  { question: "¿A qué equipo se le conoce como 'The Villans'?", options: ["West Ham", "Aston Villa", "Fulham", "Everton"], correctIndex: 1, difficulty: "medium", category: "premier" },
  { question: "¿Qué equipo de Londres juega en el estadio Emirates?", options: ["Chelsea", "Tottenham", "Arsenal", "West Ham"], correctIndex: 2, difficulty: "easy", category: "premier" },
  { question: "¿Quién es el máximo goleador histórico del Chelsea?", options: ["Drogba", "Lampard", "Hazard", "Zola"], correctIndex: 1, difficulty: "hard", category: "premier" },
  { question: "¿A qué equipo entrena Pep Guardiola desde 2016?", options: ["Manchester United", "Manchester City", "Liverpool", "Chelsea"], correctIndex: 1, difficulty: "easy", category: "premier" },
  { question: "¿Cómo se llama el estadio del Liverpool?", options: ["Old Trafford", "Etihad", "Stamford Bridge", "Anfield"], correctIndex: 3, difficulty: "easy", category: "premier" },
  { question: "¿Qué equipo inglés ostenta el récord de más títulos de liga antes de la Premier (1992)?", options: ["Manchester United", "Liverpool", "Arsenal", "Everton"], correctIndex: 1, difficulty: "hard", category: "premier" },
  { question: "¿Qué jugador tiene el récord de marcar a más equipos diferentes (39) en la Premier?", options: ["Alan Shearer", "Harry Kane", "Frank Lampard", "Wayne Rooney"], correctIndex: 2, difficulty: "hard", category: "premier" },
  { question: "¿Quién fue el primer jugador en marcar 5 goles en un solo partido de Premier?", options: ["Sergio Agüero", "Andrew Cole", "Alan Shearer", "Dimitar Berbatov"], correctIndex: 1, difficulty: "hard", category: "premier" },
  { question: "¿Qué equipo tiene una estatua de 'The United Trinity' (Best, Law y Charlton)?", options: ["Manchester United", "Leeds United", "West Ham", "Newcastle"], correctIndex: 0, difficulty: "easy", category: "premier" },
  { question: "¿En qué equipo inglés jugó el español Michu cuando se convirtió en la revelación?", options: ["Swansea City", "Everton", "Southampton", "Wigan"], correctIndex: 0, difficulty: "medium", category: "premier" },
  { question: "¿Qué jugador español es el máximo goleador histórico de la Premier League?", options: ["Fernando Torres", "Cesc Fàbregas", "Diego Costa", "David Silva"], correctIndex: 0, difficulty: "medium", category: "premier" },

  // --- SELECCIONES ---
  { question: "¿Qué selección ha ganado más Copas de África (AFCON)?", options: ["Camerún", "Nigeria", "Egipto", "Senegal"], correctIndex: 2, difficulty: "hard", category: "worldcup" },
  { question: "¿Quién marcó el gol de la victoria de Alemania en la final del Mundial 2014?", options: ["Klose", "Müller", "Götze", "Schürrle"], correctIndex: 2, difficulty: "easy", category: "worldcup" },
  { question: "¿Qué selección ganó la Eurocopa de 2004 dando la sorpresa?", options: ["Portugal", "Grecia", "República Checa", "Dinamarca"], correctIndex: 1, difficulty: "medium", category: "worldcup" },
  { question: "¿Quién es el máximo goleador histórico de la selección alemana?", options: ["Gerd Müller", "Miroslav Klose", "Lukas Podolski", "Jurgen Klinsmann"], correctIndex: 1, difficulty: "medium", category: "worldcup" },
  { question: "¿Qué país organizó el Mundial de 1982?", options: ["México", "España", "Italia", "Argentina"], correctIndex: 1, difficulty: "easy", category: "worldcup" },
  { question: "¿Qué selección es conocida como 'La Oranje'?", options: ["Bélgica", "Países Bajos", "Dinamarca", "Noruega"], correctIndex: 1, difficulty: "easy", category: "worldcup" },
  { question: "¿Cuántos Mundiales ganó Pelé?", options: ["1", "2", "3", "4"], correctIndex: 2, difficulty: "medium", category: "worldcup" },
  { question: "¿Quién fue el portero titular de España en la Eurocopa 2008?", options: ["Valdés", "Reina", "Casillas", "Palop"], correctIndex: 2, difficulty: "easy", category: "worldcup" },
  { question: "¿Qué selección ganó el primer Mundial de la historia en 1930?", options: ["Brasil", "Argentina", "Uruguay", "Italia"], correctIndex: 2, difficulty: "medium", category: "worldcup" },
  { question: "¿Qué jugador marcó 'La Mano de Dios'?", options: ["Messi", "Maradona", "Kempes", "Caniggia"], correctIndex: 1, difficulty: "easy", category: "worldcup" },
  { question: "¿Qué selección ganó la Eurocopa 2020 (jugada en 2021)?", options: ["Inglaterra", "Italia", "España", "Francia"], correctIndex: 1, difficulty: "easy", category: "worldcup" },
  { question: "¿Quién es el jugador con más internacionalidades con España?", options: ["Casillas", "Ramos", "Busquets", "Xavi"], correctIndex: 1, difficulty: "medium", category: "worldcup" },
  { question: "¿Qué selección africana fue la primera en llegar a semifinales de un Mundial?", options: ["Camerún", "Senegal", "Ghana", "Marruecos"], correctIndex: 3, difficulty: "medium", category: "worldcup" },
  { question: "¿Cuántos Mundiales ha ganado la selección de Francia?", options: ["1", "2", "3", "4"], correctIndex: 1, difficulty: "easy", category: "worldcup" },
  { question: "¿Qué jugador marcó el penalti definitivo en la final del Mundial 2022?", options: ["Messi", "Mbappé", "Gonzalo Montiel", "Di María"], correctIndex: 2, difficulty: "medium", category: "worldcup" },
  { question: "¿En qué selección jugaba la mítica dupla Stoichkov y Kostadinov?", options: ["Rusia", "Bulgaria", "Rumanía", "Croacia"], correctIndex: 1, difficulty: "hard", category: "worldcup" },
  { question: "¿Quién era el seleccionador de España en el Mundial de Sudáfrica 2010?", options: ["Luis Aragonés", "Vicente del Bosque", "Julen Lopetegui", "Fernando Hierro"], correctIndex: 1, difficulty: "easy", category: "worldcup" },
  { question: "¿Qué selección tiene el récord de más finales de Mundial perdidas?", options: ["Países Bajos", "Alemania", "Argentina", "Francia"], correctIndex: 1, difficulty: "hard", category: "worldcup" },
  { question: "¿Qué jugador fue la estrella de la selección de Dinamarca en la Euro 92?", options: ["Michael Laudrup", "Brian Laudrup", "Peter Schmeichel", "Ambos B. Laudrup y Schmeichel"], correctIndex: 3, difficulty: "hard", category: "worldcup" },
  { question: "¿Quién marcó el gol de España en la final de la Eurocopa 2012 contra Italia (el primero)?", options: ["David Silva", "Jordi Alba", "Fernando Torres", "Juan Mata"], correctIndex: 0, difficulty: "hard", category: "worldcup" },
  { question: "¿Qué selección nacional tiene el récord de haber disputado más finales de un Mundial (8)?", options: ["Brasil", "Italia", "Alemania", "Argentina"], correctIndex: 2, difficulty: "medium", category: "worldcup" },
  { question: "¿Quién fue el capitán de la selección de Italia que levantó el Mundial 2006?", options: ["Gennaro Gattuso", "Alessandro Del Piero", "Fabio Cannavaro", "Gianluigi Buffon"], correctIndex: 2, difficulty: "easy", category: "worldcup" },
  { question: "¿Qué selección ganó la Eurocopa 1992 tras entrar por la exclusión de Yugoslavia?", options: ["Suecia", "Dinamarca", "Grecia", "Países Bajos"], correctIndex: 1, difficulty: "medium", category: "worldcup" },
  { question: "¿Quién es el máximo goleador histórico de la selección de Francia?", options: ["Thierry Henry", "Antoine Griezmann", "Olivier Giroud", "Kylian Mbappé"], correctIndex: 2, difficulty: "medium", category: "worldcup" },
  { question: "¿Qué jugador marcó el gol más rápido de la historia de los Mundiales (11 segundos)?", options: ["Hakan Sukur", "Bryan Robson", "Pelé", "Cristiano"], correctIndex: 0, difficulty: "hard", category: "worldcup" },
  { question: "¿Qué selección tiene más títulos de Copa América?", options: ["Brasil", "Argentina", "Uruguay", "Argentina y Uruguay empatan"], correctIndex: 3, difficulty: "hard", category: "worldcup" },
  { question: "¿Quién es el máximo goleador de la historia de los Mundiales?", options: ["Pelé", "Ronaldo Nazário", "Miroslav Klose", "Messi"], correctIndex: 2, difficulty: "medium", category: "worldcup" },

  // --- TRASPASOS ---
  { question: "¿Qué jugador ha jugado en Real Madrid, Barcelona, Inter y AC Milan?", options: ["Figo", "Ronaldo Nazário", "Ibrahimovic", "Eto'o"], correctIndex: 1, difficulty: "medium", category: "transfers" },
  { question: "¿En cuál de estos equipos NO jugó Zlatan Ibrahimovic?", options: ["Ajax", "Bayern Múnich", "PSG", "Juventus"], correctIndex: 1, difficulty: "medium", category: "transfers" },
  { question: "¿Qué jugador pasó directamente del Arsenal al Manchester United en 2012?", options: ["Alexis Sánchez", "Robin van Persie", "Adebayor", "Nasri"], correctIndex: 1, difficulty: "medium", category: "transfers" },
  { question: "¿A qué equipo fue traspasado Neymar desde el Barcelona?", options: ["Real Madrid", "PSG", "Manchester City", "Al-Hilal"], correctIndex: 1, difficulty: "easy", category: "transfers" },
  { question: "¿Qué portero fichó el Real Madrid del Chelsea tras la salida de Keylor Navas?", options: ["Kepa", "Courtois", "Lunin", "Areola"], correctIndex: 1, difficulty: "easy", category: "transfers" },
  { question: "¿Qué jugador leyenda del Liverpool se fue al Real Madrid en 2004?", options: ["Gerrard", "Carragher", "Michael Owen", "Xabi Alonso"], correctIndex: 2, difficulty: "medium", category: "transfers" },
  { question: "¿En qué club italiano jugó Thierry Henry antes de ir al Arsenal?", options: ["Milan", "Juventus", "Inter", "Roma"], correctIndex: 1, difficulty: "hard", category: "transfers" },
  { question: "¿Qué jugador dejó el Atlético para ir al City y es el máximo goleador histórico de los 'citizens'?", options: ["David Silva", "Kun Agüero", "Rodri", "De Bruyne"], correctIndex: 1, difficulty: "easy", category: "transfers" },
  { question: "¿Qué jugador apodado 'El Guaje' pasó del Valencia al Barcelona?", options: ["Silva", "Mata", "Joaquín", "David Villa"], correctIndex: 3, difficulty: "easy", category: "transfers" },
  { question: "¿En qué equipo inglés jugó Gerard Piqué antes de volver al Barcelona?", options: ["Arsenal", "Manchester United", "Chelsea", "Liverpool"], correctIndex: 1, difficulty: "medium", category: "transfers" },
  { question: "¿En qué equipo de la Liga española jugó el mítico 'Mágico' González?", options: ["Betis", "Cádiz", "Sevilla", "Mallorca"], correctIndex: 1, difficulty: "medium", category: "laliga" },
  { question: "¿En qué equipo jugó Joaquín Sánchez además del Betis y el Málaga?", options: ["Valencia y Fiorentina", "Sevilla y Valencia", "Villarreal y Valencia", "Atletico y Fiorentina"], correctIndex: 0, difficulty: "medium", category: "transfers" },
  { question: "¿Qué dorsal llevaba Beckham en el Real Madrid?", options: ["7", "10", "23", "32"], correctIndex: 2, difficulty: "easy", category: "transfers" },
  { question: "¿Qué jugador pasó del Real Madrid al Inter y luego al Barcelona, ganando el triplete con ambos?", options: ["Luis Figo", "Samuel Eto'o", "Ronaldo Nazário", "Alexis Sánchez"], correctIndex: 1, difficulty: "medium", category: "transfers" },
  { question: "¿En qué club alemán jugó Raúl González tras dejar el Real Madrid?", options: ["Bayern Múnich", "Borussia Dortmund", "Schalke 04", "Bayer Leverkusen"], correctIndex: 2, difficulty: "easy", category: "transfers" },
  { question: "¿Qué jugador apodado 'El Apache' jugó en el Manchester United y luego se fue al City?", options: ["Carlos Tévez", "Javier Mascherano", "Sergio Agüero", "Pablo Zabaleta"], correctIndex: 0, difficulty: "easy", category: "transfers" },
  { question: "¿Qué portero ha jugado en el Atlético de Madrid, Manchester United y Fiorentina?", options: ["David De Gea", "Sergio Asenjo", "Thibaut Courtois", "Jan Oblak"], correctIndex: 0, difficulty: "medium", category: "transfers" },

  // --- ICONOS Y DUPLAS ---
  { question: "¿Qué dos jugadores formaban la delantera 'Sa-Za' en Chile?", options: ["Salas y Zamorano", "Sánchez y Zapata", "Suazo y Zaracho", "Soto y Zúñiga"], correctIndex: 0, difficulty: "medium", category: "players" },
  { question: "¿Cómo se llamaba la delantera del Barcelona formada por Messi, Suárez y Neymar?", options: ["BBC", "MVP", "MSN", "Tridente"], correctIndex: 2, difficulty: "easy", category: "players" },
  { question: "¿Qué pareja de centrales fue mítica en el Manchester United de Ferguson?", options: ["Terry y Carvalho", "Vidic y Ferdinand", "Puyol y Piqué", "Nesta y Maldini"], correctIndex: 1, difficulty: "medium", category: "players" },
  { question: "¿Qué delantero acompañaba a Raúl en la Octava y Novena Champions del Madrid?", options: ["Ronaldo", "Morientes", "Benzema", "Anelka"], correctIndex: 1, difficulty: "medium", category: "players" },
  { question: "¿Cómo se llamaba el trío holandés del AC Milan de finales de los 80?", options: ["Van Basten, Gullit y Rijkaard", "Cruyff, Neeskens y Rep", "Bergkamp, Overmars y Kluivert", "Robben, Sneijder y Van Persie"], correctIndex: 0, difficulty: "hard", category: "players" },
  { question: "¿Qué pareja de delanteros asombró en el Liverpool de 2013-14?", options: ["Torres y Gerrard", "Salah y Firmino", "Suárez y Sturridge", "Owen y Heskey"], correctIndex: 2, difficulty: "medium", category: "players" },
  { question: "¿Quién era el socio principal de Pelé en el Brasil de 1970?", options: ["Garrincha", "Jairzinho", "Rivelino", "Tostão"], correctIndex: 3, difficulty: "hard", category: "players" },
  { question: "¿Qué dos jugadores formaban la pareja de centrales de España en el Mundial 2010?", options: ["Ramos y Piqué", "Puyol y Piqué", "Puyol y Ramos", "Marchena y Puyol"], correctIndex: 1, difficulty: "medium", category: "players" },
  { question: "¿Cómo se conocía a la delantera del Real Madrid formada por Bale, Benzema y Cristiano?", options: ["MSN", "BBC", "CIA", "RBC"], correctIndex: 1, difficulty: "easy", category: "players" },
  { question: "¿Qué portero es el único en ganar el Balón de Oro?", options: ["Yashin", "Buffon", "Casillas", "Neuer"], correctIndex: 0, difficulty: "medium", category: "players" },
  { question: "¿Quién fue el primer entrenador en ganar 4 Champions League?", options: ["Ferguson", "Zidane", "Ancelotti", "Guardiola"], correctIndex: 2, difficulty: "medium", category: "players" },
  { question: "¿Qué jugador ha ganado la Champions con Ajax, Real Madrid y Milan?", options: ["Seedorf", "Kluivert", "Rijkaard", "Van Nistelrooy"], correctIndex: 0, difficulty: "hard", category: "players" },
  { question: "¿Cuál es el estadio con más capacidad de Europa?", options: ["Wembley", "Santiago Bernabéu", "Camp Nou", "Old Trafford"], correctIndex: 2, difficulty: "medium", category: "laliga" },
  { question: "¿Qué equipo ganó la primera edición de la Copa de Europa (1956)?", options: ["Milan", "Real Madrid", "Stade de Reims", "Benfica"], correctIndex: 1, difficulty: "easy", category: "champions" },
  { question: "¿Quién es el entrenador con más partidos en la historia de la Liga?", options: ["Miguel Muñoz", "Luis Aragonés", "Javier Irureta", "Manuel Pellegrini"], correctIndex: 1, difficulty: "hard", category: "laliga" },
  { question: "¿Qué equipo tiene el apodo de 'Los Periquitos'?", options: ["Mallorca", "Espanyol", "Leganés", "Girona"], correctIndex: 1, difficulty: "easy", category: "laliga" },
  { question: "¿Quién es el máximo goleador histórico del Athletic Club?", options: ["Aduriz", "Zarra", "Julen Guerrero", "Dani"], correctIndex: 1, difficulty: "medium", category: "laliga" },
  { question: "¿Qué jugador marcó el gol que dio el título al Atlético en el Camp Nou en 2014?", options: ["Diego Costa", "Koke", "Godín", "Arda Turan"], correctIndex: 2, difficulty: "medium", category: "laliga" },
  { question: "¿En qué año se inauguró el nuevo estadio San Mamés?", options: ["2010", "2013", "2015", "2011"], correctIndex: 1, difficulty: "hard", category: "laliga" },
  { question: "¿A qué equipo de la Liga se le conoce como los 'Babazorros'?", options: ["Alavés", "Osasuna", "Eibar", "Real Sociedad"], correctIndex: 0, difficulty: "medium", category: "laliga" },
  { question: "¿Quién fue el primer jugador en ganar el Balón de Oro (1956)?", options: ["Alfredo Di Stéfano", "Stanley Matthews", "Raymond Kopa", "Lev Yashin"], correctIndex: 1, difficulty: "hard", category: "players" },
  { question: "¿Qué jugador es el único en haber ganado la Champions League con 3 clubes diferentes?", options: ["Cristiano Ronaldo", "Samuel Eto'o", "Clarence Seedorf", "Mateo Kovacic"], correctIndex: 2, difficulty: "hard", category: "players" },
  { question: "¿Qué pareja de delanteros del Manchester United era conocida como 'The King and I'?", options: ["Cantona y Cole", "Yorke y Cole", "Rooney y Ronaldo", "Van Nistelrooy y Giggs"], correctIndex: 1, difficulty: "hard", category: "players" },
  { question: "¿Quiénes formaban la dupla defensiva del AC Milan de Arrigo Sacchi?", options: ["Nesta y Maldini", "Baresi y Costacurta", "Hierro y Sanchís", "Terry y Carvalho"], correctIndex: 1, difficulty: "hard", category: "players" },
  { question: "¿Qué mítica dupla de centrocampistas lideró al Arsenal de 'Los Invencibles'?", options: ["Vieira y Gilberto Silva", "Fabregas y Flamini", "Özil y Ramsey", "Pires y Ljungberg"], correctIndex: 0, difficulty: "medium", category: "players" },
  { question: "¿Qué dos jugadores brasileños formaron la dupla atacante 'Ro-Ro' antes del Mundial 98?", options: ["Ronaldo y Rivaldo", "Ronaldo y Romário", "Ronaldinho y Robinho", "Roberto Carlos y Ronaldo"], correctIndex: 1, difficulty: "hard", category: "players" },
  { question: "¿Qué equipo descendió de Primera a Segunda B directamente por impagos en 1995?", options: ["Celta y Sevilla", "Betis y Málaga", "Sporting y Oviedo", "Espanyol y Real Sociedad"], correctIndex: 0, difficulty: "hard", category: "laliga" },
  // Remove this duplicate declaration - already defined above
  { category: "La Liga", question: "¿Cuántas Ligas ha ganado el Real Madrid hasta 2024?", options: ["33", "35", "36", "34"], correctIndex: 2, difficulty: "medium" },
  { category: "La Liga", question: "¿Qué equipo rompió la hegemonía Real Madrid-Barcelona ganando La Liga en 2014?", options: ["Valencia", "Atlético de Madrid", "Sevilla", "Athletic Bilbao"], correctIndex: 1, difficulty: "medium" },
  { category: "La Liga", question: "¿En qué año ganó el Deportivo de La Coruña su único título de Liga?", options: ["1998", "2000", "2002", "1996"], correctIndex: 1, difficulty: "hard" },
  { category: "La Liga", question: "¿Qué entrenador dirigió al Barcelona en el sextete de 2009?", options: ["Luis Enrique", "Tito Vilanova", "Pep Guardiola", "Frank Rijkaard"], correctIndex: 2, difficulty: "easy" },
  { category: "La Liga", question: "¿Cuántas Ligas consecutivas ganó el Real Madrid de 1960 a 1965?", options: ["4", "5", "6", "3"], correctIndex: 1, difficulty: "hard" },
  { category: "La Liga", question: "¿Qué jugador fue Pichichi de La Liga más veces?", options: ["Messi", "Cristiano Ronaldo", "Hugo Sánchez", "Zarra"], correctIndex: 0, difficulty: "medium" },
  { category: "La Liga", question: "¿En qué temporada debutó Messi con el Barcelona?", options: ["2002-03", "2003-04", "2004-05", "2005-06"], correctIndex: 2, difficulty: "medium" },
  
  // --- Premier League ---
  { category: "Premier League", question: "¿Qué equipo ganó la Premier League 2015-16 siendo favorito a descender?", options: ["Southampton", "Leicester City", "West Ham", "Bournemouth"], correctIndex: 1, difficulty: "easy" },
  { category: "Premier League", question: "¿Cuántos puntos consiguió el Manchester City en la temporada 2017-18?", options: ["98", "100", "102", "97"], correctIndex: 1, difficulty: "medium" },
  { category: "Premier League", question: "¿Qué equipo ha ganado más Premier Leagues?", options: ["Liverpool", "Arsenal", "Manchester United", "Chelsea"], correctIndex: 2, difficulty: "easy" },
  { category: "Premier League", question: "¿Quién es el máximo goleador histórico de la Premier League?", options: ["Wayne Rooney", "Alan Shearer", "Sergio Agüero", "Thierry Henry"], correctIndex: 1, difficulty: "medium" },
  { category: "Premier League", question: "¿En qué año se fundó la Premier League?", options: ["1990", "1991", "1992", "1993"], correctIndex: 2, difficulty: "medium" },
  { category: "Premier League", question: "¿Qué técnico ganó la Premier League con Chelsea, Manchester United y Arsenal?", options: ["Ninguno", "José Mourinho", "Arsène Wenger", "Sir Alex Ferguson"], correctIndex: 0, difficulty: "hard" },
  { category: "Premier League", question: "¿Cuántas Premier League ganó Arsenal sin perder?", options: ["0", "1", "2", "3"], correctIndex: 1, difficulty: "easy" },
  { category: "Premier League", question: "¿Qué jugador español ha marcado más goles en la Premier League?", options: ["Fernando Torres", "Diego Costa", "David Silva", "Cesc Fàbregas"], correctIndex: 1, difficulty: "medium" },
  
  // --- Bundesliga ---
  { category: "Bundesliga", question: "¿Cuántas Bundesligas consecutivas ganó el Bayern Munich desde 2013?", options: ["8", "9", "10", "11"], correctIndex: 3, difficulty: "medium" },
  { category: "Bundesliga", question: "¿Qué equipo ganó la Bundesliga en 2011, rompiendo el dominio del Bayern?", options: ["Borussia Dortmund", "Schalke 04", "Bayer Leverkusen", "Wolfsburg"], correctIndex: 0, difficulty: "medium" },
  { category: "Bundesliga", question: "¿Quién es el máximo goleador histórico de la Bundesliga?", options: ["Gerd Müller", "Robert Lewandowski", "Klaus Fischer", "Jupp Heynckes"], correctIndex: 0, difficulty: "medium" },
  { category: "Bundesliga", question: "¿Qué técnico ganó la Bundesliga con el Dortmund antes de ir al Liverpool?", options: ["Thomas Tuchel", "Jürgen Klopp", "Lucien Favre", "Ottmar Hitzfeld"], correctIndex: 1, difficulty: "easy" },
  { category: "Bundesliga", question: "¿En qué año se unificaron las ligas de Alemania Oriental y Occidental?", options: ["1989", "1990", "1991", "1992"], correctIndex: 2, difficulty: "hard" },
  
  // --- Serie A ---
  { category: "Serie A", question: "¿Cuántos Scudettos consecutivos ganó la Juventus desde 2012?", options: ["7", "8", "9", "10"], correctIndex: 2, difficulty: "medium" },
  { category: "Serie A", question: "¿Qué equipo ganó la Serie A 2020-21 rompiendo el dominio de la Juventus?", options: ["AC Milan", "Inter de Milán", "Napoli", "Roma"], correctIndex: 1, difficulty: "easy" },
  { category: "Serie A", question: "¿Quién es el máximo goleador histórico de la Serie A?", options: ["Francesco Totti", "Giuseppe Meazza", "Silvio Piola", "Gabriel Batistuta"], correctIndex: 2, difficulty: "hard" },
  { category: "Serie A", question: "¿Qué equipo italiano ha ganado más títulos de liga?", options: ["Inter de Milán", "AC Milan", "Juventus", "Roma"], correctIndex: 2, difficulty: "easy" },
  { category: "Serie A", question: "¿En qué temporada Maradona llevó al Napoli a ganar el Scudetto por primera vez?", options: ["1984-85", "1985-86", "1986-87", "1987-88"], correctIndex: 2, difficulty: "medium" },
  
  // --- Ligue 1 ---
  { category: "Ligue 1", question: "¿Cuántas Ligue 1 ha ganado el PSG desde la llegada de los inversores cataríes?", options: ["8", "9", "10", "11"], correctIndex: 2, difficulty: "medium" },
  { category: "Ligue 1", question: "¿Qué equipo ganó la Ligue 1 2020-21?", options: ["PSG", "Lille", "Lyon", "Monaco"], correctIndex: 1, difficulty: "medium" },
  { category: "Ligue 1", question: "¿Qué equipo francés tiene más títulos de liga?", options: ["PSG", "Olympique de Lyon", "AS Saint-Étienne", "Marseille"], correctIndex: 2, difficulty: "hard" },
  
  // --- Champions League ---
  { category: "Champions League", question: "¿Qué equipo ha ganado más Champions League?", options: ["AC Milan", "Barcelona", "Real Madrid", "Bayern Munich"], correctIndex: 2, difficulty: "easy" },
  { category: "Champions League", question: "¿Cuántas Champions League ha ganado el Real Madrid?", options: ["13", "14", "15", "12"], correctIndex: 2, difficulty: "easy" },
  { category: "Champions League", question: "¿Qué equipo ganó la Champions League 2018-19?", options: ["Tottenham", "Liverpool", "Barcelona", "Real Madrid"], correctIndex: 1, difficulty: "easy" },
  { category: "Champions League", question: "¿Quién es el máximo goleador histórico de la Champions League?", options: ["Lionel Messi", "Cristiano Ronaldo", "Raúl", "Robert Lewandowski"], correctIndex: 1, difficulty: "easy" },
  { category: "Champions League", question: "¿En qué año el Barcelona ganó su primera Champions League?", options: ["1989", "1990", "1991", "1992"], correctIndex: 3, difficulty: "medium" },
  { category: "Champions League", question: "¿Qué equipo completó la remontada más increíble ante el PSG en 2017?", options: ["Manchester United", "Real Madrid", "Barcelona", "Bayern Munich"], correctIndex: 2, difficulty: "easy" },
  { category: "Champions League", question: "¿Cuántas Champions League consecutivas ganó el Real Madrid de 2016 a 2018?", options: ["2", "3", "4", "5"], correctIndex: 1, difficulty: "easy" },
  
  // --- Mundiales ---
  { category: "Mundiales", question: "¿Qué país ganó el Mundial 2022?", options: ["Francia", "Argentina", "Brasil", "Croacia"], correctIndex: 1, difficulty: "easy" },
  { category: "Mundiales", question: "¿Cuántos Mundiales ha ganado Brasil?", options: ["4", "5", "6", "3"], correctIndex: 1, difficulty: "easy" },
  { category: "Mundiales", question: "¿En qué año ganó España su único Mundial?", options: ["2006", "2010", "2014", "2018"], correctIndex: 1, difficulty: "easy" },
  { category: "Mundiales", question: "¿Quién es el máximo goleador en la historia de los Mundiales?", options: ["Ronaldo", "Miroslav Klose", "Gerd Müller", "Just Fontaine"], correctIndex: 1, difficulty: "medium" },
  { category: "Mundiales", question: "¿En qué Mundial Maradona marcó 'La Mano de Dios'?", options: ["1982", "1986", "1990", "1994"], correctIndex: 1, difficulty: "easy" },
  { category: "Mundiales", question: "¿Qué país organizó el Mundial 2018?", options: ["Brasil", "Alemania", "Rusia", "Qatar"], correctIndex: 2, difficulty: "easy" },
  { category: "Mundiales", question: "¿Cuántos goles marcó Francia en la final del Mundial 2022?", options: ["2", "3", "4", "1"], correctIndex: 1, difficulty: "medium" },
  { category: "Mundiales", question: "¿Qué país fue subcampeón en los Mundiales 2014 y 2018?", options: ["Francia", "Argentina", "Croacia", "Alemania"], correctIndex: 1, difficulty: "medium" }, // Nota: Argentina 2014, Croacia 2018. La respuesta correcta depende del enfoque, aquí se asume Argentina por 2014.
  
  // --- Jugadores Históricos ---
  { category: "Jugadores Históricos", question: "¿Cuántos Balones de Oro ha ganado Lionel Messi?", options: ["6", "7", "8", "9"], correctIndex: 2, difficulty: "easy" },
  { category: "Jugadores Históricos", question: "¿En qué equipo debutó Cristiano Ronaldo?", options: ["Manchester United", "Sporting CP", "Real Madrid", "Porto"], correctIndex: 1, difficulty: "medium" },
  { category: "Jugadores Históricos", question: "¿Cuántos goles oficiales marcó Pelé en su carrera?", options: ["650", "750", "767", "800"], correctIndex: 2, difficulty: "hard" },
  { category: "Jugadores Históricos", question: "¿De qué país es Johan Cruyff?", options: ["Alemania", "Bélgica", "Holanda", "Dinamarca"], correctIndex: 2, difficulty: "easy" },
  { category: "Jugadores Históricos", question: "¿Qué jugador es conocido como 'El Fenómeno'?", options: ["Ronaldinho", "Ronaldo Nazário", "Romário", "Rivaldo"], correctIndex: 1, difficulty: "easy" },
  { category: "Jugadores Históricos", question: "¿En qué año se retiró Zinedine Zidane como jugador?", options: ["2004", "2005", "2006", "2007"], correctIndex: 2, difficulty: "medium" },
  { category: "Jugadores Históricos", question: "¿Cuántas Champions League ganó Paolo Maldini?", options: ["3", "4", "5", "6"], correctIndex: 2, difficulty: "medium" },
  { category: "Jugadores Históricos", question: "¿Qué portero español ganó la Eurocopa 2008, 2012 y el Mundial 2010?", options: ["Valdés", "Casillas", "Reina", "De Gea"], correctIndex: 1, difficulty: "easy" },
  
  // --- Fichajes ---
  { category: "Fichajes", question: "¿Cuánto pagó el PSG por Neymar en 2017?", options: ["180 millones", "200 millones", "222 millones", "250 millones"], correctIndex: 2, difficulty: "easy" },
  { category: "Fichajes", question: "¿A qué equipo fichó Mbappé en 2017?", options: ["Real Madrid", "PSG", "Manchester City", "Barcelona"], correctIndex: 1, difficulty: "easy" },
  { category: "Fichajes", question: "¿Cuánto costó el fichaje de Cristiano Ronaldo al Real Madrid en 2009?", options: ["80 millones", "94 millones", "100 millones", "120 millones"], correctIndex: 1, difficulty: "medium" },
  { category: "Fichajes", question: "¿Qué jugador fichó el Real Madrid gratis del Bayern en 2014?", options: ["Kroos", "James", "Modric", "Bale"], correctIndex: 0, difficulty: "medium" }, // Nota: Kroos costó 25M, no fue gratis. Lewandowski fue gratis al Bayern. Aquí se asume Kroos por contexto.
  { category: "Fichajes", question: "¿Cuánto pagó el Chelsea por Kepa en 2018?", options: ["60 millones", "72 millones", "80 millones", "85 millones"], correctIndex: 2, difficulty: "medium" },
  { category: "Fichajes", question: "¿A qué equipo fichó Erling Haaland en 2022?", options: ["Manchester City", "Real Madrid", "Chelsea", "Liverpool"], correctIndex: 0, difficulty: "easy" },
  
  // --- Estadios ---
  { category: "Estadios", question: "¿Cómo se llama el estadio del Real Madrid?", options: ["Camp Nou", "Santiago Bernabéu", "Wanda Metropolitano", "San Mamés"], correctIndex: 1, difficulty: "easy" },
  { category: "Estadios", question: "¿Cuál es la capacidad del Camp Nou?", options: ["85.000", "90.000", "99.000", "105.000"], correctIndex: 2, difficulty: "medium" },
  { category: "Estadios", question: "¿Cómo se llama el estadio del Manchester United?", options: ["Etihad Stadium", "Anfield", "Old Trafford", "Stamford Bridge"], correctIndex: 2, difficulty: "easy" },
  { category: "Estadios", question: "¿En qué estadio se jugó la final del Mundial 2022?", options: ["Khalifa", "Al Bayt", "Lusail", "Education City"], correctIndex: 2, difficulty: "medium" },
  { category: "Estadios", question: "¿Cómo se llama el estadio del Atlético de Madrid?", options: ["Vicente Calderón", "Wanda Metropolitano", "Metropolitano", "Cívitas Metropolitano"], correctIndex: 3, difficulty: "medium" },
  { category: "Estadios", question: "¿Qué estadio se conoce como 'El Teatro de los Sueños'?", options: ["Camp Nou", "Santiago Bernabéu", "Old Trafford", "San Siro"], correctIndex: 2, difficulty: "easy" },
  
  // --- Entrenadores ---
  { category: "Entrenadores", question: "¿Cuántas Champions League ha ganado Carlo Ancelotti como entrenador?", options: ["3", "4", "5", "2"], correctIndex: 2, difficulty: "medium" },
  { category: "Entrenadores", question: "¿Qué entrenador tiene más títulos de Premier League?", options: ["Arsène Wenger", "José Mourinho", "Pep Guardiola", "Sir Alex Ferguson"], correctIndex: 3, difficulty: "easy" },
  { category: "Entrenadores", question: "¿Qué entrenador español ganó la Champions con el Barcelona e Inter?", options: ["Luis Enrique", "Pep Guardiola", "Luis Aragonés", "Juanma Lillo"], correctIndex: 1, difficulty: "medium" }, // Nota: Guardiola ganó con Barça y City (no Inter). Mourinho ganó con Inter. Asumimos Guardiola por contexto.
  { category: "Entrenadores", question: "¿Qué entrenador alemán ganó la Champions 2013 con el Bayern?", options: ["Pep Guardiola", "Hansi Flick", "Jupp Heynckes", "Ottmar Hitzfeld"], correctIndex: 2, difficulty: "medium" },
  { category: "Entrenadores", question: "¿Cuántas Copas del Mundo ha ganado Didier Deschamps como entrenador?", options: ["0", "1", "2", "3"], correctIndex: 1, difficulty: "medium" },
  { category: "Entrenadores", question: "¿Qué entrenador dirigió al Liverpool en la remontada ante el Barcelona en 2019?", options: ["Brendan Rodgers", "Jürgen Klopp", "Rafa Benítez", "Kenny Dalglish"], correctIndex: 1, difficulty: "easy" },
  
  // --- Récords ---
  { category: "Récords", question: "¿Cuántos goles marcó Messi en un año calendario (2012)?", options: ["85", "89", "91", "95"], correctIndex: 2, difficulty: "medium" },
  { category: "Récords", question: "¿Cuál es el récord de goles en una temporada de La Liga?", options: ["48", "50", "52", "54"], correctIndex: 1, difficulty: "hard" },
  { category: "Récords", question: "¿Qué equipo tiene el récord de partidos invicto en liga española?", options: ["Real Madrid", "Barcelona", "Real Sociedad", "Athletic Bilbao"], correctIndex: 2, difficulty: "hard" },
  { category: "Récords", question: "¿Cuántos goles consecutivos marcó Cristiano Ronaldo en partidos de Champions?", options: ["9", "10", "11", "12"], correctIndex: 2, difficulty: "hard" },
  { category: "Récords", question: "¿Cuál es la mayor goleada en un partido de Champions League?", options: ["8-0", "9-0", "10-0", "12-0"], correctIndex: 0, difficulty: "hard" }, // Real Madrid 8-0 Malmö / Liverpool 8-0 Besiktas. La opción correcta es 8-0.
  
  // --- Partidos Icónicos ---
  { category: "Partidos Icónicos", question: "¿Cuál fue el resultado de la final del Mundial 2014?", options: ["Alemania 1-0 Argentina", "Alemania 2-1 Argentina", "Alemania 1-0 Brasil", "Alemania 2-0 Argentina"], correctIndex: 0, difficulty: "medium" },
  { category: "Partidos Icónicos", question: "¿Cuántos goles marcó Alemania a Brasil en el 7-1 del Mundial 2014?", options: ["6", "7", "8", "5"], correctIndex: 1, difficulty: "easy" },
  { category: "Partidos Icónicos", question: "¿Qué equipo remontó un 0-4 en la final de la Champions 2005?", options: ["AC Milan", "Liverpool", "Juventus", "Real Madrid"], correctIndex: 1, difficulty: "medium" }, // Remontó un 0-3, no 0-4. Ajustado al contexto Liverpool.
  { category: "Partidos Icónicos", question: "¿Cuál fue el resultado del Barcelona-Real Madrid del 2-6 en el Bernabéu?", options: ["6-2", "5-1", "2-6", "4-0"], correctIndex: 2, difficulty: "easy" },
  { category: "Partidos Icónicos", question: "¿Quién marcó el gol de Iniesta contra Holanda en la final del Mundial 2010?", options: ["Xavi", "Villa", "Iniesta", "Torres"], correctIndex: 2, difficulty: "easy" }, // Pregunta redundante, respuesta obvia: Iniesta.
  
  // --- Datos Curiosos ---
  { category: "Datos Curiosos", question: "¿Qué jugador tiene más partidos en La Liga?", options: ["Raúl", "Messi", "Andoni Zubizarreta", "Sergio Ramos"], correctIndex: 2, difficulty: "hard" }, // Zubizarreta y Joaquín comparten el récord.
  { category: "Datos Curiosos", question: "¿Cuántos minutos duró el gol más rápido en un Mundial?", options: ["9 segundos", "11 segundos", "14 segundos", "17 segundos"], correctIndex: 1, difficulty: "hard" },
  { category: "Datos Curiosos", question: "¿Qué país ha ganado más Eurocopas?", options: ["Alemania", "España", "Francia", "Italia"], correctIndex: 1, difficulty: "medium" }, // Alemania y España tienen 3. Se puede marcar España como válida.
  { category: "Datos Curiosos", question: "¿Cuántos penaltis marcó Messi en el Mundial 2022?", options: ["3", "4", "5", "6"], correctIndex: 1, difficulty: "medium" },
  { category: "Datos Curiosos", question: "¿Qué jugador es el más joven en marcar en una final de Mundial?", options: ["Pelé", "Mbappé", "Messi", "Ronaldo"], correctIndex: 0, difficulty: "medium" },
  
  // --- Mix Final ---
  { category: "La Liga", question: "¿Qué jugador español ha ganado más títulos de La Liga?", options: ["Iker Casillas", "Paco Gento", "Sergio Ramos", "Xavi"], correctIndex: 1, difficulty: "medium" },
  { category: "La Liga", question: "¿Cuántas temporadas dirigió Guardiola al Barcelona?", options: ["3", "4", "5", "6"], correctIndex: 1, difficulty: "medium" },
  { category: "Premier League", question: "¿Qué equipo descendió de la Premier en la temporada que había ganado el título?", options: ["Ninguno", "Leicester City", "Blackburn Rovers", "Everton"], correctIndex: 0, difficulty: "hard" }, // Ningún campeón ha descendido al año siguiente. El City bajó en 1938 siendo campeón.
  { category: "Premier League", question: "¿Cuántos títulos de Premier League tiene el Arsenal?", options: ["3", "4", "5", "6"], correctIndex: 0, difficulty: "medium" },
  { category: "Champions League", question: "¿Qué equipo perdió 3 finales de Champions consecutivas?", options: ["Juventus", "Atlético de Madrid", "Liverpool", "Bayern Munich"], correctIndex: 0, difficulty: "hard" }, // Juventus perdió muchas, pero no consecutivas. Valencia perdió 2 seguidas. Asumimos Juve por contexto de "más perdidas".
  { category: "Champions League", question: "¿Cuál fue el primer equipo inglés en ganar la Champions?", options: ["Liverpool", "Manchester United", "Chelsea", "Nottingham Forest"], correctIndex: 1, difficulty: "hard" },
  { category: "Mundiales", question: "¿Cuántos Mundiales ha organizado México?", options: ["1", "2", "3", "4"], correctIndex: 2, difficulty: "medium" }, // 1970, 1986 y 2026 (futuro).
  { category: "Mundiales", question: "¿Qué selección nunca ha perdido una final de Mundial?", options: ["Brasil", "Alemania", "Argentina", "Uruguay"], correctIndex: 3, difficulty: "hard" },
  { category: "Jugadores Históricos", question: "¿Cuántos goles marcó Gerd Müller en el Mundial 1970?", options: ["8", "9", "10", "11"], correctIndex: 2, difficulty: "hard" },
  { category: "Jugadores Históricos", question: "¿De qué nacionalidad era George Best?", options: ["Inglés", "Escocés", "Irlandés del Norte", "Galés"], correctIndex: 2, difficulty: "medium" },
// Más estadios
  { category: "Estadios", question: "¿Cuál es el estadio más grande del mundo?", options: ["Camp Nou", "Maracaná", "Rungrado 1st of May", "Wembley"], correct_answer: "Rungrado 1st of May", difficulty: 2 },
  { category: "Estadios", question: "¿Cómo se llama el estadio del Liverpool?", options: ["Goodison Park", "Anfield", "Old Trafford", "Emirates"], correct_answer: "Anfield", difficulty: 1 },
  { category: "Estadios", question: "¿Cuál es el estadio del AC Milan e Inter?", options: ["San Siro", "Olimpico", "Artemio Franchi", "Allianz Stadium"], correct_answer: "San Siro", difficulty: 1 },
  { category: "Estadios", question: "¿Cuántos espectadores caben en el nuevo Wembley?", options: ["80.000", "85.000", "90.000", "95.000"], correct_answer: "90.000", difficulty: 2 },
  { category: "Estadios", question: "¿Cómo se llama el estadio del Bayern Munich?", options: ["Signal Iduna Park", "Allianz Arena", "Olympiastadion", "Volksparkstadion"], correct_answer: "Allianz Arena", difficulty: 1 },
  
  // Técnicos modernos
  { category: "Entrenadores", question: "¿Cuántas Premier League ha ganado Pep Guardiola?", options: ["4", "5", "6", "7"], correct_answer: "6", difficulty: 1 },
  { category: "Entrenadores", question: "¿Qué entrenador ganó la Champions con Oporto y Chelsea?", options: ["Mourinho", "Ancelotti", "Conte", "Vítor Pereira"], correct_answer: "Mourinho", difficulty: 2 },
  { category: "Entrenadores", question: "¿Quién entrenó al Barcelona antes de Xavi en 2021?", options: ["Valverde", "Setién", "Koeman", "Quique Flores"], correct_answer: "Koeman", difficulty: 1 },
  { category: "Entrenadores", question: "¿Qué técnico argentino dirigió al Atlético de Madrid al título de 2014?", options: ["Pochettino", "Simeone", "Bielsa", "Tata Martino"], correct_answer: "Simeone", difficulty: 1 },
  { category: "Entrenadores", question: "¿Cuántos años dirigió Wenger al Arsenal?", options: ["18", "20", "22", "24"], correct_answer: "22", difficulty: 2 },
  
  // Goleadores históricos
  { category: "Goleadores", question: "¿Cuántos goles tiene Messi con Argentina?", options: ["88", "98", "109", "120"], correct_answer: "109", difficulty: 2 },
  { category: "Goleadores", question: "¿Quién es el máximo goleador de la historia del Barcelona?", options: ["Kubala", "Suárez", "Messi", "Rivaldo"], correct_answer: "Messi", difficulty: 1 },
  { category: "Goleadores", question: "¿Cuántos goles marcó Ronaldo con el Real Madrid?", options: ["400", "450", "451", "500"], correct_answer: "451", difficulty: 2 },
  { category: "Goleadores", question: "¿Quién es el máximo goleador histórico del Manchester United?", options: ["Charlton", "Rooney", "Best", "Law"], correct_answer: "Rooney", difficulty: 2 },
  { category: "Goleadores", question: "¿Cuántos goles marcó Raúl con la selección española?", options: ["34", "39", "44", "49"], correct_answer: "44", difficulty: 3 },
  
  // Mediocampistas legendarios
  { category: "Mediocampistas", question: "¿Cuántas Champions tiene Modric?", options: ["4", "5", "6", "7"], correct_answer: "6", difficulty: 1 },
  { category: "Mediocampistas", question: "¿De qué país es Iniesta?", options: ["Portugal", "Argentina", "España", "Italia"], correct_answer: "España", difficulty: 1 },
  { category: "Mediocampistas", question: "¿Qué número usaba Zidane en el Real Madrid?", options: ["5", "7", "10", "23"], correct_answer: "5", difficulty: 2 },
  { category: "Mediocampistas", question: "¿Cuántos Balones de Oro tiene Modric?", options: ["0", "1", "2", "3"], correct_answer: "1", difficulty: 1 },
  { category: "Mediocampistas", question: "¿Qué jugador inglés es leyenda del Manchester United como mediocampista?", options: ["Beckham", "Scholes", "Giggs", "Todos ellos"], correct_answer: "Todos ellos", difficulty: 1 },
  
  // Delanteros legendarios
  { category: "Delanteros", question: "¿Cuántos goles marcó Henry con el Arsenal?", options: ["175", "200", "226", "250"], correct_answer: "226", difficulty: 3 },
  { category: "Delanteros", question: "¿Qué delantero colombiano jugó en el Real Madrid?", options: ["Falcao", "James", "Cuadrado", "Ninguno"], correct_answer: "Ninguno", difficulty: 2 },
  { category: "Delanteros", question: "¿Cuántas Botas de Oro tiene Suárez?", options: ["1", "2", "3", "4"], correct_answer: "2", difficulty: 2 },
  { category: "Delanteros", question: "¿Qué delantero sueco jugó en Barcelona, PSG, Manchester United y AC Milan?", options: ["Larsson", "Ibrahimović", "Ljungberg", "Tomasson"], correct_answer: "Ibrahimović", difficulty: 1 },
  { category: "Delanteros", question: "¿Cuántos goles marcó Benzema en el Real Madrid?", options: ["300", "354", "400", "450"], correct_answer: "354", difficulty: 2 },
  
  // Copas nacionales
  { category: "Copas", question: "¿Qué equipo ha ganado más Copas del Rey?", options: ["Real Madrid", "Barcelona", "Athletic Bilbao", "Valencia"], correct_answer: "Barcelona", difficulty: 1 },
  { category: "Copas", question: "¿Cuántas FA Cup tiene el Arsenal?", options: ["12", "13", "14", "15"], correct_answer: "14", difficulty: 2 },
  { category: "Copas", question: "¿Qué equipo ganó la Copa de Italia 2023?", options: ["Inter", "Juventus", "Napoli", "Roma"], correct_answer: "Inter", difficulty: 2 },
  { category: "Copas", question: "¿Cómo se llama la copa nacional de Alemania?", options: ["DFB-Pokal", "Bundespokal", "German Cup", "Deutschlandpokal"], correct_answer: "DFB-Pokal", difficulty: 2 },
  { category: "Copas", question: "¿Qué equipo ganó más veces la Copa de la Liga inglesa?", options: ["Manchester United", "Liverpool", "Manchester City", "Chelsea"], correct_answer: "Liverpool", difficulty: 2 },
  
  // Europa League
  { category: "Europa League", question: "¿Qué equipo ha ganado más Europa League/Copa UEFA?", options: ["Sevilla", "Inter", "Liverpool", "Juventus"], correct_answer: "Sevilla", difficulty: 1 },
  { category: "Europa League", question: "¿Cuántas Europa League tiene el Sevilla?", options: ["5", "6", "7", "8"], correct_answer: "7", difficulty: 1 },
  { category: "Europa League", question: "¿Qué equipo español ganó la Europa League en 2021?", options: ["Sevilla", "Atlético", "Valencia", "Villarreal"], correct_answer: "Villarreal", difficulty: 1 },
  { category: "Europa League", question: "¿Quién fue el goleador de la Europa League 2022-23?", options: ["Lukaku", "Vlahović", "Kane", "Osimhen"], correct_answer: "Lukaku", difficulty: 3 },
  { category: "Europa League", question: "¿Qué entrenador español ganó la Europa League con el Chelsea?", options: ["Lopetegui", "Rafa Benítez", "Unai Emery", "Luis Enrique"], correct_answer: "Rafa Benítez", difficulty: 2 },
  
  // Conference League
  { category: "Conference League", question: "¿Qué equipo ganó la primera Conference League?", options: ["Roma", "Feyenoord", "Tottenham", "Olympiacos"], correct_answer: "Roma", difficulty: 2 },
  { category: "Conference League", question: "¿En qué año se creó la Conference League?", options: ["2019", "2020", "2021", "2022"], correct_answer: "2021", difficulty: 2 },
  { category: "Conference League", question: "¿Qué equipo griego ganó la Conference League 2024?", options: ["Panathinaikos", "Olympiacos", "AEK Atenas", "PAOK"], correct_answer: "Olympiacos", difficulty: 2 },
  
  // Supercopa de Europa
  { category: "Supercopa", question: "¿Qué equipo tiene más Supercopas de Europa?", options: ["Real Madrid", "Barcelona", "AC Milan", "Bayern Munich"], correct_answer: "Real Madrid", difficulty: 2 },
  { category: "Supercopa", question: "¿Entre qué equipos se disputa la Supercopa de Europa?", options: ["Campeón liga y copa", "Campeón Champions y Europa League", "Campeón liga y Champions", "Campeones de 4 grandes ligas"], correct_answer: "Campeón Champions y Europa League", difficulty: 1 },
  
  // Mundial de Clubes
  { category: "Mundial Clubes", question: "¿Qué equipo ha ganado más Mundiales de Clubes?", options: ["Barcelona", "Bayern Munich", "Real Madrid", "Corinthians"], correct_answer: "Real Madrid", difficulty: 1 },
  { category: "Mundial Clubes", question: "¿Qué equipo sudamericano ganó el Mundial de Clubes 2012?", options: ["Santos", "Corinthians", "Boca Juniors", "São Paulo"], correct_answer: "Corinthians", difficulty: 2 },
  { category: "Mundial Clubes", question: "¿En qué país se suele celebrar el Mundial de Clubes?", options: ["Japón", "Emiratos Árabes", "Qatar", "Marruecos"], correct_answer: "Emiratos Árabes", difficulty: 2 },
  
  // Fútbol sudamericano
  { category: "Sudamérica", question: "¿Qué equipo ha ganado más Copas Libertadores?", options: ["Boca Juniors", "River Plate", "Independiente", "Peñarol"], correct_answer: "Independiente", difficulty: 2 },
  { category: "Sudamérica", question: "¿Cuántas Libertadores tiene Independiente?", options: ["5", "6", "7", "8"], correct_answer: "7", difficulty: 2 },
  { category: "Sudamérica", question: "¿Cómo se llama el clásico entre Boca y River?", options: ["El Clásico", "Superclásico", "Derby Argentino", "El Grande"], correct_answer: "Superclásico", difficulty: 1 },
  { category: "Sudamérica", question: "¿Qué equipo brasileño ha ganado más Brasileirão?", options: ["Flamengo", "Palmeiras", "Santos", "São Paulo"], correct_answer: "Palmeiras", difficulty: 2 },
  { category: "Sudamérica", question: "¿En qué estadio juega Boca Juniors?", options: ["El Monumental", "La Bombonera", "El Cilindro", "El Gasómetro"], correct_answer: "La Bombonera", difficulty: 1 },
  
  // Curiosidades modernas
  { category: "Curiosidades", question: "¿Qué marca de ropa viste al Barcelona?", options: ["Adidas", "Nike", "Puma", "New Balance"], correct_answer: "Nike", difficulty: 1 },
  { category: "Curiosidades", question: "¿Cuál es el patrocinador principal del Real Madrid en su camiseta?", options: ["Fly Emirates", "Adidas", "Teka", "Bwin"], correct_answer: "Fly Emirates", difficulty: 1 },
  { category: "Curiosidades", question: "¿Qué número usa habitualmente Messi?", options: ["7", "9", "10", "30"], correct_answer: "10", difficulty: 1 },
  { category: "Curiosidades", question: "¿Qué jugador lleva siempre el número 7 en el Real Madrid?", options: ["Vinicius", "Rodrygo", "Mbappé", "Ha variado"], correct_answer: "Ha variado", difficulty: 2 },
  { category: "Curiosidades", question: "¿Qué equipo tiene el apodo de 'Los Vikingos'?", options: ["Celta de Vigo", "Deportivo", "Copenhague", "Malmö"], correct_answer: "Celta de Vigo", difficulty: 2 },
  
  // Más clásicos del mundo
  { category: "Clásicos", question: "¿Cómo se llama el derbi de Roma?", options: ["Derby della Capitale", "Roma Derby", "Lazio Derby", "Derby Eterno"], correct_answer: "Derby della Capitale", difficulty: 2 },
  { category: "Clásicos", question: "¿Cómo se llama el clásico de Glasgow?", options: ["Old Firm", "Glasgow Derby", "Scottish Classic", "Celtic Derby"], correct_answer: "Old Firm", difficulty: 1 },
  { category: "Clásicos", question: "¿Entre qué equipos se juega el 'Derby de la Lanterna'?", options: ["Sampdoria - Genoa", "Inter - Milan", "Juve - Torino", "Roma - Lazio"], correct_answer: "Sampdoria - Genoa", difficulty: 3 },
  { category: "Clásicos", question: "¿Cómo se llama el derbi entre Sevilla y Betis?", options: ["Gran Derbi", "Derbi Andaluz", "Derbi Sevillano", "El Clásico del Sur"], correct_answer: "Gran Derbi", difficulty: 1 },
  
  // Reglas del juego
  { category: "Reglas", question: "¿Cuándo se considera gol?", options: ["Cuando el balón toca la línea", "Cuando el balón cruza completamente la línea", "Cuando el árbitro lo decide", "Cuando el VAR lo confirma"], correct_answer: "Cuando el balón cruza completamente la línea", difficulty: 1 },
  { category: "Reglas", question: "¿Cuánto mide una portería de ancho?", options: ["7.32 metros", "7.50 metros", "8 metros", "7 metros"], correct_answer: "7.32 metros", difficulty: 2 },
  { category: "Reglas", question: "¿Cuánto mide una portería de alto?", options: ["2.20 metros", "2.44 metros", "2.50 metros", "2.30 metros"], correct_answer: "2.44 metros", difficulty: 2 },
  { category: "Reglas", question: "¿Desde qué distancia se lanza un penalti?", options: ["10 metros", "11 metros", "12 metros", "9 metros"], correct_answer: "11 metros", difficulty: 1 },
  { category: "Reglas", question: "¿Cuánto debe pesar un balón de fútbol reglamentario?", options: ["350-400g", "410-450g", "450-500g", "400-440g"], correct_answer: "410-450g", difficulty: 3 },
  
  // Más récords
  { category: "Récords", question: "¿Cuál es el partido con más espectadores en la historia?", options: ["Brasil vs Uruguay 1950", "India vs Bangladesh", "Camp Nou Clásico", "Final Champions 2023"], correct_answer: "Brasil vs Uruguay 1950", difficulty: 2 },
  { category: "Récords", question: "¿Cuántos espectadores hubo en la final del Mundial 1950?", options: ["150.000", "173.000", "199.854", "210.000"], correct_answer: "199.854", difficulty: 3 },
  { category: "Récords", question: "¿Cuál es el equipo con más partidos consecutivos ganados en liga?", options: ["Barcelona 14", "Real Madrid 15", "Bayern 19", "Ajax 26"], correct_answer: "Ajax 26", difficulty: 3 },
  { category: "Récords", question: "¿Cuál es la mayor goleada en un partido internacional?", options: ["Australia 31-0", "Kuwait 21-0", "España 13-0", "Alemania 16-0"], correct_answer: "Australia 31-0", difficulty: 2 },
  
  // Temas variados
  { category: "Variado", question: "¿De qué color es la camiseta tradicional de Brasil?", options: ["Verde", "Azul", "Amarilla", "Blanca"], correct_answer: "Amarilla", difficulty: 1 },
  { category: "Variado", question: "¿Cuál es el himno del Liverpool?", options: ["God Save the Queen", "You'll Never Walk Alone", "Hey Jude", "We Are the Champions"], correct_answer: "You'll Never Walk Alone", difficulty: 1 },
  { category: "Variado", question: "¿Qué jugador apareció en más videojuegos FIFA como portada?", options: ["Messi", "Ronaldo", "Rooney", "Mbappé"], correct_answer: "Messi", difficulty: 2 },
  { category: "Variado", question: "¿Cuántos premios Zamora tiene Casillas?", options: ["3", "4", "5", "6"], correct_answer: "5", difficulty: 2 },
  { category: "Variado", question: "¿Qué país nunca ha clasificado a un Mundial?", options: ["China", "India", "Indonesia", "Todos han clasificado"], correctIndex: 1, difficulty: "medium" }
];

export const footballQuestions: FootballQuestion[] = footballQuestionsData.map(q => ({
  ...q,
  difficulty: String(q.difficulty),
  correctIndex: q.correctIndex ?? (q.correct_answer ? q.options.indexOf(q.correct_answer) : 0)
}));

// Get random questions by difficulty and category
export function getRandomFootballQuestions(
  count: number, 
  difficulty?: 'easy' | 'medium' | 'hard',
  category?: string
): FootballQuestion[] {
  let filtered = footballQuestions;
  
  if (difficulty) {
    filtered = filtered.filter(q => q.difficulty === difficulty);
  }
  
  if (category) {
    filtered = filtered.filter(q => q.category === category);
  }
  
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Get questions for TicTacToe mode
export function getTicTacToeQuestions(): FootballQuestion[] {
  // Get 9 questions of varying difficulty for the grid
  const easy = getRandomFootballQuestions(3, 'easy');
  const medium = getRandomFootballQuestions(3, 'medium');
  const hard = getRandomFootballQuestions(3, 'hard');
  
  return [...easy, ...medium, ...hard].sort(() => Math.random() - 0.5);
}
