'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Users, Trophy, Heart, Brain, Target, Play } from 'lucide-react';
import { toast } from "sonner";
import EmotionQuiz from './EmotionQuiz';
import BreathingExercise from './BreathingExercise';
import ParentingScenarios from './ParentingScenarios';
import CoordinationGame from './CoordinationGame';

interface Player {
  id: number;
  name: string;
  position: number;
  color: string;
  score: number;
}

interface BoardSpace {
  id: number;
  type: 'start' | 'emotion' | 'breathing' | 'parenting' | 'coordination' | 'bonus' | 'rest' | 'finish';
  title: string;
  color: string;
  icon: string;
}

const BoardGame = () => {

  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Jugador 1', position: 0, color: 'bg-[#10a4b8]', score: 0 },
    { id: 2, name: 'Jugador 2', position: 0, color: 'bg-[#f35444]', score: 0 }
  ]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'minigame' | 'finished'>('setup');
  const [currentMinigame, setCurrentMinigame] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const boardSpaces: BoardSpace[] = [
    { id: 0, type: 'start', title: 'INICIO', color: 'bg-green-400', icon: 'Play' },
    { id: 1, type: 'emotion', title: 'Emociones', color: 'bg-pink-400', icon: 'Heart' },
    { id: 2, type: 'rest', title: 'Descanso', color: 'bg-gray-300', icon: 'Coffee' },
    { id: 3, type: 'breathing', title: 'Respiración', color: 'bg-blue-400', icon: 'Brain' },
    { id: 4, type: 'bonus', title: 'Bonus +10', color: 'bg-green-400', icon: 'Star' },
    { id: 5, type: 'parenting', title: 'Crianza', color: 'bg-green-400', icon: 'Users' },
    { id: 6, type: 'rest', title: 'Descanso', color: 'bg-gray-300', icon: 'Coffee' },
    { id: 7, type: 'coordination', title: 'Coordinación', color: 'bg-orange-400', icon: 'Target' },
    { id: 8, type: 'emotion', title: 'Emociones', color: 'bg-pink-400', icon: 'Heart' },
    { id: 9, type: 'bonus', title: 'Bonus +15', color: 'bg-green-400', icon: 'Star' },
    { id: 10, type: 'breathing', title: 'Respiración', color: 'bg-blue-400', icon: 'Brain' },
    { id: 11, type: 'parenting', title: 'Crianza', color: 'bg-green-400', icon: 'Users' },
    { id: 12, type: 'coordination', title: 'Coordinación', color: 'bg-orange-400', icon: 'Target' },
    { id: 13, type: 'rest', title: 'Descanso', color: 'bg-gray-300', icon: 'Coffee' },
    { id: 14, type: 'emotion', title: 'Emociones', color: 'bg-pink-400', icon: 'Heart' },
    { id: 15, type: 'finish', title: 'META', color: 'bg-purple-500', icon: 'Trophy' }
  ];

  const getDiceIcon = (value: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const Icon = icons[value - 1];
    return <Icon className="w-8 h-8" />;
  };

  const rollDice = () => {
    if (isRolling || gameState !== 'playing') return;
    
    setIsRolling(true);
    let counter = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setIsRolling(false);
        movePlayer(finalValue);
      }
    }, 100);
  };

  const movePlayer = (steps: number) => {
    const newPlayers = [...players];
    const player = newPlayers[currentPlayer];
    const newPosition = Math.min(player.position + steps, boardSpaces.length - 1);
    
    player.position = newPosition;
    setPlayers(newPlayers);

    setTimeout(() => {
      handleSpaceAction(newPosition);
    }, 1000);
  };

  const handleSpaceAction = (position: number) => {
    const space = boardSpaces[position];
    
    switch (space.type) {
      case 'emotion':
        setCurrentMinigame('emotions');
        setGameState('minigame');
        break;
      case 'breathing':
        setCurrentMinigame('breathing');
        setGameState('minigame');
        break;
      case 'parenting':
        setCurrentMinigame('parenting');
        setGameState('minigame');
        break;
      case 'coordination':
        setCurrentMinigame('coordination');
        setGameState('minigame');
        break;
      case 'bonus':
        const bonusPoints = space.title.includes('15') ? 15 : 10;
        updatePlayerScore(currentPlayer, bonusPoints);
        toast.success(`¡${players[currentPlayer].name} obtuvo ${bonusPoints} puntos bonus!`);
        nextTurn();
        break;
      case 'rest':
        toast.info(`${players[currentPlayer].name} descansa este turno`);
        nextTurn();
        break;
      case 'finish':
        toast.success(`¡${players[currentPlayer].name} ha llegado a la meta!`);
        setGameState('finished');
        break;
      default:
        nextTurn();
    }
  };

  const updatePlayerScore = (playerIndex: number, score: number) => {
    const newPlayers = [...players];
    newPlayers[playerIndex].score += score;
    setPlayers(newPlayers);
  };

  const nextTurn = () => {
    setCurrentPlayer((prev) => (prev + 1) % players.length);
  };

  const finishMinigame = (score: number) => {
    updatePlayerScore(currentPlayer, score);
    setCurrentMinigame(null);
    setGameState('playing');
    nextTurn();
  };

  const startGame = () => {
    setGameStarted(true);
    setGameState('playing');
    toast.success("¡El juego ha comenzado! Es el turno de " + players[currentPlayer].name);
  };

  const addPlayer = () => {
    if (players.length < 4) {
      const colors = ['bg-[#10a4b8]', 'bg-red-500', 'bg-[#fbc932]', 'bg-[#333F48]'];
      const newPlayer: Player = {
        id: players.length + 1,
        name: `Jugador ${players.length + 1}`,
        position: 0,
        color: colors[players.length],
        score: 0
      };
      setPlayers([...players, newPlayer]);
    }
  };

  const resetGame = () => {
    setPlayers(players.map(p => ({ ...p, position: 0, score: 0 })));
    setCurrentPlayer(0);
    setGameState('setup');
    setGameStarted(false);
    setCurrentMinigame(null);
  };

  if (currentMinigame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#333F48] to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => {
              setCurrentMinigame(null);
              setGameState('playing');
              nextTurn();
            }}
            className="mb-6 bg-[#333F48] hover:bg-[#222a30]"
          >
            Saltar Minijuego
          </Button>
          
          {currentMinigame === 'emotions' && <EmotionQuiz onScore={finishMinigame} />}
          {currentMinigame === 'breathing' && <BreathingExercise />}
          {currentMinigame === 'parenting' && <ParentingScenarios onScore={finishMinigame} />}
          {currentMinigame === 'coordination' && <CoordinationGame onScore={finishMinigame} />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-[#333F48]">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-[#333F48] text-center flex items-center justify-center gap-3">
              {/*<Heart className="text-[#f35444]" />*/}
              Viaje Emocional - Juego de Mesa
              {/*<Heart className="text-[#f35444]" />*/}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                {!gameStarted && (
                  <>
                    <Button onClick={addPlayer} disabled={players.length >= 4} variant="outline">
                      Agregar Jugador ({players.length}/4)
                    </Button>
                    <Button onClick={startGame} className="bg-[#10a4b8] hover:bg-[#0e8ca0]">
                      <Play className="w-4 h-4 mr-2" />
                      Comenzar Juego
                    </Button>
                  </>
                )}
                {gameStarted && (
                  <Button onClick={resetGame} variant="outline">
                    Reiniciar Juego
                  </Button>
                )}
              </div>
              
              {gameState === 'playing' && (
                <div className="text-center">
                  <p className="text-lg font-semibold text-[#333F48] mb-2">
                    Turno de: {players[currentPlayer].name}
                  </p>
                  <Button 
                    onClick={rollDice} 
                    disabled={isRolling}
                    className="bg-[#333F48] hover:bg-[#222a30]"
                  >
                    {getDiceIcon(diceValue)}
                    <span className="ml-2">
                      {isRolling ? 'Rodando...' : 'Lanzar Dado'}
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Player Scores */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-[#333F48]">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {players.map((player, index) => (
                <div 
                  key={player.id} 
                  className={`p-3 rounded-lg border-2 ${
                    currentPlayer === index && gameState === 'playing' 
                      ? 'border-[#fbc932] bg-yellow-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-4 h-4 rounded-full ${player.color}`}></div>
                    <span className="font-semibold">{player.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Posición: {player.position} | Puntos: {player.score}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Game Board */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-[#333F48]">
          <CardContent className="p-6">
            <div className="grid grid-cols-4 gap-2 mb-4">
              {boardSpaces.map((space, index) => (
                <div
                  key={space.id}
                  className={`relative h-20 rounded-lg border-2 border-white shadow-md flex flex-col items-center justify-center ${(space.id !== 0 && space.id !== 5) ? space.color : ''}`}
                  style={(space.id === 0 || space.id === 5 || space.id === 11 || space.id === 15) ? { backgroundColor: '#10a4b8' } 
                  : space.id === 1 || space.id === 8 || space.id === 14 ? { backgroundColor: '#fbc932' } 
                  : space.id === 2 || space.id === 6 || space.id === 13 ? { backgroundColor: '#e0dbe3' } 
                  : space.id === 7 || space.id === 12 ? { backgroundColor: '#333f48' }
                  : space.id === 3 || space.id === 10 ? { backgroundColor: '#f35444' } : {}}
                >
                  <div className="text-white font-bold text-xs text-center">
                    {space.title}
                  </div>
                  <div className="text-xs text-white mt-1">#{space.id}</div>
                  
                  {/* Player pieces */}
                  <div className="absolute -top-1 -right-1 flex gap-1">
                    {players
                      .filter(player => player.position === space.id)
                      .map(player => (
                        <div
                          key={player.id}
                          className={`w-3 h-3 rounded-full ${player.color} border border-white`}
                        ></div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Game Instructions */}
        <Card className="bg-gradient-to-br from-blue to-green-50 border-2 border-[#10a4b8]">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-[#10a4b8] mb-4">¿Cómo Jugar?</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="space-y-2">
                <div><strong>Lanza el dado</strong> para avanzar por el tablero</div>
                <div><strong>Espacios Rosa:</strong> Quiz de Emociones</div>
                <div><strong>Espacios Azules:</strong> Ejercicios de Respiración</div>
                <div><strong>Espacios Verdes:</strong> Crianza Positiva</div>
              </div>
              <div className="space-y-2">
                <div><strong>Espacios Naranjas:</strong> Coordinación Mental</div>
                <div><strong>Espacios Amarillos:</strong> Puntos Bonus</div>
                <div><strong>Espacios Grises:</strong> Descanso</div>
                <div><strong>Meta:</strong> ¡Primer lugar gana!</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {gameState === 'finished' && (
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-[#fbc932]">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-[#fbc932] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#fbc932] mb-4">¡Juego Terminado!</h2>
              <div className="space-y-2">
                {[...players]
                  .sort((a, b) => b.score - a.score || (a.position > b.position ? -1 : 1))
                  .map((player, index) => (
                    <div key={player.id} className="flex justify-between items-center">
                      <span className="font-semibold">
                        {index + 1}. {player.name}
                      </span>
                      <span>{player.score} puntos</span>
                    </div>
                  ))}
              </div>
              <Button onClick={resetGame} className="mt-4 bg-[#333F48] hover:bg-[#222a30]">
                Jugar de Nuevo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BoardGame;