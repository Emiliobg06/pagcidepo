import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Star, Heart, Brain, Users, Target, Trophy, Play, RotateCcw } from 'lucide-react';
import { toast } from "sonner";
import EmotionQuiz from './EmotionQuiz';
import BreathingExercise from './BreathingExercise';
import ParentingScenarios from './ParentingScenarios';
import CoordinationGame from './CoordinationGame';

interface Player {
  x: number;
  y: number;
  score: number;
  lives: number;
  level: number;
}

interface GameLevel {
  id: number;
  name: string;
  color: string;
  emoji: string;
  type: 'emotion' | 'breathing' | 'parenting' | 'coordination' | 'bonus';
}

interface Collectible {
  x: number;
  y: number;
  type: 'coin' | 'heart' | 'star' | 'power';
  collected: boolean;
}

const RetroGame = () => {
  const [player, setPlayer] = useState<Player>({ x: 1, y: 8, score: 0, lives: 3, level: 1 });
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'minigame' | 'gameover' | 'levelcomplete'>('menu');
  const [currentMinigame, setCurrentMinigame] = useState<string | null>(null);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [gameTime, setGameTime] = useState(0);

  const levels: GameLevel[] = [
    { id: 1, name: 'MUNDO EMOCIONAL', color: 'bg-pink-400', emoji: '💖', type: 'emotion' },
    { id: 2, name: 'ISLA RESPIRACIÓN', color: 'bg-blue-400', emoji: '🧠', type: 'breathing' },
    { id: 3, name: 'VILLA CRIANZA', color: 'bg-green-400', emoji: '👥', type: 'parenting' },
    { id: 4, name: 'TORRE COORDINACIÓN', color: 'bg-orange-400', emoji: '🎯', type: 'coordination' },
    { id: 5, name: 'CASTILLO BONUS', color: 'bg-yellow-400', emoji: '⭐', type: 'bonus' }
  ];

  const GRID_SIZE = 10;

  // Generar coleccionables aleatorios
  const generateCollectibles = useCallback(() => {
    const newCollectibles: Collectible[] = [];
    for (let i = 0; i < 15; i++) {
      newCollectibles.push({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
        type: ['coin', 'heart', 'star', 'power'][Math.floor(Math.random() * 4)] as any,
        collected: false
      });
    }
    setCollectibles(newCollectibles);
  }, []);

  // Controles del juego
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing') return;

    const newPlayer = { ...player };
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        newPlayer.y = Math.max(0, player.y - 1);
        break;
      case 'ArrowDown':
      case 's':
        newPlayer.y = Math.min(GRID_SIZE - 1, player.y + 1);
        break;
      case 'ArrowLeft':
      case 'a':
        newPlayer.x = Math.max(0, player.x - 1);
        break;
      case 'ArrowRight':
      case 'd':
        newPlayer.x = Math.min(GRID_SIZE - 1, player.x + 1);
        break;
      case ' ':
        e.preventDefault();
        checkForInteraction();
        return;
    }
    
    setPlayer(newPlayer);
    checkCollisions(newPlayer);
  }, [player, gameState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Timer del juego
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const checkCollisions = (currentPlayer: Player) => {
    const newCollectibles = collectibles.map(item => {
      if (item.x === currentPlayer.x && item.y === currentPlayer.y && !item.collected) {
        const newPlayer = { ...currentPlayer };
        
        switch (item.type) {
          case 'coin':
            newPlayer.score += 10;
            toast.success('+10 puntos! 🪙');
            break;
          case 'heart':
            newPlayer.lives = Math.min(5, newPlayer.lives + 1);
            toast.success('+1 vida! ❤️');
            break;
          case 'star':
            newPlayer.score += 50;
            toast.success('+50 puntos! ⭐');
            break;
          case 'power':
            newPlayer.score += 25;
            toast.success('¡Power-up! ⚡');
            break;
        }
        
        setPlayer(newPlayer);
        return { ...item, collected: true };
      }
      return item;
    });
    
    setCollectibles(newCollectibles);
  };

  const checkForInteraction = () => {
    // Verificar si está en una esquina especial para minijuegos
    if ((player.x === 0 && player.y === 0) || 
        (player.x === GRID_SIZE-1 && player.y === 0) ||
        (player.x === 0 && player.y === GRID_SIZE-1) ||
        (player.x === GRID_SIZE-1 && player.y === GRID_SIZE-1) ||
        (player.x === Math.floor(GRID_SIZE/2) && player.y === Math.floor(GRID_SIZE/2))) {
      
      const currentLevel = levels[player.level - 1];
      if (currentLevel) {
        setCurrentMinigame(currentLevel.type);
        setGameState('minigame');
        toast.info(`¡Entrando a ${currentLevel.name}!`);
      }
    }
  };

  const startGame = () => {
    setPlayer({ x: 1, y: 8, score: 0, lives: 3, level: 1 });
    setGameState('playing');
    setGameTime(0);
    generateCollectibles();
    toast.success('¡Juego iniciado! Usa WASD o flechas para moverte, ESPACIO para interactuar');
  };

  const finishMinigame = (score: number) => {
    const newPlayer = { ...player };
    newPlayer.score += score;
    
    if (score > 0) {
      newPlayer.level = Math.min(levels.length, newPlayer.level + 1);
      toast.success(`¡Nivel completado! Avanzaste al nivel ${newPlayer.level}`);
    }
    
    setPlayer(newPlayer);
    setCurrentMinigame(null);
    setGameState('playing');
    
    if (newPlayer.level > levels.length) {
      setGameState('levelcomplete');
    }
  };

  const resetGame = () => {
    setPlayer({ x: 1, y: 8, score: 0, lives: 3, level: 1 });
    setGameState('menu');
    setGameTime(0);
    setCurrentMinigame(null);
    setCollectibles([]);
  };

  const getCollectibleEmoji = (type: string) => {
    switch (type) {
      case 'coin': return '🪙';
      case 'heart': return '❤️';
      case 'star': return '⭐';
      case 'power': return '⚡';
      default: return '🪙';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (currentMinigame) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => {
              setCurrentMinigame(null);
              setGameState('playing');
            }}
            className="mb-6 bg-green-600 hover:bg-green-700 text-black font-bold"
          >
            ⏮️ SALTAR MINIJUEGO
          </Button>
          
          {currentMinigame === 'emotion' && <EmotionQuiz onScore={finishMinigame} />}
          {currentMinigame === 'breathing' && <BreathingExercise />}
          {currentMinigame === 'parenting' && <ParentingScenarios onScore={finishMinigame} />}
          {currentMinigame === 'coordination' && <CoordinationGame onScore={finishMinigame} />}
        </div>
      </div>
    );
  }

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black flex items-center justify-center p-4">
        <Card className="bg-black border-4 border-green-400 max-w-2xl w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-green-400 mb-4 font-mono">
              🎮 VIAJE EMOCIONAL 🎮
            </CardTitle>
            <div className="text-yellow-400 text-lg font-mono">
              *** RETRO ADVENTURE ***
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-green-300 space-y-2 font-mono">
              <p>🕹️ Un juego educativo estilo retro</p>
              <p>🧠 Aprende sobre emociones y valores</p>
              <p>🎯 Completa todos los niveles</p>
            </div>
            
            <div className="bg-gray-900 p-4 rounded border border-green-400">
              <h3 className="text-yellow-400 font-bold mb-2">CONTROLES:</h3>
              <div className="text-green-300 text-sm space-y-1">
                <p>⬆️⬇️⬅️➡️ WASD o Flechas: Mover</p>
                <p>🎮 ESPACIO: Interactuar</p>
                <p>🎯 Encuentra las esquinas especiales para minijuegos</p>
              </div>
            </div>

            <Button 
              onClick={startGame}
              className="bg-green-600 hover:bg-green-700 text-black font-bold text-xl px-8 py-4"
            >
              <Play className="w-6 h-6 mr-2" />
              START GAME
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'levelcomplete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center p-4">
        <Card className="bg-black border-4 border-yellow-400 max-w-2xl w-full">
          <CardContent className="text-center p-8">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-4xl font-bold text-yellow-400 mb-4 font-mono">
              🏆 ¡JUEGO COMPLETADO! 🏆
            </h2>
            <div className="text-green-400 text-xl font-mono space-y-2">
              <p>PUNTUACIÓN FINAL: {player.score}</p>
              <p>TIEMPO: {formatTime(gameTime)}</p>
              <p>NIVEL ALCANZADO: {player.level}</p>
            </div>
            <div className="mt-6 space-y-4">
              <p className="text-cyan-400">¡Has completado tu viaje emocional!</p>
              <Button 
                onClick={resetGame}
                className="bg-green-600 hover:bg-green-700 text-black font-bold"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                JUGAR DE NUEVO
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-4 font-mono">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* HUD */}
        <Card className="bg-gray-900 border-2 border-green-400">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-yellow-400 font-bold">PUNTOS</div>
                <div className="text-2xl">{player.score}</div>
              </div>
              <div>
                <div className="text-red-400 font-bold">VIDAS</div>
                <div className="text-2xl">{'❤️'.repeat(player.lives)}</div>
              </div>
              <div>
                <div className="text-cyan-400 font-bold">NIVEL</div>
                <div className="text-2xl">{player.level}/{levels.length}</div>
              </div>
              <div>
                <div className="text-purple-400 font-bold">TIEMPO</div>
                <div className="text-2xl">{formatTime(gameTime)}</div>
              </div>
              <div>
                <Button 
                  onClick={resetGame}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold"
                  size="sm"
                >
                  RESET
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Area */}
        <Card className="bg-gray-900 border-2 border-green-400">
          <CardContent className="p-4">
            <div className="grid grid-cols-10 gap-1 mx-auto w-fit">
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                const x = index % GRID_SIZE;
                const y = Math.floor(index / GRID_SIZE);
                const isPlayer = player.x === x && player.y === y;
                const collectible = collectibles.find(c => c.x === x && c.y === y && !c.collected);
                const isSpecialZone = (x === 0 && y === 0) || 
                                     (x === GRID_SIZE-1 && y === 0) ||
                                     (x === 0 && y === GRID_SIZE-1) ||
                                     (x === GRID_SIZE-1 && y === GRID_SIZE-1) ||
                                     (x === Math.floor(GRID_SIZE/2) && y === Math.floor(GRID_SIZE/2));

                return (
                  <div
                    key={index}
                    className={`w-8 h-8 border border-gray-700 flex items-center justify-center text-sm ${
                      isSpecialZone ? 'bg-purple-600 animate-pulse' : 'bg-gray-800'
                    }`}
                  >
                    {isPlayer && (
                      <span className="text-yellow-400 font-bold animate-bounce">🚀</span>
                    )}
                    {!isPlayer && collectible && (
                      <span className="animate-pulse">
                        {getCollectibleEmoji(collectible.type)}
                      </span>
                    )}
                    {!isPlayer && !collectible && isSpecialZone && (
                      <span className="text-purple-300">🎯</span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="bg-gray-900 border-2 border-green-400">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-yellow-400 font-bold mb-2">CONTROLES:</h3>
                <div className="space-y-1 text-sm">
                  <p>⬆️⬇️⬅️➡️ Mover jugador</p>
                  <p>🎮 ESPACIO para interactuar en zonas especiales</p>
                  <p>🎯 Encuentra las esquinas moradas para minijuegos</p>
                </div>
              </div>
              <div>
                <h3 className="text-yellow-400 font-bold mb-2">LEYENDA:</h3>
                <div className="space-y-1 text-sm">
                  <p>🚀 Tu personaje</p>
                  <p>🪙 +10 puntos | ❤️ +1 vida</p>
                  <p>⭐ +50 puntos | ⚡ Power-up +25</p>
                  <p>🎯 Zona de minijuego</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Levels Progress */}
        <Card className="bg-gray-900 border-2 border-green-400">
          <CardContent className="p-4">
            <h3 className="text-yellow-400 font-bold mb-4 text-center">PROGRESO DE NIVELES</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              {levels.map((level, index) => (
                <div
                  key={level.id}
                  className={`p-3 rounded border text-center ${
                    player.level > index + 1 
                      ? 'bg-green-600 border-green-400' 
                      : player.level === index + 1 
                        ? 'bg-yellow-600 border-yellow-400 animate-pulse' 
                        : 'bg-gray-700 border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-1">{level.emoji}</div>
                  <div className="text-xs font-bold">{level.name}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RetroGame;