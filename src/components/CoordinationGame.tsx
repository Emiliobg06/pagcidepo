'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, RotateCcw, Play, Brain } from 'lucide-react';
import { toast } from "sonner";

interface CoordinationGameProps {
  onScore: (score: number) => void;
}

const CoordinationGame = ({ onScore }: CoordinationGameProps) => {
  const [gameActive, setGameActive] = useState(false);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const colors = [
    { id: 0, color: 'bg-[#f35444] hover:bg-red-500', active: 'bg-red-600', name: 'Rojo' },
    { id: 1, color: 'bg-[#10a4b8] hover:bg-blue-500', active: 'bg-blue-600', name: 'Azul' },
    { id: 2, color: 'bg-green-400 hover:bg-green-500', active: 'bg-green-600', name: 'Verde' },
    { id: 3, color: 'bg-[#fbc932] hover:bg-[#e6b800]', active: 'bg-[#e6b800]', name: 'Amarillo' } // Cambiado a Pantone 123 C
  ];

  const startGame = () => {
    setGameActive(true);
    setGameOver(false);
    setCurrentLevel(1);
    setScore(0);
    setPlayerSequence([]);
    generateSequence(1);
  };

  const generateSequence = (level: number) => {
    const newSequence = [];
    for (let i = 0; i < level; i++) {
      newSequence.push(Math.floor(Math.random() * 4));
    }
    setSequence(newSequence);
    setPlayerSequence([]);
    showSequence(newSequence);
  };

  const showSequence = async (seq: number[]) => {
    setShowingSequence(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    for (let i = 0; i < seq.length; i++) {
      setActiveButton(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveButton(null);
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    
    setShowingSequence(false);
  };

  const handleButtonClick = (buttonId: number) => {
    if (showingSequence || !gameActive || gameOver) return;

    const newPlayerSequence = [...playerSequence, buttonId];
    setPlayerSequence(newPlayerSequence);

    // Verificar si la secuencia es correcta hasta este punto
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      // Secuencia incorrecta
      setGameOver(true);
      setGameActive(false);
      toast.error("¡Secuencia incorrecta!", {
        description: `Llegaste al nivel ${currentLevel}. ¡Buen intento!`
      });
      onScore(score);
      return;
    }

    // Si completó la secuencia correctamente
    if (newPlayerSequence.length === sequence.length) {
      const newScore = score + (currentLevel * 10);
      setScore(newScore);
      setCurrentLevel(currentLevel + 1);
      
      toast.success(`¡Nivel ${currentLevel} completado!`, {
        description: `+${currentLevel * 10} puntos`
      });

      setTimeout(() => {
        generateSequence(currentLevel + 1);
      }, 1500);
    }
  };

  const resetGame = () => {
    setGameActive(false);
    setGameOver(false);
    setSequence([]);
    setPlayerSequence([]);
    setCurrentLevel(1);
    setScore(0);
    setActiveButton(null);
    setShowingSequence(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6" style={{ color: '#333f48' }}>
      <Card className="bg-white/90 backdrop-blur-sm border-2 border-[#fbc932]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold" style={{ color: '#333f48' }}>
            <Target className="text-[#fbc932]" />
            Juego de Coordinación Mental
          </CardTitle>
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold" style={{ color: '#fbc932' }}>
              Nivel: {currentLevel}
            </div>
            <div className="text-lg font-semibold" style={{ color: '#333f48' }}>
              Puntuación: {score}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-[#fff8e1] p-4 rounded-lg border border-[#fbc932]">
            <p className="text-center" style={{ color: '#333f48' }}>
              {!gameActive && !gameOver
                ? "Observa la secuencia de colores y repítela en el mismo orden. ¡Cada nivel añade un color más!"
                : showingSequence
                ? "Observa atentamente la secuencia..."
                : gameOver
                ? `¡Juego terminado! Llegaste al nivel ${currentLevel}`
                : `Repite la secuencia (${playerSequence.length}/${sequence.length})`
              }
            </p>
          </div>

          {/* Game Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {colors.map((colorObj) => (
              <Button
                key={colorObj.id}
                className={`h-24 w-full transition-all duration-200 ${
                  activeButton === colorObj.id ? colorObj.active : colorObj.color
                } ${showingSequence ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => handleButtonClick(colorObj.id)}
                disabled={showingSequence || !gameActive || gameOver}
              >
                <span className="font-semibold text-white">
                  {colorObj.name}
                </span>
              </Button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            {!gameActive ? (
              <Button onClick={startGame} className="bg-[#fbc932] hover:bg-[#e6b800] px-8" style={{ color: '#333f48' }}>
                <Play className="w-4 h-4 mr-2" />
                {gameOver ? 'Jugar de Nuevo' : 'Comenzar Juego'}
              </Button>
            ) : (
              <Button onClick={resetGame} variant="outline" className="px-8" style={{ borderColor: '#fbc932', color: '#333f48' }}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reiniciar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="bg-gradient-to-br from-[#fff8e1] to-purple-50 border-2 border-[#fbc932]">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#fbc932' }}>
            <Brain className="text-[#fbc932]" />
            Beneficios del Entrenamiento Cognitivo:
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm" style={{ color: '#333f48' }}>
            <div className="space-y-2">
              <div>• Mejora la memoria de trabajo</div>
              <div>• Desarrolla la concentración</div>
              <div>• Fortalece la coordinación ojo-mente</div>
            </div>
            <div className="space-y-2">
              <div>• Aumenta la velocidad de procesamiento</div>
              <div>• Mejora la atención sostenida</div>
              <div>• Desarrolla habilidades de secuenciación</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoordinationGame;