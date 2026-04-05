/**
 * ═══════════════════════════════════════════════════════════
 * DARTSMASTER — app.js
 * Architecture: Model → GameEngine → UI → Storage
 * ═══════════════════════════════════════════════════════════
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   CONSTANTS & CONFIG
══════════════════════════════════════════════════════════ */

const PLAYER_COLORS = [
  '#f5a623', '#00e676', '#4a9eff', '#e040fb',
  '#ff6d6d', '#40c4ff', '#ffd740', '#69f0ae'
];

const CRICKET_TARGETS = [20, 19, 18, 17, 16, 15, 25]; // 25 = Bull

/** Checkout suggestions for common scores (501/301) */
const CHECKOUT_HINTS = {
  170: 'T20 T20 Bull', 167: 'T20 T19 Bull', 164: 'T20 T18 Bull',
  161: 'T20 T17 Bull', 160: 'T20 T20 D20', 158: 'T20 T20 D19',
  157: 'T20 T19 D20', 156: 'T20 T20 D18', 155: 'T20 T19 D19',
  154: 'T20 T18 D20', 153: 'T20 T19 D18', 152: 'T20 T20 D16',
  151: 'T20 T17 D20', 150: 'T20 T18 D18', 149: 'T20 T19 D16',
  148: 'T20 T16 D20', 147: 'T20 T17 D18', 146: 'T20 T18 D16',
  145: 'T20 T15 D20', 144: 'T20 T20 D12', 143: 'T20 T17 D16',
  142: 'T20 T14 D20', 141: 'T20 T19 D12', 140: 'T20 T16 D16',
  139: 'T20 T13 D20', 138: 'T20 T18 D12', 137: 'T20 T15 D16',
  136: 'T20 T20 D8',  135: 'T20 T17 D12', 134: 'T20 T14 D16',
  133: 'T20 T19 D8',  132: 'T20 T16 D12', 131: 'T20 T13 D16',
  130: 'T20 T18 D8',  129: 'T20 T19 D6',  128: 'T20 T16 D10',
  127: 'T20 T17 D8',  126: 'T19 T19 D6',  125: 'T20 T15 D10',
  124: 'T20 T16 D8',  123: 'T20 T13 D12', 122: 'T18 T18 D7',
  121: 'T20 T11 D14', 120: 'T20 S20 D20', 119: 'T20 T9 D16',
  118: 'T20 S18 D20', 117: 'T20 S17 D20', 116: 'T20 S16 D20',
  115: 'T20 S15 D20', 114: 'T20 S14 D20', 113: 'T20 S13 D20',
  112: 'T20 S12 D20', 111: 'T20 S11 D20', 110: 'T20 S10 D20',
  109: 'T20 S9 D20',  108: 'T20 S8 D20',  107: 'T20 S7 D20',
  106: 'T20 S6 D20',  105: 'T20 S5 D20',  104: 'T20 S4 D20',
  103: 'T20 S3 D20',  102: 'T20 S2 D20',  101: 'T20 S1 D20',
  100: 'T20 D20',      99: 'T19 S10 D16',   98: 'T20 D19',
   97: 'T19 D20',       96: 'T20 D18',       95: 'T19 D19',
   94: 'T18 D20',       93: 'T19 D18',       92: 'T20 D16',
   91: 'T17 D20',       90: 'T18 D18',       89: 'T19 D16',
   88: 'T20 D14',       87: 'T17 D18',       86: 'T18 D16',
   85: 'T15 D20',       84: 'T20 D12',       83: 'T17 D16',
   82: 'T14 D20',       81: 'T19 D12',       80: 'T20 D10',
   79: 'T19 D11',       78: 'T18 D12',       77: 'T19 D10',
   76: 'T20 D8',        75: 'T17 D12',       74: 'T14 D16',
   73: 'T19 D8',        72: 'T16 D12',       71: 'T13 D16',
   70: 'T18 D8',        69: 'T19 D6',        68: 'T20 D4',
   67: 'T17 D8',        66: 'T10 D18',       65: 'T19 D4',
   64: 'T16 D8',        63: 'T13 D12',       62: 'T10 D16',
   61: 'T15 D8',        60: 'S20 D20',       59: 'S19 D20',
   58: 'S18 D20',       57: 'S17 D20',       56: 'T16 D4',
   55: 'S15 D20',       54: 'S14 D20',       53: 'S13 D20',
   52: 'S12 D20',       51: 'S11 D20',       50: 'S10 D20',
   49: 'S9 D20',        48: 'S16 D16',       47: 'S15 D16',
   46: 'S14 D16',       45: 'S13 D16',       44: 'S12 D16',
   43: 'S3 D20',        42: 'S10 D16',       41: 'S9 D16',
   40: 'D20',           38: 'D19',            36: 'D18',
   34: 'D17',           32: 'D16',            30: 'D15',
   28: 'D14',           26: 'D13',            24: 'D12',
   22: 'D11',           20: 'D10',            18: 'D9',
   16: 'D8',            14: 'D7',             12: 'D6',
   10: 'D5',             8: 'D4',              6: 'D3',
    4: 'D2',             2: 'D1',              50: 'Bull',
};

/* ══════════════════════════════════════════════════════════
   MODEL — Player
══════════════════════════════════════════════════════════ */

class Player {
  constructor(id, name, colorIndex) {
    this.id = id;
    this.name = name;
    this.colorIndex = colorIndex;
    this.color = PLAYER_COLORS[colorIndex % PLAYER_COLORS.length];
  }

  /** Serialize for JSON storage */
  toJSON() {
    return { id: this.id, name: this.name, colorIndex: this.colorIndex };
  }

  static fromJSON(data) {
    return new Player(data.id, data.name, data.colorIndex);
  }
}

/* ══════════════════════════════════════════════════════════
   MODEL — Game (base state container)
══════════════════════════════════════════════════════════ */

class Game {
  constructor(mode, players, options = {}) {
    this.id = Date.now().toString();
    this.mode = mode;                // '501' | '301' | 'cricket' | 'around' | 'custom'
    this.players = players;          // Player[]
    this.options = options;          // { doubleOut, startScore }
    this.currentPlayerIndex = 0;
    this.currentDart = 0;            // 0-2 (3 darts per turn)
    this.currentTurnScores = [];     // scores thrown this turn
    this.turnHistory = [];           // all turns: [{playerId, scores, timestamp}]
    this.winner = null;
    this.startedAt = new Date().toISOString();
    this.finishedAt = null;

    // Mode-specific state
    this.scores = {};                // playerId → remaining score (501/301/custom)
    this.cricketState = {};          // playerId → { target: marks (0-3) }
    this.cricketPoints = {};         // playerId → bonus points
    this.aroundTargets = {};         // playerId → current target number index (0-20)

    this._initModeState();
  }

  _initModeState() {
    const startScore = this._getStartScore();
    this.players.forEach(p => {
      this.scores[p.id] = startScore;
      this.cricketPoints[p.id] = 0;
      this.cricketState[p.id] = {};
      CRICKET_TARGETS.forEach(t => { this.cricketState[p.id][t] = 0; });
      this.aroundTargets[p.id] = 0; // index into [1..20, Bull]
    });
  }

  _getStartScore() {
    if (this.mode === '501') return 501;
    if (this.mode === '301') return 301;
    if (this.mode === 'custom') return this.options.startScore || 501;
    return 0;
  }

  get currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  get isFinished() {
    return this.winner !== null;
  }

  /** Advance to next player */
  nextPlayer() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    this.currentDart = 0;
    this.currentTurnScores = [];
  }

  toJSON() {
    return {
      id: this.id,
      mode: this.mode,
      players: this.players.map(p => p.toJSON()),
      options: this.options,
      currentPlayerIndex: this.currentPlayerIndex,
      currentDart: this.currentDart,
      currentTurnScores: this.currentTurnScores,
      turnHistory: this.turnHistory,
      winner: this.winner,
      startedAt: this.startedAt,
      finishedAt: this.finishedAt,
      scores: this.scores,
      cricketState: this.cricketState,
      cricketPoints: this.cricketPoints,
      aroundTargets: this.aroundTargets,
    };
  }

  static fromJSON(data) {
    const players = data.players.map(p => Player.fromJSON(p));
    const game = new Game(data.mode, players, data.options);
    game.id = data.id;
    game.currentPlayerIndex = data.currentPlayerIndex;
    game.currentDart = data.currentDart;
    game.currentTurnScores = data.currentTurnScores;
    game.turnHistory = data.turnHistory;
    game.winner = data.winner;
    game.startedAt = data.startedAt;
    game.finishedAt = data.finishedAt;
    game.scores = data.scores;
    game.cricketState = data.cricketState;
    game.cricketPoints = data.cricketPoints;
    game.aroundTargets = data.aroundTargets;
    return game;
  }
}

/* ══════════════════════════════════════════════════════════
   GAME ENGINE — Pure logic, no DOM
══════════════════════════════════════════════════════════ */

class GameEngine {
  /**
   * Apply a score throw to a 501/301/custom game.
   * Returns { valid, bust, win, remaining }
   */
  static applyCountdownScore(game, score) {
    const player = game.currentPlayer;
    const current = game.scores[player.id];
    const newScore = current - score;

    if (newScore < 0) return { valid: false, bust: true };
    if (newScore === 1 && game.options.doubleOut) return { valid: false, bust: true };
    if (newScore === 0 && game.options.doubleOut) {
      // Requires a double — we trust the user to use multiplier buttons
      // We mark the throw as valid, the UI will prompt double validation
    }

    return {
      valid: true,
      bust: false,
      win: newScore === 0,
      remaining: newScore
    };
  }

  /**
   * Apply a cricket hit for a given target.
   * Returns { marks, closedTarget, pointsGained, allClosed }
   */
  static applyCricketHit(game, playerId, target, multiplier = 1) {
    const state = game.cricketState[playerId];
    const prevMarks = state[target] || 0;
    const totalMarks = Math.min(3, prevMarks + multiplier);
    const newMarks = totalMarks;
    const overMarks = prevMarks + multiplier - 3; // marks beyond closed

    // Check if all players except current have this target closed
    const allClosed = game.players.every(p => {
      if (p.id === playerId) return newMarks >= 3;
      return (game.cricketState[p.id][target] || 0) >= 3;
    });

    // Award points if we have marks to spare AND not all players closed it
    let pointsGained = 0;
    const targetIsClosed = game.players.every(p => (game.cricketState[p.id][target] || 0) >= 3);

    if (!targetIsClosed && overMarks > 0) {
      pointsGained = overMarks * (target === 25 ? 25 : target);
    }

    return {
      marks: newMarks,
      closedTarget: newMarks >= 3,
      pointsGained,
      allClosed,
    };
  }

  /** Check if a cricket player has won (all targets closed + highest/tied score) */
  static checkCricketWin(game, playerId) {
    const state = game.cricketState[playerId];
    const allClosed = CRICKET_TARGETS.every(t => (state[t] || 0) >= 3);
    if (!allClosed) return false;

    const myPoints = game.cricketPoints[playerId];
    // Win if all closed and no opponent has more points
    return game.players.every(p => {
      if (p.id === playerId) return true;
      return game.cricketPoints[p.id] <= myPoints;
    });
  }

  /** Get Around the World target name for a given index (0-19 = 1-20, 20 = Bull) */
  static aroundTargetName(index) {
    if (index >= 20) return 'Bull';
    return String(index + 1);
  }

  static aroundTargetValue(index) {
    if (index >= 20) return 25;
    return index + 1;
  }

  static aroundTotalTargets() {
    return 21; // 1-20 + Bull
  }
}

/* ══════════════════════════════════════════════════════════
   STORAGE — localStorage abstraction
══════════════════════════════════════════════════════════ */

const Storage = {
  KEYS: {
    CURRENT_GAME: 'dartsmaster_current_game',
    HISTORY: 'dartsmaster_history',
    THEME: 'dartsmaster_theme',
  },

  saveCurrentGame(game) {
    try {
      localStorage.setItem(this.KEYS.CURRENT_GAME, JSON.stringify(game.toJSON()));
    } catch (e) { console.warn('Storage error:', e); }
  },

  loadCurrentGame() {
    try {
      const raw = localStorage.getItem(this.KEYS.CURRENT_GAME);
      if (!raw) return null;
      return Game.fromJSON(JSON.parse(raw));
    } catch (e) {
      console.warn('Failed to load game:', e);
      return null;
    }
  },

  clearCurrentGame() {
    localStorage.removeItem(this.KEYS.CURRENT_GAME);
  },

  saveToHistory(game) {
    try {
      const history = this.loadHistory();
      // Avoid duplicates
      const idx = history.findIndex(h => h.id === game.id);
      if (idx >= 0) history[idx] = game.toJSON();
      else history.unshift(game.toJSON());
      // Keep last 50 games
      if (history.length > 50) history.pop();
      localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history));
    } catch (e) { console.warn('History save error:', e); }
  },

  loadHistory() {
    try {
      const raw = localStorage.getItem(this.KEYS.HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  },

  deleteHistoryEntry(gameId) {
    const history = this.loadHistory().filter(h => h.id !== gameId);
    localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history));
  },

  clearHistory() {
    localStorage.removeItem(this.KEYS.HISTORY);
  },

  saveTheme(theme) {
    localStorage.setItem(this.KEYS.THEME, theme);
  },

  loadTheme() {
    return localStorage.getItem(this.KEYS.THEME) || 'dark';
  },
};

/* ══════════════════════════════════════════════════════════
   UI CONTROLLER — All DOM interactions
══════════════════════════════════════════════════════════ */

const UI = {
  /** Current active game */
  game: null,

  /** Setup state */
  setup: {
    mode: '501',
    players: [],
    doubleOut: false,
    customScore: 501,
  },

  /** Init: wire all static event listeners */
  init() {
    this._applyTheme(Storage.loadTheme());
    this._bindHomeScreen();
    this._bindSetupScreen();
    this._bindGameScreen();
    this._bindHistoryScreen();
    this._checkContinue();
    this._showScreen('home');
  },

  /* ── Screen Navigation ── */

  _showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
    });
    const target = document.getElementById(`screen-${name}`);
    if (target) target.classList.add('active');
  },

  /* ── Theme ── */

  _applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    document.getElementById('themeToggle').textContent = theme === 'dark' ? '☀' : '☾';
    Storage.saveTheme(theme);
  },

  _toggleTheme() {
    const current = document.body.getAttribute('data-theme');
    this._applyTheme(current === 'dark' ? 'light' : 'dark');
  },

  /* ── Home Screen ── */

  _bindHomeScreen() {
    document.getElementById('themeToggle').addEventListener('click', () => this._toggleTheme());
    document.getElementById('btnNewGame').addEventListener('click', () => this._openSetup());
    document.getElementById('btnContinue').addEventListener('click', () => this._continueGame());
    document.getElementById('btnHistory').addEventListener('click', () => this._openHistory());
  },

  _checkContinue() {
    const saved = Storage.loadCurrentGame();
    const btn = document.getElementById('btnContinue');
    btn.disabled = !saved || saved.isFinished;
  },

  _continueGame() {
    const saved = Storage.loadCurrentGame();
    if (!saved) return;
    this.game = saved;
    this._startGameView();
  },

  /* ── Setup Screen ── */

  _openSetup() {
    this.setup = { mode: '501', players: [], doubleOut: false, customScore: 501 };
    this._renderSetupPlayers();
    this._addPlayer(); // Start with 1 player
    this._updateSetupOptions();
    this._showScreen('setup');
  },

  _bindSetupScreen() {
    document.getElementById('setupBack').addEventListener('click', () => this._showScreen('home'));

    // Mode selection
    document.getElementById('gameModeGrid').addEventListener('click', e => {
      const card = e.target.closest('.mode-card');
      if (!card) return;
      document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      this.setup.mode = card.dataset.mode;
      this._updateSetupOptions();
    });

    document.getElementById('doubleOutToggle').addEventListener('change', e => {
      this.setup.doubleOut = e.target.checked;
    });

    document.getElementById('customScore').addEventListener('change', e => {
      this.setup.customScore = parseInt(e.target.value) || 501;
    });

    document.getElementById('btnAddPlayer').addEventListener('click', () => this._addPlayer());

    document.getElementById('btnStartGame').addEventListener('click', () => this._startGame());
  },

  _updateSetupOptions() {
    const isCountdown = ['501', '301', 'custom'].includes(this.setup.mode);
    const isCricket = this.setup.mode === 'cricket';
    const isAround = this.setup.mode === 'around';
    const isCustom = this.setup.mode === 'custom';

    document.getElementById('optionDoubleOut').style.display = isCountdown ? 'flex' : 'none';
    document.getElementById('optionCustomScore').style.display = isCustom ? 'flex' : 'none';
  },

  _addPlayer() {
    if (this.setup.players.length >= 8) return;
    const idx = this.setup.players.length;
    const player = new Player(Date.now().toString(), `Joueur ${idx + 1}`, idx);
    this.setup.players.push(player);
    this._renderSetupPlayers();
  },

  _removePlayer(playerId) {
    if (this.setup.players.length <= 1) return;
    this.setup.players = this.setup.players.filter(p => p.id !== playerId);
    // Re-assign colors
    this.setup.players.forEach((p, i) => { p.colorIndex = i; p.color = PLAYER_COLORS[i]; });
    this._renderSetupPlayers();
  },

  _renderSetupPlayers() {
    const container = document.getElementById('playersList');
    container.innerHTML = '';
    document.getElementById('playerCount').textContent = `(${this.setup.players.length})`;

    this.setup.players.forEach(player => {
      const row = document.createElement('div');
      row.className = 'player-row';
      row.innerHTML = `
        <div class="player-color player-color-${player.colorIndex}"></div>
        <input
          type="text"
          class="player-name-input"
          value="${this._escapeHtml(player.name)}"
          placeholder="Nom du joueur"
          maxlength="20"
          data-id="${player.id}"
        />
        <button class="btn-remove-player" data-id="${player.id}" title="Supprimer">✕</button>
      `;
      container.appendChild(row);

      row.querySelector('.player-name-input').addEventListener('input', e => {
        const p = this.setup.players.find(p => p.id === e.target.dataset.id);
        if (p) p.name = e.target.value || `Joueur`;
      });

      row.querySelector('.btn-remove-player').addEventListener('click', e => {
        this._removePlayer(e.target.dataset.id);
      });
    });

    // Add btn availability
    document.getElementById('btnAddPlayer').disabled = this.setup.players.length >= 8;
  },

  _startGame() {
    if (this.setup.players.length < 1) return;
    const options = {
      doubleOut: this.setup.doubleOut,
      startScore: this.setup.customScore,
    };
    this.game = new Game(this.setup.mode, this.setup.players, options);
    Storage.saveCurrentGame(this.game);
    this._startGameView();
  },

  /* ── Game Screen ── */

  _startGameView() {
    this._showScreen('game');
    this._setupGameInput();
    this._renderGame();
  },

  _bindGameScreen() {
    document.getElementById('gameBack').addEventListener('click', () => {
      if (confirm('Quitter la partie ? Elle sera sauvegardée.')) {
        Storage.saveCurrentGame(this.game);
        this._checkContinue();
        this._showScreen('home');
      }
    });

    document.getElementById('btnUndo').addEventListener('click', () => this._undoLastThrow());
    document.getElementById('btnUndo').title = 'Annuler le dernier lancer (ou tout le tour précédent)';

    document.getElementById('btnConfirmScore').addEventListener('click', () => {
      const val = parseInt(document.getElementById('manualInput').value);
      if (!isNaN(val) && val >= 0 && val <= 180) {
        this._applyCountdownThrow(val);
        document.getElementById('manualInput').value = '';
      }
    });

    document.getElementById('manualInput').addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('btnConfirmScore').click();
    });

    document.getElementById('btnNextTurn').addEventListener('click', () => this._advanceTurn());

    document.getElementById('btnAroundHit').addEventListener('click', () => this._applyAroundThrow(true));
    document.getElementById('btnAroundMiss').addEventListener('click', () => this._applyAroundThrow(false));

    document.getElementById('btnPlayAgain').addEventListener('click', () => this._playAgain());
    document.getElementById('btnGoHome').addEventListener('click', () => {
      Storage.clearCurrentGame();
      this._checkContinue();
      this._showScreen('home');
    });
  },

  _setupGameInput() {
    const mode = this.game.mode;
    const isCountdown = ['501', '301', 'custom'].includes(mode);

    // Show/hide appropriate views and inputs
    document.getElementById('view-scoreboard').style.display = isCountdown ? '' : 'none';
    document.getElementById('view-cricket').style.display = mode === 'cricket' ? '' : 'none';
    document.getElementById('view-around').style.display = mode === 'around' ? '' : 'none';

    document.getElementById('inputStandard').style.display = isCountdown ? '' : 'none';
    document.getElementById('inputCricket').style.display = mode === 'cricket' ? '' : 'none';
    document.getElementById('inputAround').style.display = mode === 'around' ? '' : 'none';

    document.getElementById('gameModeBadge').textContent = this._modeName(mode);

    if (isCountdown) this._buildScoreButtons();
    if (mode === 'cricket') this._buildCricketInputButtons();
  },

  _modeName(mode) {
    const names = { '501': '501', '301': '301', 'cricket': 'CRICKET', 'around': 'AROUND', 'custom': 'CUSTOM' };
    return names[mode] || mode.toUpperCase();
  },

  _buildScoreButtons() {
    const container = document.getElementById('scoreButtons');
    container.innerHTML = '';

    // Common scores
    const commonScores = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      25, 26, 30, 32, 36, 38, 40, 45, 50, 60,
    ];

    // Special multiplier buttons
    const specials = [
      { label: 'T20', value: 60, cls: 'special' },
      { label: 'T19', value: 57, cls: 'special' },
      { label: 'T18', value: 54, cls: 'special' },
      { label: 'T17', value: 51, cls: 'special' },
      { label: 'Bull', value: 50, cls: 'special' },
    ];

    commonScores.forEach(val => {
      const btn = document.createElement('button');
      btn.className = 'score-btn' + (val === 0 ? ' miss' : '');
      btn.textContent = val === 0 ? 'MISS' : val;
      btn.addEventListener('click', () => this._applyCountdownThrow(val));
      container.appendChild(btn);
    });

    specials.forEach(s => {
      const btn = document.createElement('button');
      btn.className = `score-btn ${s.cls}`;
      btn.textContent = s.label;
      btn.addEventListener('click', () => this._applyCountdownThrow(s.value));
      container.appendChild(btn);
    });
  },

  _buildCricketInputButtons() {
    const container = document.getElementById('cricketInputGrid');
    container.innerHTML = '';

    // Header row
    const header = document.createElement('div');
    header.className = 'cricket-input-header';
    header.innerHTML = `
      <span class="cricket-col-label">CIBLE</span>
      <span class="cricket-col-label single-lbl">S<small> ×1</small></span>
      <span class="cricket-col-label double-lbl">D<small> ×2</small></span>
      <span class="cricket-col-label triple-lbl">T<small> ×3</small></span>
    `;
    container.appendChild(header);

    // One row per cricket target
    [...CRICKET_TARGETS].forEach(target => {
      const label = target === 25 ? 'BULL' : String(target);
      const row = document.createElement('div');
      row.className = 'cricket-input-row';
      row.dataset.target = target;

      // Target label cell
      const labelCell = document.createElement('span');
      labelCell.className = 'cricket-target-label';
      labelCell.textContent = label;
      row.appendChild(labelCell);

      // S (×1) / D (×2) / T (×3) buttons
      [1, 2, 3].forEach(mult => {
        const btn = document.createElement('button');
        btn.className = `cricket-mult-btn mult-${mult}`;
        btn.dataset.target = target;
        btn.dataset.mult = mult;
        btn.textContent = ['', 'S', 'D', 'T'][mult];
        btn.addEventListener('click', () => this._applyCricketThrow(target, mult));
        row.appendChild(btn);
      });

      container.appendChild(row);
    });

    // MISS / pass button at the bottom
    const missRow = document.createElement('div');
    missRow.className = 'cricket-input-miss-row';
    const missBtn = document.createElement('button');
    missBtn.className = 'cricket-miss-btn';
    missBtn.innerHTML = `✗ RATÉ — passer la fléchette`;
    missBtn.addEventListener('click', () => this._advanceCricketDart());
    missRow.appendChild(missBtn);
    container.appendChild(missRow);
  },

  /* ── Countdown Game Logic (501/301/custom) ── */

  _applyCountdownThrow(score) {
    const game = this.game;
    if (game.isFinished) return;

    const result = GameEngine.applyCountdownScore(game, score);

    if (result.bust) {
      // Bust: add to display, then auto-end turn
      game.currentTurnScores.push({ score, bust: true });
      this._updateDartDisplay();
      this._flashBust();
      setTimeout(() => this._endCountdownTurn(true), 800);
      return;
    }

    // Valid throw
    game.currentTurnScores.push({ score, bust: false });
    game.scores[game.currentPlayer.id] = result.remaining;
    game.currentDart++;

    this._updateDartDisplay();
    this._renderScoreboard();
    this._updateCheckoutHint(result.remaining);

    if (result.win) {
      this._triggerWin(game.currentPlayer);
      return;
    }

    // After 3 darts, show "Next Turn"
    if (game.currentDart >= 3) {
      this._showNextTurnButton();
    }

    Storage.saveCurrentGame(game);
  },

  _endCountdownTurn(isBust = false) {
    const game = this.game;
    // Record turn
    game.turnHistory.push({
      playerId: game.currentPlayer.id,
      scores: [...game.currentTurnScores],
      bust: isBust,
      timestamp: Date.now(),
    });

    if (isBust) {
      // Restore score (reverse the turn)
      this._recalculateScoreForPlayer(game.currentPlayer.id);
    }

    game.nextPlayer();
    this._renderGame();
    Storage.saveCurrentGame(game);
  },

  _recalculateScoreForPlayer(playerId) {
    // Re-compute from history
    const game = this.game;
    const startScore = game._getStartScore();
    let score = startScore;
    game.turnHistory
      .filter(t => t.playerId === playerId && !t.bust)
      .forEach(t => { t.scores.forEach(d => { score -= d.score; }); });
    game.scores[playerId] = score;
  },

  _advanceTurn() {
    document.getElementById('btnNextTurn').style.display = 'none';
    const mode = this.game.mode;
    if (mode === 'cricket') this._endCricketTurn();
    else if (mode === 'around') this._endAroundTurn();
    else this._endCountdownTurn(false);
  },

  _showNextTurnButton() {
    document.getElementById('btnNextTurn').style.display = '';
    document.getElementById('btnNextTurn').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },

  _flashBust() {
    const card = document.querySelector('.score-card.active');
    if (card) {
      card.classList.add('bust');
      setTimeout(() => card.classList.remove('bust'), 500);
    }
  },

  _updateCheckoutHint(remaining) {
    const hint = document.getElementById('checkoutHint');
    if (remaining <= 170 && remaining >= 2 && CHECKOUT_HINTS[remaining]) {
      hint.textContent = `🎯 Checkout ${remaining}: ${CHECKOUT_HINTS[remaining]}`;
      hint.classList.add('visible');
    } else {
      hint.classList.remove('visible');
    }
  },

  /* ── Cricket Logic ── */

  _applyCricketThrow(target, multiplier) {
    const game = this.game;
    if (game.isFinished) return;

    const player = game.currentPlayer;
    const result = GameEngine.applyCricketHit(game, player.id, target, multiplier);

    game.cricketState[player.id][target] = result.marks;
    if (result.pointsGained > 0) {
      game.cricketPoints[player.id] += result.pointsGained;
    }

    // Store full throw data including points gained (needed for undo)
    game.currentTurnScores.push({ target, multiplier, pointsGained: result.pointsGained });
    game.currentDart++;

    this._renderCricketBoard();
    this._updateDartDisplay();

    // Check win
    if (GameEngine.checkCricketWin(game, player.id)) {
      this._triggerWin(player);
      return;
    }

    if (game.currentDart >= 3) this._showNextTurnButton();
    Storage.saveCurrentGame(game);
  },

  _advanceCricketDart() {
    const game = this.game;
    game.currentTurnScores.push({ target: null, multiplier: 0 });
    game.currentDart++;
    this._updateDartDisplay();
    if (game.currentDart >= 3) this._showNextTurnButton();
  },

  _endCricketTurn() {
    const game = this.game;
    game.turnHistory.push({
      playerId: game.currentPlayer.id,
      scores: [...game.currentTurnScores],
      timestamp: Date.now(),
    });
    game.nextPlayer();
    this._renderGame();
    Storage.saveCurrentGame(game);
  },

  /* ── Around the World Logic ── */

  _applyAroundThrow(hit) {
    const game = this.game;
    if (game.isFinished) return;

    const player = game.currentPlayer;
    const currentIdx = game.aroundTargets[player.id];

    game.currentTurnScores.push({ hit, targetIdx: currentIdx });

    if (hit) {
      game.aroundTargets[player.id]++;
      // Check win (passed all 21 targets)
      if (game.aroundTargets[player.id] >= GameEngine.aroundTotalTargets()) {
        this._triggerWin(player);
        return;
      }
    }

    game.currentDart++;
    this._updateDartDisplay();
    this._renderAroundBoard();
    this._updateAroundTargetDisplay();

    if (game.currentDart >= 3) this._showNextTurnButton();
    Storage.saveCurrentGame(game);
  },

  _endAroundTurn() {
    const game = this.game;
    game.turnHistory.push({
      playerId: game.currentPlayer.id,
      scores: [...game.currentTurnScores],
      timestamp: Date.now(),
    });
    game.nextPlayer();
    this._renderGame();
    Storage.saveCurrentGame(game);
  },

  /* ── Undo ── */

  _undoLastThrow() {
    const game = this.game;

    // Case 1: There are throws in the current turn → undo the last one
    if (game.currentTurnScores.length > 0) {
      const last = game.currentTurnScores.pop();
      game.currentDart = Math.max(0, game.currentDart - 1);

      if (['501', '301', 'custom'].includes(game.mode)) {
        // Restore score (only if not a bust entry, those don't reduce score)
        if (!last.bust) {
          game.scores[game.currentPlayer.id] += last.score;
        }
      } else if (game.mode === 'cricket') {
        if (last.target !== null) {
          const pid = game.currentPlayer.id;
          const prevMarks = game.cricketState[pid][last.target] || 0;
          const newMarks = Math.max(0, prevMarks - last.multiplier);
          game.cricketState[pid][last.target] = newMarks;

          // Restore points: if the throw awarded points, remove them
          if (last.pointsGained && last.pointsGained > 0) {
            game.cricketPoints[pid] = Math.max(0, (game.cricketPoints[pid] || 0) - last.pointsGained);
          }
        }
      } else if (game.mode === 'around') {
        if (last.hit) {
          game.aroundTargets[game.currentPlayer.id] = Math.max(0, game.aroundTargets[game.currentPlayer.id] - 1);
        }
      }

      document.getElementById('btnNextTurn').style.display = 'none';
      this._renderGame();
      Storage.saveCurrentGame(game);
      return;
    }

    // Case 2: No throws in current turn → undo the last completed turn
    if (game.turnHistory.length === 0) return;

    const lastTurn = game.turnHistory.pop();

    // Go back to the previous player
    game.currentPlayerIndex = (game.currentPlayerIndex - 1 + game.players.length) % game.players.length;
    const prevPlayer = game.currentPlayer;

    if (['501', '301', 'custom'].includes(game.mode)) {
      if (!lastTurn.bust) {
        // Re-add all scores of that turn
        const total = lastTurn.scores.reduce((s, d) => s + (d.bust ? 0 : d.score), 0);
        game.scores[prevPlayer.id] += total;
      } else {
        // Turn was a bust: score was already restored at end of turn, nothing to undo on the score
        // But re-apply the deductions that happened before the bust
        // Actually on bust the score is recalculated — so we need to recalculate again:
        this._recalculateScoreForPlayer(prevPlayer.id);
        // But the turn was popped, so now we need to add back the valid throws
        const validTotal = lastTurn.scores.filter(d => !d.bust).reduce((s, d) => s + d.score, 0);
        game.scores[prevPlayer.id] += validTotal;
      }
    } else if (game.mode === 'cricket') {
      // Undo each throw of that turn in reverse
      [...lastTurn.scores].reverse().forEach(throwData => {
        if (throwData.target === null) return; // miss, nothing to undo
        const state = game.cricketState[prevPlayer.id];
        state[throwData.target] = Math.max(0, (state[throwData.target] || 0) - throwData.multiplier);
        if (throwData.pointsGained > 0) {
          game.cricketPoints[prevPlayer.id] = Math.max(0, (game.cricketPoints[prevPlayer.id] || 0) - throwData.pointsGained);
        }
      });
    } else if (game.mode === 'around') {
      const hitsInTurn = lastTurn.scores.filter(d => d.hit).length;
      game.aroundTargets[prevPlayer.id] = Math.max(0, game.aroundTargets[prevPlayer.id] - hitsInTurn);
    }

    // Restore the turn as "in progress" so the player can re-enter their throws
    game.currentTurnScores = [];
    game.currentDart = 0;
    document.getElementById('btnNextTurn').style.display = 'none';

    this._renderGame();
    Storage.saveCurrentGame(game);
  },

  /* ── Win ── */

  _triggerWin(player) {
    const game = this.game;
    game.winner = player.id;
    game.finishedAt = new Date().toISOString();

    // Save to history & clear current
    Storage.saveToHistory(game);
    Storage.clearCurrentGame();

    // Compute stats
    const turns = game.turnHistory.filter(t => t.playerId === player.id);
    const statsLines = [`${turns.length} tours joués`];
    if (['501', '301', 'custom'].includes(game.mode)) {
      const totalThrows = turns.reduce((s, t) => s + t.scores.length, 0);
      statsLines.push(`${totalThrows} fléchettes`);
    }

    document.getElementById('winnerName').textContent = player.name;
    document.getElementById('winnerStats').textContent = statsLines.join(' · ');
    document.getElementById('winnerOverlay').style.display = 'flex';
  },

  _playAgain() {
    document.getElementById('winnerOverlay').style.display = 'none';
    // Same players, same mode
    const players = this.game.players;
    const options = this.game.options;
    const mode = this.game.mode;
    this.game = new Game(mode, players, options);
    Storage.saveCurrentGame(this.game);
    this._startGameView();
  },

  /* ── Render helpers ── */

  _renderGame() {
    const mode = this.game.mode;
    document.getElementById('turnPlayerName').textContent = this.game.currentPlayer.name;
    this._updateDartDisplay();
    this._updateCheckoutHint(this.game.scores[this.game.currentPlayer.id]);
    document.getElementById('btnUndo').disabled =
      game.currentTurnScores.length === 0 && game.turnHistory.length === 0;

    if (['501', '301', 'custom'].includes(mode)) {
      this._renderScoreboard();
    } else if (mode === 'cricket') {
      this._renderCricketBoard();
      this._updateCricketInputButtons();
    } else if (mode === 'around') {
      this._renderAroundBoard();
      this._updateAroundTargetDisplay();
    }

    document.getElementById('btnNextTurn').style.display =
      this.game.currentDart >= 3 ? '' : 'none';
  },

  _updateDartDisplay() {
    const game = this.game;
    const slots = document.querySelectorAll('.dart-slot');
    slots.forEach((slot, i) => {
      const throwData = game.currentTurnScores[i];
      if (throwData !== undefined) {
        if (game.mode === 'cricket') {
          slot.textContent = throwData.target === null ? '—' : `${throwData.target}×${throwData.multiplier}`;
        } else if (game.mode === 'around') {
          slot.textContent = throwData.hit ? '✓' : '✗';
        } else {
          slot.textContent = throwData.bust ? `${throwData.score}!` : throwData.score;
        }
        slot.className = 'dart-slot filled';
      } else if (i === game.currentDart) {
        slot.textContent = '●';
        slot.className = 'dart-slot active';
      } else {
        slot.textContent = '—';
        slot.className = 'dart-slot';
      }
    });

    // Turn total
    if (['501', '301', 'custom'].includes(game.mode)) {
      const total = game.currentTurnScores
        .filter(t => !t.bust)
        .reduce((s, t) => s + t.score, 0);
      document.getElementById('turnTotal').textContent = total;
    } else {
      document.getElementById('turnTotal').textContent = '';
    }
  },

  _renderScoreboard() {
    const game = this.game;
    const container = document.getElementById('scoreboard');
    container.innerHTML = '';

    game.players.forEach(player => {
      const isActive = player.id === game.currentPlayer.id;
      const score = game.scores[player.id];
      const maxScore = game._getStartScore();
      const isCritical = score <= 20 && score > 0;
      const isFinishing = score <= 170 && score > 0;

      // Last turn scores
      const lastTurn = game.turnHistory
        .filter(t => t.playerId === player.id)
        .slice(-1)[0];
      const lastScores = lastTurn
        ? lastTurn.scores.map(d => d.bust ? `💥${d.score}` : d.score).join(' + ')
        : '';

      const card = document.createElement('div');
      card.className = `score-card${isActive ? ' active' : ''}`;
      card.innerHTML = `
        <div class="player-color-bar player-color-${player.colorIndex}"></div>
        <div class="player-info">
          <span class="player-name">${this._escapeHtml(player.name)}</span>
          <span class="player-turn-indicator">▶ en jeu</span>
          ${lastScores ? `<div class="player-last-scores"><span class="last-score-chip">${lastScores}</span></div>` : ''}
        </div>
        <div class="player-score">
          <span class="score-value ${isCritical ? 'critical' : isFinishing ? 'finishing' : ''}">${score}</span>
        </div>
      `;
      container.appendChild(card);
    });
  },

  _renderCricketBoard() {
    const game = this.game;
    const container = document.getElementById('cricketBoard');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'cricket-table';

    // Header
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = game.players
      .map(p => `<th style="color:${p.color}">${this._escapeHtml(p.name)}</th>`)
      .join('') + '<th class="target-col">TARGET</th>' +
      game.players.map(p => `<th style="color:${p.color}">PTS</th>`).join('');
    table.appendChild(headerRow);

    CRICKET_TARGETS.forEach(target => {
      const allClosed = game.players.every(p => (game.cricketState[p.id][target] || 0) >= 3);
      const tr = document.createElement('tr');
      const targetLabel = target === 25 ? 'BULL' : target;

      const cells = game.players.map(p => {
        const marks = game.cricketState[p.id][target] || 0;
        return `<td>${this._renderMarks(marks)}</td>`;
      }).join('');

      const targetCell = `<td class="target-col ${allClosed ? 'cricket-target-closed' : ''}">
        <strong>${allClosed ? '✓' : targetLabel}</strong>
      </td>`;

      const pointCells = game.players.map(p => {
        const pts = game.cricketPoints[p.id] || 0;
        return `<td class="cricket-points-cell">${pts}</td>`;
      }).join('');

      tr.innerHTML = cells + targetCell + pointCells;

      // Highlight active player row
      if (game.players.some(p => p.id === game.currentPlayer.id)) {
        // Actually highlight the active player's column somehow
        tr.dataset.allClosed = allClosed;
      }

      table.appendChild(tr);
    });

    container.appendChild(table);
  },

  _renderMarks(count) {
    const marks = ['○', '/', '✕', '●'];
    const labels = ['', 'S', 'D', 'T'];
    if (count === 0) return `<span class="mark">${marks[0]}</span>`;
    if (count === 1) return `<span class="mark filled">S</span>`;
    if (count === 2) return `<span class="mark filled">D</span>`;
    return `<span class="mark closed">T</span>`;
  },

  _updateCricketInputButtons() {
    const game = this.game;
    const player = game.currentPlayer;

    CRICKET_TARGETS.forEach(target => {
      const marks = game.cricketState[player.id][target] || 0;
      const isClosed = marks >= 3;
      const row = document.querySelector(`.cricket-input-row[data-target="${target}"]`);
      if (!row) return;

      // Dim the row if this player has already closed the target
      row.classList.toggle('cricket-row-closed', isClosed);

      // Update each multiplier button: show which are still useful
      row.querySelectorAll('.cricket-mult-btn').forEach(btn => {
        const mult = parseInt(btn.dataset.mult);
        // How many more marks can this player score on this target?
        const marksNeeded = 3 - marks;
        btn.disabled = isClosed;
        btn.classList.toggle('mult-useful', !isClosed && mult <= marksNeeded);
      });

      // Update the target label to show current mark state
      const labelEl = row.querySelector('.cricket-target-label');
      if (labelEl) {
        const markIcons = ['', '╱', '✕', '●'];
        labelEl.textContent = (target === 25 ? 'BULL' : String(target));
        if (marks > 0) {
          labelEl.setAttribute('data-marks', marks);
        } else {
          labelEl.removeAttribute('data-marks');
        }
      }
    });
  },

  _renderAroundBoard() {
    const game = this.game;

    // Targets grid
    const container = document.getElementById('aroundBoard');
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'around-grid';

    for (let i = 0; i < GameEngine.aroundTotalTargets(); i++) {
      const cell = document.createElement('div');
      cell.className = 'around-target-cell';
      cell.textContent = GameEngine.aroundTargetName(i);

      const activeIdx = game.aroundTargets[game.currentPlayer.id];

      if (i === activeIdx) {
        cell.classList.add('current-target');
      }

      // Check if any player has hit this
      const hitters = game.players.filter(p => game.aroundTargets[p.id] > i);
      if (hitters.length > 0) {
        cell.classList.add('hit-by-player');
        cell.style.borderColor = hitters[0].color;
      }

      grid.appendChild(cell);
    }

    container.appendChild(grid);

    // Player progress bars
    const progressDiv = document.createElement('div');
    progressDiv.className = 'around-players-progress';

    game.players.forEach(player => {
      const progress = game.aroundTargets[player.id];
      const total = GameEngine.aroundTotalTargets();
      const pct = Math.round((progress / total) * 100);
      const isActive = player.id === game.currentPlayer.id;

      const row = document.createElement('div');
      row.className = `around-player-row${isActive ? ' active' : ''}`;
      row.innerHTML = `
        <div class="player-color-bar player-color-${player.colorIndex}" style="min-height:24px;width:6px"></div>
        <span style="font-size:14px;font-weight:600;min-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${this._escapeHtml(player.name)}</span>
        <div class="around-player-progress">
          <div class="around-player-fill" style="width:${pct}%;background:${player.color}"></div>
        </div>
        <span class="around-player-target-label">${progress < total ? GameEngine.aroundTargetName(progress) : '✓'}</span>
      `;
      progressDiv.appendChild(row);
    });

    container.appendChild(progressDiv);
  },

  _updateAroundTargetDisplay() {
    const game = this.game;
    const idx = game.aroundTargets[game.currentPlayer.id];
    const name = idx < GameEngine.aroundTotalTargets()
      ? GameEngine.aroundTargetName(idx)
      : '—';
    const el = document.getElementById('aroundCurrentTarget');
    el.innerHTML = `Cible : <strong>${name}</strong>`;
  },

  /* ── History Screen ── */

  _openHistory() {
    this._renderHistory();
    this._showScreen('history');
  },

  _bindHistoryScreen() {
    document.getElementById('historyBack').addEventListener('click', () => this._showScreen('home'));
    document.getElementById('btnClearHistory').addEventListener('click', () => {
      if (confirm('Effacer tout l\'historique ?')) {
        Storage.clearHistory();
        this._renderHistory();
      }
    });
  },

  _renderHistory() {
    const list = document.getElementById('historyList');
    const history = Storage.loadHistory();

    if (history.length === 0) {
      list.innerHTML = '<p class="empty-state">Aucune partie enregistrée.</p>';
      return;
    }

    list.innerHTML = '';

    history.forEach(gameData => {
      const card = document.createElement('div');
      card.className = 'history-card';

      const date = new Date(gameData.startedAt);
      const dateStr = date.toLocaleDateString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });

      const playersHtml = gameData.players.map(p => {
        const isWinner = p.id === gameData.winner;
        return `<div class="history-player-chip ${isWinner ? 'winner' : ''}">
          <div class="history-color-dot" style="background:${PLAYER_COLORS[p.colorIndex]}"></div>
          ${this._escapeHtml(p.name)}
        </div>`;
      }).join('');

      card.innerHTML = `
        <div class="history-card-header">
          <span class="history-mode">${this._modeName(gameData.mode)}</span>
          <span class="history-date">${dateStr}</span>
        </div>
        <div class="history-players">${playersHtml}</div>
        <div class="history-actions">
          <button class="btn-history-delete" data-id="${gameData.id}">🗑 Supprimer</button>
        </div>
      `;

      card.querySelector('.btn-history-delete').addEventListener('click', e => {
        Storage.deleteHistoryEntry(e.target.dataset.id);
        this._renderHistory();
      });

      list.appendChild(card);
    });
  },

  /* ── Utils ── */

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str || ''));
    return div.innerHTML;
  },
};

/* ══════════════════════════════════════════════════════════
   BOOTSTRAP
══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  UI.init();
});
