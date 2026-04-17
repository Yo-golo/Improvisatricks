document.addEventListener('DOMContentLoaded', function() {
    const stylesData = [
        { style: "À la manière de Molière", explanation: "Reproduit le langage, les intrigues et les caractères comiques du théâtre de Molière." },
        { style: "À la manière de Shakespeare", explanation: "Utilise le style poétique et dramatique de Shakespeare, souvent avec des thèmes de tragédie ou de comédie." },
        { style: "À la manière de Marcel Pagnol", explanation: "Emprunte le ton chaleureux et les personnages typiques de la Provence dans les œuvres de Pagnol." },
        { style: "À la manière de Eugène Ionesco", explanation: "Intègre l'absurdité et la dérision propres aux pièces de Ionesco." },
        { style: "À la manière de Anton Tchekhov", explanation: "Met en scène des drames réalistes avec une tension émotionnelle sous-jacente, typiques de Tchekhov." },
        { style: "À la manière de Franz Kafka", explanation: "Reflète l'absurdité et l'oppression caractéristiques des récits de Kafka." },
        { style: "À la manière d'Alfred Hitchcock", explanation: "Crée un suspense psychologique intense, à la manière des films d'Hitchcock." },
        { style: "À la manière de Charlie Chaplin", explanation: "S'inspire du comique muet et gestuel, typique des films de Chaplin." },
        { style: "À la manière de Quentin Tarantino", explanation: "Utilise des dialogues percutants et des situations de violence stylisée." },
        { style: "À la manière de Jean-Luc Godard", explanation: "Exploite des dialogues décalés et des ruptures narratives innovantes." },
        { style: "À la manière de Lewis Carroll", explanation: "Crée des univers absurdes et fantaisistes, remplis de jeux de mots et de situations insolites." },
        { style: "À la manière de Samuel Beckett", explanation: "Explore l'absurde et l'existentiel, souvent avec des personnages en proie à la solitude et à l'ennui." },
        { style: "À la manière de Victor Hugo", explanation: "Présente des drames épiques avec des thèmes de justice sociale et de grandeur humaine." },
        { style: "À la manière de Steven Spielberg", explanation: "Crée des aventures visuellement captivantes, souvent avec un fort élément émotionnel et fantastique." },
        { style: "À la manière de Federico Fellini", explanation: "S'inspire de l'onirisme et de la fantaisie des films de Fellini, avec une touche de surréalisme." },
        { style: "À la manière de Jules Verne", explanation: "Explore des voyages extraordinaires et des inventions futuristes dans un cadre aventureux." },
        { style: "À la manière de Jean de La Fontaine", explanation: "Utilise des fables et des morales, souvent avec des personnages animaux qui illustrent des leçons de vie." },
        { style: "Commedia dell'arte", explanation: "Reproduit les masques, la gestuelle et les intrigues improvisées de la Commedia dell'arte italienne." },
        { style: "Western", explanation: "Met en scène des cowboys, des duels, et des décors du Far West." },
        { style: "Western spaghetti", explanation: "Style de western à l'italienne, plus sombre, avec des personnages ambigus et une violence exacerbée." },
        { style: "Film noir", explanation: "Imite l'atmosphère sombre, les intrigues criminelles et les personnages ambigus du film noir." },
        { style: "Science-fiction", explanation: "Envisage des récits dans des univers futuristes ou extraterrestres, souvent avec des avancées technologiques." },
        { style: "Mélodrame", explanation: "Accentue les émotions intenses, souvent autour de conflits familiaux ou amoureux." },
        { style: "Sitcom", explanation: "Présente des situations humoristiques dans un cadre quotidien, souvent avec des personnages récurrents." },
        { style: "Documentaire", explanation: "Simule un reportage ou un documentaire avec une narration descriptive et des entretiens." },
        { style: "Opéra", explanation: "Les dialogues et les actions sont chantés, accompagnés parfois de musique." },
        { style: "Soap opera", explanation: "Reproduit des drames relationnels et des intrigues souvent exagérées, typiques des feuilletons télévisés." },
        { style: "Conte de fées", explanation: "Met en scène des récits fantastiques avec des morales simples et des personnages archétypaux." },
        { style: "Super-héros", explanation: "Présente des personnages aux pouvoirs extraordinaires luttant contre le mal." },
        { style: "Film d'horreur", explanation: "Crée une atmosphère de peur, souvent avec des éléments surnaturels ou violents." },
        { style: "Roman d'amour", explanation: "Concentre l'intrigue autour d'une histoire d'amour intense et souvent compliquée." },
        { style: "Théâtre de boulevard", explanation: "Comédie légère avec des quiproquos et des situations cocasses." },
        { style: "Grommelot", explanation: "Langage inventé où l'intonation et les gestes transmettent l'émotion plus que les mots." },
        { style: "Rimée", explanation: "Les dialogues sont composés en rimes, apportant un rythme poétique à l'improvisation." },
        { style: "Chantée", explanation: "Tous les dialogues sont chantés, souvent sur des airs improvisés." },
        { style: "Jukebox", explanation: "Les dialogues sont chantés sur des airs de chansons populaires, avec des styles musicaux imposés." },
        { style: "Texte imposé", explanation: "Un joueur utilise exclusivement un texte préparé à l'avance pour ses dialogues." },
        { style: "Sans parole", explanation: "L'improvisation se fait sans mots, utilisant uniquement des gestes et des sons indistincts." },
        { style: "Silencieuse", explanation: "Aucune parole ou son n'est émis pendant toute l'improvisation." },
        { style: "Playback (doublage américain)", explanation: "Des comédiens jouent sans parler, tandis que d'autres fournissent leurs voix en temps réel." },
        { style: "Gromolo", explanation: "Utilisation d'onomatopées et de sons pour créer des dialogues sans sens réel." },
        { style: "Mimée", explanation: "L'improvisation se fait uniquement par les gestes, sans aucun son ni dialogue." },
        { style: "Croisement", explanation: "Les joueurs échangent leurs personnages lorsque l'arbitre siffle, créant des situations inattendues." },
        { style: "Suicide", explanation: "Chaque joueur doit intégrer un objet et un lieu imposés pour finir son personnage par un suicide." },
        { style: "Mort en scène", explanation: "Le personnage doit mourir à cause d'un objet et dans un lieu imposé, sans obligation de suicide." },
        { style: "Tous meurent à la fin", explanation: "Tous les personnages doivent mourir avant la fin de l'improvisation." },
        { style: "Une Oli", explanation: "Improvisation libre avec des contraintes spécifiques imposées par l'arbitre." },
        { style: "Déplacements limités", explanation: "Les joueurs ne peuvent se déplacer que dans des couloirs prédéfinis par l'arbitre." },
        { style: "Assis, debout, accroupis, couché", explanation: "Chaque joueur doit adopter une posture différente des autres (assis, debout, accroupi, couché)." },
        { style: "Générateur de mots", explanation: "Chaque joueur ne peut utiliser que des mots déjà prononcés par un autre joueur au début de l'impro." },
        { style: "Porno censuré", explanation: "Parodie d'un film porno, sans les scènes explicites, jouant sur le double sens." },
        { style: "Sans limite d'espace", explanation: "Les joueurs ne sont pas limités par l'espace de la scène, pouvant aller et venir librement." },
        { style: "Dans le noir (auditive)", explanation: "L'improvisation se déroule dans l'obscurité complète, se concentrant sur les sons et dialogues." },
        { style: "Abécédaire (inversé ou non)", explanation: "Chaque réplique commence par une lettre de l'alphabet en ordre séquentiel ou inversé." },
        { style: "Switch (répétitive)", explanation: "À chaque coup de sifflet, les joueurs doivent changer le dernier mot ou phrase prononcée." },
        { style: "Zone d'humeurs", explanation: "Différentes zones de la scène sont associées à des humeurs spécifiques, les joueurs adoptent l'humeur en place." },
        { style: "Grosse colère", explanation: "Les joueurs commencent calmement, puis leur colère monte progressivement jusqu'à l'explosion finale." },
        { style: "Humeur imposée", explanation: "Chaque joueur reçoit une humeur spécifique qu'il doit maintenir tout au long de l'improvisation." },
        { style: "Poursuite", explanation: "Une équipe commence une improvisation, l'autre équipe la termine." },
        { style: "Double-poursuite", explanation: "Chaque équipe joue deux fois, suivant un schéma A-B-A-B." },
        { style: "Roman-photo", explanation: "L'improvisation se joue en plans arrêtés (photos), accompagnés de voix-off." },
        { style: "Fusillade", explanation: "Les joueurs improvisent brièvement sur des thèmes différents, sans temps de préparation." },
        { style: "Peau de chagrin (régressive)", explanation: "Une même improvisation est rejouée plusieurs fois, avec une durée réduite à chaque reprise." },
        { style: "Zapping télé (vidéo-way)", explanation: "L'arbitre change de chaîne (groupe) à volonté, modifiant l'improvisation en cours." },
        { style: "Étages (Montage/Démontage)", explanation: "Chaque étage de la scène représente un thème différent, et l'arbitre peut changer d'étage à tout moment." },
        { style: "Téléphone arabe mimé", explanation: "Une histoire est mimée de joueur en joueur, et se déforme au fil de la transmission." },
        { style: "Harold", explanation: "Un personnage absent mais central est évoqué par tous les autres, sans jamais apparaître." },
        { style: "Carré hollandais", explanation: "Quatre improvisateurs alternent les scènes avec différents thèmes sur chaque côté du carré." },
        { style: "Village", explanation: "Les personnages, définis par leurs métiers ou rôles, construisent une histoire commune dans un même village." },
        { style: "Traveling", explanation: "L'improvisation suit chaque personnage lorsqu'il sort de scène, poursuivant l'histoire sur lui." },
        { style: "Points de vue", explanation: "Une même histoire est racontée successivement selon le point de vue de différents personnages." },
        { style: "Taxi", explanation: "Un joueur installe un lieu, et les autres improvisateurs interviennent successivement avec lui." },
        { style: "Trois-Têtes", explanation: "Trois joueurs incarnent un seul personnage, chacun ajoutant un mot à la suite du précédent." },
        { style: "Avec exagération", explanation: "L'improvisation est rejouée plusieurs fois, chaque fois avec une exagération croissante des actions et dialogues." },
        { style: "Budget dégressif", explanation: "L'improvisation est rejouée plusieurs fois, avec un budget de plus en plus réduit, modifiant les accessoires et décors." },
        { style: "-1", explanation: "Une même improvisation est rejouée plusieurs fois, en retirant un joueur à chaque fois." },
        { style: "Cuisine et dépendance", explanation: "La scène est divisée en deux pièces mitoyennes avec des personnages passant d'une pièce à l'autre." },
        { style: "Musicale (avec ambiance musicale)", explanation: "Les joueurs doivent intégrer une ambiance musicale dans leur improvisation, comme une bande sonore de film." },
        { style: "Objet détourné (Accessoire)", explanation: "Les objets donnés par l'arbitre ne doivent pas être utilisés pour leur fonction d'origine." },
        { style: "Objets imposés (Profusion d'objets)", explanation: "Une dizaine d'objets doivent être intégrés dans l'improvisation, chacun ayant une nouvelle fonction." }
    ];

    const stylesBody = document.getElementById('styles-body');

    stylesData.forEach(styleInfo => {
        const row = document.createElement('tr');

        const styleCell = document.createElement('td');
        styleCell.textContent = styleInfo.style;
        styleCell.setAttribute('data-label', 'Style d\'improvisation');

        const explanationCell = document.createElement('td');
        explanationCell.textContent = styleInfo.explanation;
        explanationCell.setAttribute('data-label', 'Brève explication');

        row.appendChild(styleCell);
        row.appendChild(explanationCell);
        stylesBody.appendChild(row);
    });
});