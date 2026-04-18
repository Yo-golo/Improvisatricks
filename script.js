// Drawer styles d'improvisation
function openStylesDrawer() {
    document.getElementById('styles-drawer').classList.add('open');
    document.getElementById('drawer-backdrop').classList.add('open');
    document.getElementById('styles-drawer').setAttribute('aria-hidden', 'false');
}

function closeStylesDrawer() {
    document.getElementById('styles-drawer').classList.remove('open');
    document.getElementById('drawer-backdrop').classList.remove('open');
    document.getElementById('styles-drawer').setAttribute('aria-hidden', 'true');
}

window.addEventListener('message', e => {
    if (e.data === 'close-styles-drawer') closeStylesDrawer();
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('styles-info-btn')?.addEventListener('click', openStylesDrawer);
    document.getElementById('drawer-close-btn')?.addEventListener('click', closeStylesDrawer);
    document.getElementById('drawer-backdrop')?.addEventListener('click', closeStylesDrawer);
});

// Système de modale custom
function showModal({ title, message, icon, buttons }) {
    return new Promise(resolve => {
        const overlay = document.getElementById('modal-overlay');
        document.getElementById('modal-title').textContent = title || '';
        document.getElementById('modal-message').textContent = message || '';
        const iconEl = document.getElementById('modal-icon');
        iconEl.textContent = icon || '';
        iconEl.style.display = icon ? '' : 'none';

        const btnsEl = document.getElementById('modal-buttons');
        btnsEl.innerHTML = '';
        buttons.forEach(btn => {
            const el = document.createElement('button');
            el.textContent = btn.label;
            el.className = btn.className || '';
            el.addEventListener('click', () => {
                overlay.classList.add('modal-closing');
                setTimeout(() => {
                    overlay.classList.add('hidden');
                    overlay.classList.remove('modal-visible', 'modal-closing');
                }, 180);
                resolve(btn.value);
            });
            btnsEl.appendChild(el);
        });

        overlay.classList.remove('hidden');
        overlay.classList.remove('modal-closing');
    });
}

function showAlert(message, title = 'Information', icon = '') {
    return showModal({
        title, message, icon,
        buttons: [{ label: 'OK', className: 'modal-btn-primary', value: true }]
    });
}

function showConfirm(message, title = 'Confirmation') {
    return showModal({
        title, message,
        buttons: [
            { label: 'Annuler',      className: 'modal-btn-secondary', value: false },
            { label: 'Réinitialiser', className: 'modal-btn-danger',   value: true  }
        ]
    });
}

// Variables globales pour stocker les données des joueurs et des équipes
let playerCount = 0;
let players = [];
let teams = [];
let scores = [0, 0]; // Initialisation des scores pour les deux équipes
let roundNumber = 0;
let selectedVoteIndex = null;
let compareePhase = 0;       // 0 = normal, 1 = équipe 1 en cours, 2 = équipe 2 en cours
let compareeFirstTeam = 0;   // index (0 ou 1) de l'équipe qui joue en premier

// Variables pour gérer l'état de pause
let isPaused = false;
let improInterval;
let timeLeft;

// Initialisation des objets Audio avec les chemins corrects
const audio30Sec = new Audio('./snd/signal_30_sec.mp3');
const audio10Sec = new Audio('./snd/signal_10_sec.mp3');
const audioFinImpro = new Audio('./snd/fin_impro.mp3');
const audioConcertation = new Audio('./snd/concertation.mp3');
const audioDingStart = new Audio('./snd/ding-start.mp3');

// Liste des challenges possibles
const CHALLENGES = [
    'À cloche-pied',
    'Avec l\'accent Canadien',
    'Parler en vers',
    'En accéléré',
    'Muet',
    'Roman photo',
    'Avec l\'accent americain',
    'Avec l\'accent pied noir',
    'Tous le monde assis',
    'Toute la réserve entre en scène'
];

// Objet pour stocker les références DOM
const DOM = {
    playerButtons: null,
    nameEntrySection: null,
    playerForm: null,
    teamsDisplaySection: null,
    team1Display: null,
    team2Display: null,
    roundSetupSection: null,
    playersPerTeamSelect: null,
    countdownSection: null,
    timer: null,
    improSummarySection: null,
    improDetails: null,
    improTimerSection: null,
    improTimerDisplay: null,
    voteSection: null,
    voteBtn: null,
    startImproBtn: null,
    stylesInfoBtn: null,
    submitNamesBtn: null,
    reshuffleTeamsBtn: null,
    teamsVoteContainer: null,
    challengeBtn: null,
    endImproBtn: null,
    pauseResumeBtn: null,
    resetBtn: null,
    scoreDisplay: null,
    scoreTeam1: null,
    scoreTeam2: null,
    nullRoundBtn: null,
    nextRoundBtn: null,
    durationSelect: null,
    improTypeSelect: null,
    styleSelect: null,
    subjectSelect: null,
    randomizeRoundBtn: null,
    startRoundBtn: null,
    startConcertationBtn: null,
    startDirectImproBtn: null,
    voteBtn: null,
    playerSelectionSection: null,
    headerTitle: null,    // Added
    headerSubtitle: null  // Added
};

// Fonction pour initialiser les références DOM
function initializeDOMElements() {
    console.log('Initializing DOM elements');
    
    // Sélection des boutons de joueurs
    DOM.playerButtons = document.querySelectorAll('.player-btn');
    console.log('Found player buttons:', DOM.playerButtons.length);
    
    // Sections principales
    DOM.nameEntrySection = document.getElementById('name-entry');
    DOM.playerForm = document.getElementById('player-form');
    DOM.playerSelectionSection = document.querySelector('.player-selection');
    DOM.teamsDisplaySection = document.getElementById('teams-display');
    DOM.roundSetupSection = document.getElementById('round-setup');
    DOM.countdownSection = document.getElementById('countdown');
    DOM.improSummarySection = document.getElementById('impro-summary');
    DOM.improTimerSection = document.getElementById('impro-timer');
    DOM.voteSection = document.getElementById('vote-section');
    
    // Affichage des équipes
    DOM.team1Display = document.getElementById('team1-display');
    DOM.team2Display = document.getElementById('team2-display');
    
    // Éléments de configuration
    DOM.playersPerTeamSelect = document.getElementById('players-per-team');
    DOM.durationSelect = document.getElementById('duration');
    DOM.improTypeSelect = document.getElementById('impro-type');
    DOM.styleSelect = document.getElementById('style');
    DOM.subjectSelect = document.getElementById('subject');
    
    // Éléments de timer et affichage
    DOM.timer = document.getElementById('timer');
    DOM.improDetails = document.getElementById('impro-details');
    DOM.improTimerDisplay = document.getElementById('impro-timer-display');
    
    // Boutons
    DOM.voteBtn = document.getElementById('vote-btn');
    DOM.startImproBtn = document.getElementById('start-impro');
    DOM.stylesInfoBtn = document.getElementById('styles-info-btn');
    DOM.submitNamesBtn = document.getElementById('submit-names');
    DOM.reshuffleTeamsBtn = document.getElementById('reshuffle-teams');
    DOM.challengeBtn = document.getElementById('challenge-btn');
    DOM.endImproBtn = document.getElementById('end-impro-btn');
    DOM.pauseResumeBtn = document.getElementById('pause-resume-btn');
    DOM.resetBtn = document.getElementById('reset-btn');
    DOM.scoreDisplay = document.getElementById('score-display');
    DOM.scoreTeam1 = document.getElementById('score-team1');
    DOM.scoreTeam2 = document.getElementById('score-team2');
    DOM.nullRoundBtn = document.getElementById('null-round-btn');
    DOM.nextRoundBtn = document.getElementById('next-round-btn');
    DOM.randomizeRoundBtn = document.getElementById('randomize-round');
    DOM.startRoundBtn = document.getElementById('start-round');
    DOM.startConcertationBtn = document.getElementById('start-concertation');
    DOM.startDirectImproBtn = document.getElementById('start-direct-impro');
    
    // En-tête
    DOM.headerTitle = document.querySelector('header h1');
    DOM.headerSubtitle = document.querySelector('header p');

    // Log des éléments non trouvés
    console.log('DOM Elements status:');
    Object.entries(DOM).forEach(([key, value]) => {
        if (!value) {
            console.error(`Missing DOM element: ${key}`);
        }
    });

    // Initialiser les écouteurs d'événements
    setupEventListeners();
}

// Fonction pour masquer ou afficher un élément
function toggleVisibility(element, isVisible) {
    if (!element) {
        console.error('Element is null in toggleVisibility. Stack trace:', new Error().stack);
        return;
    }
    
    if (isVisible) {
        element.classList.remove('hidden');
    } else {
        element.classList.add('hidden');
    }
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    console.log('Setting up event listeners');

    // Gestionnaire de clic pour les boutons de sélection du nombre de joueurs
    if (DOM.playerButtons && DOM.playerButtons.length > 0) {
        DOM.playerButtons.forEach(button => {
            console.log('Adding click listener to button:', button.textContent);
            button.addEventListener('click', (e) => {
                console.log('Button clicked!', e.target);
                const players = parseInt(button.getAttribute('data-players'));
                console.log('Number of players selected:', players);
                playerCount = players;
                displayPlayerForm(players);
                saveGameState();
            });
        });
    } else {
        console.error('Player buttons not found in setupEventListeners!');
    }

    // Gestion du bouton Reset
    if (DOM.resetBtn) {
        DOM.resetBtn.addEventListener('click', async () => {
            if (await showConfirm('Voulez-vous vraiment réinitialiser le jeu ?', 'Réinitialiser ?')) {
                resetGame();
            }
        });
    }

    // Gestion du bouton Terminer
    if (DOM.endImproBtn) {
        DOM.endImproBtn.addEventListener('click', () => {
            timeLeft = 10;
            isPaused = false;
            DOM.improTimerDisplay.textContent = formatTime(timeLeft);
            playSound(audio10Sec);
            DOM.endImproBtn.style.display = 'none';
        });
    }

    // Gestion du bouton Challenge
    if (DOM.challengeBtn) {
        DOM.challengeBtn.addEventListener('click', () => {
            const challenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
            showAlert(challenge, 'Challenge !', '⚡');
        });
    }

    // Gestion du bouton Pause/Reprise
    if (DOM.pauseResumeBtn) {
        DOM.pauseResumeBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            DOM.pauseResumeBtn.textContent = isPaused ? 'Reprise' : 'Pause';
        });
    }

    // Gestionnaire de clic pour le bouton de validation des noms
    if (DOM.submitNamesBtn) {
        DOM.submitNamesBtn.addEventListener('click', () => {
            console.log('=== CLIC VALIDER ===');
            console.log('playerCount:', playerCount);
            const inputs = Array.from(DOM.playerForm.querySelectorAll('input'));
            console.log('inputs trouvés:', inputs.length);
            players = inputs
                           .map(input => input.value.trim())
                           .filter(name => name.length > 0);
            console.log('players:', players);

            if (players.length === playerCount) {
                generateTeams();
                saveGameState();
            } else {
                showAlert(`${players.length} noms saisis pour ${playerCount} joueurs attendus.`, 'Attention', '⚠️');
            }
        });
    }

    // Gestionnaire de clic pour le bouton "Refaire les équipes"
    if (DOM.reshuffleTeamsBtn) {
        DOM.reshuffleTeamsBtn.addEventListener('click', generateTeams);
    }

    // Gestionnaire de clic pour le bouton "OK" (lancer la configuration de la manche)
    if (DOM.startRoundBtn) {
        DOM.startRoundBtn.addEventListener('click', showRoundSetup);
    }

    // Gestion du bouton "Hasard"
    if (DOM.randomizeRoundBtn) {
        DOM.randomizeRoundBtn.addEventListener('click', () => {
            const styleSelect = document.getElementById('style');
            const subjectSelect = document.getElementById('subject');
            const improTypeSelect = document.getElementById('impro-type');
            const durationSelect = document.getElementById('duration');

            if (styleSelect && styleSelect.options.length > 0) {
                const randomStyleIndex = Math.floor(Math.random() * styleSelect.options.length);
                styleSelect.selectedIndex = randomStyleIndex;
            }

            if (subjectSelect && subjectSelect.options.length > 0) {
                const randomSubjectIndex = Math.floor(Math.random() * subjectSelect.options.length);
                subjectSelect.selectedIndex = randomSubjectIndex;
            }

            if (improTypeSelect && improTypeSelect.options.length > 0) {
                const randomTypeIndex = Math.floor(Math.random() * improTypeSelect.options.length);
                improTypeSelect.selectedIndex = randomTypeIndex;
            }

            if (durationSelect && durationSelect.options.length > 0) {
                const randomDurationIndex = Math.floor(Math.random() * durationSelect.options.length);
                durationSelect.selectedIndex = randomDurationIndex;
            }
        });
    }

    // Gérer le bouton "Concertation"
    if (DOM.startConcertationBtn) {
        DOM.startConcertationBtn.addEventListener('click', async () => {
            if (DOM.improTypeSelect.value === 'comparee' && compareePhase === 0) {
                await handleCompareeSetup();
            } else {
                startConcertation();
            }
        });
    }

    // Gérer le bouton "Impro directe"
    if (DOM.startDirectImproBtn) {
        DOM.startDirectImproBtn.addEventListener('click', async () => {
            if (DOM.improTypeSelect.value === 'comparee' && compareePhase === 0) {
                await handleCompareeSetup();
            } else {
                startDirectImpro();
            }
        });
    }

    // Gestion du bouton "Démarrer l'impro"
    if (DOM.startImproBtn) {
        DOM.startImproBtn.addEventListener('click', startImprovisation);
    }

    // Gestion du bouton de vote
    if (DOM.voteBtn) {
        DOM.voteBtn.addEventListener('click', displayVoteOptions);
    }

    // Gestion du bouton "Prochaine manche" (confirme le vote sélectionné)
    if (DOM.nextRoundBtn) {
        DOM.nextRoundBtn.addEventListener('click', async () => {
            if (selectedVoteIndex !== null) {
                scores[selectedVoteIndex]++;
                updateScoreDisplay();
                if (await checkForWinner()) return;
            }
            resetRoundSetup();
        });
    }
}

// Fonction pour afficher le formulaire de saisie des noms avec des valeurs par défaut
function displayPlayerForm(count) {
    console.log('Displaying player form for', count, 'players');
    toggleVisibility(DOM.playerSelectionSection, false);
    DOM.playerForm.innerHTML = ''; // Réinitialiser le formulaire
    
    for (let i = 1; i <= count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Nom du joueur ${i}`;
        input.required = true;
        input.id = `player${i}`;
        input.value = `Joueur ${i}`; // Pré-remplir avec "Joueur X"
        DOM.playerForm.appendChild(input);
    }
    
    toggleVisibility(DOM.nameEntrySection, true);
}

// Fonction pour afficher la section de configuration des manches
function showRoundSetup() {
    toggleVisibility(DOM.teamsDisplaySection, false);
    toggleVisibility(DOM.playerSelectionSection, false);
    toggleVisibility(DOM.roundSetupSection, true);
    
    // Update header text
    roundNumber++;
    DOM.headerTitle.textContent = 'Improvisatricks';
    DOM.headerSubtitle.textContent = `Match en cours — Manche N°${roundNumber}`;
    
    // Mise à jour du sélecteur de joueurs par équipe
    const maxPlayersPerTeam = Math.floor(playerCount / 2);
    DOM.playersPerTeamSelect.innerHTML = '';
    
    for (let i = 1; i <= maxPlayersPerTeam; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        DOM.playersPerTeamSelect.appendChild(option);
    }
    
    // Sélectionner par défaut le nombre maximum de joueurs
    DOM.playersPerTeamSelect.value = maxPlayersPerTeam;

    // Charger les données CSV si nécessaire
    loadCSVData();
}

// Fonction pour démarrer une improvisation directe
function startDirectImpro() {
    console.log('Starting direct impro');
    const duration = DOM.durationSelect.value;
    const playersPerTeam = DOM.playersPerTeamSelect.value;
    const improType = DOM.improTypeSelect.value;
    const style = DOM.styleSelect.value;
    const subject = DOM.subjectSelect.value;

    // Mettre à jour le résumé de l'improvisation
    const improSummaryContent = `Une improvisation de ${duration} secondes, pour ${playersPerTeam} joueur(s) par équipe, de nature ${improType}, dans le style "${style}" et avec pour sujet "${subject}".`;
    
    if (DOM.improDetails) {
        DOM.improDetails.textContent = improSummaryContent;
    }
    
    // Masquer toutes les sections non nécessaires
    toggleVisibility(DOM.roundSetupSection, false);
    toggleVisibility(DOM.countdownSection, false);
    toggleVisibility(DOM.playerSelectionSection, false);
    
    // Afficher le timer avec le résumé
    toggleVisibility(DOM.improTimerSection, true);
    
    // Masquer les contrôles du timer pour l'instant
    if (DOM.pauseResumeBtn) DOM.pauseResumeBtn.style.display = 'none';
    if (DOM.challengeBtn) DOM.challengeBtn.style.display = 'none';
    if (DOM.endImproBtn) DOM.endImproBtn.style.display = 'none';
    
    // Afficher le bouton de démarrage
    if (DOM.startImproBtn) {
        DOM.startImproBtn.style.display = 'block';
    }
}

// Fonction pour terminer la concertation
function endConcertation() {
    console.log('Ending concertation');
    const duration = DOM.durationSelect.value;
    const playersPerTeam = DOM.playersPerTeamSelect.value;
    const improType = DOM.improTypeSelect.value;
    const style = DOM.styleSelect.value;
    const subject = DOM.subjectSelect.value;

    // Mettre à jour le résumé de l'improvisation
    const improSummaryContent = `Une improvisation de ${duration} secondes, pour ${playersPerTeam} joueur(s) par équipe, de nature ${improType}, dans le style "${style}" et avec pour sujet "${subject}".`;
    
    if (DOM.improDetails) {
        DOM.improDetails.textContent = improSummaryContent;
    }
    
    // Masquer toutes les sections non nécessaires
    toggleVisibility(DOM.countdownSection, false);
    toggleVisibility(DOM.roundSetupSection, false);
    toggleVisibility(DOM.playerSelectionSection, false);
    
    // Afficher le timer avec le résumé
    toggleVisibility(DOM.improTimerSection, true);
    
    // Masquer les contrôles du timer pour l'instant
    if (DOM.pauseResumeBtn) DOM.pauseResumeBtn.style.display = 'none';
    if (DOM.challengeBtn) DOM.challengeBtn.style.display = 'none';
    if (DOM.endImproBtn) DOM.endImproBtn.style.display = 'none';
    
    // Afficher le bouton de démarrage
    if (DOM.startImproBtn) {
        DOM.startImproBtn.style.display = 'block';
    }
}

// Fonction pour démarrer l'improvisation
function startImprovisation() {
    console.log('Starting improvisation');
    playSound(audioDingStart);
    const duration = parseInt(DOM.durationSelect.value);

    // Afficher les contrôles du timer
    if (DOM.pauseResumeBtn) DOM.pauseResumeBtn.style.display = 'block';
    if (DOM.challengeBtn) DOM.challengeBtn.style.display = 'block';
    if (DOM.endImproBtn) DOM.endImproBtn.style.display = 'block';

    // Masquer le bouton de démarrage
    if (DOM.startImproBtn) {
        DOM.startImproBtn.style.display = 'none';
    }
    
    DOM.improTimerDisplay.textContent = formatTime(duration);
    timeLeft = duration;

    // Démarrage du compte à rebours
    if (improInterval) {
        clearInterval(improInterval);
    }

    improInterval = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            DOM.improTimerDisplay.textContent = formatTime(timeLeft);

            if (timeLeft === 30) {
                playSound(audio30Sec);
            }
            
            if (timeLeft === 10) {
                playSound(audio10Sec);
            }

            if (timeLeft <= 0) {
                clearInterval(improInterval);
                playSound(audioFinImpro);
                if (DOM.pauseResumeBtn) DOM.pauseResumeBtn.style.display = 'none';
                if (DOM.challengeBtn) DOM.challengeBtn.style.display = 'none';
                if (DOM.endImproBtn) DOM.endImproBtn.style.display = 'none';
                setTimeout(() => {
                    if (compareePhase === 1) {
                        showCompareeTransition();
                    } else {
                        toggleVisibility(DOM.voteBtn, true);
                    }
                }, 5000);
            }
        }
    }, 1000);
}

// ── Impro comparée ──────────────────────────────────────────────────────────

// Modale 1 : choix de l'équipe qui commence + mode de jeu
async function handleCompareeSetup() {
    // Étape 1 — Qui commence ?
    const teamChoice = await showModal({
        title: 'Impro comparée',
        icon: '🔀',
        message: `${teams[0].join(', ')}  vs  ${teams[1].join(', ')}\n\nQuelle équipe commence ?`,
        buttons: [
            { label: 'Équipe 1',    value: 0,        className: 'modal-btn-secondary' },
            { label: '🎲 Au sort',  value: 'random', className: 'modal-btn-primary'   },
            { label: 'Équipe 2',    value: 1,        className: 'modal-btn-secondary' }
        ]
    });

    compareeFirstTeam = (teamChoice === 'random')
        ? Math.floor(Math.random() * 2)
        : Number(teamChoice);

    // Étape 2 — Mode de jeu pour l'équipe 1
    const modeChoice = await showModal({
        title: `Équipe ${compareeFirstTeam + 1} commence`,
        icon: '▶️',
        message: `Mode de jeu pour l'Équipe ${compareeFirstTeam + 1} :`,
        buttons: [
            { label: 'Concertation',  value: 'concertation', className: 'modal-btn-secondary' },
            { label: 'Impro directe', value: 'direct',       className: 'modal-btn-primary'   }
        ]
    });

    compareePhase = 1;
    DOM.headerSubtitle.textContent =
        `Match en cours — Manche N°${roundNumber} · Impro comparée (1/2)`;

    if (modeChoice === 'concertation') {
        startConcertation();
    } else {
        startDirectImpro();
    }
}

// Modale 2 : transition vers l'équipe 2 après la fin de la première impro
async function showCompareeTransition() {
    const secondTeam = 1 - compareeFirstTeam;
    const style        = DOM.styleSelect.value;
    const subject      = DOM.subjectSelect.value;
    const duration     = DOM.durationSelect.value;
    const playersPerTeam = DOM.playersPerTeamSelect.value;

    const recap = `Style : ${style}\nSujet : ${subject}\nDurée : ${duration}s — ${playersPerTeam} joueur(s) par équipe`;

    const modeChoice = await showModal({
        title: `Au tour de l'Équipe ${secondTeam + 1}`,
        icon: '🔀',
        message: `Rappel de l'impro :\n${recap}\n\nMode de jeu pour l'Équipe ${secondTeam + 1} :`,
        buttons: [
            { label: 'Concertation',  value: 'concertation', className: 'modal-btn-secondary' },
            { label: 'Impro directe', value: 'direct',       className: 'modal-btn-primary'   }
        ]
    });

    compareePhase = 2;
    DOM.headerSubtitle.textContent =
        `Match en cours — Manche N°${roundNumber} · Impro comparée (2/2)`;

    if (modeChoice === 'concertation') {
        startConcertation();
    } else {
        startDirectImpro();
    }
}

// ────────────────────────────────────────────────────────────────────────────

// Fonction pour afficher les options de vote pour les équipes
function displayVoteOptions() {
    selectedVoteIndex = null;
    toggleVisibility(DOM.improTimerSection, false);
    toggleVisibility(DOM.voteBtn, false);
    toggleVisibility(DOM.voteSection, true);
    toggleVisibility(DOM.nullRoundBtn, false);
    toggleVisibility(DOM.nextRoundBtn, false);

    const teamsVoteContainer = document.getElementById('teams-vote');
    teamsVoteContainer.innerHTML = '';

    teamsVoteContainer.appendChild(createTeamCard(0, teams[0], scores[0]));

    // Bouton "Match nul" entre les deux cartes
    const nullBtn = document.createElement('button');
    nullBtn.className = 'btn-null-inline';
    nullBtn.textContent = 'Match nul';
    nullBtn.addEventListener('click', async () => {
        scores[0]++;
        scores[1]++;
        updateScoreDisplay();
        if (await checkForWinner()) return;
        resetRoundSetup();
    });
    teamsVoteContainer.appendChild(nullBtn);

    teamsVoteContainer.appendChild(createTeamCard(1, teams[1], scores[1]));
}

// Fonction pour créer une carte d'équipe
function createTeamCard(index, team, score) {
    const teamCard = document.createElement('div');
    teamCard.classList.add('team-card');
    teamCard.innerHTML = `
        <h3>Équipe ${index + 1}</h3>
        <p>${team.join(', ')}</p>
        ${score > 0 ? `<p>Points: ${score}</p>` : ''}
    `;

    teamCard.addEventListener('click', async () => {
        if (scores[index] + 1 >= 5) {
            scores[index]++;
            updateScoreDisplay();
            await checkForWinner();
            return;
        }
        document.querySelectorAll('#teams-vote .team-card').forEach(c => c.classList.remove('selected'));
        teamCard.classList.add('selected');
        selectedVoteIndex = index;
        toggleVisibility(DOM.nextRoundBtn, true);
    });

    return teamCard;
}

// Fonction pour vérifier si une équipe a gagné — retourne true si la partie est terminée
async function checkForWinner() {
    const winningTeamIndex = scores.findIndex(score => score >= 5);
    if (winningTeamIndex >= 0) {
        await showAlert(`L'équipe ${winningTeamIndex + 1} a gagné !`, 'Victoire !', '🏆');
        resetGame();
        return true;
    }
    return false;
}

// Fonction pour réinitialiser la configuration de la manche pour la prochaine manche
function resetRoundSetup() {
    compareePhase = 0;
    roundNumber++;
    DOM.headerSubtitle.textContent = `Match en cours — Manche N°${roundNumber}`;
    toggleVisibility(DOM.voteSection, false);
    toggleVisibility(DOM.improTimerSection, false);
    toggleVisibility(DOM.improSummarySection, false);
    toggleVisibility(DOM.roundSetupSection, true);
    toggleVisibility(DOM.nextRoundBtn, false);
    toggleVisibility(DOM.nullRoundBtn, false);
}

// Fonction pour réinitialiser le jeu
function resetGame() {
    // Réinitialisation des variables globales
    playerCount = 0;
    players = [];
    teams = [];
    scores = [0, 0];
    roundNumber = 0;
    selectedVoteIndex = null;
    compareePhase = 0;
    compareeFirstTeam = 0;
    isPaused = false;
    
    // Réinitialisation de l'affichage
    toggleVisibility(DOM.playerSelectionSection, true);
    toggleVisibility(DOM.nameEntrySection, false);
    toggleVisibility(DOM.scoreDisplay, false);
    toggleVisibility(DOM.teamsDisplaySection, false);
    toggleVisibility(DOM.roundSetupSection, false);
    toggleVisibility(DOM.countdownSection, false);
    toggleVisibility(DOM.improTimerSection, false);
    toggleVisibility(DOM.voteSection, false);
    toggleVisibility(DOM.improSummarySection, false);
    toggleVisibility(DOM.nextRoundBtn, false);
    toggleVisibility(DOM.nullRoundBtn, false);
    
    // Réinitialisation du header
    DOM.headerTitle.textContent = 'Bienvenue sur Improvisatricks';
    DOM.headerSubtitle.textContent = 'Cliquez sur le nombre de joueurs pour commencer le match';
    
    // Hide team columns and buttons
    if (DOM.team1Display) DOM.team1Display.style.display = 'none';
    if (DOM.team2Display) DOM.team2Display.style.display = 'none';
    if (DOM.reshuffleTeamsBtn) DOM.reshuffleTeamsBtn.style.display = 'none';
    if (DOM.startRoundBtn) DOM.startRoundBtn.style.display = 'none';
    
    // Réinitialisation du formulaire des joueurs
    DOM.playerForm.innerHTML = '';
    
    // Réinitialisation de l'affichage des équipes
    if (DOM.team1Display) DOM.team1Display.innerHTML = '';
    if (DOM.team2Display) DOM.team2Display.innerHTML = '';
    
    // Réinitialisation des boutons et contrôles
    if (DOM.pauseResumeBtn) DOM.pauseResumeBtn.textContent = 'Pause';
    
    // Arrêt du timer s'il est en cours
    if (improInterval) {
        clearInterval(improInterval);
        improInterval = null;
    }
    
    // Sauvegarde de l'état réinitialisé
    saveGameState();
}

// Fonction pour charger les fichiers CSV et remplir les sélecteurs
function loadCSVData() {
    // Vérifier si les sélecteurs sont déjà remplis
    const styleSelect = document.getElementById('style');
    const subjectSelect = document.getElementById('subject');

    if (styleSelect && styleSelect.options.length === 0) {
        Papa.parse("styles.csv", {
            download: true,
            header: true,
            complete: function(results) {
                populateSelect('style', results.data, 'style');
            },
            error: function(error) {
                console.error("Erreur lors du chargement des styles :", error);
            }
        });
    }

    if (subjectSelect && subjectSelect.options.length === 0) {
        Papa.parse("sujets.csv", {
            download: true,
            header: true,
            complete: function(results) {
                populateSelect('subject', results.data, 'sujet');
            },
            error: function(error) {
                console.error("Erreur lors du chargement des sujets :", error);
            }
        });
    }
}

function populateSelect(selectId, data, key) {
    const select = document.getElementById(selectId);
    data.forEach(row => {
        const option = document.createElement('option');
        option.value = row[key].trim();
        option.textContent = row[key].trim();
        select.appendChild(option);
    });
}

function updateScoreDisplay() {
    if (DOM.scoreTeam1) DOM.scoreTeam1.textContent = `Éq. 1 : ${scores[0]}`;
    if (DOM.scoreTeam2) DOM.scoreTeam2.textContent = `Éq. 2 : ${scores[1]}`;
}

// Formate un nombre de secondes en mm:ss
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Fonction pour obtenir un élément aléatoire d'un tableau
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Fonction pour jouer un son avec gestion d'erreur
async function playSound(audioObject) {
    console.log('Tentative de lecture du son:', audioObject.src);
    console.log('État initial de l\'audio:', {
        readyState: audioObject.readyState,
        paused: audioObject.paused,
        currentTime: audioObject.currentTime,
        duration: audioObject.duration
    });

    try {
        const playPromise = audioObject.play();
        console.log('Promise de lecture obtenue');
        
        await playPromise;
        console.log('Son joué avec succès');
    } catch (error) {
        console.error('Erreur lors de la lecture du son:', error);
        console.log('État de l\'audio après erreur:', {
            readyState: audioObject.readyState,
            paused: audioObject.paused,
            currentTime: audioObject.currentTime,
            duration: audioObject.duration
        });

        // Réessayer de charger et jouer le son
        console.log('Rechargement du son...');
        audioObject.load();
        
        try {
            await audioObject.play();
            console.log('Son joué avec succès après rechargement');
        } catch (retryError) {
            console.error('Échec de la seconde tentative:', retryError);
            console.log('État final de l\'audio:', {
                readyState: audioObject.readyState,
                paused: audioObject.paused,
                currentTime: audioObject.currentTime,
                duration: audioObject.duration
            });
        }
    }
}

// Fonction pour démarrer la concertation
function startConcertation() {
    console.log('Starting concertation');
    const duration = 30; // 30 secondes de concertation
    
    // Masquer les sections non nécessaires
    toggleVisibility(DOM.roundSetupSection, false);
    toggleVisibility(DOM.improSummarySection, false);
    toggleVisibility(DOM.improTimerSection, false);
    toggleVisibility(DOM.playerSelectionSection, false);
    
    // Afficher la section de compte à rebours
    toggleVisibility(DOM.countdownSection, true);
    
    // Jouer le son de concertation
    playSound(audioConcertation);
    
    // Démarrer le compte à rebours
    startCountdown(duration, DOM.timer, endConcertation);
}

// Fonction pour démarrer le compte à rebours
function startCountdown(duration, displayElement, callback) {
    let timeLeft = duration;
    displayElement.textContent = formatTime(timeLeft);

    const countdownInterval = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            displayElement.textContent = formatTime(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                callback();
            }
        }
    }, 1000);
}

// Fonction pour sauvegarder l'état du jeu
function saveGameState() {
    const gameState = {
        playerCount,
        players,
        teams,
        scores,
        isPaused,
        timeLeft
    };
    console.log('Saving state:', gameState);
    localStorage.setItem('improvisatricksState', JSON.stringify(gameState));
}

// Fonction pour restaurer l'état du jeu
function restoreGameState() {
    try {
        const savedState = localStorage.getItem('improvisatricksState');
        console.log('Retrieved state:', savedState);
        
        if (savedState) {
            const state = JSON.parse(savedState);
            playerCount = state.playerCount;
            players = state.players;
            teams = state.teams;
            scores = state.scores;
            isPaused = state.isPaused;
            timeLeft = state.timeLeft;

            // Restaurer l'interface utilisateur selon l'état
            if (teams.length > 0) {
                displayTeams();
            } else if (players.length > 0) {
                displayPlayerForm(playerCount);
            }
        }
    } catch (error) {
        console.error('Error restoring state:', error);
    }
}

// Fonction pour obtenir la section actuellement visible
function getCurrentSection() {
    for (const [key, element] of Object.entries(DOM)) {
        if (element && element.classList && !element.classList.contains('hidden') && key.includes('Section')) {
            return key;
        }
    }
    return null;
}

// Fonction pour générer et afficher les équipes
function generateTeams() {
    teams = [[], []]; // Réinitialiser les équipes

    // Mélanger les joueurs aléatoirement
    players = players.sort(() => Math.random() - 0.5);

    // Répartir les joueurs dans les deux équipes
    players.forEach((player, index) => {
        teams[index % 2].push(player);
    });

    displayTeams();
}

// Fonction pour afficher les équipes sur la page
function displayTeams() {
    toggleVisibility(DOM.nameEntrySection, false);
    toggleVisibility(DOM.scoreDisplay, true);
    updateScoreDisplay();

    // Clear and update team displays
    DOM.team1Display.innerHTML = `<h2>Équipe 1</h2><p>${teams[0].join(', ')}</p>`;
    DOM.team2Display.innerHTML = `<h2>Équipe 2</h2><p>${teams[1].join(', ')}</p>`;

    // Show the teams display section and enable the team columns
    toggleVisibility(DOM.teamsDisplaySection, true);
    DOM.team1Display.style.display = 'block';
    DOM.team2Display.style.display = 'block';
    
    // Show the reshuffle and OK buttons
    DOM.reshuffleTeamsBtn.style.display = 'inline-block';
    DOM.startRoundBtn.style.display = 'inline-block';
    
    saveGameState();
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    initializeDOMElements();
    restoreGameState();
});