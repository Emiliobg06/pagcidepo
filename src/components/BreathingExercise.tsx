import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';
import { toast } from "sonner";

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState('4-4-4');

  const exercises = {
    '4-4-4': { inhale: 4, hold: 4, exhale: 4, name: 'Respiración Cuadrada' },
    '4-7-8': { inhale: 4, hold: 7, exhale: 8, name: 'Técnica 4-7-8 (Relajación)' },
    '6-2-6': { inhale: 6, hold: 2, exhale: 6, name: 'Respiración Calmante' }
  };

  const currentExercise = exercises[selectedExercise as keyof typeof exercises];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Cambiar de fase
      if (phase === 'inhale') {
        setPhase('hold');
        setTimeLeft(currentExercise.hold);
      } else if (phase === 'hold') {
        setPhase('exhale');
        setTimeLeft(currentExercise.exhale);
      } else {
        setPhase('inhale');
        setTimeLeft(currentExercise.inhale);
        setCycle(cycle + 1);
        
        if (cycle + 1 === 5) {
          setIsActive(false);
          toast.success("¡Ejercicio completado!", {
            description: "Has completado 5 ciclos de respiración. ¡Excelente trabajo!"
          });
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, phase, currentExercise, cycle]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setTimeLeft(currentExercise.inhale);
    setCycle(0);
    toast.info("Ejercicio iniciado", {
      description: "Sigue las instrucciones en pantalla"
    });
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimeLeft(currentExercise.inhale);
    setCycle(0);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Inhala profundamente';
      case 'hold': return 'Mantén la respiración';
      case 'exhale': return 'Exhala lentamente';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-[#10a4b8] to-[#10a4b8]'; // Pantone 7710C
      case 'hold': return 'from-[#fbc932] to-[#fbc932]'; // Pantone 1205C
      case 'exhale': return 'from-[#f35444] to-[#f35444]';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6" style={{ color: '#333f48' }}>
      {/* Exercise Selection */}
      <Card className="bg-white/90 backdrop-blur-sm border-2" style={{ borderColor: '#10a4b8' }}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2" style={{ color: '#10a4b8' }}>
            <Wind className="text-[#10a4b8]" />
            Ejercicios de Respiración
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p style={{ color: '#333f48' }}>
              Selecciona un ejercicio de respiración para reducir el estrés y mejorar tu bienestar:
            </p>
            <div className="grid gap-3">
              {Object.entries(exercises).map(([key, exercise]) => (
                <Button
                  key={key}
                  variant={selectedExercise === key ? "default" : "outline"}
                  onClick={() => setSelectedExercise(key)}
                  className={`text-left justify-start p-4 h-auto ${
                    selectedExercise === key ? 'bg-[#10a4b8] hover:bg-[#0e8ca0]' : 'hover:bg-[#e0f7fa]'
                  }`}
                  style={{
                    color: selectedExercise === key ? '#fff' : '#333f48',
                    borderColor: '#10a4b8'
                  }}
                >
                  <div>
                    <div className="font-semibold">{exercise.name}</div>
                    <div className="text-sm opacity-80">
                      Inhalar: {exercise.inhale}s • Mantener: {exercise.hold}s • Exhalar: {exercise.exhale}s
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breathing Circle */}
      <Card className="bg-white/90 backdrop-blur-sm border-2" style={{ borderColor: '#10a4b8' }}>
        <CardContent className="p-8">
          <div className="text-center space-y-8">
            {/* Breathing Circle */}
            <div className="relative mx-auto w-64 h-64 flex items-center justify-center">
              <div 
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${getPhaseColor()} transition-all duration-1000 ${
                  isActive ? (phase === 'inhale' ? 'scale-110' : phase === 'exhale' ? 'scale-75' : 'scale-100') : 'scale-100'
                } opacity-80`}
              />
              <div className="relative z-10 text-center text-white">
                <div className="text-2xl font-bold mb-2">{timeLeft}</div>
                <div className="text-lg font-semibold">{getPhaseText()}</div>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold" style={{ color: '#333f48' }}>
                {currentExercise.name}
              </h3>
              <p style={{ color: '#333f48' }}>
                Ciclo {cycle}/5 • {phase === 'inhale' ? 'Inspirando' : phase === 'hold' ? 'Reteniendo' : 'Espirando'}
              </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              {!isActive ? (
                <Button onClick={startExercise} className="bg-[#10a4b8] hover:bg-[#0e8ca0] px-8 text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Comenzar
                </Button>
              ) : (
                <Button onClick={pauseExercise} variant="outline" className="px-8" style={{ borderColor: '#10a4b8', color: '#10a4b8' }}>
                  <Pause className="w-4 h-4 mr-2" />
                  Pausar
                </Button>
              )}
              <Button onClick={resetExercise} variant="outline" className="px-8" style={{ borderColor: '#10a4b8', color: '#10a4b8' }}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reiniciar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="bg-gradient-to-br from-[#e0f7fa] to-green-50 border-2" style={{ borderColor: '#10a4b8' }}>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#10a4b8' }}>
            Beneficios de la Respiración Consciente:
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm" style={{ color: '#333f48' }}>
            <div className="space-y-2">
              <div>• Reduce el estrés y la ansiedad</div>
              <div>• Mejora la concentración</div>
              <div>• Regula las emociones</div>
            </div>
            <div className="space-y-2">
              <div>• Activa el sistema nervioso parasimpático</div>
              <div>• Mejora la calidad del sueño</div>
              <div>• Aumenta la sensación de calma</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreathingExercise;