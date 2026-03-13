// Culture General Questions - "Sabes más que un niño de primaria" style
// 500+ questions with hints for lifeline system



export interface CultureQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: number | string;
  category: string;
  hint?: string;
}

export const cultureQuestions: CultureQuestion[] = [
  // GEOGRAFÍA
  { question: "¿Cuál es la capital de Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], correctIndex: 2, difficulty: 3, category: "geografia", hint: "No es la ciudad más grande" },
  { question: "¿Cuál es el río más largo del mundo?", options: ["Amazonas", "Nilo", "Yangtsé", "Misisipi"], correctIndex: 0, difficulty: 2, category: "geografia", hint: "Está en Sudamérica" },
  { question: "¿En qué país se encuentran las Pirámides de Giza?", options: ["Marruecos", "Egipto", "Libia", "Sudán"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "País africano con faraones" },
  { question: "¿Cuál es el océano más grande?", options: ["Atlántico", "Índico", "Pacífico", "Ártico"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Su nombre significa paz" },
  { question: "¿Capital de Italia?", options: ["Milán", "Roma", "Florencia", "Venecia"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "Ciudad eterna" },
  { question: "¿Capital de Estados Unidos?", options: ["Nueva York", "Los Ángeles", "Washington D.C.", "Chicago"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Nombre de un presidente" },
  { question: "¿Cuál es el país más poblado del mundo?", options: ["China", "India", "Estados Unidos", "Indonesia"], correctIndex: 1, difficulty: 2, category: "geografia", hint: "Superó a China recientemente" },
  { question: "¿Capital de Canadá?", options: ["Toronto", "Montreal", "Vancouver", "Ottawa"], correctIndex: 3, difficulty: 2, category: "geografia", hint: "No es la ciudad más grande" },
  { question: "¿Cuál es el río más largo de la Península Ibérica?", options: ["Ebro", "Duero", "Tajo", "Guadalquivir"], correctIndex: 2, difficulty: 2, category: "geografia", hint: "Pasa por Lisboa" },
  { question: "¿Cuántas comunidades autónomas tiene España?", options: ["15", "17", "19", "20"], correctIndex: 1, difficulty: 2, category: "geografia", hint: "Entre 15 y 20" },
  { question: "¿Capital de Brasil?", options: ["São Paulo", "Río de Janeiro", "Brasilia", "Salvador"], correctIndex: 2, difficulty: 2, category: "geografia", hint: "Ciudad planificada moderna" },
  { question: "¿Cuál es la montaña más alta de España?", options: ["Mulhacén", "Teide", "Aneto", "Almanzor"], correctIndex: 1, difficulty: 2, category: "geografia", hint: "Está en una isla" },
  { question: "¿Capital de Marruecos?", options: ["Casablanca", "Marrakech", "Rabat", "Fez"], correctIndex: 2, difficulty: 3, category: "geografia", hint: "Empieza por R" },
  { question: "¿En qué continente está Egipto?", options: ["Asia", "África", "Europa", "Oceanía"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "Pirámides y desierto" },
  { question: "¿Cuál es el país más pequeño del mundo?", options: ["Mónaco", "San Marino", "Vaticano", "Liechtenstein"], correctIndex: 2, difficulty: 2, category: "geografia", hint: "Sede del Papa" },
  { question: "¿Capital de Suiza?", options: ["Ginebra", "Zúrich", "Berna", "Basilea"], correctIndex: 2, difficulty: 3, category: "geografia", hint: "No es la más conocida" },
  { question: "¿Cuántos planetas tiene el Sistema Solar?", options: ["7", "8", "9", "10"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "Plutón ya no cuenta" },
  { question: "¿En qué océano está la fosa de las Marianas?", options: ["Atlántico", "Índico", "Pacífico", "Ártico"], correctIndex: 2, difficulty: 3, category: "geografia", hint: "El más grande" },
  { question: "¿Cuál es el desierto más grande del mundo?", options: ["Sahara", "Gobi", "Antártida", "Kalahari"], correctIndex: 2, difficulty: 4, category: "geografia", hint: "Desierto frío" },
  { question: "¿Capital de Japón?", options: ["Kioto", "Osaka", "Tokio", "Yokohama"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "La más poblada" },
  
  // HISTORIA
  { question: "¿En qué año cayó el Muro de Berlín?", options: ["1987", "1989", "1991", "1985"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Final de los 80" },
  { question: "¿Quién descubrió América?", options: ["Américo Vespucio", "Hernán Cortés", "Cristóbal Colón", "Fernando de Magallanes"], correctIndex: 2, difficulty: 1, category: "historia", hint: "Italiano al servicio de España" },
  { question: "¿En qué año se descubrió América?", options: ["1490", "1492", "1494", "1500"], correctIndex: 1, difficulty: 1, category: "historia", hint: "Muy fácil de recordar" },
  { question: "¿Quién fue el primer hombre en pisar la Luna?", options: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "Michael Collins"], correctIndex: 2, difficulty: 1, category: "historia", hint: "Un pequeño paso para el hombre..." },
  { question: "¿En qué año llegó el hombre a la Luna?", options: ["1965", "1969", "1971", "1963"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Final de los 60" },
  { question: "¿En qué año comenzó la Guerra Civil Española?", options: ["1934", "1936", "1938", "1940"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Mediados de los 30" },
  { question: "¿Quién pintó el Guernica?", options: ["Dalí", "Goya", "Picasso", "Velázquez"], correctIndex: 2, difficulty: 1, category: "historia", hint: "Cubismo" },
  { question: "¿En qué año terminó la Segunda Guerra Mundial?", options: ["1943", "1944", "1945", "1946"], correctIndex: 2, difficulty: 2, category: "historia", hint: "Bomba atómica" },
  { question: "¿Quién fue el último faraón de Egipto?", options: ["Ramsés II", "Tutankamón", "Cleopatra", "Nefertiti"], correctIndex: 2, difficulty: 2, category: "historia", hint: "Era mujer" },
  { question: "¿En qué siglo fue la Revolución Francesa?", options: ["XVII", "XVIII", "XIX", "XVI"], correctIndex: 1, difficulty: 2, category: "historia", hint: "1789" },
  { question: "¿Quién fue el primer presidente de Estados Unidos?", options: ["Abraham Lincoln", "Thomas Jefferson", "George Washington", "John Adams"], correctIndex: 2, difficulty: 1, category: "historia", hint: "Billete de dólar" },
  { question: "¿En qué año se hundió el Titanic?", options: ["1910", "1912", "1914", "1916"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Antes de la Primera Guerra Mundial" },
  { question: "¿Quién fue el primer emperador romano?", options: ["Julio César", "Augusto", "Nerón", "Calígula"], correctIndex: 1, difficulty: 3, category: "historia", hint: "Sobrino de César" },
  { question: "¿En qué año cayó el Imperio Romano de Occidente?", options: ["376", "410", "455", "476"], correctIndex: 3, difficulty: 4, category: "historia", hint: "Siglo V" },
  { question: "¿Quién conquistó el Imperio Azteca?", options: ["Francisco Pizarro", "Hernán Cortés", "Pedro de Valdivia", "Vasco Núñez de Balboa"], correctIndex: 1, difficulty: 2, category: "historia", hint: "México" },
  { question: "¿En qué año se firmó la Constitución Española actual?", options: ["1975", "1978", "1980", "1982"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Después de Franco" },
  { question: "¿Quién fue el último rey de España antes de la República?", options: ["Alfonso XII", "Alfonso XIII", "Carlos III", "Fernando VII"], correctIndex: 1, difficulty: 3, category: "historia", hint: "Abuelo de Juan Carlos I" },
  { question: "¿En qué año comenzó la Primera Guerra Mundial?", options: ["1912", "1914", "1916", "1918"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Asesinato en Sarajevo" },
  { question: "¿Quién inventó la imprenta?", options: ["Leonardo da Vinci", "Johannes Gutenberg", "Galileo Galilei", "Isaac Newton"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Alemán del siglo XV" },
  { question: "¿En qué año se abolió la esclavitud en Estados Unidos?", options: ["1863", "1865", "1870", "1850"], correctIndex: 1, difficulty: 3, category: "historia", hint: "Después de la Guerra Civil" },
  
  // CIENCIA
  { question: "¿Cuál es el símbolo químico del Oro?", options: ["Or", "Au", "Ag", "Go"], correctIndex: 1, difficulty: 2, category: "ciencia", hint: "Del latín Aurum" },
  { question: "¿Cuál es el elemento químico 'O'?", options: ["Oro", "Osmio", "Oxígeno", "Oganesón"], correctIndex: 2, difficulty: 1, category: "ciencia", hint: "Lo respiramos" },
  { question: "¿Cuántos huesos tiene el cuerpo humano adulto?", options: ["186", "196", "206", "216"], correctIndex: 2, difficulty: 2, category: "ciencia", hint: "Alrededor de 200" },
  { question: "¿Qué gas absorben las plantas en la fotosíntesis?", options: ["Oxígeno", "Nitrógeno", "Dióxido de carbono", "Hidrógeno"], correctIndex: 2, difficulty: 2, category: "ciencia", hint: "CO2" },
  { question: "¿Cuál es el hueso más pequeño del cuerpo humano?", options: ["Martillo", "Yunque", "Estribo", "Cóclea"], correctIndex: 2, difficulty: 3, category: "ciencia", hint: "Está en el oído" },
  { question: "¿Cuántas válvulas tiene el corazón humano?", options: ["2", "3", "4", "5"], correctIndex: 2, difficulty: 2, category: "ciencia", hint: "Número par" },
  { question: "¿Qué significa la sigla ADN?", options: ["Ácido Desoxirribonucleico", "Ácido Dioxi-nucleico", "Asociación de Nucleótidos", "Ácido Dinámico Natural"], correctIndex: 0, difficulty: 2, category: "ciencia", hint: "Doble hélice" },
  { question: "¿Cuál es el planeta más cercano al Sol?", options: ["Venus", "Mercurio", "Marte", "Tierra"], correctIndex: 1, difficulty: 1, category: "ciencia", hint: "Dios mensajero" },
  { question: "¿Qué es la 'sinapsis'?", options: ["Tipo de célula", "Conexión entre neuronas", "Órgano del cerebro", "Enfermedad neurológica"], correctIndex: 1, difficulty: 3, category: "ciencia", hint: "Sistema nervioso" },
  { question: "¿Cuál es el elemento más abundante en el universo?", options: ["Oxígeno", "Carbono", "Helio", "Hidrógeno"], correctIndex: 3, difficulty: 2, category: "ciencia", hint: "El más ligero" },
  { question: "¿Cuántos dientes tiene un humano adulto completo?", options: ["28", "30", "32", "34"], correctIndex: 2, difficulty: 1, category: "ciencia", hint: "Incluye las muelas del juicio" },
  { question: "¿Qué ciencia estudia los fósiles?", options: ["Arqueología", "Geología", "Paleontología", "Biología"], correctIndex: 2, difficulty: 2, category: "ciencia", hint: "Dinosaurios" },
  { question: "¿Cuál es la velocidad de la luz?", options: ["200.000 km/s", "300.000 km/s", "400.000 km/s", "500.000 km/s"], correctIndex: 1, difficulty: 2, category: "ciencia", hint: "Aproximadamente 3x10⁸ m/s" },
  { question: "¿Qué vitamina produce el cuerpo con la luz solar?", options: ["Vitamina A", "Vitamina C", "Vitamina D", "Vitamina E"], correctIndex: 2, difficulty: 2, category: "ciencia", hint: "Buena para los huesos" },
  { question: "¿Cuántas patas tiene una araña?", options: ["6", "8", "10", "12"], correctIndex: 1, difficulty: 1, category: "ciencia", hint: "Más que un insecto" },
  { question: "¿Qué órgano produce la insulina?", options: ["Hígado", "Riñón", "Páncreas", "Estómago"], correctIndex: 2, difficulty: 2, category: "ciencia", hint: "Diabetes" },
  { question: "¿Cuál es el metal más conductor de electricidad?", options: ["Oro", "Cobre", "Plata", "Aluminio"], correctIndex: 2, difficulty: 3, category: "ciencia", hint: "Más que el cobre" },
  { question: "¿Qué planeta es conocido como el planeta rojo?", options: ["Venus", "Júpiter", "Marte", "Saturno"], correctIndex: 2, difficulty: 1, category: "ciencia", hint: "Dios de la guerra" },
  { question: "¿Cuál es el órgano más grande del cuerpo humano?", options: ["Hígado", "Cerebro", "Piel", "Intestino"], correctIndex: 2, difficulty: 2, category: "ciencia", hint: "Nos cubre" },
  { question: "¿Qué estudia la ornitología?", options: ["Insectos", "Peces", "Aves", "Reptiles"], correctIndex: 2, difficulty: 2, category: "ciencia", hint: "Vuelan" },
  
  // ARTE Y CULTURA
  { question: "¿Quién pintó La Gioconda (Mona Lisa)?", options: ["Miguel Ángel", "Rafael", "Leonardo da Vinci", "Botticelli"], correctIndex: 2, difficulty: 1, category: "arte", hint: "Italiano renacentista multifacético" },
  { question: "¿Quién pintó 'Las Meninas'?", options: ["Goya", "El Greco", "Velázquez", "Murillo"], correctIndex: 2, difficulty: 1, category: "arte", hint: "Museo del Prado" },
  { question: "¿Quién pintó 'La noche estrellada'?", options: ["Monet", "Van Gogh", "Cézanne", "Renoir"], correctIndex: 1, difficulty: 1, category: "arte", hint: "Se cortó la oreja" },
  { question: "¿Quién compuso la 'Novena Sinfonía'?", options: ["Mozart", "Bach", "Beethoven", "Brahms"], correctIndex: 2, difficulty: 1, category: "arte", hint: "Estaba sordo" },
  { question: "¿Quién escribió 'Romeo y Julieta'?", options: ["Oscar Wilde", "Charles Dickens", "William Shakespeare", "Jane Austen"], correctIndex: 2, difficulty: 1, category: "arte", hint: "Inglés del siglo XVI" },
  { question: "¿Quién escribió 'Don Quijote de la Mancha'?", options: ["Lope de Vega", "Calderón de la Barca", "Miguel de Cervantes", "Quevedo"], correctIndex: 2, difficulty: 1, category: "arte", hint: "El manco de Lepanto" },
  { question: "¿Quién dirigió la película 'Titanic'?", options: ["Steven Spielberg", "James Cameron", "Martin Scorsese", "Christopher Nolan"], correctIndex: 1, difficulty: 1, category: "arte", hint: "También dirigió Avatar" },
  { question: "¿Quién escribió 'Crónica de una muerte anunciada'?", options: ["Mario Vargas Llosa", "Gabriel García Márquez", "Julio Cortázar", "Pablo Neruda"], correctIndex: 1, difficulty: 2, category: "arte", hint: "Colombiano, realismo mágico" },
  { question: "¿Quién escribió '1984'?", options: ["Aldous Huxley", "Ray Bradbury", "George Orwell", "H.G. Wells"], correctIndex: 2, difficulty: 2, category: "arte", hint: "Gran Hermano" },
  { question: "¿Quién es el autor de 'El Señor de los Anillos'?", options: ["C.S. Lewis", "J.R.R. Tolkien", "George R.R. Martin", "Terry Pratchett"], correctIndex: 1, difficulty: 1, category: "arte", hint: "Profesor de Oxford" },
  { question: "¿Quién escribió Harry Potter?", options: ["Stephenie Meyer", "J.K. Rowling", "Rick Riordan", "Suzanne Collins"], correctIndex: 1, difficulty: 1, category: "arte", hint: "Británica, iniciales JK" },
  { question: "¿Quién cantaba 'Thriller'?", options: ["Prince", "Stevie Wonder", "Michael Jackson", "Whitney Houston"], correctIndex: 2, difficulty: 1, category: "arte", hint: "Rey del Pop" },
  { question: "¿Quién pintó el techo de la Capilla Sixtina?", options: ["Leonardo da Vinci", "Rafael", "Miguel Ángel", "Botticelli"], correctIndex: 2, difficulty: 1, category: "arte", hint: "También esculpió el David" },
  { question: "¿Qué artista español es conocido por el surrealismo y los relojes blandos?", options: ["Picasso", "Miró", "Dalí", "Goya"], correctIndex: 2, difficulty: 1, category: "arte", hint: "Bigote famoso" },
  { question: "¿Quién compuso 'Las Cuatro Estaciones'?", options: ["Bach", "Mozart", "Vivaldi", "Handel"], correctIndex: 2, difficulty: 2, category: "arte", hint: "Italiano, barroco" },
  { question: "¿De qué país era Frida Kahlo?", options: ["Argentina", "España", "México", "Colombia"], correctIndex: 2, difficulty: 1, category: "arte", hint: "Casada con Diego Rivera" },
  { question: "¿Quién escribió 'Cien años de soledad'?", options: ["Isabel Allende", "Gabriel García Márquez", "Pablo Neruda", "Octavio Paz"], correctIndex: 1, difficulty: 1, category: "arte", hint: "Gabo" },
  { question: "¿Qué instrumento tocaba Beethoven principalmente?", options: ["Violín", "Piano", "Órgano", "Cello"], correctIndex: 1, difficulty: 1, category: "arte", hint: "Teclado" },
  { question: "¿De qué país era Mozart?", options: ["Alemania", "Austria", "Italia", "Francia"], correctIndex: 1, difficulty: 2, category: "arte", hint: "Salzburgo" },
  { question: "¿Quién es el rey de la selva?", options: ["Tigre", "León", "Elefante", "Gorila"], correctIndex: 1, difficulty: 1, category: "naturaleza", hint: "Melena" },
  
  // From Word document - Geografía
  { question: "¿Cuál es el único continente que se encuentra en los cuatro hemisferios?", options: ["Asia", "África", "Antártida", "Oceanía"], correctIndex: 1, difficulty: 3, category: "geografia", hint: "El segundo más grande" },
  { question: "¿Cuál es la capital de Islandia?", options: ["Oslo", "Helsinki", "Reikiavik", "Copenhague"], correctIndex: 2, difficulty: 3, category: "geografia", hint: "Empieza por R" },
  { question: "¿Qué río atraviesa la ciudad de Londres?", options: ["Sena", "Danubio", "Támesis", "Tíber"], correctIndex: 2, difficulty: 2, category: "geografia", hint: "Nombre inglés famoso" },
  { question: "¿En qué país se encuentra la ciudad de Petra?", options: ["Egipto", "Jordania", "Irán", "Turquía"], correctIndex: 1, difficulty: 3, category: "geografia", hint: "Cerca de Israel" },
  
  // From Word document - TV y Nostalgia
  { question: "¿Quién fue el ganador de la primera edición de Operación Triunfo en España?", options: ["David Bisbal", "Rosa López", "David Bustamante", "Chenoa"], correctIndex: 1, difficulty: 2, category: "arte", hint: "Fue a Eurovisión" },
  { question: "En 'Aquí no hay quien viva', ¿cómo se llamaba el videoclub de Paco?", options: ["Paco's Video", "Videoclub Paco", "Cinema Paco", "Pura Ficción"], correctIndex: 1, difficulty: 3, category: "arte", hint: "Muy literal" },
  { question: "¿Cuál era el nombre del colegio en la serie 'Física o Química'?", options: ["Zurbarán", "Las Encinas", "San Severo", "Laguna Negra"], correctIndex: 0, difficulty: 2, category: "arte", hint: "Nombre de pintor" },
  { question: "¿Qué personaje de 'Los Simpson' trabaja en una tienda llamada 'El Badulaque'?", options: ["Apu", "Moe", "Ned Flanders", "Barney"], correctIndex: 0, difficulty: 1, category: "arte", hint: "Hindú" },
  
  // From Word document - Cine
  { question: "¿Quién dirigió la película 'El laberinto del fauno'?", options: ["Pedro Almodóvar", "Guillermo del Toro", "Alejandro Amenábar", "J.A. Bayona"], correctIndex: 1, difficulty: 2, category: "arte", hint: "Mexicano" },
  { question: "¿Cómo se llama el reino donde vive Simba en 'El Rey León'?", options: ["Pride Lands", "Savannah", "Africa", "Lion Kingdom"], correctIndex: 0, difficulty: 2, category: "arte", hint: "Tierras del orgullo" },
  { question: "¿Cuál fue la primera película de Pixar estrenada en cines?", options: ["Bichos", "Toy Story", "Buscando a Nemo", "Monsters Inc."], correctIndex: 1, difficulty: 1, category: "arte", hint: "Juguetes que cobran vida" },
  { question: "¿En qué año se estrenó la primera película de 'Harry Potter'?", options: ["1999", "2001", "2003", "2005"], correctIndex: 1, difficulty: 2, category: "arte", hint: "Inicio de década" },
  
  // More science questions
  { question: "¿Qué planeta es conocido como el 'Planeta Rojo'?", options: ["Venus", "Júpiter", "Marte", "Saturno"], correctIndex: 2, difficulty: 1, category: "ciencia", hint: "Dios de la guerra" },
  { question: "¿Cuál es el mamífero más grande del mundo?", options: ["Elefante africano", "Ballena azul", "Jirafa", "Hipopótamo"], correctIndex: 1, difficulty: 1, category: "ciencia", hint: "Vive en el mar" },
  { question: "¿Qué gas absorben las plantas para realizar la fotosíntesis?", options: ["Oxígeno", "Nitrógeno", "Dióxido de carbono", "Helio"], correctIndex: 2, difficulty: 2, category: "ciencia", hint: "CO2" },
  
  // MATEMÁTICAS
  { question: "¿Cuántos lados tiene un hexágono?", options: ["5", "6", "7", "8"], correctIndex: 1, difficulty: 1, category: "matematicas", hint: "Hexa = seis" },
  { question: "¿Cuántos lados tiene un heptágono?", options: ["6", "7", "8", "9"], correctIndex: 1, difficulty: 1, category: "matematicas", hint: "Hepta = siete" },
  { question: "¿Cuánto es la raíz cuadrada de 81?", options: ["7", "8", "9", "10"], correctIndex: 2, difficulty: 1, category: "matematicas", hint: "9 x 9" },
  { question: "¿Cuánto es 15% de 200?", options: ["25", "30", "35", "40"], correctIndex: 1, difficulty: 2, category: "matematicas", hint: "10% + 5%" },
  { question: "¿Cuál es el valor de Pi aproximado?", options: ["3.14", "3.41", "2.71", "3.16"], correctIndex: 0, difficulty: 1, category: "matematicas", hint: "Círculos" },
  { question: "¿Cuántos grados tiene un ángulo recto?", options: ["45", "90", "180", "360"], correctIndex: 1, difficulty: 1, category: "matematicas", hint: "Esquina de un cuadrado" },
  { question: "¿Cuántos grados tiene un triángulo?", options: ["90", "180", "270", "360"], correctIndex: 1, difficulty: 1, category: "matematicas", hint: "Suma de sus ángulos" },
  { question: "¿Qué es un número primo?", options: ["Divisible por 1 y por sí mismo", "Divisible por 2", "Mayor que 10", "Número negativo"], correctIndex: 0, difficulty: 2, category: "matematicas", hint: "2, 3, 5, 7, 11..." },
  { question: "¿Cuánto es 7 x 8?", options: ["54", "56", "58", "64"], correctIndex: 1, difficulty: 1, category: "matematicas", hint: "5, 6, 7, 8" },
  { question: "¿Cuánto es 144 dividido entre 12?", options: ["10", "11", "12", "13"], correctIndex: 2, difficulty: 1, category: "matematicas", hint: "Docena de docenas" },
  { question: "¿Qué es un trapecio?", options: ["Cuadrilátero con 4 lados iguales", "Cuadrilátero con 2 lados paralelos", "Triángulo con ángulo recto", "Polígono de 5 lados"], correctIndex: 1, difficulty: 2, category: "matematicas", hint: "Tiene bases" },
  { question: "¿Cuánto es 2 elevado a la 10?", options: ["512", "1000", "1024", "2048"], correctIndex: 2, difficulty: 3, category: "matematicas", hint: "1 kilobyte" },
  { question: "¿Qué número es el resultado de dividir cualquier número entre 0?", options: ["0", "1", "Infinito", "Indefinido"], correctIndex: 3, difficulty: 2, category: "matematicas", hint: "No se puede hacer" },
  { question: "¿Cuánto es el factorial de 5 (5!)?", options: ["25", "60", "100", "120"], correctIndex: 3, difficulty: 3, category: "matematicas", hint: "5x4x3x2x1" },
  { question: "¿Cuántos lados tiene un dodecágono?", options: ["10", "11", "12", "15"], correctIndex: 2, difficulty: 2, category: "matematicas", hint: "Dodeca = doce" },
  
  // DEPORTES
  { question: "¿Cuántos jugadores hay en un equipo de fútbol en el campo?", options: ["10", "11", "12", "9"], correctIndex: 1, difficulty: 1, category: "deportes", hint: "Incluye al portero" },
  { question: "¿Cuántos jugadores hay en un equipo de baloncesto en pista?", options: ["5", "6", "7", "4"], correctIndex: 0, difficulty: 1, category: "deportes", hint: "NBA" },
  { question: "¿Cuántos jugadores hay en un equipo de voleibol en pista?", options: ["5", "6", "7", "8"], correctIndex: 1, difficulty: 2, category: "deportes", hint: "Rotación" },
  { question: "¿En qué deporte se hace un 'Touchdown'?", options: ["Rugby", "Fútbol Americano", "Béisbol", "Hockey"], correctIndex: 1, difficulty: 1, category: "deportes", hint: "Super Bowl" },
  { question: "¿Cuántos sets hay que ganar en un partido de tenis masculino en Grand Slam?", options: ["2", "3", "4", "5"], correctIndex: 1, difficulty: 2, category: "deportes", hint: "Al mejor de 5" },
  { question: "¿Qué equipo ha ganado más ligas de fútbol en España?", options: ["Barcelona", "Real Madrid", "Atlético Madrid", "Athletic Bilbao"], correctIndex: 1, difficulty: 1, category: "deportes", hint: "36 títulos" },
  { question: "¿Cada cuántos años se celebran los Juegos Olímpicos de verano?", options: ["2", "3", "4", "5"], correctIndex: 2, difficulty: 1, category: "deportes", hint: "Año bisiesto" },
  { question: "¿Cuántos hoyos tiene un campo de golf estándar?", options: ["9", "12", "18", "21"], correctIndex: 2, difficulty: 1, category: "deportes", hint: "Una vuelta completa" },
  { question: "¿Cuántas carreras hay en una temporada de Fórmula 1 actualmente?", options: ["18-20", "20-24", "12-15", "25-30"], correctIndex: 1, difficulty: 2, category: "deportes", hint: "Ha ido aumentando" },
  { question: "¿Cuántos puntos vale un 'triple' en baloncesto?", options: ["1", "2", "3", "4"], correctIndex: 2, difficulty: 1, category: "deportes", hint: "Desde lejos" },
  
  // IDIOMAS Y VARIOS
  { question: "¿Cuál es el idioma más hablado del mundo como lengua materna?", options: ["Inglés", "Español", "Chino Mandarín", "Hindi"], correctIndex: 2, difficulty: 2, category: "general", hint: "País más poblado" },
  { question: "¿Cuál es la moneda de Japón?", options: ["Yuan", "Won", "Yen", "Ringgit"], correctIndex: 2, difficulty: 1, category: "general", hint: "Empieza por Y" },
  { question: "¿Cuál es la moneda de Suiza?", options: ["Euro", "Franco suizo", "Corona", "Libra"], correctIndex: 1, difficulty: 2, category: "general", hint: "No están en la UE" },
  { question: "¿Qué idioma es oficial en Austria?", options: ["Francés", "Italiano", "Alemán", "Inglés"], correctIndex: 2, difficulty: 1, category: "general", hint: "País vecino de Alemania" },
  { question: "Nombra 5 colores en inglés", options: ["Red, Blue, Green, Yellow, Black", "Rojo, Azul, Verde, Amarillo, Negro", "Rouge, Bleu, Vert, Jaune, Noir", "Rot, Blau, Grün, Gelb, Schwarz"], correctIndex: 0, difficulty: 1, category: "general", hint: "Idioma anglosajón" },
  { question: "¿Qué significan las siglas RAE?", options: ["Real Academia Española", "Registro de Archivos Españoles", "Red de Academias Europeas", "Reglamento Académico Educativo"], correctIndex: 0, difficulty: 1, category: "general", hint: "Diccionario oficial" },
  { question: "¿Cuál es el animal terrestre más grande?", options: ["Rinoceronte", "Hipopótamo", "Elefante africano", "Jirafa"], correctIndex: 2, difficulty: 1, category: "naturaleza", hint: "Tiene trompa" },
  { question: "¿Cuál es el mamífero más grande del mundo?", options: ["Elefante", "Ballena azul", "Tiburón ballena", "Orca"], correctIndex: 1, difficulty: 1, category: "naturaleza", hint: "Vive en el océano" },
  { question: "¿Cuál es el ave más rápida del mundo?", options: ["Águila real", "Halcón peregrino", "Colibrí", "Golondrina"], correctIndex: 1, difficulty: 2, category: "naturaleza", hint: "En picado" },
  { question: "¿Qué gas respiramos principalmente?", options: ["Oxígeno", "Nitrógeno", "Dióxido de carbono", "Helio"], correctIndex: 1, difficulty: 3, category: "ciencia", hint: "78% de la atmósfera" },

// GEOGRAFÍA Y MUNDO
  { question: "¿Cuál es el único continente que se encuentra en los cuatro hemisferios?", options: ["Asia", "África", "Antártida", "Oceanía"], correctIndex: 1, difficulty: 2, category: "geografia", hint: "Lo cruza el Ecuador y el Meridiano de Greenwich" },
  { question: "¿Cuál es la capital de Islandia?", options: ["Oslo", "Helsinki", "Reikiavik", "Copenhague"], correctIndex: 2, difficulty: 2, category: "geografia", hint: "Ciudad con mucha actividad geotérmica" },
  { question: "¿Qué río atraviesa la ciudad de Londres?", options: ["Sena", "Danubio", "Támesis", "Tíber"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Nombre muy británico" },
  { question: "¿Cuál es el país más grande del mundo por superficie?", options: ["China", "Estados Unidos", "Canadá", "Rusia"], correctIndex: 3, difficulty: 1, category: "geografia", hint: "Abarca 11 husos horarios" },
  { question: "¿En qué país se encuentra la ciudad de Petra?", options: ["Egipto", "Jordania", "Irán", "Turquía"], correctIndex: 1, difficulty: 2, category: "geografia", hint: "Famosa ciudad excavada en piedra" },

  // TELEVISIÓN Y NOSTALGIA
  { question: "¿Cómo se llamaba el perro de la familia de 'Los Serrano'?", options: ["Curro", "Choni", "Pepe", "No tenían perro"], correctIndex: 3, difficulty: 3, category: "nostalgia", hint: "¡Cuidado! Es una pregunta trampa" },
  { question: "¿Quién fue el ganador de la primera edición de Operación Triunfo en España?", options: ["David Bisbal", "Rosa López", "David Bustamante", "Chenoa"], correctIndex: 1, difficulty: 1, category: "nostalgia", hint: "Rosa de España" },
  { question: "En 'Aquí no hay quien viva', ¿cómo se llamaba el videoclub de Paco?", options: ["Paco's Video", "Videoclub Paco", "Cinema Paco", "Pura Ficción"], correctIndex: 1, difficulty: 2, category: "nostalgia", hint: "Nombre muy directo" },
  { question: "¿Cuál era el nombre del colegio en la serie 'Física o Química'?", options: ["Zurbarán", "Las Encinas", "San Severo", "Laguna Negra"], correctIndex: 0, difficulty: 2, category: "nostalgia", hint: "Nombre de un famoso pintor español" },
  { question: "¿Qué personaje de 'Los Simpson' trabaja en una tienda llamada 'El Badulaque'?", options: ["Apu", "Moe", "Ned Flanders", "Barney"], correctIndex: 0, difficulty: 1, category: "nostalgia", hint: "Nahasapeemapetilon" },

  // CINE Y ENTRETENIMIENTO
  { question: "¿Quién dirigió la película 'El laberinto del fauno'?", options: ["Pedro Almodóvar", "Guillermo del Toro", "Alejandro Amenábar", "J.A. Bayona"], correctIndex: 1, difficulty: 2, category: "cine", hint: "Director mexicano" },
  { question: "¿Cómo se llama el reino donde vive Simba en 'El Rey León'?", options: ["Pride Lands", "Far Far Away", "Narnia", "Mordor"], correctIndex: 0, difficulty: 1, category: "cine", hint: "Tierras del Orgullo" },
  { question: "¿Qué actor interpreta a Jack Sparrow en 'Piratas del Caribe'?", options: ["Brad Pitt", "Johnny Depp", "Orlando Bloom", "Tom Cruise"], correctIndex: 1, difficulty: 1, category: "cine", hint: "Famoso por Eduardo Manostijeras" },
  { question: "¿Cuál fue la primera película de Pixar estrenada en cines?", options: ["Bichos", "Toy Story", "Cars", "Monstruos S.A."], correctIndex: 1, difficulty: 1, category: "cine", hint: "Protagonizada por juguetes" },
  { question: "¿En qué año se estrenó la primera película de 'Harry Potter'?", options: ["1999", "2001", "2003", "2005"], correctIndex: 1, difficulty: 2, category: "cine", hint: "A principios de los 2000" },

  // CIENCIA Y NATURALEZA
  { question: "¿Cuál es el elemento químico con el símbolo 'Au'?", options: ["Plata", "Oro", "Cobre", "Aluminio"], correctIndex: 1, difficulty: 2, category: "ciencia", hint: "Del latín Aurum" },
  { question: "¿Cuántos huesos tiene el cuerpo humano de un adulto?", options: ["186", "206", "216", "256"], correctIndex: 1, difficulty: 2, category: "ciencia", hint: "Algo más de doscientos" },
  { question: "¿Qué planeta es conocido como el 'Planeta Rojo'?", options: ["Venus", "Júpiter", "Marte", "Saturno"], correctIndex: 2, difficulty: 1, category: "ciencia", hint: "Dios de la guerra" },
  { question: "¿Cuál es el mamífero más grande del mundo?", options: ["Elefante africano", "Ballena azul", "Tiburón ballena", "Orca"], correctIndex: 1, difficulty: 1, category: "ciencia", hint: "Vive en el agua" },
  { question: "¿Qué gas absorben las plantas para realizar la fotosíntesis?", options: ["Oxígeno", "Nitrógeno", "Dióxido de carbono", "Helio"], correctIndex: 2, difficulty: 1, category: "ciencia", hint: "CO2" },

  // HISTORIA Y CULTURA
  { question: "¿En qué año cayó el Muro de Berlín?", options: ["1985", "1989", "1991", "1993"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Finales de los 80" },
  { question: "¿Quién pintó 'La última cena'?", options: ["Miguel Ángel", "Leonardo da Vinci", "Rafael", "Donatello"], correctIndex: 1, difficulty: 1, category: "arte", hint: "Autor de la Mona Lisa" },
  { question: "¿Cuál era la moneda oficial de España antes del Euro?", options: ["Escudo", "Peseta", "Real", "Franco"], correctIndex: 1, difficulty: 1, category: "historia", hint: "Las 'rubias'" },
  { question: "¿Quién escribió la obra 'Don Quijote de la Mancha'?", options: ["Lope de Vega", "García Lorca", "Miguel de Cervantes", "Quevedo"], correctIndex: 2, difficulty: 1, category: "literatura", hint: "El Manco de Lepanto" },
  { question: "¿En qué ciudad se encuentra el Coliseo?", options: ["Atenas", "Roma", "Nápoles", "Florencia"], correctIndex: 1, difficulty: 1, category: "historia", hint: "Capital de Italia" },

  // DEPORTES
  { question: "¿Quién ha ganado más Balones de Oro en la historia (hasta 2024)?", options: ["Cristiano Ronaldo", "Lionel Messi", "Pelé", "Maradona"], correctIndex: 1, difficulty: 1, category: "deportes", hint: "Jugador argentino" },
  { question: "¿En qué ciudad se celebraron los Juegos Olímpicos de 1992?", options: ["Madrid", "Sevilla", "Barcelona", "Valencia"], correctIndex: 2, difficulty: 1, category: "deportes", hint: "Ciudad Condal" },
  { question: "¿Cuál es el estilo de natación más lento?", options: ["Crol", "Espalda", "Mariposa", "Braza"], correctIndex: 3, difficulty: 2, category: "deportes", hint: "Estilo pecho" },
  { question: "¿Cuántos jugadores hay en un equipo de baloncesto en pista?", options: ["4", "5", "6", "7"], correctIndex: 1, difficulty: 1, category: "deportes", hint: "Una mano completa" },
  { question: "¿Quién es el tenista con más títulos de Roland Garros?", options: ["Roger Federer", "Novak Djokovic", "Rafael Nadal", "Björn Borg"], correctIndex: 2, difficulty: 1, category: "deportes", hint: "El Rey de la Tierra Batida" },

  // MÚSICA
  { question: "¿A qué banda pertenecía Freddie Mercury?", options: ["The Beatles", "Queen", "Led Zeppelin", "Pink Floyd"], correctIndex: 1, difficulty: 1, category: "musica", hint: "Reina en inglés" },
  { question: "¿Quién canta la canción 'Bad Guy'?", options: ["Ariana Grande", "Dua Lipa", "Billie Eilish", "Taylor Swift"], correctIndex: 2, difficulty: 1, category: "musica", hint: "Cantante joven con estilo oscuro" },
  { question: "¿Cómo se llamaba el grupo de música de Amaia Montero antes de irse?", options: ["La Quinta Estación", "La Oreja de Van Gogh", "El Sueño de Morfeo", "Amaral"], correctIndex: 1, difficulty: 1, category: "musica", hint: "Famosos por 'Rosas'" },
  { question: "¿Cuál es el nombre real de Lady Gaga?", options: ["Stefani Germanotta", "Robyn Fenty", "Katy Hudson", "Onika Maraj"], correctIndex: 0, difficulty: 3, category: "musica", hint: "Nombre de origen italiano" },
  { question: "¿Qué grupo español cantaba 'Zapatillas'?", options: ["Pignoise", "El Canto del Loco", "Pereza", "Estopa"], correctIndex: 1, difficulty: 1, category: "musica", hint: "Dani Martín era el vocalista" },

  // MISCELÁNEA
  { question: "¿Cuál es el ingrediente principal del hummus?", options: ["Lentejas", "Garbanzos", "Alubias", "Guisantes"], correctIndex: 1, difficulty: 1, category: "comida", hint: "Legumbre base del cocido" },
  { question: "¿Qué red social tenía un logo con un pájaro azul?", options: ["Facebook", "Instagram", "Twitter", "TikTok"], correctIndex: 2, difficulty: 1, category: "varios", hint: "Ahora se llama X" },
  { question: "¿Cuántos colores tiene el arcoíris?", options: ["5", "6", "7", "8"], correctIndex: 2, difficulty: 1, category: "ciencia", hint: "Número de la suerte" },
  { question: "¿Cuál es el animal nacional de Australia?", options: ["Koala", "Canguro", "Ornitorrinco", "Demonio de Tasmania"], correctIndex: 1, difficulty: 1, category: "naturaleza", hint: "Lleva a sus crías en una bolsa" },
  { question: "¿En qué año se fundó Google?", options: ["1994", "1996", "1998", "2000"], correctIndex: 2, difficulty: 2, category: "varios", hint: "Finales de los 90" },
  { question: "¿Qué significan las siglas 'WWW' en una dirección web?", options: ["World Wide Web", "Web World Wide", "Wide World Web", "World Web Wide"], correctIndex: 0, difficulty: 1, category: "varios", hint: "Telaraña mundial" },
  { question: "¿Cuál es el libro más vendido de la historia (después de la Biblia)?", options: ["El Señor de los Anillos", "Don Quijote", "Harry Potter", "Historia de dos ciudades"], correctIndex: 1, difficulty: 2, category: "literatura", hint: "Obra de Cervantes" },
  { question: "¿Cuál es la montaña más alta del mundo?", options: ["K2", "Kilimanjaro", "Everest", "Annapurna"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Himalaya" },
  { question: "¿En qué país nació Elon Musk?", options: ["Estados Unidos", "Canadá", "Sudáfrica", "Australia"], correctIndex: 2, difficulty: 2, category: "varios", hint: "País africano" },
  { question: "¿Cuál es la capital de Australia?", options: ["Sídney", "Melbourne", "Canberra", "Perth"], correctIndex: 2, difficulty: 3, category: "geografia", hint: "No es Sídney ni Melbourne" },
  { question: "¿Qué pintor es famoso por sus relojes blandos?", options: ["Picasso", "Dalí", "Miró", "Goya"], correctIndex: 1, difficulty: 2, category: "arte", hint: "Surrealismo español" },
  { question: "¿Cuál es el océano más profundo?", options: ["Atlántico", "Índico", "Ártico", "Pacífico"], correctIndex: 3, difficulty: 2, category: "geografia", hint: "Contiene la fosa de las Marianas" },
  { question: "¿Quién escribió 'Cien años de soledad'?", options: ["Mario Vargas Llosa", "Gabriel García Márquez", "Julio Cortázar", "Pablo Neruda"], correctIndex: 1, difficulty: 1, category: "literatura", hint: "Gabo" },
  { question: "¿En qué año llegó el hombre a la Luna?", options: ["1965", "1969", "1972", "1975"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Misión Apolo 11" },
  { question: "¿Cuál es el metal más caro del mundo?", options: ["Oro", "Platino", "Rodio", "Iridio"], correctIndex: 2, difficulty: 3, category: "ciencia", hint: "Empieza por R" },
  { question: "¿Cómo se llama el protagonista de 'The Legend of Zelda'?", options: ["Zelda", "Link", "Ganon", "Navi"], correctIndex: 1, difficulty: 1, category: "gaming", hint: "Viste de verde" },
  { question: "¿En qué año se lanzó la primera PlayStation en Europa?", options: ["1992", "1994", "1995", "1997"], correctIndex: 2, difficulty: 2, category: "gaming", hint: "Mitad de los 90" },
  { question: "¿Cuál es el videojuego más vendido de la historia?", options: ["Tetris", "GTA V", "Minecraft", "Wii Sports"], correctIndex: 2, difficulty: 2, category: "gaming", hint: "Juego de bloques" },
  { question: "¿Cómo se llama el fontanero de Nintendo?", options: ["Luigi", "Wario", "Mario", "Waluigi"], correctIndex: 2, difficulty: 1, category: "gaming", hint: "Viste de rojo" },
  { question: "¿Qué empresa creó el juego 'Fortnite'?", options: ["Nintendo", "Ubisoft", "Epic Games", "Activision"], correctIndex: 2, difficulty: 1, category: "gaming", hint: "Tiene su propia tienda digital" },

  // COMIDA Y BEBIDA
  { question: "¿De qué país es originaria la pizza?", options: ["Francia", "Grecia", "Italia", "Estados Unidos"], correctIndex: 2, difficulty: 1, category: "comida", hint: "País del Mediterráneo" },
  { question: "¿Qué tipo de pasta tiene forma de lazos o mariposas?", options: ["Macarrones", "Penne", "Farfalle", "Fusilli"], correctIndex: 2, difficulty: 2, category: "comida", hint: "Nombre italiano" },
  { question: "¿Cuál es el ingrediente principal del guacamole?", options: ["Tomate", "Cebolla", "Aguacate", "Pimiento"], correctIndex: 2, difficulty: 1, category: "comida", hint: "Fruta verde cremosa" },
  { question: "¿Qué bebida se obtiene de la fermentación de la manzana?", options: ["Cerveza", "Vino", "Sidra", "Hidromiel"], correctIndex: 2, difficulty: 1, category: "comida", hint: "Típica de Asturias" },
  { question: "¿Cuál es el queso más famoso de Grecia?", options: ["Parmesano", "Brie", "Feta", "Gouda"], correctIndex: 2, difficulty: 2, category: "comida", hint: "Queso blanco salado" },

  // CULTURA GENERAL CONTINUACIÓN
  { question: "¿Qué selección ganó el Mundial de Fútbol en 2010?", options: ["Alemania", "Holanda", "España", "Brasil"], correctIndex: 2, difficulty: 1, category: "deportes", hint: "Gol de Iniesta" },
  { question: "¿Quién es el autor de 'El Principito'?", options: ["Antoine de Saint-Exupéry", "Victor Hugo", "Charles Baudelaire", "Albert Camus"], correctIndex: 0, difficulty: 2, category: "literatura", hint: "Piloto francés" },
  { question: "¿Cuál es el país con más habitantes del mundo (en 2024)?", options: ["China", "Estados Unidos", "India", "Indonesia"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Superó a China recientemente" },
  { question: "¿En qué año se hundió el Titanic?", options: ["1905", "1912", "1918", "1922"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Abril de 1912" },
  { question: "¿Cuál es la capital de Italia?", options: ["Milán", "Venecia", "Roma", "Nápoles"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "La ciudad eterna" },
  { question: "¿Qué órgano del cuerpo humano produce la insulina?", options: ["Hígado", "Páncreas", "Riñón", "Estómago"], correctIndex: 1, difficulty: 2, category: "ciencia", hint: "Relacionado con la diabetes" },
  { question: "¿Quién pintó la 'Mona Lisa'?", options: ["Miguel Ángel", "Leonardo da Vinci", "Van Gogh", "Picasso"], correctIndex: 1, difficulty: 1, category: "arte", hint: "Genio del Renacimiento" },
  { question: "¿Cuál es el río más largo del mundo?", options: ["Nilo", "Amazonas", "Misisipi", "Yangtsé"], correctIndex: 1, difficulty: 2, category: "geografia", hint: "Atraviesa Sudamérica" },
  { question: "¿Cuántos corazones tiene un pulpo?", options: ["1", "2", "3", "4"], correctIndex: 2, difficulty: 3, category: "naturaleza", hint: "Tiene más de dos" },
  { question: "¿En qué país se inventó la pólvora?", options: ["Japón", "India", "China", "Egipto"], correctIndex: 2, difficulty: 2, category: "historia", hint: "País de la Gran Muralla" },

  // MÚSICA Y CINE CONTINUACIÓN
  { question: "¿Quién es el 'Rey del Pop'?", options: ["Elvis Presley", "Michael Jackson", "Justin Bieber", "Prince"], correctIndex: 1, difficulty: 1, category: "musica", hint: "Autor de Thriller" },
  { question: "¿Cuál es la capital de Francia?", options: ["Lyon", "Marsella", "Niza", "París"], correctIndex: 3, difficulty: 1, category: "geografia", hint: "Ciudad de la luz" },
  { question: "¿Qué superhéroe es conocido como 'El caballero oscuro'?", options: ["Superman", "Batman", "Spider-Man", "Iron Man"], correctIndex: 1, difficulty: 1, category: "cine", hint: "Protector de Gotham" },
  { question: "¿Cuál es el metal líquido a temperatura ambiente?", options: ["Plata", "Mercurio", "Plomo", "Zinc"], correctIndex: 1, difficulty: 2, category: "ciencia", hint: "Usado en termómetros antiguos" },
  { question: "¿En qué continente está el desierto del Sáhara?", options: ["Asia", "África", "América", "Oceanía"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "Continente vecino de Europa" },
  { question: "¿Quién fue el primer presidente de Estados Unidos?", options: ["Abraham Lincoln", "Thomas Jefferson", "George Washington", "John Adams"], correctIndex: 2, difficulty: 2, category: "historia", hint: "Da nombre a la capital" },
  { question: "¿Cuál es el idioma más hablado del mundo (nativos + no nativos)?", options: ["Chino Mandarín", "Español", "Inglés", "Hindi"], correctIndex: 2, difficulty: 2, category: "varios", hint: "Idioma global" },
  { question: "¿En qué país se encuentran las pirámides de Guiza?", options: ["México", "Perú", "Egipto", "Sudán"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "País del río Nilo" },
  { question: "¿Qué nota musical sigue a 'Sol'?", options: ["Fa", "La", "Si", "Do"], correctIndex: 1, difficulty: 1, category: "musica", hint: "Do Re Mi Fa Sol..." },
  { question: "¿Cuál es el planeta más cercano al Sol?", options: ["Venus", "Tierra", "Mercurio", "Marte"], correctIndex: 2, difficulty: 2, category: "ciencia", hint: "El más pequeño del sistema solar" },

  // HISTORIA Y CURIOSIDADES EXTRA
  { question: "¿Qué ciudad española es famosa por su acueducto romano?", options: ["Mérida", "Segovia", "Tarragona", "Córdoba"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "En Castilla y León" },
  { question: "¿Cuál es el nombre del protagonista de 'Piratas del Caribe'?", options: ["Will Turner", "Jack Sparrow", "Hector Barbossa", "Davy Jones"], correctIndex: 1, difficulty: 1, category: "cine", hint: "Capitán ebrio" },
  { question: "¿Qué animal es el símbolo de la paz?", options: ["Águila", "Paloma", "Cisne", "Delfín"], correctIndex: 1, difficulty: 1, category: "varios", hint: "Es blanca" },
  { question: "¿Quién descubrió la penicilina?", options: ["Louis Pasteur", "Alexander Fleming", "Marie Curie", "Albert Einstein"], correctIndex: 1, difficulty: 3, category: "ciencia", hint: "Médico escocés" },
  { question: "¿En qué año terminó la Segunda Guerra Mundial?", options: ["1939", "1942", "1945", "1948"], correctIndex: 2, difficulty: 2, category: "historia", hint: "Mitad de los 40" },
  { question: "¿Cuál es la capital de Japón?", options: ["Seúl", "Pekín", "Tokio", "Kioto"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Ciudad más poblada del mundo" },
  { question: "¿Qué científica descubrió el radio y el polonio?", options: ["Ada Lovelace", "Rosalind Franklin", "Marie Curie", "Jane Goodall"], correctIndex: 2, difficulty: 2, category: "ciencia", hint: "Ganadora de dos Nobel" },
  { question: "¿En qué país se encuentra el Taj Mahal?", options: ["Pakistán", "India", "Bangladés", "Nepal"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "País del río Ganges" },
  { question: "¿Cómo se llama la reina de Inglaterra que más tiempo reinó?", options: ["Victoria", "Isabel I", "Isabel II", "Ana"], correctIndex: 2, difficulty: 1, category: "historia", hint: "Fallecida en 2022" },
  { question: "¿Cuál es la moneda de Japón?", options: ["Won", "Yuan", "Yen", "Baht"], correctIndex: 2, difficulty: 1, category: "varios", hint: "Empieza por Y" },

  // CINE Y ARTE ADICIONAL
  { question: "¿Qué actor interpretó a Iron Man en el UCM?", options: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"], correctIndex: 1, difficulty: 1, category: "cine", hint: "RDJ" },
  { question: "¿Cuál es la capital de Portugal?", options: ["Oporto", "Faro", "Lisboa", "Coímbra"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Ciudad de los siete cerros" },
  { question: "¿Qué pintor español pintó 'Las Meninas'?", options: ["Goya", "Velázquez", "El Greco", "Murillo"], correctIndex: 1, difficulty: 2, category: "arte", hint: "Pintor de cámara de Felipe IV" },
  { question: "¿Cuál es el animal más rápido del mundo?", options: ["Guepardo", "Halcón peregrino", "Pez vela", "León"], correctIndex: 1, difficulty: 2, category: "naturaleza", hint: "Es un ave" },
  { question: "¿Qué país tiene forma de bota?", options: ["Grecia", "Italia", "Croacia", "Noruega"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "País de la pizza" },
  { question: "¿Quién escribió 'Romeo y Julieta'?", options: ["Cervantes", "Shakespeare", "Dante", "Molière"], correctIndex: 1, difficulty: 1, category: "literatura", hint: "El bardo de Avon" },
  { question: "¿Cuál es el hueso más largo del cuerpo humano?", options: ["Húmero", "Fémur", "Tibia", "Peroné"], correctIndex: 1, difficulty: 2, category: "ciencia", hint: "Está en la pierna" },
  { question: "¿En qué año se fundó la ONU?", options: ["1940", "1945", "1950", "1955"], correctIndex: 1, difficulty: 3, category: "historia", hint: "Tras la 2ª Guerra Mundial" },
  { question: "¿Cuál es la capital de Alemania?", options: ["Múnich", "Hamburgo", "Berlín", "Fráncfort"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Tenía un muro famoso" },
  { question: "¿Qué instrumento tocaba Jimi Hendrix?", options: ["Batería", "Bajo", "Guitarra", "Piano"], correctIndex: 2, difficulty: 2, category: "musica", hint: "Es una leyenda de las cuerdas" },

  // GEOGRAFÍA Y LITERATURA PACK 3
  { question: "¿Qué ciudad es conocida como 'La ciudad del amor'?", options: ["Venecia", "París", "Roma", "Nueva York"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "Torre Eiffel" },
  { question: "¿Cuál es el océano más pequeño?", options: ["Índico", "Ártico", "Antártico", "Pacífico"], correctIndex: 1, difficulty: 3, category: "geografia", hint: "Polo Norte" },
  { question: "¿Quién pintó 'El Grito'?", options: ["Van Gogh", "Edvard Munch", "Salvador Dalí", "Pablo Picasso"], correctIndex: 1, difficulty: 2, category: "arte", hint: "Expresionista noruego" },
  { question: "¿Cuál es la capital de Estados Unidos?", options: ["Nueva York", "Los Ángeles", "Washington D.C.", "Chicago"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Casa Blanca" },
  { question: "¿Qué desierto es el más árido del mundo?", options: ["Sáhara", "Gobi", "Atacama", "Sonora"], correctIndex: 2, difficulty: 3, category: "geografia", hint: "En Chile" },
  { question: "¿Quién es el autor de 'Harry Potter'?", options: ["George R.R. Martin", "J.R.R. Tolkien", "J.K. Rowling", "Stephen King"], correctIndex: 2, difficulty: 1, category: "literatura", hint: "Escritora británica" },
  { question: "¿Cuál es la capital de Rusia?", options: ["San Petersburgo", "Moscú", "Kiev", "Varsovia"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "Plaza Roja" },
  { question: "¿Qué gas respiramos principalmente?", options: ["Oxígeno", "Dióxido de carbono", "Nitrógeno", "Argón"], correctIndex: 2, difficulty: 3, category: "ciencia", hint: "Aproximadamente el 78%" },
  { question: "¿Cuál es el animal terrestre más grande?", options: ["Rinoceronte", "Hipopótamo", "Elefante africano", "Jirafa"], correctIndex: 2, difficulty: 1, category: "naturaleza", hint: "Tiene colmillos y trompa" },
  { question: "¿Quién fue el autor de 'La Odisea'?", options: ["Platón", "Aristóteles", "Homero", "Sófocles"], correctIndex: 2, difficulty: 2, category: "literatura", hint: "Poeta griego ciego" },

  // CURIOSIDADES DEL MUNDO
  { question: "¿Cuál es la capital de Brasil?", options: ["Río de Janeiro", "Sao Paulo", "Brasilia", "Salvador"], correctIndex: 2, difficulty: 2, category: "geografia", hint: "Ciudad planeada" },
  { question: "¿Qué país regaló la Estatua de la Libertad a EE.UU.?", options: ["Reino Unido", "Francia", "Alemania", "España"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Aliado histórico" },
  { question: "¿Cuál es la capital de Canadá?", options: ["Toronto", "Vancouver", "Ottawa", "Montreal"], correctIndex: 2, difficulty: 2, category: "geografia", hint: "No es Toronto" },
  { question: "¿Quién inventó la bombilla?", options: ["Nikola Tesla", "Thomas Edison", "Graham Bell", "Isaac Newton"], correctIndex: 1, difficulty: 1, category: "historia", hint: "Mago de Menlo Park" },
  { question: "¿Cuál es el país con más islas del mundo?", options: ["Indonesia", "Filipinas", "Suecia", "Noruega"], correctIndex: 2, difficulty: 3, category: "geografia", hint: "Más de 220,000 islas" },
  { question: "¿En qué año se estrenó 'Titanic'?", options: ["1995", "1997", "1999", "2001"], correctIndex: 1, difficulty: 2, category: "cine", hint: "James Cameron" },
  { question: "¿Cuál es la capital de China?", options: ["Shanghái", "Cantón", "Pekín", "Hong Kong"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Norte del país" },
  { question: "¿Qué planeta tiene los anillos más visibles?", options: ["Júpiter", "Saturno", "Urano", "Neptuno"], correctIndex: 1, difficulty: 1, category: "ciencia", hint: "Sexto planeta" },
  { question: "¿Quién pintó el techo de la Capilla Sixtina?", options: ["Leonardo da Vinci", "Miguel Ángel", "Rafael", "Donatello"], correctIndex: 1, difficulty: 2, category: "arte", hint: "También esculpió el David" },
  { question: "¿Cuál es la capital de Argentina?", options: ["Córdoba", "Rosario", "Buenos Aires", "Mendoza"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Casa Rosada" },

  // CULTURA GENERAL VARIOS
  { question: "¿Qué elemento químico tiene el símbolo 'H'?", options: ["Helio", "Hierro", "Hidrógeno", "Mercurio"], correctIndex: 2, difficulty: 1, category: "ciencia", hint: "Elemento más abundante" },
  { question: "¿Cuál es la capital de Grecia?", options: ["Esparta", "Atenas", "Tesalónica", "Heraclión"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "Cuna de la democracia" },
  { question: "¿Quién escribió 'El Hobbit'?", options: ["C.S. Lewis", "J.K. Rowling", "J.R.R. Tolkien", "George R.R. Martin"], correctIndex: 2, difficulty: 1, category: "literatura", hint: "Padre de la fantasía moderna" },
  { question: "¿Cuál es la capital de México?", options: ["Guadalajara", "Monterrey", "Ciudad de México", "Cancún"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "CDMX" },
  { question: "¿Qué país ganó el primer Mundial de Fútbol (1930)?", options: ["Brasil", "Argentina", "Uruguay", "Italia"], correctIndex: 2, difficulty: 3, category: "deportes", hint: "País anfitrión aquel año" },
  { question: "¿Cuál es el metal más abundante en la corteza terrestre?", options: ["Hierro", "Aluminio", "Cobre", "Oro"], correctIndex: 1, difficulty: 3, category: "ciencia", hint: "Usado en latas" },
  { question: "¿Quién dijo 'I have a dream'?", options: ["Malcolm X", "Nelson Mandela", "Martin Luther King Jr.", "Rosa Parks"], correctIndex: 2, difficulty: 2, category: "historia", hint: "Líder civil" },
  { question: "¿Cuál es la capital de Egipto?", options: ["Alejandría", "Luxor", "El Cairo", "Guiza"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Cerca de las pirámides" },
  { question: "¿Qué instrumento tiene 88 teclas?", options: ["Guitarra", "Arpa", "Piano", "Órgano"], correctIndex: 2, difficulty: 1, category: "musica", hint: "Instrumento de percusión y cuerda" },
  { question: "¿Cuál es la capital de Colombia?", options: ["Medellín", "Cali", "Bogotá", "Cartagena"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Situada en el centro del país" },

  // INTERNET Y MODERNIDAD
  { question: "¿En qué año nació Facebook?", options: ["2000", "2002", "2004", "2006"], correctIndex: 2, difficulty: 2, category: "varios", hint: "Mark Zuckerberg" },
  { question: "¿Cuál es el nombre del protagonista de 'Matrix'?", options: ["Morfeo", "Neo", "Smith", "Trinity"], correctIndex: 1, difficulty: 1, category: "cine", hint: "Thomas Anderson" },
  { question: "¿Qué ciudad española tiene la 'Giralda'?", options: ["Córdoba", "Granada", "Sevilla", "Málaga"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Capital andaluza" },
  { question: "¿Cuál es el animal más inteligente (después del humano)?", options: ["Perro", "Chimpancé", "Delfín", "Cuervo"], correctIndex: 1, difficulty: 2, category: "naturaleza", hint: "Cercanía genética" },
  { question: "¿Cuál es la capital de Marruecos?", options: ["Casablanca", "Marrakech", "Rabat", "Tánger"], correctIndex: 2, difficulty: 2, category: "geografia", hint: "No es Casablanca" },
  { question: "¿Quién inventó el teléfono?", options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Guglielmo Marconi"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Aunque Meucci fue el original" },
  { question: "¿Cuál es el país más pequeño del mundo?", options: ["Mónaco", "San Marino", "Vaticano", "Liechtenstein"], correctIndex: 2, difficulty: 2, category: "geografia", hint: "En medio de Roma" },
  { question: "¿Qué fruta es famosa por Newton y la gravedad?", options: ["Pera", "Naranja", "Manzana", "Plátano"], correctIndex: 2, difficulty: 1, category: "ciencia", hint: "Le cayó en la cabeza" },
  { question: "¿Cuál es la capital de Bélgica?", options: ["Amberes", "Gante", "Bruselas", "Brujas"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Sede de la UE" },
  { question: "¿Quién escribió '1984'?", options: ["Aldous Huxley", "Ray Bradbury", "George Orwell", "Ernest Hemingway"], correctIndex: 2, difficulty: 2, category: "literatura", hint: "Big Brother" },

  // FINAL BLOQUE GEOGRAFÍA
  { question: "¿Qué país tiene más pirámides del mundo?", options: ["Egipto", "México", "Sudán", "Perú"], correctIndex: 2, difficulty: 3, category: "geografia", hint: "Tiene más que Egipto" },
  { question: "¿Cuál es la capital de Turquía?", options: ["Estambul", "Esmirna", "Ankara", "Antalya"], correctIndex: 2, difficulty: 2, category: "geografia", hint: "No es Estambul" },
  { question: "¿Qué serie de TV transcurre en el Central Perk?", options: ["HIMYM", "Seinfeld", "Friends", "Big Bang Theory"], correctIndex: 2, difficulty: 1, category: "nostalgia", hint: "Rachel, Ross, Joey..." },
  { question: "¿Cuál es el componente principal del Sol?", options: ["Oxígeno", "Helio", "Hidrógeno", "Carbono"], correctIndex: 2, difficulty: 2, category: "ciencia", hint: "Elemento número 1" },
  { question: "¿Cuál es la capital de Suiza?", options: ["Zúrich", "Ginebra", "Berna", "Basilea"], correctIndex: 2, difficulty: 2, category: "geografia", hint: "No es la ciudad más grande" },
  { question: "¿Quién es el creador de 'Star Wars'?", options: ["Spielberg", "James Cameron", "George Lucas", "Ridley Scott"], correctIndex: 2, difficulty: 1, category: "cine", hint: "Lucasfilm" },
  { question: "¿Cuál es el idioma oficial de Brasil?", options: ["Español", "Brasileño", "Portugués", "Inglés"], correctIndex: 2, difficulty: 1, category: "varios", hint: "Colonización lusa" },
  { question: "¿Cuál es la capital de Tailandia?", options: ["Phuket", "Chiang Mai", "Bangkok", "Pattaya"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Krung Thep" },
  { question: "¿Qué animal es 'Bambi'?", options: ["Conejo", "Zorro", "Ciervo", "Mofeta"], correctIndex: 2, difficulty: 1, category: "cine", hint: "Tiene cuernos al crecer" },
  { question: "¿Cuál es el último planeta del Sistema Solar?", options: ["Urano", "Saturno", "Neptuno", "Plutón"], correctIndex: 2, difficulty: 2, category: "ciencia", hint: "Plutón ya no cuenta" },

  // GAMING Y GEEK
  { question: "¿Cómo se llama el villano de Final Fantasy VII?", options: ["Kefka", "Sephiroth", "Ardyn", "Kuja"], correctIndex: 1, difficulty: 2, category: "gaming", hint: "Tiene una espada larguísima" },
  { question: "¿En qué año se lanzó Tuenti?", options: ["2004", "2006", "2008", "2010"], correctIndex: 1, difficulty: 2, category: "nostalgia", hint: "Red social española" },
  { question: "¿Cuál es el mundo de 'World of Warcraft'?", options: ["Azeroth", "Sanctuary", "Tyria", "Draenor"], correctIndex: 0, difficulty: 2, category: "gaming", hint: "Hogar de la Alianza y la Horda" },
  { question: "¿Qué Pokémon tiene el número 001?", options: ["Pikachu", "Bulbasaur", "Charmander", "Mew"], correctIndex: 1, difficulty: 2, category: "gaming", hint: "Tipo planta/veneno" },
  { question: "¿Cómo se llama el mapa original de 'LoL'?", options: ["Abismo", "Bosque", "Grieta del Invocador", "Valle"], correctIndex: 2, difficulty: 2, category: "gaming", hint: "5 vs 5" },

  // CINE Y SERIES GENERACIÓN 96
  { question: "¿Quién era 'El Duque' en Sin tetas no hay paraíso?", options: ["Miguel Ángel Silvestre", "Mario Casas", "Álex González", "Hugo Silva"], correctIndex: 0, difficulty: 1, category: "nostalgia", hint: "M.A.S." },
  { question: "¿Cómo se llamaba el bar de 'Siete Vidas'?", options: ["El Crípton", "El Kasi Ke No", "El Central", "La Taberna"], correctIndex: 1, difficulty: 2, category: "nostalgia", hint: "Donde daban collejas" },
  { question: "¿En qué serie aparecía 'Nube de Algodón'?", options: ["Los Fruitis", "La banda de Mozart", "Pocoyó", "Bernard"], correctIndex: 0, difficulty: 2, category: "nostalgia", hint: "Serie de frutas animadas" },
  { question: "¿Cuál es el verdadero nombre de Hulk?", options: ["Bruce Banner", "Peter Parker", "Tony Stark", "Steve Rogers"], correctIndex: 0, difficulty: 1, category: "cine", hint: "Científico radiactivo" },
  { question: "¿En qué año se estrenó 'Avatar'?", options: ["2007", "2008", "2009", "2010"], correctIndex: 2, difficulty: 2, category: "cine", hint: "Pueblo Na'vi" },

  // CIENCIA ADICIONAL
  { question: "¿Cuál es el planeta más frío?", options: ["Neptuno", "Urano", "Plutón", "Saturno"], correctIndex: 1, difficulty: 3, category: "ciencia", hint: "Séptimo planeta" },
  { question: "¿Qué parte de la célula es la 'central energética'?", options: ["Núcleo", "Ribosoma", "Mitocondria", "Aparato"], correctIndex: 2, difficulty: 2, category: "ciencia", hint: "Genera ATP" },
  { question: "¿Símbolo químico del Potasio?", options: ["P", "Po", "Pt", "K"], correctIndex: 3, difficulty: 2, category: "ciencia", hint: "Del latín Kalium" },
  { question: "¿Cómo se llama el miedo a las alturas?", options: ["Claustrofobia", "Acrofobia", "Agorafobia", "Aracnofobia"], correctIndex: 1, difficulty: 1, category: "ciencia", hint: "Vértigo" },
  { question: "¿Quién formuló la Teoría de la Evolución?", options: ["Newton", "Darwin", "Mendel", "Pasteur"], correctIndex: 1, difficulty: 1, category: "ciencia", hint: "El origen de las especies" },

  // ÚLTIMO BLOQUE VARIOS
  { question: "¿País más pequeño por población?", options: ["Mónaco", "Tuvalu", "Nauru", "Vaticano"], correctIndex: 3, difficulty: 3, category: "geografia", hint: "Estado eclesiástico" },
  { question: "¿En qué país está Dubái?", options: ["Arabia Saudí", "EAU", "Qatar", "Omán"], correctIndex: 1, difficulty: 2, category: "geografia", hint: "Emiratos Árabes" },
  { question: "¿Lago más profundo del mundo?", options: ["Victoria", "Caspio", "Baikal", "Titicaca"], correctIndex: 2, difficulty: 3, category: "geografia", hint: "En Siberia" },
  { question: "¿Qué estrecho separa España de Marruecos?", options: ["Magallanes", "Bering", "Gibraltar", "Bósforo"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Columnas de Hércules" },
  { question: "¿Quién fue el primer hombre en el espacio?", options: ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "John Glenn"], correctIndex: 2, difficulty: 2, category: "historia", hint: "Cosmonauta soviético" },
  { question: "¿En qué año comenzó la Guerra Civil Española?", options: ["1931", "1934", "1936", "1939"], correctIndex: 2, difficulty: 2, category: "historia", hint: "Julio de aquel año" },
  { question: "¿Qué artista pintó 'El Guernica'?", options: ["Dalí", "Picasso", "Miró", "Goya"], correctIndex: 1, difficulty: 1, category: "arte", hint: "Cubismo" },
  { question: "¿Capital del Imperio Romano de Oriente?", options: ["Roma", "Atenas", "Alejandría", "Constantinopla"], correctIndex: 3, difficulty: 2, category: "historia", hint: "Antigua Bizancio" },
  { question: "¿Qué civilización construyó Machu Picchu?", options: ["Maya", "Azteca", "Inca", "Olmeca"], correctIndex: 2, difficulty: 1, category: "historia", hint: "Andes peruanos" },

  // DEPORTES Y MÚSICA FINAL
  { question: "¿Equipo con más Champions League?", options: ["Milan", "Real Madrid", "Bayern", "Liverpool"], correctIndex: 1, difficulty: 1, category: "deportes", hint: "Tienen 15" },
  { question: "¿En qué deporte se usa el 'Home Run'?", options: ["Cricket", "Rugby", "Béisbol", "Golf"], correctIndex: 2, difficulty: 1, category: "deportes", hint: "Bate y pelota" },
  { question: "¿Cuántos anillos de NBA ganó Michael Jordan?", options: ["4", "5", "6", "7"], correctIndex: 2, difficulty: 2, category: "deportes", hint: "Dos 'three-peats'" },
  { question: "¿Distancia de una maratón completa?", options: ["21 km", "35,5 km", "42,195 km", "50 km"], correctIndex: 2, difficulty: 2, category: "deportes", hint: "42 y pico" },
  { question: "¿Máximo goleador histórico de España?", options: ["Raúl", "Torres", "Villa", "Morata"], correctIndex: 2, difficulty: 2, category: "deportes", hint: "El Guaje" },
  { question: "¿Boy band británica de X-Factor 2010?", options: ["BSB", "One Direction", "Jonas Brothers", "Blue"], correctIndex: 1, difficulty: 1, category: "musica", hint: "Harry Styles era miembro" },
  { question: "¿Artista española que canta 'Malamente'?", options: ["Aitana", "Lola Índigo", "Rosalía", "Bad Gyal"], correctIndex: 2, difficulty: 1, category: "musica", hint: "Motomami" },
  { question: "¿Nombre del grupo de hip-hop de Eminem?", options: ["D12", "NWA", "Wu-Tang", "G-Unit"], correctIndex: 0, difficulty: 3, category: "musica", hint: "Detroit Twelve" },
  { question: "¿A quién se conoce como 'Reina del Soul'?", options: ["Whitney", "Aretha Franklin", "Beyoncé", "Nina Simone"], correctIndex: 1, difficulty: 2, category: "musica", hint: "R-E-S-P-E-C-T" },
  { question: "¿Qué canción rompió récords en 2017?", options: ["Despacito", "Échame la culpa", "Calypso", "No me doy por vencido"], correctIndex: 0, difficulty: 1, category: "musica", hint: "Luis Fonsi y Daddy Yankee" },

  // COMIDA Y VARIOS FINAL
  { question: "¿De qué se hace el Tofu?", options: ["Arroz", "Trigo", "Soja", "Maíz"], correctIndex: 2, difficulty: 2, category: "comida", hint: "Legumbre asiática" },
  { question: "¿Ingrediente que genera debate en la tortilla?", options: ["Chorizo", "Queso", "Cebolla", "Pimiento"], correctIndex: 2, difficulty: 1, category: "comida", hint: "Sin ella es para 'sincebollistas'" },
  { question: "¿Tipo de vino de uva Albariño?", options: ["Tinto", "Rosado", "Blanco", "Espumoso"], correctIndex: 2, difficulty: 2, category: "comida", hint: "Típico de Galicia" },
  { question: "¿País de la cerveza Corona?", options: ["España", "México", "Brasil", "EE.UU."], correctIndex: 1, difficulty: 1, category: "comida", hint: "Se suele tomar con lima" },
  { question: "¿Especia más cara del mundo por peso?", options: ["Vainilla", "Azafrán", "Canela", "Pimienta"], correctIndex: 1, difficulty: 3, category: "comida", hint: "Oro rojo" },
  { question: "¿Animal logo de Lacoste?", options: ["Tiburón", "Lagarto", "Cocodrilo", "Camaleón"], correctIndex: 2, difficulty: 1, category: "varios", hint: "Reptil de río" },
  { question: "¿Red social que compró Elon Musk?", options: ["Tumblr", "Reddit", "Twitter", "Mastodon"], correctIndex: 2, difficulty: 1, category: "varios", hint: "Pájaro azul" },
  { question: "¿Idioma oficial de Austria?", options: ["Austriaco", "Alemán", "Suizo", "Francés"], correctIndex: 1, difficulty: 2, category: "geografia", hint: "Igual que en Alemania" },
  { question: "¿Quién escribió 'Crónica de una muerte anunciada'?", options: ["Allende", "García Márquez", "Borges", "Vargas Llosa"], correctIndex: 1, difficulty: 2, category: "literatura", hint: "Realismo mágico" },
  { question: "¿Minutos de un partido de rugby profesional?", options: ["60", "80", "90", "100"], correctIndex: 1, difficulty: 2, category: "deportes", hint: "Dos partes de 40" },
  { question: "¿En qué ciudad está la Torre Eiffel?", options: ["Londres", "Berlín", "París", "Madrid"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Francia" },
  { question: "¿Superhéroe de editorial DC?", options: ["Iron Man", "Spider-Man", "Wonder Woman", "Thor"], correctIndex: 2, difficulty: 2, category: "cine", hint: "Amazona" },
  { question: "¿Moneda oficial de Reino Unido?", options: ["Euro", "Dólar", "Libra Esterlina", "Franco"], correctIndex: 2, difficulty: 1, category: "varios", hint: "Pound" },
  { question: "¿Órgano humano más grande?", options: ["Hígado", "Cerebro", "Piel", "Corazón"], correctIndex: 2, difficulty: 2, category: "ciencia", hint: "Nos cubre totalmente" },

  // LITERATURA Y CIENCIA FINAL
  { question: "¿Autor de 'La metamorfosis'?", options: ["Franz Kafka", "Nietzsche", "Freud", "Marx"], correctIndex: 0, difficulty: 2, category: "literatura", hint: "Gregorio Samsa" },
  { question: "¿Filósofo que dijo 'Solo sé que no sé nada'?", options: ["Platón", "Aristóteles", "Sócrates", "Descartes"], correctIndex: 2, difficulty: 2, category: "historia", hint: "Maestro de Platón" },
  { question: "¿Famoso detective de Arthur Conan Doyle?", options: ["Poirot", "Sherlock Holmes", "Sam Spade", "James Bond"], correctIndex: 1, difficulty: 1, category: "literatura", hint: "Elemental, querido Watson" },
  { question: "¿País de 'Orgullo y Prejuicio'?", options: ["Francia", "Inglaterra", "Escocia", "Irlanda"], correctIndex: 1, difficulty: 2, category: "literatura", hint: "Jane Austen" },
  { question: "¿Escritor de la Tierra Media?", options: ["Lewis", "Rowling", "Tolkien", "Martin"], correctIndex: 2, difficulty: 1, category: "literatura", hint: "Señor de los Anillos" },
  { question: "¿Capital de Vietnam?", options: ["Saigón", "Hanói", "Da Nang", "Bangkok"], correctIndex: 1, difficulty: 3, category: "geografia", hint: "Al norte del país" },
  { question: "¿Qué significa 'LOL'?", options: ["Lots of Love", "Laughing Out Loud", "Low Luck", "League"], correctIndex: 1, difficulty: 1, category: "varios", hint: "Reírse fuerte" },
  { question: "¿Año del primer vídeo en YouTube?", options: ["2004", "2005", "2006", "2007"], correctIndex: 1, difficulty: 2, category: "varios", hint: "Me at the zoo" },
  { question: "¿Gato del rastro de arcoíris?", options: ["Grumpy Cat", "Nyan Cat", "Keyboard Cat", "Longcat"], correctIndex: 1, difficulty: 2, category: "varios", hint: "Meme de 8 bits" },
  { question: "¿Primer vídeo en llegar a 1.000 millones en YT?", options: ["Baby", "Gangnam Style", "Despacito", "Shape of You"], correctIndex: 1, difficulty: 2, category: "musica", hint: "Psy" },
  { question: "¿Valor aproximado de PI?", options: ["3,12", "3,14", "3,16", "3,18"], correctIndex: 1, difficulty: 1, category: "ciencia", hint: "Constante circular" },
  { question: "¿Elemento más abundante en el universo?", options: ["Oxígeno", "Carbono", "Hidrógeno", "Helio"], correctIndex: 2, difficulty: 3, category: "ciencia", hint: "Primero de la tabla" },
  { question: "¿Donante universal de sangre?", options: ["A+", "B-", "AB+", "O-"], correctIndex: 3, difficulty: 3, category: "ciencia", hint: "Grupo O negativo" },
  { question: "¿Parte del ojo sensible a la luz?", options: ["Córnea", "Iris", "Retina", "Cristalino"], correctIndex: 2, difficulty: 2, category: "ciencia", hint: "Fondo del ojo" },
  { question: "¿Componente del diamante?", options: ["Sílice", "Hierro", "Carbono", "Calcio"], correctIndex: 2, difficulty: 2, category: "ciencia", hint: "Como el grafito" },
  { question: "¿Quién ganó el Mundial de Basket 2006?", options: ["USA", "Argentina", "España", "Grecia"], correctIndex: 2, difficulty: 2, category: "deportes", hint: "Primer mundial de España" },
  { question: "¿Nombre real de Snoop Dogg?", options: ["Calvin Broadus", "Marshall Mathers", "Shawn Carter", "Curtis Jackson"], correctIndex: 0, difficulty: 3, category: "musica", hint: "Apellido Broadus" },
  { question: "¿Ciudad de 'The Beatles'?", options: ["Londres", "Manchester", "Liverpool", "Birmingham"], correctIndex: 2, difficulty: 1, category: "musica", hint: "Puerto inglés" },
  { question: "¿Resultado de 7 x 8?", options: ["54", "56", "58", "62"], correctIndex: 1, difficulty: 1, category: "varios", hint: "Tablas de multiplicar" },
  { question: "¿Fobia a espacios cerrados?", options: ["Claustrofobia", "Agorafobia", "Hemofobia", "Hidrofobia"], correctIndex: 0, difficulty: 1, category: "ciencia", hint: "Encierro" },
  { question: "¿Océano más grande?", options: ["Atlántico", "Índico", "Pacífico", "Ártico"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Cubre un tercio de la Tierra" },
  { question: "¿Líder civil asesinado en 1968?", options: ["Mandela", "Malcolm X", "MLK", "Gandhi"], correctIndex: 2, difficulty: 2, category: "historia", hint: "Nobel de la Paz" },
  { question: "¿Ciudad de la 'Puerta del Sol'?", options: ["Barcelona", "Madrid", "Sevilla", "Valencia"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "Capital de España" },
  { question: "¿Batman de Nolan?", options: ["Affleck", "Bale", "Pattinson", "Keaton"], correctIndex: 1, difficulty: 1, category: "cine", hint: "Christian" },
  { question: "¿Año estreno Titanic?", options: ["1995", "1996", "1997", "1998"], correctIndex: 2, difficulty: 2, category: "cine", hint: "Leo DiCaprio" },
  { question: "¿Serie de TV más cara?", options: ["Tronos", "The Crown", "Anillos de Poder", "Stranger Things"], correctIndex: 2, difficulty: 2, category: "cine", hint: "Amazon Prime" },
  { question: "¿Protagonista Breaking Bad?", options: ["Pinkman", "Walter White", "Saul", "Hank"], correctIndex: 1, difficulty: 1, category: "cine", hint: "Heisenberg" },
  { question: "¿Oscar Mejor Película 2020?", options: ["1917", "Joker", "Parásitos", "Green Book"], correctIndex: 2, difficulty: 2, category: "cine", hint: "Película coreana" },
  { question: "¿Mundial Fútbol 1998?", options: ["Italia", "Francia", "Alemania", "Brasil"], correctIndex: 1, difficulty: 1, category: "deportes", hint: "Ganó Zidane" },
  { question: "¿Más medallas olímpicas oro?", options: ["Bolt", "Phelps", "Biles", "Lewis"], correctIndex: 1, difficulty: 1, category: "deportes", hint: "El Tiburón de Baltimore" },
  { question: "¿Equipo más títulos NBA?", options: ["Lakers", "Celtics", "Warriors", "Bulls"], correctIndex: 1, difficulty: 2, category: "deportes", hint: "Superaron a los Lakers en 2024" },
  { question: "¿Ciudad de Wimbledon?", options: ["NY", "París", "Londres", "Melbourne"], correctIndex: 2, difficulty: 1, category: "deportes", hint: "Césped inglés" },
  { question: "¿Piloto F1 más títulos?", options: ["Vettel", "Verstappen", "Hamilton", "Alonso"], correctIndex: 2, difficulty: 1, category: "deportes", hint: "Empatado con Schumacher" },
  { question: "¿Elemento número atómico 1?", options: ["Helio", "Litio", "Hidrógeno", "Oxígeno"], correctIndex: 2, difficulty: 1, category: "ciencia", hint: "H" },
  { question: "¿Pintó 'La joven de la perla'?", options: ["Rembrandt", "Vermeer", "Van Gogh", "Rubens"], correctIndex: 1, difficulty: 2, category: "arte", hint: "Johannes" },
  { question: "¿Componente principal del aire?", options: ["Oxígeno", "CO2", "Nitrógeno", "Argón"], correctIndex: 2, difficulty: 3, category: "ciencia", hint: "No es el Oxígeno" },
  { question: "¿Cuántos estados tiene EE. UU.?", options: ["48", "50", "52", "54"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "Bandera de barras y estrellas" },
  { question: "¿Órgano que produce bilis?", options: ["Páncreas", "Hígado", "Riñones", "Estómago"], correctIndex: 1, difficulty: 2, category: "ciencia", hint: "Filtra toxinas" },
  { question: "¿Banda de Kurt Cobain?", options: ["Pearl Jam", "Soundgarden", "Nirvana", "Alice in Chains"], correctIndex: 2, difficulty: 1, category: "musica", hint: "Grunge" },
  { question: "¿Artista femenina más Grammys?", options: ["Adele", "Lady Gaga", "Beyoncé", "Taylor Swift"], correctIndex: 2, difficulty: 2, category: "musica", hint: "Queen B" },
  { question: "¿Festival de Indio, California?", options: ["Tomorrowland", "Lollapalooza", "Coachella", "Glastonbury"], correctIndex: 2, difficulty: 1, category: "musica", hint: "Famoso por los outfits de influencers" },
  { question: "¿Grupo español 'La Flaca'?", options: ["Estopa", "Jarabe de Palo", "Amaral", "Pereza"], correctIndex: 1, difficulty: 1, category: "musica", hint: "Pau Donés" },
  { question: "¿Río más largo de Europa?", options: ["Danubio", "Rin", "Volga", "Sena"], correctIndex: 2, difficulty: 3, category: "geografia", hint: "Atraviesa Rusia" },
  { question: "¿Huesos bebé al nacer?", options: ["206", "250", "300", "350"], correctIndex: 2, difficulty: 3, category: "ciencia", hint: "Se fusionan al crecer" },
  { question: "¿pH neutro del agua?", options: ["0", "5", "7", "14"], correctIndex: 2, difficulty: 2, category: "ciencia", hint: "Mitad de la escala" },
  { question: "¿Descubrió América en 1492?", options: ["Vespucio", "Cortés", "Colón", "Pizarro"], correctIndex: 2, difficulty: 1, category: "historia", hint: "Cristóbal" },
  { question: "¿Color caja negra aviones?", options: ["Negro", "Rojo", "Naranja", "Amarillo"], correctIndex: 2, difficulty: 2, category: "ciencia", hint: "Para verla mejor entre escombros" },
  { question: "¿Patas tiene una araña?", options: ["6", "8", "10", "12"], correctIndex: 1, difficulty: 1, category: "naturaleza", hint: "Dos más que los insectos" },
  { question: "¿Bailes 15s originalmente?", options: ["Vine", "Instagram", "TikTok", "Snapchat"], correctIndex: 2, difficulty: 1, category: "varios", hint: "Musical.ly" },
  { question: "¿Piel de Homer Simpson?", options: ["Naranja", "Amarillo", "Rosa", "Blanco"], correctIndex: 1, difficulty: 1, category: "cine", hint: "Color icónico" },
  { question: "¿Gas necesitan humanos?", options: ["Helio", "Oxígeno", "Argón", "Xenón"], correctIndex: 1, difficulty: 1, category: "ciencia", hint: "O2" },
  { question: "¿Velocidad de la luz?", options: ["30.000 km/s", "300.000 km/s", "3.000.000 km/s", "300 km/s"], correctIndex: 1, difficulty: 3, category: "ciencia", hint: "Casi 300 mil" },
  { question: "¿Proceso fabricar alimento plantas?", options: ["Respiración", "Digestión", "Fotosíntesis", "Ósmosis"], correctIndex: 2, difficulty: 1, category: "ciencia", hint: "Luz solar" },
  { question: "¿JJOO Barcelona?", options: ["1988", "1990", "1992", "1994"], correctIndex: 2, difficulty: 2, category: "deportes", hint: "Amigo para siempre" },
  { question: "¿Catedral llamada Mezquita?", options: ["Sevilla", "Granada", "Córdoba", "Jaén"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Famosa por sus arcos rojos y blancos" },

{ question: "¿Cuántos días tiene un año bisiesto?", options: ["365", "366", "364", "367"], correctIndex: 1, difficulty: "easy", category: "cultura_general" },

{ question: "¿Qué planeta es conocido como el planeta rojo?", options: ["Venus", "Marte", "Júpiter", "Saturno"], correctIndex: 1, difficulty: "easy", category: "ciencia" },

{ question: "¿Cuál es el océano más grande del mundo?", options: ["Atlántico", "Índico", "Ártico", "Pacífico"], correctIndex: 3, difficulty: "easy", category: "geografia" },

{ question: "¿Qué gas respiramos principalmente?", options: ["Oxígeno", "Nitrógeno", "CO2", "Helio"], correctIndex: 1, difficulty: "medium", category: "ciencia" },

{ question: "¿Quién pintó la Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Miguel Ángel"], correctIndex: 2, difficulty: "easy", category: "arte" },

{ question: "¿Cuál es el hueso más largo del cuerpo humano?", options: ["Húmero", "Fémur", "Tibia", "Radio"], correctIndex: 1, difficulty: "medium", category: "salud" },

{ question: "¿Qué país tiene más población?", options: ["India", "EEUU", "China", "Indonesia"], correctIndex: 0, difficulty: "medium", category: "geografia" },

{ question: "¿Qué instrumento mide la temperatura?", options: ["Barómetro", "Termómetro", "Anemómetro", "Higrómetro"], correctIndex: 1, difficulty: "easy", category: "vida_cotidiana" },

{ question: "¿Cuántos continentes hay?", options: ["5", "6", "7", "8"], correctIndex: 2, difficulty: "easy", category: "geografia" },

{ question: "¿Qué vitamina obtenemos principalmente del sol?", options: ["Vitamina A", "Vitamina C", "Vitamina D", "Vitamina B12"], correctIndex: 2, difficulty: "medium", category: "salud" },

{ question: "¿Cuál es el idioma más hablado del mundo (nativos)?", options: ["Inglés", "Español", "Chino mandarín", "Hindi"], correctIndex: 2, difficulty: "medium", category: "cultura_general" },

{ question: "¿Qué órgano bombea la sangre?", options: ["Pulmón", "Cerebro", "Hígado", "Corazón"], correctIndex: 3, difficulty: "easy", category: "salud" },

{ question: "¿Cuál es el metal más abundante en la corteza terrestre?", options: ["Hierro", "Aluminio", "Oro", "Cobre"], correctIndex: 1, difficulty: "hard", category: "ciencia" },

{ question: "¿Qué país inventó el sushi moderno?", options: ["China", "Japón", "Corea", "Tailandia"], correctIndex: 1, difficulty: "easy", category: "curiosidades" },

{ question: "¿Qué número romano representa la X?", options: ["5", "10", "50", "100"], correctIndex: 1, difficulty: "easy", category: "cultura_general" },

{ question: "¿Cuántos corazones tiene un pulpo?", options: ["1", "2", "3", "4"], correctIndex: 2, difficulty: "hard", category: "curiosidades" },

{ question: "¿Cuál es la capital de Canadá?", options: ["Toronto", "Ottawa", "Vancouver", "Montreal"], correctIndex: 1, difficulty: "medium", category: "geografia" },

{ question: "¿Qué moneda se usa en Reino Unido?", options: ["Euro", "Libra esterlina", "Dólar", "Franco"], correctIndex: 1, difficulty: "easy", category: "cultura_general" },

{ question: "¿Qué animal es el más rápido en tierra?", options: ["León", "Guepardo", "Caballo", "Tigre"], correctIndex: 1, difficulty: "easy", category: "naturaleza" },

{ question: "¿Cuál es el elemento químico H?", options: ["Helio", "Hidrógeno", "Hafnio", "Hierro"], correctIndex: 1, difficulty: "medium", category: "ciencia" },

{ question: "¿Qué invento popularizó Johannes Gutenberg?", options: ["Telescopio", "Imprenta", "Radio", "Bombilla"], correctIndex: 1, difficulty: "medium", category: "historia" },

{ question: "¿Qué país tiene forma de bota?", options: ["España", "Italia", "Grecia", "Portugal"], correctIndex: 1, difficulty: "easy", category: "geografia" },

{ question: "¿Cuántos lados tiene un hexágono?", options: ["5", "6", "7", "8"], correctIndex: 1, difficulty: "easy", category: "cultura_general" },

{ question: "¿Qué órgano filtra la sangre?", options: ["Riñón", "Pulmón", "Corazón", "Estómago"], correctIndex: 0, difficulty: "medium", category: "salud" },

{ question: "¿Qué país es famoso por la Torre Eiffel?", options: ["Italia", "Francia", "España", "Bélgica"], correctIndex: 1, difficulty: "easy", category: "geografia" },

{ question: "¿Cuál es el único mamífero capaz de volar?", options: ["Ardilla voladora", "Murciélago", "Colugo", "Lémur"], correctIndex: 1, difficulty: "hard", category: "naturaleza" },

{ question: "¿Qué elemento químico tiene el símbolo Au?", options: ["Plata", "Oro", "Aluminio", "Argón"], correctIndex: 1, difficulty: "hard", category: "ciencia" },

{ question: "¿Cuántos huesos tiene un bebé al nacer (aprox.)?", options: ["206", "270", "300", "180"], correctIndex: 1, difficulty: "hard", category: "salud" },

{ question: "¿Qué país tiene más husos horarios?", options: ["Rusia", "EEUU", "Francia", "China"], correctIndex: 2, difficulty: "hard", category: "geografia" },

{ question: "¿Cuál es el desierto más grande del mundo?", options: ["Sahara", "Gobi", "Antártida", "Arabia"], correctIndex: 2, difficulty: "hard", category: "geografia" },

{ question: "¿Qué órgano humano puede regenerarse parcialmente?", options: ["Corazón", "Pulmón", "Hígado", "Riñón"], correctIndex: 2, difficulty: "hard", category: "salud" },

{ question: "¿Qué gas es más abundante en la atmósfera terrestre?", options: ["Oxígeno", "CO2", "Nitrógeno", "Argón"], correctIndex: 2, difficulty: "hard", category: "ciencia" },

{ question: "¿Qué metal es líquido a temperatura ambiente?", options: ["Mercurio", "Plomo", "Galio", "Bromo"], correctIndex: 0, difficulty: "hard", category: "ciencia" },

{ question: "¿Cuál es el animal más longevo conocido?", options: ["Tortuga gigante", "Ballena boreal", "Medusa inmortal", "Tiburón de Groenlandia"], correctIndex: 3, difficulty: "hard", category: "naturaleza" },

{ question: "¿Qué científico formuló la teoría de la relatividad?", options: ["Newton", "Einstein", "Tesla", "Bohr"], correctIndex: 1, difficulty: "hard", category: "historia" },

{ question: "¿Cuál es la capital más alta del mundo?", options: ["Quito", "La Paz", "Bogotá", "Katmandú"], correctIndex: 1, difficulty: "hard", category: "geografia" },

{ question: "¿Qué planeta tiene más lunas confirmadas (2025)?", options: ["Júpiter", "Saturno", "Urano", "Neptuno"], correctIndex: 1, difficulty: "hard", category: "ciencia" },

{ question: "¿Qué porcentaje aproximado del cuerpo humano es agua?", options: ["40%", "60%", "75%", "90%"], correctIndex: 1, difficulty: "hard", category: "salud" },

{ question: "¿Qué país inventó el papel?", options: ["Egipto", "China", "Grecia", "India"], correctIndex: 1, difficulty: "hard", category: "historia" },

{ question: "¿Cuál es el hueso más pequeño del cuerpo humano?", options: ["Estribo", "Yunque", "Martillo", "Falange"], correctIndex: 0, difficulty: "hard", category: "salud" },

{ question: "¿Qué fenómeno explica los colores del cielo al atardecer?", options: ["Reflexión", "Refracción", "Dispersión", "Difracción"], correctIndex: 2, difficulty: "hard", category: "ciencia" },

{ question: "¿Cuál es el país más pequeño del mundo?", options: ["Mónaco", "San Marino", "Vaticano", "Malta"], correctIndex: 2, difficulty: "hard", category: "geografia" },

{ question: "¿Qué órgano consume más energía en reposo?", options: ["Corazón", "Cerebro", "Hígado", "Riñón"], correctIndex: 1, difficulty: "hard", category: "salud" },

{ question: "¿Cuál es la velocidad de la luz?", options: ["300.000 km/s", "150.000 km/s", "1.000.000 km/s", "30.000 km/s"], correctIndex: 0, difficulty: "hard", category: "ciencia" },

{ question: "¿Qué invento permitió la revolución digital moderna?", options: ["Bombilla", "Transistor", "Motor eléctrico", "Telégrafo"], correctIndex: 1, difficulty: "hard", category: "tecnologia" },

{ question: "¿Qué país tiene la mayor biodiversidad?", options: ["Brasil", "Australia", "Colombia", "Indonesia"], correctIndex: 2, difficulty: "hard", category: "naturaleza" },

{ question: "¿Qué parte del cerebro regula el equilibrio?", options: ["Hipotálamo", "Cerebelo", "Amígdala", "Tálamo"], correctIndex: 1, difficulty: "hard", category: "salud" },

{ question: "¿Qué unidad mide la resistencia eléctrica?", options: ["Voltio", "Amperio", "Ohmio", "Watio"], correctIndex: 2, difficulty: "hard", category: "ciencia" },

{ question: "¿Qué país tiene la muralla más famosa?", options: ["India", "China", "Japón", "Corea"], correctIndex: 1, difficulty: "hard", category: "historia" },

{ question: "¿Qué proteína transporta oxígeno en sangre?", options: ["Colágeno", "Hemoglobina", "Insulina", "Mioglobina"], correctIndex: 1, difficulty: "hard", category: "salud" },
{ question: "¿Qué parte del cuerpo humano produce insulina?", options: ["Hígado", "Páncreas", "Riñón", "Bazo"], correctIndex: 1, difficulty: "hard", category: "salud" },

{ question: "¿Cuál es el metal más denso comúnmente conocido?", options: ["Oro", "Hierro", "Osmio", "Plomo"], correctIndex: 2, difficulty: "hard", category: "ciencia" },

{ question: "¿Qué planeta tiene el día más largo?", options: ["Venus", "Marte", "Mercurio", "Saturno"], correctIndex: 0, difficulty: "hard", category: "ciencia" },

{ question: "¿Qué filósofo dijo 'Solo sé que no sé nada'?", options: ["Platón", "Aristóteles", "Sócrates", "Descartes"], correctIndex: 2, difficulty: "hard", category: "historia" },

{ question: "¿Cuál es el órgano más grande del cuerpo humano?", options: ["Hígado", "Pulmón", "Piel", "Cerebro"], correctIndex: 2, difficulty: "hard", category: "salud" },

{ question: "¿Qué país consume más café per cápita?", options: ["Brasil", "Finlandia", "Colombia", "Italia"], correctIndex: 1, difficulty: "hard", category: "curiosidades" },

{ question: "¿Qué fenómeno físico permite que los aviones vuelen?", options: ["Ley de Ohm", "Principio de Bernoulli", "Efecto Doppler", "Gravedad inversa"], correctIndex: 1, difficulty: "hard", category: "ciencia" },

{ question: "¿Qué vitamina es esencial para la coagulación?", options: ["Vitamina D", "Vitamina C", "Vitamina K", "Vitamina B"], correctIndex: 2, difficulty: "hard", category: "salud" },

{ question: "¿Cuál es el país más grande del mundo?", options: ["China", "Canadá", "EEUU", "Rusia"], correctIndex: 3, difficulty: "hard", category: "geografia" },

{ question: "¿Qué órgano humano no recibe sangre directamente?", options: ["Córnea", "Cartílago", "Cabello", "Todos"], correctIndex: 3, difficulty: "hard", category: "salud" },

{ question: "¿Qué científico descubrió la penicilina?", options: ["Pasteur", "Fleming", "Curie", "Newton"], correctIndex: 1, difficulty: "hard", category: "historia" },

{ question: "¿Cuál es el punto más profundo del océano?", options: ["Fosa de Java", "Fosa de las Marianas", "Fosa de Tonga", "Fosa del Atlántico"], correctIndex: 1, difficulty: "hard", category: "geografia" },

{ question: "¿Qué país tiene más islas?", options: ["Indonesia", "Filipinas", "Suecia", "Japón"], correctIndex: 2, difficulty: "hard", category: "geografia" },

{ question: "¿Qué parte del cerebro regula la respiración?", options: ["Cerebelo", "Bulbo raquídeo", "Hipotálamo", "Tálamo"], correctIndex: 1, difficulty: "hard", category: "salud" },

{ question: "¿Qué animal tiene la mordida más potente?", options: ["León", "Cocodrilo", "Tiburón blanco", "Hipopótamo"], correctIndex: 1, difficulty: "hard", category: "naturaleza" },

{ question: "¿Cuál es la fórmula química del ozono?", options: ["O2", "O3", "CO2", "H2O"], correctIndex: 1, difficulty: "hard", category: "ciencia" },

{ question: "¿Qué país inventó el sistema decimal?", options: ["Egipto", "India", "Grecia", "China"], correctIndex: 1, difficulty: "hard", category: "historia" },

{ question: "¿Cuál es el único continente sin desiertos cálidos?", options: ["Europa", "América", "Oceanía", "Antártida"], correctIndex: 0, difficulty: "hard", category: "geografia" },

{ question: "¿Qué tipo de sangre es donante universal?", options: ["A+", "O-", "AB+", "B-"], correctIndex: 1, difficulty: "hard", category: "salud" },

{ question: "¿Qué animal duerme menos al día?", options: ["Jirafa", "Elefante", "Caballo", "Delfín"], correctIndex: 0, difficulty: "hard", category: "curiosidades" },

{ question: "¿Cuál es el país con más volcanes activos?", options: ["Japón", "Indonesia", "Chile", "Islandia"], correctIndex: 1, difficulty: "hard", category: "geografia" },

{ question: "¿Qué órgano humano puede seguir funcionando sin cerebro?", options: ["Pulmón", "Corazón", "Riñón", "Hígado"], correctIndex: 1, difficulty: "hard", category: "salud" },

{ question: "¿Qué científico formuló las leyes del movimiento?", options: ["Einstein", "Newton", "Galileo", "Tesla"], correctIndex: 1, difficulty: "hard", category: "ciencia" },

{ question: "¿Qué país tiene más premios Nobel?", options: ["Alemania", "Reino Unido", "EEUU", "Francia"], correctIndex: 2, difficulty: "hard", category: "historia" },

{ question: "¿Qué parte del ojo controla la entrada de luz?", options: ["Retina", "Iris", "Córnea", "Cristalino"], correctIndex: 1, difficulty: "hard", category: "salud" },
{ question: "¿Qué elemento es imprescindible para la fusión nuclear en estrellas?", options: ["Oxígeno", "Helio", "Hidrógeno", "Carbono"], correctIndex: 2, difficulty: "extreme", category: "ciencia" },

{ question: "¿Cuántos cromosomas tiene un ser humano?", options: ["44", "46", "48", "23"], correctIndex: 1, difficulty: "extreme", category: "salud" },

{ question: "¿Qué país tiene más pirámides que Egipto?", options: ["Sudán", "México", "Perú", "Irak"], correctIndex: 0, difficulty: "extreme", category: "geografia" },

{ question: "¿Qué órgano humano puede generar nuevas neuronas?", options: ["Cerebelo", "Hipocampo", "Corteza", "Bulbo"], correctIndex: 1, difficulty: "extreme", category: "salud" },

{ question: "¿Cuál es el único número primo par?", options: ["0", "1", "2", "4"], correctIndex: 2, difficulty: "extreme", category: "logica" },

{ question: "¿Qué planeta rota 'al revés'?", options: ["Marte", "Venus", "Júpiter", "Saturno"], correctIndex: 1, difficulty: "extreme", category: "ciencia" },

{ question: "¿Qué metal puede derretirse en la mano?", options: ["Mercurio", "Galio", "Cesio", "Estaño"], correctIndex: 1, difficulty: "extreme", category: "ciencia" },

{ question: "¿Qué animal tiene ADN más parecido al humano?", options: ["Cerdo", "Chimpancé", "Delfín", "Ratón"], correctIndex: 1, difficulty: "extreme", category: "naturaleza" },

{ question: "¿Qué magnitud mide los decibelios?", options: ["Frecuencia", "Intensidad sonora", "Voltaje", "Energía"], correctIndex: 1, difficulty: "extreme", category: "ciencia" },

{ question: "¿Qué país tiene más lagos?", options: ["Canadá", "Rusia", "Finlandia", "Suecia"], correctIndex: 0, difficulty: "extreme", category: "geografia" },

{ question: "¿Qué vitamina sintetiza la piel?", options: ["Vitamina A", "Vitamina D", "Vitamina C", "Vitamina K"], correctIndex: 1, difficulty: "extreme", category: "salud" },

{ question: "¿Qué órgano humano no puede sentir dolor?", options: ["Cerebro", "Corazón", "Hígado", "Pulmón"], correctIndex: 0, difficulty: "extreme", category: "salud" },

{ question: "¿Cuál es la montaña más alta desde su base real?", options: ["Everest", "K2", "Mauna Kea", "Aconcagua"], correctIndex: 2, difficulty: "extreme", category: "geografia" },

{ question: "¿Qué gas hace que la voz suene aguda?", options: ["Oxígeno", "Helio", "Nitrógeno", "CO2"], correctIndex: 1, difficulty: "extreme", category: "curiosidades" },

{ question: "¿Qué partícula tiene carga negativa?", options: ["Protón", "Neutrón", "Electrón", "Fotón"], correctIndex: 2, difficulty: "extreme", category: "ciencia" },

{ question: "¿Qué fenómeno explica el GPS?", options: ["Relatividad", "Gravedad", "Electromagnetismo", "Inercia"], correctIndex: 0, difficulty: "extreme", category: "ciencia" },

{ question: "¿Qué país no tiene ríos permanentes?", options: ["Qatar", "Islandia", "Portugal", "Chile"], correctIndex: 0, difficulty: "extreme", category: "geografia" },

{ question: "¿Qué órgano humano pesa más?", options: ["Cerebro", "Hígado", "Pulmón", "Corazón"], correctIndex: 1, difficulty: "extreme", category: "salud" },

{ question: "¿Qué animal puede sobrevivir en el espacio?", options: ["Cucaracha", "Tardígrado", "Hormiga", "Escarabajo"], correctIndex: 1, difficulty: "extreme", category: "naturaleza" },

{ question: "¿Cuál es el idioma con más palabras?", options: ["Español", "Chino", "Inglés", "Árabe"], correctIndex: 2, difficulty: "extreme", category: "cultura_general" },
{ question: "¿Qué órgano humano produce bilis?", options: ["Riñón", "Estómago", "Hígado", "Páncreas"], correctIndex: 2, difficulty: "hard", category: "salud" },

{ question: "¿Cuál es el país más poblado de África?", options: ["Egipto", "Nigeria", "Sudáfrica", "Etiopía"], correctIndex: 1, difficulty: "hard", category: "geografia" },

{ question: "¿Qué vitamina ayuda al sistema inmune?", options: ["Vitamina C", "Vitamina D", "Vitamina K", "Vitamina B12"], correctIndex: 0, difficulty: "hard", category: "salud" },

{ question: "¿Qué científico propuso la gravedad?", options: ["Einstein", "Newton", "Galileo", "Kepler"], correctIndex: 1, difficulty: "hard", category: "ciencia" },

{ question: "¿Cuál es el hueso más fuerte?", options: ["Fémur", "Mandíbula", "Tibia", "Húmero"], correctIndex: 0, difficulty: "hard", category: "salud" },

{ question: "¿Qué país tiene más volcanes?", options: ["Japón", "Indonesia", "Chile", "Islandia"], correctIndex: 1, difficulty: "hard", category: "geografia" },

{ question: "¿Qué órgano regula hormonas?", options: ["Hipotálamo", "Tiroides", "Hipófisis", "Todos"], correctIndex: 3, difficulty: "hard", category: "salud" },

{ question: "¿Qué planeta tiene más gravedad?", options: ["Tierra", "Saturno", "Júpiter", "Neptuno"], correctIndex: 2, difficulty: "hard", category: "ciencia" },

{ question: "¿Cuál es el metal más abundante en la Tierra?", options: ["Hierro", "Aluminio", "Cobre", "Níquel"], correctIndex: 0, difficulty: "hard", category: "ciencia" },

{ question: "¿Qué órgano filtra toxinas?", options: ["Pulmón", "Riñón", "Hígado", "Piel"], correctIndex: 2, difficulty: "hard", category: "salud" },

// --- POLÍTICA Y SISTEMAS ---

  { question: "¿Qué es una tecnocracia?", options: ["Gobierno de los más ricos", "Gobierno de los técnicos y expertos", "Gobierno de los militares", "Gobierno de los ancianos"], correctIndex: 1, difficulty: 4, category: "politica", hint: "Viene de 'techne' (habilidad/oficio)" },
  { question: "¿Cuál es el parlamento más antiguo del mundo aún en funcionamiento?", options: ["Congreso de EE.UU.", "Althing de Islandia", "Parlamento Británico", "Cortes de Castilla"], correctIndex: 1, difficulty: 5, category: "historia", hint: "Se fundó en el año 930" },
  { question: "¿Qué significa el término 'Gerrymandering'?", options: ["Un tipo de votación electrónica", "Manipulación de límites de distritos electorales", "Un acuerdo de paz internacional", "La destitución de un presidente"], correctIndex: 1, difficulty: 5, category: "politica", hint: "Tiene nombre de salamandra" },
  { question: "¿Cuál es la sede principal del Tribunal Internacional de Justicia?", options: ["Ginebra", "Nueva York", "La Haya", "Bruselas"], correctIndex: 2, difficulty: 3, category: "politica", hint: "Está en los Países Bajos" },
  { question: "¿Qué país tiene una monarquía absoluta en la actualidad?", options: ["España", "Japón", "Arabia Saudita", "Marruecos"], correctIndex: 2, difficulty: 2, category: "politica", hint: "El Rey tiene poder total" },
  { question: "¿En qué consiste un sistema político federal?", options: ["El poder está centralizado en la capital", "Los estados tienen autonomía y leyes propias", "Solo hay un partido político", "El ejército gobierna el país"], correctIndex: 1, difficulty: 3, category: "politica", hint: "Como en EE.UU., México o Alemania" },
  { question: "¿Qué órgano de la ONU tiene 5 miembros permanentes con derecho a veto?", options: ["Asamblea General", "Consejo de Seguridad", "UNESCO", "Corte Penal Internacional"], correctIndex: 1, difficulty: 3, category: "politica", hint: "Se encarga de la paz mundial" },
  { question: "¿Qué es el sufragio universal?", options: ["Derecho a voto solo de hombres", "Derecho a voto de todos los ciudadanos adultos", "Derecho a voto solo de propietarios", "Derecho a voto por correo"], correctIndex: 1, difficulty: 2, category: "politica", hint: "Nadie es excluido por clase o género" },
  { question: "¿Qué país no tiene una Constitución escrita en un solo documento?", options: ["Francia", "Reino Unido", "Alemania", "Italia"], correctIndex: 1, difficulty: 4, category: "politica", hint: "Se basa en leyes dispersas y tradiciones" },
  { question: "¿Qué ideología defiende la mínima intervención del Estado en la economía?", options: ["Socialismo", "Comunismo", "Liberalismo", "Fascismo"], correctIndex: 2, difficulty: 2, category: "politica", hint: "Libre mercado" },
  { question: "¿Qué es un 'Bicameralismo'?", options: ["Un gobierno con dos presidentes", "Un parlamento dividido en dos cámaras", "Un país con dos capitales", "Una alianza entre dos partidos"], correctIndex: 1, difficulty: 3, category: "politica", hint: "Congreso y Senado" },
  { question: "¿Dónde nació el concepto moderno de 'Derecha' e 'Izquierda' política?", options: ["Revolución Rusa", "Revolución Francesa", "Guerra Civil Americana", "Independencia de México"], correctIndex: 1, difficulty: 4, category: "historia", hint: "Por la posición en la Asamblea de 1789" },
  { question: "¿Qué es una moción de censura?", options: ["Un castigo a un periodista", "Propuesta parlamentaria para derribar al gobierno", "Un veto a una ley de presupuestos", "Una ley que prohíbe hablar de política"], correctIndex: 1, difficulty: 3, category: "politica", hint: "Retirada de confianza al presidente" },
  { question: "¿Qué país abandonó la Unión Europea en el proceso conocido como Brexit?", options: ["Noruega", "Reino Unido", "Suiza", "Grecia"], correctIndex: 1, difficulty: 1, category: "politica", hint: "Ocurrió tras el referéndum de 2016" },
  { question: "¿Qué es el nepotismo?", options: ["Gobierno de los más inteligentes", "Trato de favor a familiares para cargos públicos", "Sistema basado en la fuerza militar", "Elecciones sin oposición"], correctIndex: 1, difficulty: 3, category: "politica", hint: "Favoritismo familiar" },
  { question: "¿Quién es el actual Secretario General de la ONU (a 2024)?", options: ["Ban Ki-moon", "Kofi Annan", "António Guterres", "Javier Pérez de Cuéllar"], correctIndex: 2, difficulty: 3, category: "politica", hint: "Es de origen portugués" },
  { question: "¿Qué es el 'Estado de Bienestar'?", options: ["Un país sin impuestos", "Modelo donde el Estado provee servicios básicos", "Un país gobernado por psicólogos", "Un sistema de jubilación privada"], correctIndex: 1, difficulty: 2, category: "politica", hint: "Salud y educación pública" },
  { question: "¿En qué país se inventó la democracia?", options: ["Italia", "Grecia", "Egipto", "China"], correctIndex: 1, difficulty: 1, category: "historia", hint: "Atenas clásica" },
  { question: "¿Qué significa 'Amnistía'?", options: ["Reducción de una pena", "Perdón legal de delitos políticos", "Expulsión del país", "Derecho a voto"], correctIndex: 1, difficulty: 4, category: "politica", hint: "Olvido de la infracción" },
  { question: "¿Qué país tiene un sistema político de un solo partido oficial?", options: ["Estados Unidos", "China", "India", "Brasil"], correctIndex: 1, difficulty: 2, category: "politica", hint: "Partido Comunista" },
  { question: "¿Qué es la 'Coalición'?", options: ["Un tipo de impuesto", "Alianza de partidos para gobernar", "La disolución del parlamento", "Un golpe de estado"], correctIndex: 1, difficulty: 2, category: "politica", hint: "Unión para sumar votos" },
  { question: "¿Qué es la plutocracia?", options: ["Gobierno de los militares", "Gobierno de los ricos", "Gobierno de los filósofos", "Gobierno del pueblo"], correctIndex: 1, difficulty: 4, category: "politica", hint: "Pluto = riqueza" },
  { question: "¿Qué ciudad es la capital administrativa de la Unión Europea?", options: ["París", "Berlín", "Bruselas", "Madrid"], correctIndex: 2, difficulty: 2, category: "geografia", hint: "Está en Bélgica" },
  { question: "¿Qué significa el término 'Demagogia'?", options: ["Estudio de la población", "Estrategia para ganar favores mediante halagos", "Sistema de elección por sorteo", "Ciencia del gobierno"], correctIndex: 1, difficulty: 4, category: "politica", hint: "Promesas vacías para convencer" },
  { question: "¿Qué es la 'cláusula de barrera' en elecciones?", options: ["Muro en la frontera", "Porcentaje mínimo de votos para entrar al parlamento", "Límite de edad para votar", "Prohibición de votar a extranjeros"], correctIndex: 1, difficulty: 5, category: "politica", hint: "Suele ser del 3% o 5%" },
  { question: "¿Qué país utiliza el sistema de 'Cantones'?", options: ["España", "Francia", "Suiza", "Canadá"], correctIndex: 2, difficulty: 4, category: "geografia", hint: "País alpino muy descentralizado" },
  { question: "¿Qué es la 'Soberanía Nacional'?", options: ["Poder que reside en el Rey", "Poder que reside en los ciudadanos", "Independencia de otros países", "Control de las aduanas"], correctIndex: 1, difficulty: 3, category: "politica", hint: "El pueblo es el dueño del poder" },
  { question: "¿Cuál es el principal objetivo de la OTAN?", options: ["Comercio libre", "Defensa colectiva militar", "Ayuda humanitaria", "Intercambio cultural"], correctIndex: 1, difficulty: 2, category: "politica", hint: "Alianza Atlántica" },
  { question: "¿Qué es el totalitarismo?", options: ["Democracia directa", "Control absoluto del Estado en toda la vida", "Gobierno de una coalición total", "Sistema de impuestos equitativos"], correctIndex: 1, difficulty: 3, category: "politica", hint: "Sin libertad individual" },
  { question: "¿Qué es un 'Lobby'?", options: ["Un tipo de votación secreta", "Grupo de presión para influir en leyes", "La entrada del parlamento", "Un partido de extrema izquierda"], correctIndex: 1, difficulty: 4, category: "politica", hint: "Grupos de interés" },
  { question: "¿Qué significa 'Estatizar'?", options: ["Crear una estatua de un líder", "Pasar una empresa privada al control del Estado", "Dividir un país en estados", "Declarar la guerra"], correctIndex: 1, difficulty: 3, category: "politica", hint: "Nacionalizar" },
  { question: "¿Qué país es conocido por su 'Neutralidad' histórica?", options: ["Estados Unidos", "Rusia", "Suiza", "Reino Unido"], correctIndex: 2, difficulty: 2, category: "politica", hint: "No se alía en guerras" },
  { question: "¿Qué es el 'Referéndum'?", options: ["Elección de diputados", "Votación directa del pueblo sobre una ley", "Informe del presidente", "Cierre del congreso"], correctIndex: 1, difficulty: 2, category: "politica", hint: "Consulta popular" },
  { question: "¿Quién ostenta el poder judicial?", options: ["El Gobierno", "El Parlamento", "Los Jueces y Tribunales", "La Policía"], correctIndex: 2, difficulty: 1, category: "politica", hint: "Castigan el incumplimiento de la ley" },
  { question: "¿Qué es la 'Oligarquía'?", options: ["Gobierno del pueblo", "Gobierno de unos pocos", "Gobierno de los militares", "Falta de gobierno"], correctIndex: 1, difficulty: 3, category: "politica", hint: "Poder concentrado en una élite" },
  { question: "¿Qué es el 'Populismo'?", options: ["Ciencia de las poblaciones", "Tendencia a atraer a las masas con promesas simples", "Vivir en el campo", "Estudio de las fiestas populares"], correctIndex: 1, difficulty: 3, category: "politica", hint: "Retórica 'pueblo contra élite'" },
  { question: "¿Qué es una 'Constitución'?", options: ["Un libro de historia", "La ley fundamental de un Estado", "Un contrato de trabajo", "Un decreto del presidente"], correctIndex: 1, difficulty: 1, category: "politica", hint: "La norma suprema" },
  { question: "¿Qué es la 'Inmunidad Parlamentaria'?", options: ["Salud gratuita para políticos", "Protección de diputados ante procesos judiciales", "Poder votar dos veces", "Derecho a no pagar impuestos"], correctIndex: 1, difficulty: 4, category: "politica", hint: "Evita detenciones por motivos políticos" },
  { question: "¿Qué es el 'Apartheid'?", options: ["Un sistema de riego", "Sistema de segregación racial en Sudáfrica", "Un tipo de moneda", "Un partido político alemán"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Terminó gracias a Nelson Mandela" },
  { question: "¿Cuál es la función del Banco Mundial?", options: ["Fabricar billetes para todos", "Financiar proyectos de desarrollo", "Guardar el oro de los países", "Regular las bolsas de valores"], correctIndex: 1, difficulty: 3, category: "politica", hint: "Reducción de la pobreza" },
  { question: "¿Qué es el 'Asilo Político'?", options: ["Un hospital para políticos", "Protección de un Estado a un extranjero perseguido", "Un retiro para presidentes", "La cárcel para corruptos"], correctIndex: 1, difficulty: 2, category: "politica", hint: "Refugio internacional" },
  { question: "¿Qué es la 'Socialdemocracia'?", options: ["Comunismo extremo", "Sistema capitalista con fuerte protección social", "Dictadura del pueblo", "Gobierno de las redes sociales"], correctIndex: 1, difficulty: 3, category: "politica", hint: "Muy común en Europa del Norte" },
  { question: "¿Qué país tiene un 'Emperador' como figura simbólica hoy?", options: ["China", "Japón", "Tailandia", "Corea"], correctIndex: 1, difficulty: 2, category: "politica", hint: "El Trono del Crisantemo" },
];

// --- GEOGRAFÍA ---
export const geographyQuestions: CultureQuestion[] = [
  { question: "¿Qué país tiene más islas en el mundo?", options: ["Indonesia", "Filipinas", "Suecia", "Noruega"], correctIndex: 2, difficulty: 5, category: "geografia", hint: "Tiene más de 200,000 islas" },
  { question: "¿Cuál es el país más grande de África?", options: ["Egipto", "Nigeria", "Argelia", "Sudán"], correctIndex: 2, difficulty: 3, category: "geografia", hint: "Tras la división de Sudán" },
  { question: "¿Qué estrecho separa Rusia de Estados Unidos?", options: ["Estrecho de Bering", "Estrecho de Gibraltar", "Estrecho de Magallanes", "Canal de la Mancha"], correctIndex: 0, difficulty: 3, category: "geografia", hint: "Paso entre Asia y América" },
  { question: "¿Cuál es la capital de Kazajistán?", options: ["Almaty", "Astaná", "Taskent", "Biskek"], correctIndex: 1, difficulty: 4, category: "geografia", hint: "Se llamó Nur-Sultán un tiempo" },
  { question: "¿En qué país se encuentra el Salto Ángel?", options: ["Brasil", "Colombia", "Venezuela", "Ecuador"], correctIndex: 2, difficulty: 2, category: "geografia", hint: "Norte de Sudamérica" },
  { question: "¿Qué mar baña las costas de Jordania e Israel?", options: ["Mar Rojo", "Mar Muerto", "Mar Negro", "Mar Caspio"], correctIndex: 1, difficulty: 2, category: "geografia", hint: "Es extremadamente salado" },
  { question: "¿Cuál es el país más joven del mundo?", options: ["Timor Oriental", "Sudán del Sur", "Montenegro", "Kosovo"], correctIndex: 1, difficulty: 4, category: "geografia", hint: "Se independizó en 2011" },
  { question: "¿Qué cordillera separa Europa de Asia?", options: ["Alpes", "Himalaya", "Montes Urales", "Cáucaso"], correctIndex: 2, difficulty: 3, category: "geografia", hint: "Está en Rusia" },
  { question: "¿Cuál es la capital de Vietnam?", options: ["Ciudad Ho Chi Minh", "Hanoi", "Da Nang", "Hue"], correctIndex: 1, difficulty: 3, category: "geografia", hint: "En el norte del país" },
  { question: "¿Qué país tiene más costas en el mundo?", options: ["Australia", "Canadá", "Rusia", "Chile"], correctIndex: 1, difficulty: 4, category: "geografia", hint: "País norteamericano" },
  { question: "¿Cuál es el punto más bajo de la superficie terrestre?", options: ["Valle de la Muerte", "Fosa de las Marianas", "Mar Muerto", "Lago Baikal"], correctIndex: 2, difficulty: 4, category: "geografia", hint: "A orillas de un lago salado" },
  { question: "¿Qué río pasa por más países?", options: ["Amazonas", "Nilo", "Danubio", "Mekong"], correctIndex: 2, difficulty: 5, category: "geografia", hint: "Atraviesa 10 países europeos" },
  { question: "¿Qué país es conocido como 'La bota' por su forma?", options: ["Grecia", "Italia", "Vietnam", "Chile"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "En el Mediterráneo" },
  { question: "¿En qué país se encuentra el monte Kilimanjaro?", options: ["Kenia", "Tanzania", "Etiopía", "Uganda"], correctIndex: 1, difficulty: 3, category: "geografia", hint: "Cerca del ecuador africano" },
  { question: "¿Cuál es la capital de Nueva Zelanda?", options: ["Auckland", "Wellington", "Christchurch", "Queenstown"], correctIndex: 1, difficulty: 3, category: "geografia", hint: "No es la ciudad más grande" },
  { question: "¿Qué canal une el Océano Atlántico con el Pacífico?", options: ["Canal de Suez", "Canal de Panamá", "Canal de Corinto", "Canal de Kiel"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "Atraviesa Centroamérica" },
  { question: "¿Cuál es el país más densamente poblado del mundo?", options: ["China", "India", "Mónaco", "Singapur"], correctIndex: 2, difficulty: 4, category: "geografia", hint: "Es una ciudad-estado europea" },
  { question: "¿Qué país tiene tres capitales?", options: ["Nigeria", "Sudáfrica", "Bolivia", "Malasia"], correctIndex: 1, difficulty: 3, category: "geografia", hint: "Pretoria, Ciudad del Cabo y Bloemfontein" },
  { question: "¿Cuál es el lago más profundo del mundo?", options: ["Lago Superior", "Lago Titicaca", "Lago Baikal", "Mar Caspio"], correctIndex: 2, difficulty: 4, category: "geografia", hint: "Está en Siberia" },
  { question: "¿Qué país se encuentra entre España y Francia?", options: ["Mónaco", "Luxemburgo", "Andorra", "Liechtenstein"], correctIndex: 2, difficulty: 2, category: "geografia", hint: "En los Pirineos" },
  { question: "¿Qué río atraviesa París?", options: ["Támesis", "Rin", "Sena", "Ródano"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Sus muelles son patrimonio mundial" },
  { question: "¿Cuál es el país más grande de Sudamérica?", options: ["Argentina", "Brasil", "Perú", "Colombia"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "Hablan portugués" },
  { question: "¿Cuál es la capital de Noruega?", options: ["Copenhague", "Estocolmo", "Oslo", "Helsinki"], correctIndex: 2, difficulty: 2, category: "geografia", hint: "Donde se entrega el Nobel de la Paz" },
  { question: "¿Cuál es la montaña más alta de América?", options: ["Denali", "Aconcagua", "Chimborazo", "Pico Bolívar"], correctIndex: 1, difficulty: 3, category: "geografia", hint: "Está en los Andes argentinos" },
  { question: "¿Cuál es la capital de Corea del Sur?", options: ["Pionyang", "Tokio", "Seúl", "Pekín"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Sede de Samsung" },
  { question: "¿Cuál es el estado más grande de EE.UU.?", options: ["Texas", "California", "Alaska", "Montana"], correctIndex: 2, difficulty: 2, category: "geografia", hint: "Está en el noroeste" },
  { question: "¿Qué ciudad es conocida como 'La Gran Manzana'?", options: ["Londres", "Nueva York", "Los Ángeles", "Chicago"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "Sede de Wall Street" },
  { question: "¿Qué estrecho separa España de Marruecos?", options: ["Bósforo", "Gibraltar", "Ormuz", "Dardanelos"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "Columnas de Hércules" },
  { question: "¿Cuál es la capital de Escocia?", options: ["Glasgow", "Edimburgo", "Aberdeen", "Dundee"], correctIndex: 1, difficulty: 3, category: "geografia", hint: "Famosa por su castillo y festival" },
  { question: "¿Qué país tiene la mayor reserva de petróleo?", options: ["Arabia Saudita", "Rusia", "Venezuela", "EE.UU."], correctIndex: 2, difficulty: 5, category: "geografia", hint: "País sudamericano" },
  { question: "¿Cuál es la capital de Tailandia?", options: ["Phuket", "Bangkok", "Chiang Mai", "Pattaya"], correctIndex: 1, difficulty: 2, category: "geografia", hint: "Ciudad de los ángeles" },
  { question: "¿En qué país están las ruinas de Machu Picchu?", options: ["Bolivia", "Perú", "Chile", "Colombia"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "Imperio Inca" },
  { question: "¿Cuál es el río más caudaloso del mundo?", options: ["Nilo", "Misisipi", "Amazonas", "Yangtsé"], correctIndex: 2, difficulty: 2, category: "geografia", hint: "Lleva más agua que los siguientes 7 juntos" },
  { question: "¿Cuál es la capital de Ucrania?", options: ["Moscú", "Kiev", "Varsovia", "Minsk"], correctIndex: 1, difficulty: 2, category: "geografia", hint: "A orillas del río Dniéper" },
  { question: "¿Qué país se conoce como la 'Tierra del Sol Naciente'?", options: ["China", "Corea", "Japón", "Taiwán"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Nippon" },
  { question: "¿Cuál es la capital de Argentina?", options: ["Rosario", "Córdoba", "Buenos Aires", "Mendoza"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Ciudad autónoma" },
  { question: "¿Qué país tiene el mayor número de volcanes activos?", options: ["Islandia", "Indonesia", "Japón", "Chile"], correctIndex: 1, difficulty: 4, category: "geografia", hint: "En el Cinturón de Fuego del Pacífico" },
  { question: "¿Cuál es la capital de Irán?", options: ["Bagdad", "Teherán", "Damasco", "Riad"], correctIndex: 1, difficulty: 3, category: "geografia", hint: "Antigua Persia" },
  { question: "¿Qué mar separa Europa de África?", options: ["Caspio", "Mediterráneo", "Báltico", "Adriático"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "Mare Nostrum" },
  { question: "¿Cuál es la capital de Polonia?", options: ["Cracovia", "Varsovia", "Gdansk", "Poznan"], correctIndex: 1, difficulty: 3, category: "geografia", hint: "Reconstruida tras la II Guerra Mundial" },
];

// --- HISTORIA ---
export const historyQuestions: CultureQuestion[] = [
  { question: "¿Quién fue el primer emperador de la China unificada?", options: ["Kublai Khan", "Qin Shi Huang", "Confucio", "Mao Zedong"], correctIndex: 1, difficulty: 4, category: "historia", hint: "El de los guerreros de terracota" },
  { question: "¿En qué año comenzó la Revolución Francesa?", options: ["1776", "1789", "1804", "1812"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Toma de la Bastilla" },
  { question: "¿Qué civilización construyó Chichén Itzá?", options: ["Azteca", "Inca", "Maya", "Olmeca"], correctIndex: 2, difficulty: 2, category: "historia", hint: "En la península de Yucatán" },
  { question: "¿Quién fue la 'Reina Virgen' de Inglaterra?", options: ["Victoria", "Isabel I", "María Estuardo", "Ana Bolena"], correctIndex: 1, difficulty: 3, category: "historia", hint: "Hija de Enrique VIII" },
  { question: "¿Qué ciudad fue dividida por un muro hasta 1989?", options: ["Viena", "Berlín", "Praga", "Budapest"], correctIndex: 1, difficulty: 1, category: "historia", hint: "Capital alemana" },
  { question: "¿Quién escribió el 'Diario' sobre la persecución nazi?", options: ["Marie Curie", "Ana Frank", "Rosa Luxemburgo", "Virginia Woolf"], correctIndex: 1, difficulty: 1, category: "historia", hint: "Murió en un campo de concentración" },
  { question: "¿En qué país nació Adolf Hitler?", options: ["Alemania", "Austria", "Hungría", "Suiza"], correctIndex: 1, difficulty: 2, category: "historia", hint: "No fue en el país que gobernó" },
  { question: "¿Cuál fue la primera civilización en usar escritura cuneiforme?", options: ["Egipcios", "Sumerios", "Fenicios", "Griegos"], correctIndex: 1, difficulty: 4, category: "historia", hint: "En Mesopotamia" },
  { question: "¿Quién lideró la independencia de gran parte de Sudamérica?", options: ["José de San Martín", "Simón Bolívar", "Bernardo O'Higgins", "Miguel Hidalgo"], correctIndex: 1, difficulty: 2, category: "historia", hint: "El Libertador" },
  { question: "¿Qué barco llevó a los peregrinos a América en 1620?", options: ["Santa María", "Mayflower", "Beagle", "Endeavour"], correctIndex: 1, difficulty: 3, category: "historia", hint: "Flor de Mayo" },
  { question: "¿En qué año se disolvió la URSS?", options: ["1989", "1991", "1993", "1995"], correctIndex: 1, difficulty: 3, category: "historia", hint: "Tras la dimisión de Gorbachov" },
  { question: "¿Quién fue el primer presidente de Sudáfrica democrática?", options: ["Desmond Tutu", "Nelson Mandela", "F.W. de Klerk", "Thabo Mbeki"], correctIndex: 1, difficulty: 1, category: "historia", hint: "Pasó 27 años en prisión" },
  { question: "¿Qué imperio gobernaba Solimán el Magnífico?", options: ["Persa", "Otomano", "Mogol", "Romano"], correctIndex: 1, difficulty: 4, category: "historia", hint: "Con sede en Constantinopla" },
  { question: "¿Qué país fue el primero en dar voto a las mujeres?", options: ["EE.UU.", "Reino Unido", "Nueva Zelanda", "Finlandia"], correctIndex: 2, difficulty: 5, category: "historia", hint: "En el año 1893" },
  { question: "¿Cómo se llamaba la ruta comercial China-Europa?", options: ["Ruta de las Especias", "Ruta de la Seda", "Ruta del Oro", "Ruta Transahariana"], correctIndex: 1, difficulty: 1, category: "historia", hint: "Marco Polo la recorrió" },
  { question: "¿Quién lideró el movimiento de independencia de la India?", options: ["Nehru", "Mahatma Gandhi", "Indira Gandhi", "Subhas Chandra Bose"], correctIndex: 1, difficulty: 1, category: "historia", hint: "Defensor de la no violencia" },
  { question: "¿Qué conflicto enfrentó a Esparta y Atenas?", options: ["Guerras Médicas", "Guerras del Peloponeso", "Guerras Púnicas", "Guerra de Troya"], correctIndex: 1, difficulty: 4, category: "historia", hint: "Guerra interna en Grecia" },
  { question: "¿Quién fue la última zarina de Rusia?", options: ["Catalina la Grande", "Alexandra Feodorovna", "Anastasia", "Isabel I"], correctIndex: 1, difficulty: 5, category: "historia", hint: "Esposa de Nicolás II" },
  { question: "¿Qué ciudad japonesa fue la primera en sufrir un ataque atómico?", options: ["Nagasaki", "Tokio", "Hiroshima", "Osaka"], correctIndex: 2, difficulty: 1, category: "historia", hint: "6 de agosto de 1945" },
  { question: "¿Qué país regaló la Estatua de la Libertad a EE.UU.?", options: ["España", "Reino Unido", "Francia", "Italia"], correctIndex: 2, difficulty: 2, category: "historia", hint: "Centenario de la independencia" },
  { question: "¿Quién fue el filósofo tutor de Alejandro Magno?", options: ["Platón", "Sócrates", "Aristóteles", "Heródoto"], correctIndex: 2, difficulty: 3, category: "historia", hint: "Autor de la Ética a Nicómaco" },
  { question: "¿Qué civilización inventó el calendario de 365 días?", options: ["Egipcia", "Griega", "Azteca", "Romana"], correctIndex: 0, difficulty: 4, category: "historia", hint: "Basado en las crecidas del Nilo" },
  { question: "¿Cuál fue la capital del Imperio Bizantino?", options: ["Roma", "Atenas", "Constantinopla", "Alejandría"], correctIndex: 2, difficulty: 2, category: "historia", hint: "Actual Estambul" },
  { question: "¿En qué país se originó la Revolución Industrial?", options: ["Francia", "Alemania", "Reino Unido", "EE.UU."], correctIndex: 2, difficulty: 2, category: "historia", hint: "Máquina de vapor y carbón" },
  { question: "¿Quién fue el primer hombre en el espacio?", options: ["Neil Armstrong", "Yuri Gagarin", "John Glenn", "Buzz Aldrin"], correctIndex: 1, difficulty: 3, category: "historia", hint: "Soviético, 1961" },
  { question: "¿Qué reina española financió el viaje de Colón?", options: ["Juana la Loca", "Isabel la Católica", "María de Molina", "Isabel II"], correctIndex: 1, difficulty: 1, category: "historia", hint: "Reina de Castilla" },
  { question: "¿En qué año terminó la Guerra Civil Española?", options: ["1936", "1939", "1945", "1975"], correctIndex: 1, difficulty: 3, category: "historia", hint: "Empezó en el 36" },
  { question: "¿Qué faraón es famoso por su tumba intacta?", options: ["Ramsés II", "Tutankamón", "Keops", "Akenatón"], correctIndex: 1, difficulty: 1, category: "historia", hint: "El faraón niño" },
  { question: "¿Qué batalla supuso la derrota final de Napoleón?", options: ["Austerlitz", "Waterloo", "Leipzig", "Trafalgar"], correctIndex: 1, difficulty: 2, category: "historia", hint: "En la actual Bélgica" },
  { question: "¿Quién fue el líder de la Revolución Rusa de 1917?", options: ["Stalin", "Lenin", "Trotsky", "Nicolás II"], correctIndex: 1, difficulty: 3, category: "historia", hint: "Fundador del Partido Bolchevique" },
  { question: "¿Qué tratado puso fin a la I Guerra Mundial?", options: ["Tratado de Versalles", "Tratado de Tordesillas", "Tratado de Utrecht", "Paz de Westfalia"], correctIndex: 0, difficulty: 2, category: "historia", hint: "Se firmó en 1919" },
  { question: "¿Quién descubrió la penicilina?", options: ["Louis Pasteur", "Alexander Fleming", "Marie Curie", "Albert Einstein"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Fue un hallazgo accidental" },
  { question: "¿Qué imperio construyó el Coliseo?", options: ["Griego", "Romano", "Bizantino", "Persa"], correctIndex: 1, difficulty: 1, category: "historia", hint: "Bajo la dinastía Flavia" },
  { question: "¿Quién fue la primera mujer en ganar un Premio Nobel?", options: ["Rosalind Franklin", "Marie Curie", "Ada Lovelace", "Frida Kahlo"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Ganó dos en distintas categorías" },
  { question: "¿Quién fue asesinado en Sarajevo detonando la I Guerra Mundial?", options: ["Archiduque Francisco Fernando", "Zar Nicolás II", "Káiser Guillermo", "Rey Jorge V"], correctIndex: 0, difficulty: 3, category: "historia", hint: "Heredero al trono austrohúngaro" },
  { question: "¿Qué país invadió Alemania para iniciar la II Guerra Mundial?", options: ["Francia", "Polonia", "Rusia", "Checoslovaquia"], correctIndex: 1, difficulty: 2, category: "historia", hint: "1 de septiembre de 1939" },
  { question: "¿En qué ciudad se firmó la Constitución de EE.UU.?", options: ["Washington D.C.", "Nueva York", "Filadelfia", "Boston"], correctIndex: 2, difficulty: 4, category: "historia", hint: "Donde está la Campana de la Libertad" },
  { question: "¿Quién fue el primer presidente de EE.UU.?", options: ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "Benjamin Franklin"], correctIndex: 2, difficulty: 1, category: "historia", hint: "Lideró la Guerra de Independencia" },
  { question: "¿Qué desastre ocurrió en 1986 en una central nuclear de Ucrania?", options: ["Fukushima", "Chernóbil", "Three Mile Island", "Kyshtym"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Cerca de Prípiat" },
  { question: "¿Quién fue la mítica reina que se suicidó con una áspid?", options: ["Nefertiti", "Cleopatra", "Zenobia", "Hatshepsut"], correctIndex: 1, difficulty: 1, category: "historia", hint: "Romances con Julio César y Marco Antonio" },
  { question: "¿Qué muro cayó el 9 de noviembre de 1989?", options: ["Muro de las Lamentaciones", "Gran Muralla China", "Muro de Berlín", "Muro de Adriano"], correctIndex: 2, difficulty: 1, category: "historia", hint: "Símbolo de la Guerra Fría" },
  { question: "¿Qué imperio conquistó Hernán Cortés?", options: ["Inca", "Azteca", "Maya", "Chibcha"], correctIndex: 1, difficulty: 2, category: "historia", hint: "En el actual México" },
  { question: "¿Quién fue el último líder de la URSS?", options: ["Stalin", "Brezhnev", "Gorbachov", "Yeltsin"], correctIndex: 2, difficulty: 3, category: "historia", hint: "Impulsó la Perestroika" },
  { question: "¿En qué isla murió Napoleón?", options: ["Elba", "Santa Elena", "Córcega", "Sicilia"], correctIndex: 1, difficulty: 4, category: "historia", hint: "En mitad del Atlántico Sur" },
];

// --- BIOLOGÍA ---
export const biologyQuestions: CultureQuestion[] = [
  { question: "¿Cuál es el orgánulo de la respiración celular?", options: ["Ribosoma", "Mitocondria", "Aparato de Golgi", "Lisosoma"], correctIndex: 1, difficulty: 2, category: "biologia", hint: "Central energética de la célula" },
  { question: "¿Qué base nitrogenada no se encuentra en el ADN?", options: ["Adenina", "Guanina", "Uracilo", "Timina"], correctIndex: 2, difficulty: 3, category: "biologia", hint: "El Uracilo es propio del ARN" },
  { question: "¿Cómo se llama la división celular que produce gametos?", options: ["Mitosis", "Meiosis", "Fisión", "Brotación"], correctIndex: 1, difficulty: 3, category: "biologia", hint: "Reduce cromosomas a la mitad" },
  { question: "¿Qué proteína transporta el oxígeno en la sangre?", options: ["Insulina", "Colágeno", "Hemoglobina", "Queratina"], correctIndex: 2, difficulty: 1, category: "biologia", hint: "Contiene hierro y da color rojo" },
  { question: "¿Quién es el padre de la genética?", options: ["Charles Darwin", "Gregor Mendel", "Louis Pasteur", "Lamarck"], correctIndex: 1, difficulty: 2, category: "biologia", hint: "Experimentos con guisantes" },
  { question: "¿Qué tipo de sangre es el 'donante universal'?", options: ["A+", "AB+", "O-", "B-"], correctIndex: 2, difficulty: 3, category: "biologia", hint: "No tiene antígenos A, B ni Rh" },
  { question: "¿Cuál es el hueso más largo del cuerpo humano?", options: ["Húmero", "Tibia", "Fémur", "Radio"], correctIndex: 2, difficulty: 1, category: "biologia", hint: "Está en el muslo" },
  { question: "¿Qué proceso convierte luz solar en energía química?", options: ["Respiración", "Fotosíntesis", "Fermentación", "Quimiosíntesis"], correctIndex: 1, difficulty: 1, category: "biologia", hint: "Plantas y algas" },
  { question: "¿Cuántos pares de cromosomas tiene un humano?", options: ["21", "23", "46", "24"], correctIndex: 1, difficulty: 2, category: "biologia", hint: "En total son 46" },
  { question: "¿Qué órgano produce la insulina?", options: ["Hígado", "Páncreas", "Riñón", "Bazo"], correctIndex: 1, difficulty: 2, category: "biologia", hint: "Regula el azúcar en sangre" },
  { question: "¿Cuál es el principal gas que exhalamos?", options: ["Oxígeno", "Dióxido de carbono", "Nitrógeno", "Metano"], correctIndex: 1, difficulty: 1, category: "biologia", hint: "CO2" },
  { question: "¿Qué vitamina se sintetiza con la luz solar?", options: ["Vitamina C", "Vitamina A", "Vitamina D", "Vitamina K"], correctIndex: 2, difficulty: 2, category: "biologia", hint: "Absorción de calcio" },
  { question: "¿Qué científico propuso la evolución por selección natural?", options: ["Newton", "Darwin", "Watson", "Tesla"], correctIndex: 1, difficulty: 1, category: "biologia", hint: "El origen de las especies" },
  { question: "¿Cuál es el reino de los hongos?", options: ["Plantae", "Monera", "Fungi", "Protista"], correctIndex: 2, difficulty: 2, category: "biologia", hint: "No hacen fotosíntesis" },
  { question: "¿Cuál es el grupo de invertebrados más numeroso?", options: ["Moluscos", "Anélidos", "Artrópodos", "Equinodermos"], correctIndex: 2, difficulty: 3, category: "biologia", hint: "Incluye insectos" },
  { question: "¿Qué hormona es la 'hormona del estrés'?", options: ["Adrenalina", "Cortisol", "Dopamina", "Serotonina"], correctIndex: 1, difficulty: 3, category: "biologia", hint: "Tensión prolongada" },
  { question: "¿Qué parte de la célula contiene el material genético?", options: ["Citoplasma", "Membrana", "Núcleo", "Vacuola"], correctIndex: 2, difficulty: 1, category: "biologia", hint: "Cerebro de la célula" },
  { question: "¿Qué gas necesita la fotosíntesis?", options: ["Oxígeno", "Dióxido de Carbono", "Helio", "Argón"], correctIndex: 1, difficulty: 1, category: "biologia", hint: "Las plantas lo absorben" },
  { question: "¿Qué enzima 'desenrolla' la hélice de ADN?", options: ["Ligasa", "Polimerasa", "Helicasa", "Primasa"], correctIndex: 2, difficulty: 4, category: "biologia", hint: "Su nombre suena a hélice" },
  { question: "¿Cuál es el azúcar del ADN?", options: ["Ribosa", "Desoxirribosa", "Fructosa", "Glucosa"], correctIndex: 1, difficulty: 2, category: "biologia", hint: "Da nombre al ácido" },
  { question: "¿Qué hormona desarrolla caracteres sexuales masculinos?", options: ["Estrógeno", "Progesterona", "Testosterona", "Cortisol"], correctIndex: 2, difficulty: 1, category: "biologia", hint: "Producida en los testículos" },
  { question: "¿Qué es la apoptosis?", options: ["Necrosis", "Suicidio celular programado", "Autofagia", "Mitosis"], correctIndex: 1, difficulty: 4, category: "biologia", hint: "Fundamental para evitar cáncer" },
  { question: "¿Cuál es la función principal de los ribosomas?", options: ["Respiración", "Síntesis de proteínas", "Digestión celular", "Almacenar agua"], correctIndex: 1, difficulty: 2, category: "biologia", hint: "Leen el ARN mensajero" },
  { question: "¿Qué vitamina es esencial para la coagulación?", options: ["Vitamina A", "Vitamina B12", "Vitamina K", "Vitamina E"], correctIndex: 2, difficulty: 3, category: "biologia", hint: "Vegetales de hoja verde" },
  { question: "¿En qué órgano se produce la bilis?", options: ["Páncreas", "Hígado", "Vesícula biliar", "Estómago"], correctIndex: 1, difficulty: 3, category: "biologia", hint: "El órgano la produce, la vesícula la guarda" },
  { question: "¿Qué parte de la neurona recibe impulsos?", options: ["Axón", "Dendrita", "Soma", "Mielina"], correctIndex: 1, difficulty: 3, category: "biologia", hint: "Forma de ramificaciones" },
];

// --- EUROVISIÓN ---
export const eurovisionQuestions: CultureQuestion[] = [
  { question: "¿Qué país ha ganado más veces Eurovisión?", options: ["Suecia", "Irlanda", "Reino Unido", "Francia"], correctIndex: 1, difficulty: 4, category: "eurovision", hint: "7 victorias" },
  { question: "¿En qué año se celebró el primer festival?", options: ["1950", "1956", "1960", "1964"], correctIndex: 1, difficulty: 3, category: "eurovision", hint: "Fue en Lugano, Suiza" },
  { question: "¿Qué grupo saltó a la fama tras ganar en 1974?", options: ["Mocedades", "ABBA", "Baccara", "The Shadows"], correctIndex: 1, difficulty: 1, category: "eurovision", hint: "Cantaron 'Waterloo'" },
  { question: "¿Qué país ganó en 2022?", options: ["España", "Reino Unido", "Ucrania", "Italia"], correctIndex: 2, difficulty: 2, category: "eurovision", hint: "Kalush Orchestra con 'Stefania'" },
  { question: "¿Cuál es el famoso 'Big Five'?", options: ["España, Francia, Italia, Alemania, Reino Unido", "España, Portugal, Francia, Grecia, Italia", "Rusia, China, EE.UU., Japón, Corea", "Suecia, Noruega, Dinamarca, Islandia, Finlandia"], correctIndex: 0, difficulty: 2, category: "eurovision", hint: "Los que más dinero aportan" },
  { question: "¿Qué cantante española ganó con 'Vivo cantando'?", options: ["Massiel", "Salomé", "Karina", "Pastora Soler"], correctIndex: 1, difficulty: 4, category: "eurovision", hint: "Empate de 1969" },
  { question: "¿Qué país no europeo participa desde 2015?", options: ["Canadá", "Australia", "Marruecos", "Túnez"], correctIndex: 1, difficulty: 1, category: "eurovision", hint: "Está en Oceanía" },
  { question: "¿Qué frase se dice al dar la máxima puntuación?", options: ["Ten points", "Twelve points", "Douze points", "Max points"], correctIndex: 2, difficulty: 1, category: "eurovision", hint: "Se dice en francés" },
  { question: "¿Quién ostenta el récord de más puntos en una final?", options: ["Alexander Rybak", "Loreen", "Salvador Sobral", "Duncan Laurence"], correctIndex: 2, difficulty: 5, category: "eurovision", hint: "'Amar pelos dois' en 2017" },
  { question: "¿Cuál es el nombre del trofeo de Eurovisión?", options: ["Micrófono de Cristal", "Guitarra de Oro", "Lira de Plata", "Disco de Diamante"], correctIndex: 0, difficulty: 2, category: "eurovision", hint: "Es transparente y brillante" },
  { question: "¿Qué país acogió el festival en 2023 en nombre de Ucrania?", options: ["Polonia", "Reino Unido", "España", "Alemania"], correctIndex: 1, difficulty: 2, category: "eurovision", hint: "Se celebró en Liverpool" },
  { question: "¿Céline Dion ganó representando a qué país?", options: ["Francia", "Bélgica", "Suiza", "Luxemburgo"], correctIndex: 2, difficulty: 4, category: "eurovision", hint: "Ella es canadiense" },
  { question: "¿Cuántos países ganaron a la vez en 1969?", options: ["2", "3", "4", "5"], correctIndex: 2, difficulty: 4, category: "eurovision", hint: "Empate masivo" },
  { question: "¿Qué país debutó y ganó el mismo año?", options: ["Serbia", "Croacia", "Eslovenia", "Letonia"], correctIndex: 0, difficulty: 5, category: "eurovision", hint: "2007 con 'Molitva'" },
  { question: "¿Qué grupo representó a España en 2022 obteniendo 3er puesto?", options: ["Tanxugueiras", "Rigoberta Bandini", "Chanel", "Blanca Paloma"], correctIndex: 2, difficulty: 1, category: "eurovision", hint: "Cantó 'SloMo'" },
  { question: "¿Cómo se llama la canción con la que Portugal ganó por primera vez?", options: ["Amar pelos dois", "O meu coração não tem cor", "Senhora do mar", "Telemóveis"], correctIndex: 0, difficulty: 2, category: "eurovision", hint: "Salvador Sobral" },
  { question: "¿Quién es la única persona que ha ganado 3 veces?", options: ["Loreen", "Johnny Logan", "Mans Zelmerlöw", "Linda Martin"], correctIndex: 1, difficulty: 4, category: "eurovision", hint: "Irlandés, 'Mr. Eurovision'" },
  { question: "¿Qué instrumento tocó Alexander Rybak en 'Fairytale'?", options: ["Guitarra", "Piano", "Violín", "Flauta"], correctIndex: 2, difficulty: 1, category: "eurovision", hint: "Lo tocaba mientras bailaba en 2009" },
  { question: "¿Quién es la única mujer que ha ganado dos veces como cantante?", options: ["Loreen", "Carola", "Charlotte Perrelli", "Conchita Wurst"], correctIndex: 0, difficulty: 3, category: "eurovision", hint: "Ganó en 2012 y 2023" },
];

// --- ABOGACÍA Y LEYES ---
export const lawQuestions: CultureQuestion[] = [
  { question: "¿Qué significa 'In dubio pro reo'?", options: ["A favor del Estado", "A favor del acusado", "El derecho es para todos", "Sin ley no hay pena"], correctIndex: 1, difficulty: 3, category: "abogacia", hint: "Presunción de inocencia" },
  { question: "¿Qué es el 'Habeas Corpus'?", options: ["Un impuesto", "Derecho a comparecer ante un juez tras detención", "Una condena a muerte", "Un contrato de propiedad"], correctIndex: 1, difficulty: 3, category: "abogacia", hint: "Evita detenciones ilegales" },
  { question: "¿Cuál es la norma suprema de un ordenamiento jurídico?", options: ["El Código Penal", "La Constitución", "El Código Civil", "El Reglamento de Tráfico"], correctIndex: 1, difficulty: 1, category: "abogacia", hint: "Todas las leyes deben respetarla" },
  { question: "¿Qué diferencia el Derecho Civil del Penal?", options: ["El Civil es para militares", "El Penal castiga delitos, el Civil regula relaciones privadas", "No hay diferencia", "El Civil es solo para empresas"], correctIndex: 1, difficulty: 2, category: "abogacia", hint: "Contratos vs Crímenes" },
  { question: "¿Qué es un abogado de oficio?", options: ["Un abogado de oficina", "Abogado asignado gratuitamente por el Estado", "Un abogado solo de juicios", "Un abogado jubilado"], correctIndex: 1, difficulty: 1, category: "abogacia", hint: "Garantiza defensa sin recursos" },
  { question: "¿Qué significa 'Pacta sunt servanda'?", options: ["Los pactos deben cumplirse", "El pacto es nulo", "Pactar es de sabios", "El juez decide el pacto"], correctIndex: 0, difficulty: 4, category: "abogacia", hint: "Principio de contratos" },
  { question: "¿Quién ejerce la acusación pública en un juicio?", options: ["El Juez", "El Fiscal", "El Notario", "El Procurador"], correctIndex: 1, difficulty: 2, category: "abogacia", hint: "Representa el interés de la sociedad" },
  { question: "¿Qué significa que un delito ha 'prescrito'?", options: ["El juez ha dictado sentencia", "Ha pasado el tiempo legal y ya no se puede juzgar", "El acusado es culpable", "Se han perdido las pruebas"], correctIndex: 1, difficulty: 2, category: "abogacia", hint: "El tiempo borra la responsabilidad" },
  { question: "¿Qué es la jurisprudencia?", options: ["Un libro de leyes", "El conjunto de sentencias de los tribunales", "La carrera de derecho", "Un tribunal internacional"], correctIndex: 1, difficulty: 3, category: "abogacia", hint: "Interpreta cómo aplicar la ley" },
  { question: "¿Qué significa 'Dolo'?", options: ["Sufrimiento físico", "Intención deliberada de cometer un delito", "Cometer un error sin querer", "Una fianza"], correctIndex: 1, difficulty: 3, category: "abogacia", hint: "Hacerlo 'a sabiendas'" },
  { question: "¿Qué es una persona jurídica?", options: ["Un juez", "Una entidad con derechos y obligaciones", "Un abogado famoso", "Un criminal"], correctIndex: 1, difficulty: 2, category: "abogacia", hint: "Como una empresa" },
  { question: "¿Qué tribunal es el de mayor rango?", options: ["Tribunal Superior", "Tribunal Supremo", "Juzgado de Guardia", "Audiencia Provincial"], correctIndex: 1, difficulty: 1, category: "abogacia", hint: "La última instancia" },
  { question: "¿Qué significa ser 'reincidente'?", options: ["Ser inocente", "Cometer el mismo delito varias veces", "Declararse culpable", "Apelar una sentencia"], correctIndex: 1, difficulty: 1, category: "abogacia", hint: "Es un agravante" },
  { question: "¿Qué significa 'Ab initio'?", options: ["Hasta el final", "Desde el principio", "Sin juicio", "Por ley"], correctIndex: 1, difficulty: 4, category: "abogacia", hint: "Inicio" },
  { question: "¿Qué es el 'Principio de Legalidad'?", options: ["Pagar impuestos siempre", "No hay delito ni pena sin ley previa", "El abogado siempre tiene razón", "Las leyes no se pueden cambiar"], correctIndex: 1, difficulty: 3, category: "abogacia", hint: "Nullum crimen, nulla poena sine lege" },
  { question: "¿Qué es la 'Vacatio Legis'?", options: ["Vacaciones de jueces", "Plazo entre publicación de ley y su entrada en vigor", "Leyes de turismo", "Anulación de una ley"], correctIndex: 1, difficulty: 5, category: "abogacia", hint: "Evita que una ley se aplique por sorpresa" },
  { question: "¿Qué significa 'Res Iudicata'?", options: ["Caso abierto", "Cosa juzgada", "Juicio nulo", "Juez imparcial"], correctIndex: 1, difficulty: 4, category: "abogacia", hint: "No se puede volver a juzgar" },
  { question: "¿Qué es la 'Expropiación Forzosa'?", options: ["Robar a un ciudadano", "El Estado toma un bien privado por interés público", "Multar a una empresa", "Vender una casa"], correctIndex: 1, difficulty: 3, category: "abogacia", hint: "Con indemnización" },
// --- PSICOLOGÍA Y MENTE (NUEVA CATEGORÍA) ---
  { question: "¿Qué psicólogo realizó el famoso 'Experimento de la prisión de Stanford'?", options: ["Sigmund Freud", "Philip Zimbardo", "Ivan Pavlov", "B.F. Skinner"], correctIndex: 1, difficulty: 3, category: "psicologia", hint: "Estudió roles de guardias y prisioneros" },
  { question: "¿Qué es la 'disonancia cognitiva'?", options: ["Pérdida de memoria", "Conflicto entre creencias y actos", "Doble personalidad", "Miedo a decidir"], correctIndex: 1, difficulty: 4, category: "psicologia", hint: "Malestar por contradicción interna" },
  { question: "¿Quién es el padre del Psicoanálisis?", options: ["Carl Jung", "Sigmund Freud", "Jean Piaget", "William James"], correctIndex: 1, difficulty: 1, category: "psicologia", hint: "Ello, Yo y Superyó" },
  { question: "¿Qué mide el Test de Rorschach?", options: ["Inteligencia", "Personalidad", "Memoria", "Reflejos"], correctIndex: 1, difficulty: 2, category: "psicologia", hint: "Manchas de tinta" },
  { question: "¿Qué es el 'Efecto Placebo'?", options: ["Mejora por sugestión", "Alergia a medicamentos", "Inmunidad natural", "Resistencia al dolor"], correctIndex: 0, difficulty: 2, category: "psicologia", hint: "Creer que cura" },
  { question: "¿En la pirámide de Maslow, qué está en la cima?", options: ["Seguridad", "Fisiología", "Autorrealización", "Afiliación"], correctIndex: 2, difficulty: 3, category: "psicologia", hint: "El máximo potencial" },
  { question: "¿Qué condicionamiento estudió Pavlov con sus perros?", options: ["Operante", "Clásico", "Instrumental", "Vicario"], correctIndex: 1, difficulty: 3, category: "psicologia", hint: "Estímulo-Respuesta" },
  { question: "¿Qué trastorno se caracteriza por altibajos extremos de ánimo?", options: ["Esquizofrenia", "Bipolaridad", "Narcisismo", "Agorafobia"], correctIndex: 1, difficulty: 2, category: "psicologia", hint: "Manía y depresión" },
  { question: "¿Qué es la 'Pareidolia'?", options: ["Ver caras en objetos", "Oír voces", "Miedo a los payasos", "Obsesión por el orden"], correctIndex: 0, difficulty: 4, category: "psicologia", hint: "Ver formas en las nubes" },
  { question: "¿Qué parte del cerebro se asocia principalmente con el miedo?", options: ["Hipocampo", "Amígdala", "Cerebelo", "Lóbulo frontal"], correctIndex: 1, difficulty: 4, category: "psicologia", hint: "Procesamiento emocional" },
  { question: "¿Qué síndrome hace que la víctima simpatice con su secuestrador?", options: ["Síndrome de Lima", "Síndrome de Estocolmo", "Síndrome de París", "Síndrome de Jerusalén"], correctIndex: 1, difficulty: 2, category: "psicologia", hint: "Capital de Suecia" },
  { question: "¿Qué es la 'Resiliencia'?", options: ["Negación del dolor", "Capacidad de superar traumas", "Falta de empatía", "Memoria fotográfica"], correctIndex: 1, difficulty: 3, category: "psicologia", hint: "Adaptarse a la adversidad" },
  { question: "¿Quién propuso la teoría del 'Inconsciente Colectivo'?", options: ["Freud", "Carl Jung", "Adler", "Lacan"], correctIndex: 1, difficulty: 4, category: "psicologia", hint: "Arquetipos" },
  { question: "¿Qué es la 'Sinestesia'?", options: ["No sentir dolor", "Percibir unidos varios sentidos", "Pérdida del olfato", "Visión doble"], correctIndex: 1, difficulty: 4, category: "psicologia", hint: "Oír colores" },
  { question: "¿Qué estudia la Psicología Gestalt?", options: ["Los sueños", "La percepción del todo", "El comportamiento animal", "La infancia"], correctIndex: 1, difficulty: 4, category: "psicologia", hint: "El todo es más que la suma de las partes" },
  { question: "¿Qué efecto describe que la gente rinde mejor si se siente observada?", options: ["Efecto Hawthorne", "Efecto Mariposa", "Efecto Pigmalión", "Efecto Halo"], correctIndex: 0, difficulty: 5, category: "psicologia", hint: "Estudio en una fábrica" },
  { question: "¿Qué es la 'Procrastinación'?", options: ["Miedo al fracaso", "Posponer tareas", "Obsesión por la limpieza", "Hablar dormido"], correctIndex: 1, difficulty: 2, category: "psicologia", hint: "Lo hago mañana" },
  { question: "¿Cuál es el 'Manual Diagnóstico y Estadístico de los Trastornos Mentales'?", options: ["CIE-10", "DSM-5", "Vademécum", "Código Penal"], correctIndex: 1, difficulty: 3, category: "psicologia", hint: "La biblia de los psiquiatras" },
  { question: "¿Qué es el 'Efecto Dunning-Kruger'?", options: ["Creer saber más de lo que se sabe", "Olvidar nombres", "Miedo a espacios abiertos", "Depresión estacional"], correctIndex: 0, difficulty: 3, category: "psicologia", hint: "Ignorancia confiada" },
  { question: "¿Qué neurotransmisor se asocia con el placer y la recompensa?", options: ["Cortisol", "Adrenalina", "Dopamina", "Melatonina"], correctIndex: 2, difficulty: 3, category: "psicologia", hint: "Sistema de recompensa" },

  // --- DERECHO Y LEYES (NUEVA CATEGORÍA) ---
  { question: "¿Qué significa la expresión latina 'Habeas Corpus'?", options: ["Que tengas el cuerpo", "Cuerpo del delito", "Derecho a la vida", "Pena de muerte"], correctIndex: 0, difficulty: 4, category: "leyes", hint: "Derecho a comparecer ante el juez" },
  { question: "¿Cuál es la norma suprema del ordenamiento jurídico español?", options: ["Código Civil", "Código Penal", "La Constitución", "El Rey"], correctIndex: 2, difficulty: 1, category: "leyes", hint: "De 1978" },
  { question: "¿Qué principio establece que todos son inocentes hasta que se demuestre lo contrario?", options: ["In dubio pro reo", "Presunción de inocencia", "Onus probandi", "Non bis in idem"], correctIndex: 1, difficulty: 2, category: "leyes", hint: "Base del derecho penal" },
  { question: "¿Qué significa 'In dubio pro reo'?", options: ["Culpable hasta demostrarse inocente", "En caso de duda, a favor del reo", "La ley es dura", "El desconocimiento no exime"], correctIndex: 1, difficulty: 3, category: "leyes", hint: "Beneficio de la duda" },
  { question: "¿Qué poder del Estado aprueba las leyes?", options: ["Ejecutivo", "Judicial", "Legislativo", "Militar"], correctIndex: 2, difficulty: 2, category: "leyes", hint: "El Parlamento" },
  { question: "¿Qué es el 'Boletín Oficial del Estado' (BOE)?", options: ["Un periódico", "Diario oficial de leyes", "Presupuesto del Rey", "Censo electoral"], correctIndex: 1, difficulty: 1, category: "leyes", hint: "Donde se publica todo" },
  { question: "¿A qué edad se alcanza la mayoría de edad legal en España?", options: ["16", "18", "21", "25"], correctIndex: 1, difficulty: 1, category: "leyes", hint: "Votar y conducir" },
  { question: "¿Qué es un 'testamento ológrafo'?", options: ["Escrito a mano por el testador", "Ante notario", "Oral", "En vídeo"], correctIndex: 0, difficulty: 5, category: "leyes", hint: "De su puño y letra" },
  { question: "¿Qué significa que una ley tiene 'efecto retroactivo'?", options: ["Se aplica al futuro", "Se aplica a hechos pasados", "Es ilegal", "Se anula"], correctIndex: 1, difficulty: 4, category: "leyes", hint: "Mirar atrás" },
  { question: "¿Qué órgano garantiza la constitucionalidad de las leyes en España?", options: ["Tribunal Supremo", "Audiencia Nacional", "Tribunal Constitucional", "Congreso"], correctIndex: 2, difficulty: 3, category: "leyes", hint: "Intérprete supremo" },
  { question: "¿Qué es el 'Derecho Mercantil'?", options: ["Regula crímenes", "Regula familias", "Regula el comercio", "Regula la administración"], correctIndex: 2, difficulty: 2, category: "leyes", hint: "Empresas y negocios" },
  { question: "¿Qué significa la expresión 'Dura lex, sed lex'?", options: ["La ley es blanda", "La ley es dura, pero es la ley", "Sin ley no hay orden", "La ley siempre cambia"], correctIndex: 1, difficulty: 3, category: "leyes", hint: "Aceptación de la norma" },
  { question: "¿Qué es la 'Plusvalía' en términos fiscales?", options: ["Impuesto al trabajo", "Valor añadido", "Incremento de valor de un bien", "Descuento por familia"], correctIndex: 2, difficulty: 4, category: "leyes", hint: "Impuesto municipal al vender piso" },
  { question: "¿Quién es el Jefe del Estado en una Monarquía Parlamentaria?", options: ["El Presidente", "El Primer Ministro", "El Rey", "El Juez Supremo"], correctIndex: 2, difficulty: 1, category: "leyes", hint: "Reina pero no gobierna" },
  { question: "¿Qué es un 'referéndum'?", options: ["Elección de alcalde", "Votación directa del pueblo", "Reunión de ministros", "Juicio popular"], correctIndex: 1, difficulty: 2, category: "leyes", hint: "Sí o No" },
  { question: "¿Cuál es la pena máxima en el Código Penal español actual?", options: ["Cadena perpetua", "Pena de muerte", "Prisión permanente revisable", "30 años fijos"], correctIndex: 2, difficulty: 3, category: "leyes", hint: "No es cadena perpetua exacta" },
  { question: "¿Qué es el 'Usufructo'?", options: ["Ser dueño total", "Derecho a usar y disfrutar", "Pagar una deuda", "Robar legalmente"], correctIndex: 1, difficulty: 4, category: "leyes", hint: "Uso y fruto" },
  { question: "¿Qué organismo internacional tiene sede en La Haya?", options: ["OTAN", "FMI", "Corte Internacional de Justicia", "Banco Mundial"], correctIndex: 2, difficulty: 3, category: "leyes", hint: "Juzga países" },
  { question: "¿Qué es el 'Derecho de Veto' en la ONU?", options: ["Derecho a votar", "Poder para bloquear una decisión", "Derecho a hablar", "Obligación de pagar"], correctIndex: 1, difficulty: 3, category: "leyes", hint: "Lo tienen 5 países" },
  { question: "¿Qué significa 'Persona Non Grata'?", options: ["Persona bienvenida", "Diplomático expulsado", "Turista ilegal", "Ciudadano honorario"], correctIndex: 1, difficulty: 3, category: "leyes", hint: "No agradable" },

  // --- MEDICINA AVANZADA Y ANATOMÍA ---
  { question: "¿Dónde se encuentra el hueso escafoides?", options: ["Cráneo", "Mano (Carpo)", "Rodilla", "Columna"], correctIndex: 1, difficulty: 4, category: "medicina", hint: "Suele romperse al caer con la mano" },
  { question: "¿Qué son los 'Islotes de Langerhans'?", options: ["Islas del Pacífico", "Células del Páncreas", "Partes del Oído", "Bacterias intestinales"], correctIndex: 1, difficulty: 5, category: "medicina", hint: "Producen insulina" },
  { question: "¿Qué arteria principal sale del ventrículo izquierdo?", options: ["Carótida", "Femoral", "Aorta", "Pulmonar"], correctIndex: 2, difficulty: 3, category: "medicina", hint: "La más grande del cuerpo" },
  { question: "¿Qué es la 'Apoptosis'?", options: ["Crecimiento celular", "Muerte celular programada", "Infección vírica", "División celular"], correctIndex: 1, difficulty: 5, category: "medicina", hint: "Suicidio celular" },
  { question: "¿Cuántos pares de costillas tiene el cuerpo humano?", options: ["10", "12", "14", "16"], correctIndex: 1, difficulty: 2, category: "medicina", hint: "24 en total" },
  { question: "¿Qué órgano almacena la bilis?", options: ["Hígado", "Páncreas", "Vesícula biliar", "Bazo"], correctIndex: 2, difficulty: 3, category: "medicina", hint: "Pequeño saco verde" },
  { question: "¿Qué es el 'Atlas' en anatomía?", options: ["Un libro", "La primera vértebra cervical", "Un músculo de la pierna", "El hueso del talón"], correctIndex: 1, difficulty: 4, category: "medicina", hint: "Sostiene la cabeza" },
  { question: "¿Qué tipo de sangre se considera 'Receptor Universal'?", options: ["O Negativo", "A Positivo", "AB Positivo", "B Negativo"], correctIndex: 2, difficulty: 3, category: "medicina", hint: "Recibe de todos" },
  { question: "¿Qué sustancia transporta el oxígeno en los glóbulos rojos?", options: ["Insulina", "Hemoglobina", "Melanina", "Queratina"], correctIndex: 1, difficulty: 2, category: "medicina", hint: "Contiene hierro" },
  { question: "¿Cuál es el músculo más fuerte del cuerpo en relación a su tamaño?", options: ["Bíceps", "Cuádriceps", "Masetero", "Glúteo"], correctIndex: 2, difficulty: 4, category: "medicina", hint: "En la mandíbula" },
  { question: "¿Qué nervio craneal inerva la mayoría de los órganos internos?", options: ["Nervio Óptico", "Nervio Vago", "Nervio Facial", "Nervio Trigémino"], correctIndex: 1, difficulty: 5, category: "medicina", hint: "El décimo par" },
  { question: "¿Qué es la 'Sístole'?", options: ["Relajación del corazón", "Contracción del corazón", "Parada cardíaca", "Soplo"], correctIndex: 1, difficulty: 3, category: "medicina", hint: "Bombeo" },
  { question: "¿Dónde está el fémur?", options: ["Brazo", "Muslo", "Antebrazo", "Espinilla"], correctIndex: 1, difficulty: 1, category: "medicina", hint: "Hueso más largo" },
  { question: "¿Qué glándula regula el ritmo circadiano (sueño)?", options: ["Tiroides", "Pineal", "Pituitaria", "Suprarrenal"], correctIndex: 1, difficulty: 4, category: "medicina", hint: "Produce melatonina" },
  { question: "¿Qué enfermedad provoca la deficiencia de Vitamina C?", options: ["Raquitismo", "Escorbuto", "Anemia", "Bocio"], correctIndex: 1, difficulty: 3, category: "medicina", hint: "Enfermedad de marineros" },
  { question: "¿Cuál es la función principal de los glóbulos blancos?", options: ["Transportar oxígeno", "Coagular sangre", "Defensa inmunitaria", "Regular temperatura"], correctIndex: 2, difficulty: 2, category: "medicina", hint: "Leucocitos" },
  { question: "¿Qué es una 'Bradicardia'?", options: ["Ritmo cardíaco rápido", "Ritmo cardíaco lento", "Presión alta", "Fiebre"], correctIndex: 1, difficulty: 4, category: "medicina", hint: "Corazón lento" },
  { question: "¿Qué hueso es conocido como 'la paletilla'?", options: ["Clavícula", "Esternón", "Escápula u Omóplato", "Húmero"], correctIndex: 2, difficulty: 2, category: "medicina", hint: "Espalda alta" },
  { question: "¿Qué conecta los músculos a los huesos?", options: ["Ligamentos", "Tendones", "Cartílagos", "Nervios"], correctIndex: 1, difficulty: 3, category: "medicina", hint: "Aquiles tiene uno" },
  { question: "¿Qué parte del ojo da su color?", options: ["Pupila", "Córnea", "Iris", "Retina"], correctIndex: 2, difficulty: 1, category: "medicina", hint: "Rodea la pupila" },

  // --- HISTORIA COMPLEJA Y CURIOSA ---
  { question: "¿Qué tratado puso fin a la Primera Guerra Mundial?", options: ["Tratado de Utrecht", "Tratado de Versalles", "Tratado de Tordesillas", "Paz de Westfalia"], correctIndex: 1, difficulty: 3, category: "historia", hint: "1919" },
  { question: "¿Quién fue el último Zar de Rusia?", options: ["Iván el Terrible", "Pedro el Grande", "Nicolás II", "Alejandro I"], correctIndex: 2, difficulty: 2, category: "historia", hint: "Familia Romanov" },
  { question: "¿En qué batalla fue derrotado Napoleón definitivamente?", options: ["Austerlitz", "Waterloo", "Trafalgar", "Borodino"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Contra Wellington" },
  { question: "¿Qué civilización inventó la escritura cuneiforme?", options: ["Egipcios", "Sumerios", "Griegos", "Mayas"], correctIndex: 1, difficulty: 4, category: "historia", hint: "Mesopotamia" },
  { question: "¿Quién pronunció el discurso de 'Sangre, esfuerzo, lágrimas y sudor'?", options: ["Churchill", "Roosevelt", "Stalin", "Hitler"], correctIndex: 0, difficulty: 2, category: "historia", hint: "Primer Ministro británico" },
  { question: "¿Qué rey inglés rompió con la Iglesia Católica para divorciarse?", options: ["Enrique V", "Enrique VIII", "Ricardo III", "Carlos I"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Tuvo 6 esposas" },
  { question: "¿Qué imperio construyó Machu Picchu?", options: ["Maya", "Azteca", "Inca", "Olmeca"], correctIndex: 2, difficulty: 1, category: "historia", hint: "En Perú" },
  { question: "¿En qué año se produjo el Descubrimiento de América?", options: ["1492", "1453", "1512", "1488"], correctIndex: 0, difficulty: 1, category: "historia", hint: "Colón" },
  { question: "¿Qué conflicto duró 116 años?", options: ["Guerra de los 30 años", "Guerra de los Cien Años", "Guerra de las Rosas", "Cruzadas"], correctIndex: 1, difficulty: 3, category: "historia", hint: "Francia vs Inglaterra" },
  { question: "¿Quién fue el primer hombre en el espacio?", options: ["Neil Armstrong", "Yuri Gagarin", "Buzz Aldrin", "Laika"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Soviético" },
  { question: "¿Qué dinastía china construyó la mayor parte de la Gran Muralla?", options: ["Han", "Ming", "Qin", "Tang"], correctIndex: 1, difficulty: 4, category: "historia", hint: "Dinastía posterior" },
  { question: "¿Qué país sufrió el 'Apartheid'?", options: ["Estados Unidos", "Ruanda", "Sudáfrica", "Australia"], correctIndex: 2, difficulty: 2, category: "historia", hint: "Nelson Mandela" },
  { question: "¿Quién fue 'Jack el Destripador'?", options: ["Un médico", "Un carnicero", "Nunca se identificó", "Un príncipe"], correctIndex: 2, difficulty: 2, category: "historia", hint: "Londres victoriano" },
  { question: "¿Qué general cartaginés cruzó los Alpes con elefantes?", options: ["Aníbal", "Escipión", "Atila", "Julio César"], correctIndex: 0, difficulty: 3, category: "historia", hint: "Guerras Púnicas" },
  { question: "¿En qué año ocurrió la Revolución Francesa?", options: ["1776", "1789", "1812", "1848"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Toma de la Bastilla" },
  { question: "¿Qué ciudad fue destruida por el volcán Vesubio?", options: ["Roma", "Pompeya", "Atenas", "Cartago"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Cuerpos de ceniza" },
  { question: "¿Quién fue el primer Emperador de China?", options: ["Sun Tzu", "Qin Shi Huang", "Mao Zedong", "Kublai Khan"], correctIndex: 1, difficulty: 4, category: "historia", hint: "Guerreros de Terracota" },
  { question: "¿Qué tratado dividió el mundo entre España y Portugal en 1494?", options: ["Tordesillas", "Utrecht", "Alcáçovas", "Versalles"], correctIndex: 0, difficulty: 3, category: "historia", hint: "Línea en el mapa" },
  { question: "¿Qué reina española fue conocida como 'La Loca'?", options: ["Isabel I", "Isabel II", "Juana I", "María Cristina"], correctIndex: 2, difficulty: 2, category: "historia", hint: "Hija de los Reyes Católicos" },
  { question: "¿Qué presidente de EEUU abolió la esclavitud?", options: ["Washington", "Jefferson", "Lincoln", "Kennedy"], correctIndex: 2, difficulty: 1, category: "historia", hint: "Guerra de Secesión" },

  // --- GEOGRAFÍA DIFÍCIL Y CURIOSA ---
  { question: "¿Cuál es el río más largo de Europa?", options: ["Danubio", "Rin", "Volga", "Sena"], correctIndex: 2, difficulty: 3, category: "geografia", hint: "Está en Rusia" },
  { question: "¿Cuál es la capital de Australia?", options: ["Sídney", "Melbourne", "Canberra", "Perth"], correctIndex: 2, difficulty: 2, category: "geografia", hint: "Ciudad planificada" },
  { question: "¿Qué país africano nunca fue colonizado formalmente?", options: ["Nigeria", "Etiopía", "Sudáfrica", "Egipto"], correctIndex: 1, difficulty: 4, category: "geografia", hint: "Abisinia" },
  { question: "¿En qué país se encuentra el Monte Kilimanjaro?", options: ["Kenia", "Tanzania", "Uganda", "Sudáfrica"], correctIndex: 1, difficulty: 3, category: "geografia", hint: "Techo de África" },
  { question: "¿Cuál es el lago navegable más alto del mundo?", options: ["Baikal", "Victoria", "Titicaca", "Superior"], correctIndex: 2, difficulty: 3, category: "geografia", hint: "Perú y Bolivia" },
  { question: "¿Qué país tiene más islas en el mundo?", options: ["Filipinas", "Indonesia", "Suecia", "Japón"], correctIndex: 2, difficulty: 5, category: "geografia", hint: "País nórdico (sorpresa)" },
  { question: "¿Cuál es la capital de Canadá?", options: ["Toronto", "Vancouver", "Montreal", "Ottawa"], correctIndex: 3, difficulty: 2, category: "geografia", hint: "No es la más grande" },
  { question: "¿Qué estrecho separa Asia de América?", options: ["Gibraltar", "Bering", "Bósforo", "Ormuz"], correctIndex: 1, difficulty: 3, category: "geografia", hint: "Cerca de Alaska" },
  { question: "¿Cuál es el país más pequeño de América del Sur?", options: ["Uruguay", "Surinam", "Guyana", "Ecuador"], correctIndex: 1, difficulty: 4, category: "geografia", hint: "Antigua Guayana Holandesa" },
  { question: "¿Qué mar baña las costas de Israel, Líbano y Egipto?", options: ["Rojo", "Muerto", "Mediterráneo", "Negro"], correctIndex: 2, difficulty: 1, category: "geografia", hint: "Mare Nostrum" },
  { question: "¿Cuál es la capital de Turquía?", options: ["Estambul", "Ankara", "Antalya", "Esmirna"], correctIndex: 1, difficulty: 2, category: "geografia", hint: "Centro del país" },
  { question: "¿Qué país es un enclave dentro de Sudáfrica?", options: ["Lesoto", "Suazilandia", "Namibia", "Botsuana"], correctIndex: 0, difficulty: 4, category: "geografia", hint: "Totalmente rodeado" },
  { question: "¿Dónde están las Islas Galápagos?", options: ["Colombia", "Ecuador", "Chile", "Perú"], correctIndex: 1, difficulty: 3, category: "geografia", hint: "Darwin estuvo allí" },
  { question: "¿Cuál es el desierto no polar más árido del mundo?", options: ["Sahara", "Gobi", "Atacama", "Kalahari"], correctIndex: 2, difficulty: 4, category: "geografia", hint: "Está en Chile" },
  { question: "¿Qué río pasa por Roma?", options: ["Arno", "Po", "Tíber", "Sena"], correctIndex: 2, difficulty: 3, category: "geografia", hint: "Tivere" },
  { question: "¿Cuál es la capital de Kazajistán (antes Astaná)?", options: ["Almaty", "Biskek", "Nur-Sultán", "Taskent"], correctIndex: 2, difficulty: 5, category: "geografia", hint: "Cambió de nombre recientemente" },
  { question: "¿Qué país tiene forma de 'bota'?", options: ["Nueva Zelanda", "Italia", "Chile", "Noruega"], correctIndex: 1, difficulty: 1, category: "geografia", hint: "En el Mediterráneo" },
  { question: "¿En qué océano se encuentra la Isla de Pascua?", options: ["Atlántico", "Índico", "Pacífico", "Antártico"], correctIndex: 2, difficulty: 3, category: "geografia", hint: "Moais" },
  { question: "¿Cuál es la montaña más alta de América?", options: ["Denali", "Aconcagua", "Chimborazo", "Huascarán"], correctIndex: 1, difficulty: 3, category: "geografia", hint: "En Argentina" },
  { question: "¿Qué país limita al norte con Estados Unidos?", options: ["Canadá", "México", "Rusia", "Groenlandia"], correctIndex: 1, difficulty: 2, category: "geografia", hint: "Al norte de EE.UU. está Canadá, pero la pregunta es 'limita al norte CON EE.UU.'" },

  // --- LÓGICA Y CULTURA VARIADA (NIVEL ALTO) ---
  { question: "¿Qué es una 'falacia ad hominem'?", options: ["Atacar la idea", "Atacar a la persona", "Apelar a la autoridad", "Circularidad"], correctIndex: 1, difficulty: 4, category: "logica", hint: "Contra el hombre" },
  { question: "¿Qué filósofo dijo 'Pienso, luego existo'?", options: ["Sócrates", "Kant", "Descartes", "Nietzsche"], correctIndex: 2, difficulty: 2, category: "filosofia", hint: "Cogito ergo sum" },
  { question: "¿En ajedrez, qué pieza puede saltar sobre otras?", options: ["Alfil", "Torre", "Caballo", "Reina"], correctIndex: 2, difficulty: 2, category: "varios", hint: "Movimiento en L" },
  { question: "¿Qué mide la Escala de Richter?", options: ["Viento", "Terremotos", "Dureza minerales", "Calor"], correctIndex: 1, difficulty: 2, category: "ciencia", hint: "Sismos" },
  { question: "¿Qué es la 'Entropía'?", options: ["Energía", "Orden", "Desorden/Caos", "Calor"], correctIndex: 2, difficulty: 4, category: "ciencia", hint: "Termodinámica" },
  { question: "¿Cuál es el libro más vendido de la historia (excluyendo religiosos)?", options: ["Harry Potter", "El Quijote", "Don Quijote", "Historia de dos ciudades"], correctIndex: 2, difficulty: 3, category: "literatura", hint: "Cervantes" },
  { question: "¿Qué es el 'Gato de Schrödinger'?", options: ["Un animal real", "Una paradoja cuántica", "Un dibujo animado", "Una raza"], correctIndex: 1, difficulty: 4, category: "ciencia", hint: "Vivo y muerto a la vez" },
  { question: "¿Cuántas casillas tiene un tablero de ajedrez?", options: ["32", "64", "100", "50"], correctIndex: 1, difficulty: 2, category: "varios", hint: "8x8" },
  { question: "¿Qué es el 'Braille'?", options: ["Un idioma", "Sistema de lectura táctil", "Un tipo de queso", "Una región francesa"], correctIndex: 1, difficulty: 1, category: "varios", hint: "Para ciegos" },
  { question: "¿Qué animal es un 'monotrema' (mamífero que pone huevos)?", options: ["Canguro", "Ornitorrinco", "Koala", "Murciélago"], correctIndex: 1, difficulty: 4, category: "naturaleza", hint: "Pico de pato" },
// --- PSICOLOGÍA Y COMPORTAMIENTO (PACK 2) ---
  { question: "¿Qué experimento estudió la obediencia a la autoridad usando descargas eléctricas falsas?", options: ["Experimento de Asch", "Experimento de Milgram", "Pequeño Albert", "Caja de Skinner"], correctIndex: 1, difficulty: 4, category: "psicologia", hint: "Stanley Milgram" },
  { question: "¿Qué es el 'Efecto Halo'?", options: ["Ver luces alrededor", "Atribuir cualidades positivas por una sola característica", "Miedo a la luz", "Creerse un santo"], correctIndex: 1, difficulty: 3, category: "psicologia", hint: "Si es guapo, es bueno" },
  { question: "¿Qué parte del cerebro es fundamental para la memoria a largo plazo?", options: ["Cerebelo", "Hipocampo", "Bulbo raquídeo", "Hipotálamo"], correctIndex: 1, difficulty: 4, category: "psicologia", hint: "Parece un caballito de mar" },
  { question: "¿Qué es la 'Indefensión Aprendida'?", options: ["No saber defenderse", "Creer que no se puede cambiar el destino", "Olvidar cómo luchar", "Pereza extrema"], correctIndex: 1, difficulty: 4, category: "psicologia", hint: "Martin Seligman" },
  { question: "¿Qué trastorno se conocía antiguamente como 'Maníaco-Depresivo'?", options: ["Esquizofrenia", "Trastorno Bipolar", "Neurosis", "Psicopatía"], correctIndex: 1, difficulty: 2, category: "psicologia", hint: "Dos polos" },
  { question: "¿Qué es el 'Efecto Stroop'?", options: ["Confusión al leer un color escrito en tinta de otro color", "Miedo a los colores", "Ver colores en blanco y negro", "Ceguera al color"], correctIndex: 0, difficulty: 3, category: "psicologia", hint: "Rojo escrito en tinta azul" },
  { question: "¿Quién desarrolló la teoría del 'Desarrollo Cognitivo' en niños?", options: ["Freud", "Jean Piaget", "Skinner", "Watson"], correctIndex: 1, difficulty: 3, category: "psicologia", hint: "Etapas sensoriomotoras" },
  { question: "¿Qué es la 'Proyección' en psicoanálisis?", options: ["Planear el futuro", "Atribuir a otros nuestros propios defectos", "Ver películas mentales", "Soñar despierto"], correctIndex: 1, difficulty: 4, category: "psicologia", hint: "Mecanismo de defensa" },
  { question: "¿Qué fobia es el miedo a los espacios abiertos o públicos?", options: ["Claustrofobia", "Agorafobia", "Acrofobia", "Xenofobia"], correctIndex: 1, difficulty: 3, category: "psicologia", hint: "Contrario a claustrofobia" },
  { question: "¿Qué es el 'Sesgo de Confirmación'?", options: ["Confirmar citas", "Buscar solo información que apoye nuestras creencias", "Dudar de todo", "Creer en conspiraciones"], correctIndex: 1, difficulty: 3, category: "psicologia", hint: "Ignorar lo que nos contradice" },
  { question: "¿Qué psicólogo es famoso por su teoría de la 'Inteligencia Emocional'?", options: ["Daniel Goleman", "Gardner", "Freud", "Pavlov"], correctIndex: 0, difficulty: 3, category: "psicologia", hint: "Libro best-seller de los 90" },
  { question: "¿Qué es la 'Gestalt'?", options: ["Una terapia", "Una corriente que estudia la percepción", "Un test de inteligencia", "Una enfermedad"], correctIndex: 1, difficulty: 4, category: "psicologia", hint: "El todo y las partes" },
  { question: "¿Qué estudia la 'Proxémica'?", options: ["El futuro", "El uso del espacio personal y la distancia", "Los productos químicos", "La proximidad familiar"], correctIndex: 1, difficulty: 5, category: "psicologia", hint: "Distancia íntima, social..." },

  // --- MEDICINA Y BIOLOGÍA AVANZADA (PACK 2) ---
  { question: "¿Qué órgano produce la hormona 'Cortisol'?", options: ["Tiroides", "Glándulas Suprarrenales", "Páncreas", "Hígado"], correctIndex: 1, difficulty: 4, category: "medicina", hint: "Hormona del estrés" },
  { question: "¿Cuál es la función principal del Bazo?", options: ["Producir insulina", "Filtrar y destruir células sanguíneas viejas", "Digerir grasas", "Bombear sangre"], correctIndex: 1, difficulty: 4, category: "medicina", hint: "Sistema linfático" },
  { question: "¿Qué es un 'Aneurisma'?", options: ["Un paro cardíaco", "Dilatación anormal de una arteria", "Una fractura ósea", "Una infección pulmonar"], correctIndex: 1, difficulty: 4, category: "medicina", hint: "Como un globo en la vena" },
  { question: "¿Cuántos pares de nervios craneales tiene el ser humano?", options: ["10", "12", "14", "31"], correctIndex: 1, difficulty: 5, category: "medicina", hint: "Docena" },
  { question: "¿Qué es la 'Mielina'?", options: ["Un azúcar", "Capa aislante que recubre los nervios", "Una hormona", "Un tipo de músculo"], correctIndex: 1, difficulty: 4, category: "medicina", hint: "Facilita impulsos eléctricos" },
  { question: "¿Qué hueso no se articula con ningún otro hueso del cuerpo?", options: ["Fémur", "Hioides", "Estribo", "Rótula"], correctIndex: 1, difficulty: 5, category: "medicina", hint: "En la garganta" },
  { question: "¿Qué enfermedad provoca la falta de Vitamina B12?", options: ["Escorbuto", "Anemia Perniciosa", "Raquitismo", "Pelagra"], correctIndex: 1, difficulty: 5, category: "medicina", hint: "Tipo de anemia" },
  { question: "¿Qué es la 'Homeostasis'?", options: ["Coagulación de la sangre", "Equilibrio interno del organismo", "Mutación genética", "Transfusión de sangre"], correctIndex: 1, difficulty: 3, category: "medicina", hint: "Estabilidad" },
  { question: "¿Qué válvula separa la aurícula derecha del ventrículo derecho?", options: ["Mitral", "Tricúspide", "Aórtica", "Pulmonar"], correctIndex: 1, difficulty: 5, category: "medicina", hint: "Tiene tres valvas" },
  { question: "¿Qué es el 'Píloro'?", options: ["Un hueso del pie", "Válvula de salida del estómago", "Un tipo de neurona", "Parte del oído"], correctIndex: 1, difficulty: 4, category: "medicina", hint: "Conecta con el duodeno" },
  { question: "¿Qué tipo de célula carece de núcleo?", options: ["Neurona", "Glóbulo rojo (Eritrocito)", "Glóbulo blanco", "Óvulo"], correctIndex: 1, difficulty: 4, category: "medicina", hint: "Para llevar más oxígeno" },
  { question: "¿Qué es la 'Necrosis'?", options: ["Muerte de tejido corporal", "Crecimiento excesivo", "División celular", "Infección por hongos"], correctIndex: 0, difficulty: 3, category: "medicina", hint: "Tejido muerto" },
  { question: "¿Dónde se encuentra la 'Silla Turca'?", options: ["En la cadera", "En el hueso esfenoides del cráneo", "En el pie", "En la columna"], correctIndex: 1, difficulty: 5, category: "medicina", hint: "Aloja la hipófisis" },
  { question: "¿Qué es la 'Disnea'?", options: ["Dolor de cabeza", "Dificultad para respirar", "Visión borrosa", "Falta de apetito"], correctIndex: 1, difficulty: 3, category: "medicina", hint: "Sensación de ahogo" },

  // --- LEYES Y DERECHO (PACK 2) ---
  { question: "¿Qué significa 'Ad Hominem' en un debate?", options: ["A favor del hombre", "Atacar a la persona y no al argumento", "Argumento de autoridad", "Verdad absoluta"], correctIndex: 1, difficulty: 3, category: "leyes", hint: "Falacia lógica" },
  { question: "¿Qué es el 'Derecho Consuetudinario'?", options: ["Derecho escrito", "Derecho basado en la costumbre", "Derecho internacional", "Derecho penal"], correctIndex: 1, difficulty: 5, category: "leyes", hint: "No está en leyes escritas" },
  { question: "¿Qué significa 'Prima Facie'?", options: ["A primera vista", "Primo hermano", "Primera fase", "Facultad principal"], correctIndex: 0, difficulty: 4, category: "leyes", hint: "Apariencia inicial" },
  { question: "¿Qué es la 'Prevaricación'?", options: ["Robar dinero público", "Dictar una resolución injusta a sabiendas", "Mentir en juicio", "Falsificar documentos"], correctIndex: 1, difficulty: 4, category: "leyes", hint: "Delito de jueces o funcionarios" },
  { question: "¿Qué es un 'Indulto'?", options: ["Perdón total o parcial de una pena", "Olvido del delito (Amnistía)", "Sentencia de muerte", "Multa económica"], correctIndex: 0, difficulty: 3, category: "leyes", hint: "Lo da el Gobierno" },
  { question: "¿Qué es el 'Dolo' en derecho penal?", options: ["Dolor de la víctima", "Voluntad deliberada de cometer un delito", "Descuido o negligencia", "Daño económico"], correctIndex: 1, difficulty: 3, category: "leyes", hint: "Intención" },
  { question: "¿Qué significa 'Pacta sunt servanda'?", options: ["Los pactos deben cumplirse", "Los pactos son servidumbre", "Paz para los siervos", "El contrato es nulo"], correctIndex: 0, difficulty: 5, category: "leyes", hint: "Principio fundamental de contratos" },
  { question: "¿Qué es la 'Legítima Defensa'?", options: ["Atacar primero", "Causa de justificación para eximir de culpa", "Venganza", "Justicia por mano propia"], correctIndex: 1, difficulty: 2, category: "leyes", hint: "Defenderse de agresión real" },
  { question: "¿Qué es el 'Estatuto de los Trabajadores'?", options: ["Norma básica laboral", "Sindicato", "Contrato temporal", "Huelga general"], correctIndex: 0, difficulty: 2, category: "leyes", hint: "Regula derechos laborales" },
  { question: "¿Qué tribunal juzga crímenes de genocidio y lesa humanidad?", options: ["Tribunal Supremo", "Corte Penal Internacional", "ONU", "Tribunal de Cuentas"], correctIndex: 1, difficulty: 3, category: "leyes", hint: "Sede en La Haya" },
  { question: "¿Qué es el 'Derecho de Asilo'?", options: ["Derecho a vivienda", "Protección a refugiados", "Derecho a sanidad", "Derecho a jubilarse"], correctIndex: 1, difficulty: 2, category: "leyes", hint: "Persecución política" },
  { question: "¿Qué es una 'Moción de Censura'?", options: ["Prohibir una película", "Mecanismo para destituir al Gobierno", "Multa de tráfico", "Juicio rápido"], correctIndex: 1, difficulty: 3, category: "leyes", hint: "Parlamento contra Presidente" },
  { question: "¿Qué significa 'Ab Intestato'?", options: ["Sin testamento", "Con testamento cerrado", "Testigo falso", "Intestino"], correctIndex: 0, difficulty: 5, category: "leyes", hint: "Herencia sin papeles" },

  // --- HISTORIA COMPLEJA (PACK 2) ---
  { question: "¿Qué fue la 'Guerra de los Treinta Años'?", options: ["Conflicto religioso en Europa (1618-1648)", "Guerra civil española", "Guerra entre Roma y Cartago", "Invasión napoleónica"], correctIndex: 0, difficulty: 4, category: "historia", hint: "Paz de Westfalia" },
  { question: "¿Quién fue el último emperador azteca?", options: ["Moctezuma II", "Cuauhtémoc", "Atahualpa", "Pachacútec"], correctIndex: 1, difficulty: 3, category: "historia", hint: "Primo de Moctezuma" },
  { question: "¿Qué es la 'Piedra de Rosetta'?", options: ["Joya egipcia", "Clave para descifrar jeroglíficos", "Tumba de faraón", "Monumento romano"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Tres idiomas" },
  { question: "¿En qué año cayó Constantinopla?", options: ["1453", "1492", "1066", "1204"], correctIndex: 0, difficulty: 3, category: "historia", hint: "Fin de la Edad Media" },
  { question: "¿Qué batalla marcó el fin de Napoleón?", options: ["Austerlitz", "Waterloo", "Jena", "Trafalgar"], correctIndex: 1, difficulty: 2, category: "historia", hint: "1815" },
  { question: "¿Quién fue Robespierre?", options: ["Rey de Francia", "Líder del 'Terror' en la Revolución Francesa", "General de Napoleón", "Filósofo ilustrado"], correctIndex: 1, difficulty: 3, category: "historia", hint: "Guillotinado" },
  { question: "¿Qué potencia atacó Pearl Harbor?", options: ["Alemania", "Italia", "Japón", "Rusia"], correctIndex: 2, difficulty: 1, category: "historia", hint: "Diciembre de 1941" },
  { question: "¿Qué fue el 'Plan Marshall'?", options: ["Estrategia de guerra", "Ayuda económica de EEUU a Europa", "Plan espacial", "Invasión de Normandía"], correctIndex: 1, difficulty: 3, category: "historia", hint: "Reconstrucción post-SGM" },
  { question: "¿Quién unificó Alemania en el siglo XIX?", options: ["Bismarck", "Hitler", "Káiser Guillermo", "Federico el Grande"], correctIndex: 0, difficulty: 3, category: "historia", hint: "Canciller de Hierro" },
  { question: "¿Qué civilización creó el alfabeto del que deriva el nuestro?", options: ["Egipcios", "Fenicios", "Sumerios", "Persas"], correctIndex: 1, difficulty: 4, category: "historia", hint: "Grandes navegantes" },
  { question: "¿En qué guerra se usó por primera vez la bomba atómica?", options: ["Primera Guerra Mundial", "Segunda Guerra Mundial", "Guerra de Corea", "Guerra de Vietnam"], correctIndex: 1, difficulty: 1, category: "historia", hint: "Hiroshima" },
  { question: "¿Quién fue el primer hombre en orbitar la Tierra?", options: ["Neil Armstrong", "Yuri Gagarin", "John Glenn", "Laika"], correctIndex: 1, difficulty: 2, category: "historia", hint: "Vostok 1" },
  { question: "¿Qué rey inglés firmó la Carta Magna en 1215?", options: ["Ricardo Corazón de León", "Juan Sin Tierra", "Enrique VIII", "Guillermo el Conquistador"], correctIndex: 1, difficulty: 4, category: "historia", hint: "Hermano de Ricardo" },
  { question: "¿Qué imperio gobernaba la India antes de la independencia?", options: ["Imperio Mogol", "Imperio Británico", "Imperio Otomano", "Imperio Francés"], correctIndex: 1, difficulty: 1, category: "historia", hint: "El Raj" },

  // --- GEOGRAFÍA CURIOSA Y DIFÍCIL (PACK 2) ---
  { question: "¿Cuál es la capital de Liechtenstein?", options: ["Zúrich", "Berna", "Vaduz", "Mónaco"], correctIndex: 2, difficulty: 4, category: "geografia", hint: "Empieza por V" },
  { question: "¿Qué país tiene la mayor reserva de agua dulce del mundo?", options: ["Rusia", "Canadá", "Brasil", "EEUU"], correctIndex: 2, difficulty: 3, category: "geografia", hint: "Río Amazonas y acuíferos" },
  { question: "¿Cuál es el río más largo de Asia?", options: ["Ganges", "Mekong", "Yangtsé", "Amarillo"], correctIndex: 2, difficulty: 3, category: "geografia", hint: "Pasa por China" },
  { question: "¿Qué país es conocido como 'La tierra de las mil colinas'?", options: ["Suiza", "Ruanda", "Nepal", "Escocia"], correctIndex: 1, difficulty: 5, category: "geografia", hint: "África central" },
  { question: "¿Cuál es la capital de Mongolia?", options: ["Astaná", "Taskent", "Ulán Bator", "Biskek"], correctIndex: 2, difficulty: 4, category: "geografia", hint: "Héroe Rojo" },
  { question: "¿Qué dos países separa el Estrecho de Bering?", options: ["España y Marruecos", "EEUU y Rusia", "Reino Unido y Francia", "China y Japón"], correctIndex: 1, difficulty: 3, category: "geografia", hint: "Alaska y Siberia" },
  { question: "¿Cuál es la isla más grande del mundo (no continente)?", options: ["Madagascar", "Borneo", "Groenlandia", "Nueva Guinea"], correctIndex: 2, difficulty: 2, category: "geografia", hint: "Pertenece a Dinamarca" },
  { question: "¿Qué país tiene más lagos que el resto del mundo junto?", options: ["Finlandia", "Canadá", "Rusia", "Noruega"], correctIndex: 1, difficulty: 4, category: "geografia", hint: "Norteamérica" },
  { question: "¿Cuál es la capital de Nueva Zelanda?", options: ["Auckland", "Wellington", "Christchurch", "Sidney"], correctIndex: 1, difficulty: 3, category: "geografia", hint: "Ciudad ventosa" },
  { question: "¿En qué país está la ciudad de Tombuctú?", options: ["Egipto", "Marruecos", "Malí", "Kenia"], correctIndex: 2, difficulty: 4, category: "geografia", hint: "África Occidental" },
  { question: "¿Cuál es el lugar más bajo de la Tierra (tierra firme)?", options: ["Valle de la Muerte", "Mar Muerto", "Fosa de las Marianas", "Depresión del Caspio"], correctIndex: 1, difficulty: 3, category: "geografia", hint: "Entre Israel y Jordania" },
  { question: "¿Qué país europeo no tiene costa?", options: ["Francia", "Alemania", "Austria", "España"], correctIndex: 2, difficulty: 2, category: "geografia", hint: "Hablan alemán" },
  { question: "¿Cuál es la cascada más alta del mundo?", options: ["Niágara", "Iguazú", "Salto Ángel", "Victoria"], correctIndex: 2, difficulty: 3, category: "geografia", hint: "En Venezuela" },

  // --- LÓGICA Y CULTURA CIENTÍFICA (PACK 2) ---
  { question: "¿Qué es la 'Navaja de Ockham'?", options: ["Un instrumento quirúrgico", "La explicación más simple suele ser la correcta", "Un método de tortura", "Una ley física"], correctIndex: 1, difficulty: 3, category: "logica", hint: "Principio de parsimonia" },
  { question: "¿Qué mide un 'Año Luz'?", options: ["Tiempo", "Distancia", "Velocidad", "Intensidad luminosa"], correctIndex: 1, difficulty: 2, category: "ciencia", hint: "Distancia que recorre la luz en un año" },
  { question: "¿Qué es el 'Cero Absoluto'?", options: ["0 grados Celsius", "-273,15 grados Celsius", "Congelación del agua", "Vacío total"], correctIndex: 1, difficulty: 3, category: "ciencia", hint: "0 Kelvin" },
  { question: "¿Quién propuso el modelo heliocéntrico (la Tierra gira al sol)?", options: ["Ptolomeo", "Copérnico", "Newton", "Aristóteles"], correctIndex: 1, difficulty: 2, category: "ciencia", hint: "Astrónomo polaco" },
  { question: "¿Qué es la 'Antimateria'?", options: ["Materia oscura", "Materia con carga opuesta a la normal", "Nada", "Energía pura"], correctIndex: 1, difficulty: 4, category: "ciencia", hint: "Aniquilación al contacto" },
  { question: "¿Qué es un 'Número Irracional'?", options: ["Número negativo", "Número que no puede expresarse como fracción", "Número imaginario", "Número infinito"], correctIndex: 1, difficulty: 4, category: "matematicas", hint: "Como Pi" },
  { question: "¿Qué paradoja dice que 'Aquiles nunca alcanzará a la tortuga'?", options: ["Paradoja de Zenón", "Paradoja de Fermi", "Paradoja del Abuelo", "Paradoja de Olbers"], correctIndex: 0, difficulty: 5, category: "logica", hint: "Filósofo griego" },
  { question: "¿Qué es el 'Test de Turing'?", options: ["Prueba de ADN", "Prueba para distinguir humano de máquina", "Examen de conducir", "Test de visión"], correctIndex: 1, difficulty: 3, category: "tecnologia", hint: "Inteligencia Artificial" },
  { question: "¿Qué gas es responsable del efecto invernadero principalmente?", options: ["Oxígeno", "Dióxido de Carbono (CO2)", "Nitrógeno", "Helio"], correctIndex: 1, difficulty: 1, category: "ciencia", hint: "Calentamiento global" },
  { question: "¿Qué es el 'Bosón de Higgs'?", options: ["Una estrella", "La 'partícula de Dios'", "Un virus", "Un planeta"], correctIndex: 1, difficulty: 4, category: "ciencia", hint: "Da masa a la materia" }

];

// Combined extra questions
export const allExtraCultureQuestions: CultureQuestion[] = [
  
  ...geographyQuestions,
  ...historyQuestions,
  ...biologyQuestions,
  ...eurovisionQuestions,
  ...lawQuestions,
];

// Get questions by difficulty for millionaire-style progression
export function getCultureQuestionsByDifficulty(difficulty: 1 | 2 | 3 | 4 | 5, count: number = 5): CultureQuestion[] {
  const filtered = cultureQuestions.filter(q => q.difficulty === difficulty);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Get random questions for general quiz
export function getRandomCultureQuestions(count: number): CultureQuestion[] {
  const shuffled = [...cultureQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Get questions by category
export function getCultureQuestionsByCategory(category: string, count: number = 10): CultureQuestion[] {
  const filtered = cultureQuestions.filter(q => q.category === category);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Get millionaire-style ladder (15 questions, progressively harder)
export function getMillionaireLadder(): CultureQuestion[] {
  const level1 = getCultureQuestionsByDifficulty(1, 5);
  const level2 = getCultureQuestionsByDifficulty(2, 4);
  const level3 = getCultureQuestionsByDifficulty(3, 3);
  const level4 = getCultureQuestionsByDifficulty(4, 2);
  const level5 = getCultureQuestionsByDifficulty(5, 1);
  
  return [...level1, ...level2, ...level3, ...level4, ...level5];
}
