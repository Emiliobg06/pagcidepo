import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, Lightbulb, CheckCircle } from 'lucide-react';
import { toast } from "sonner";

interface ParentingScenariosProps {
  onScore: (score: number) => void;
}

const ParentingScenarios = ({ onScore }: ParentingScenariosProps) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [completedScenarios, setCompletedScenarios] = useState(0);

  const scenarios = [
    {
      situation: "Tu hijo de 8 años llega a casa llorando porque sus amigos no quisieron jugar con él en el recreo.",
      options: [
        "Le dices que no sea llorón y que busque otros amigos",
        "Le preguntas cómo se siente y escuchas su historia sin juzgar",
        "Le das consejos inmediatos sobre cómo hacer amigos",
        "Le dices que no es importante y que se olvide del tema"
      ],
      bestOption: 1,
      feedback: {
        positive: "¡Excelente! Validar las emociones de tu hijo y escuchar activamente le ayuda a sentirse comprendido y desarrolla su inteligencia emocional. Esto fortalece la confianza y comunicación entre ustedes.",
        negative: "Recuerda que es importante validar las emociones de los niños. Escuchar sin juzgar y mostrar empatía les ayuda a procesar sus sentimientos y se sienten seguros para compartir contigo."
      }
    },
    {
      situation: "Tu hija adolescente llegó tarde a casa sin avisar y cuando le preguntas dónde estuvo, se molesta y grita.",
      options: [
        "Gritas de vuelta para demostrar quién manda en casa",
        "Te mantienes calmado/a, estableces el límite y planeas hablar cuando ambos estén más tranquilos",
        "La castigas inmediatamente sin escuchar sus razones",
        "Ignoras el comportamiento para evitar más conflicto"
      ],
      bestOption: 1,
      feedback: {
        positive: "¡Muy bien! Mantener la calma y establecer límites claros mientras planeas una conversación constructiva es la base de la crianza positiva. Esto modela autorregulación emocional.",
        negative: "En situaciones de tensión, mantener la calma y establecer límites firmes pero respetuosos es más efectivo. Los adolescentes necesitan límites claros junto con respeto y comprensión."
      }
    },
    {
      situation: "Tu hijo pequeño tiene una rabieta en el supermercado porque quiere dulces y tú has dicho que no.",
      options: [
        "Cedes y le compras los dulces para que se calme",
        "Te mantienes firme en tu decisión, reconoces sus sentimientos y le ofreces apoyo emocional",
        "Te enojas y amenazas con castigos si no para",
        "Lo ignoras completamente hasta que se calme"
      ],
      bestOption: 1,
      feedback: {
        positive: "¡Perfecto! Mantener límites consistentes mientras validas emociones enseña autocontrol y respeto. Los niños aprenden que sus sentimientos son válidos, pero no todos sus deseos serán satisfechos.",
        negative: "Mantener límites consistentes es clave en la crianza positiva. Puedes validar sus emociones ('veo que estás frustrado') mientras mantienes el límite establecido."
      }
    },
    {
      situation: "Descubres que tu hijo ha mentido sobre haber hecho su tarea cuando en realidad no la terminó.",
      options: [
        "Lo castigas severamente por mentir y por no hacer la tarea",
        "Hablas con él sobre la importancia de la honestidad y juntos buscan una solución para la tarea",
        "Le quitas todos los privilegios por una semana",
        "Haces la tarea por él para que no tenga problemas en la escuela"
      ],
      bestOption: 1,
      feedback: {
        positive: "¡Excelente enfoque! Abordar tanto la mentira como el problema subyacente (no hacer la tarea) de manera constructiva enseña responsabilidad y honestidad. Buscar soluciones juntos fortalece la relación.",
        negative: "Es importante abordar tanto la mentira como el problema original. Conversar sobre valores como la honestidad y buscar soluciones colaborativas es más efectivo que solo castigar."
      }
    }
  ];

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === scenarios[currentScenario].bestOption;
    
    if (isCorrect) {
      setScore(score + 25);
      toast.success("¡Excelente respuesta!", {
        description: "Demostraste habilidades de crianza positiva"
      });
    } else {
      toast.info("Respuesta reflexiva", {
        description: "Cada situación es una oportunidad de aprender"
      });
    }
    
    setShowFeedback(true);
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setShowFeedback(false);
      setSelectedOption(null);
      setCompletedScenarios(completedScenarios + 1);
    } else {
      setCompletedScenarios(completedScenarios + 1);
      onScore(score);
      toast.success(`¡Escenarios completados! Puntuación: ${score}/100`);
    }
  };

  const resetScenarios = () => {
    setCurrentScenario(0);
    setScore(0);
    setShowFeedback(false);
    setSelectedOption(null);
    setCompletedScenarios(0);
  };

  if (completedScenarios === scenarios.length) {
    return (
      <Card className="max-w-2xl mx-auto bg-gradient-to-br from-[#e0f7fa] to-blue-50 border-2 border-[#10a4b8]">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-[#10a4b8] flex items-center justify-center gap-2">
            <CheckCircle className="text-[#10a4b8]" />
            ¡Escenarios Completados!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-6xl font-bold text-[#10a4b8]">{score}/100</div>
          <div className="space-y-4">
            <p className="text-lg" style={{ color: '#333f48' }}>
              Has explorado diferentes situaciones de crianza y practicado respuestas basadas en la crianza positiva.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Recuerda los pilares de la crianza positiva:</h3>
              <div className="text-left text-blue-700 space-y-1">
                <div>• Validar las emociones de los niños</div>
                <div>• Establecer límites claros con respeto</div>
                <div>• Buscar soluciones colaborativas</div>
                <div>• Modelar el comportamiento que queremos ver</div>
              </div>
            </div>
          </div>
          <Button 
            onClick={resetScenarios}
            className="bg-[#10a4b8] hover:bg-[#0e8ca0] text-white px-8 py-3"
          >
            Practicar de Nuevo
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm border-2" style={{ borderColor: '#10a4b8' }}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-[#10a4b8] flex items-center gap-2">
            <Users className="text-[#10a4b8]" />
            Crianza Positiva
          </CardTitle>
          <div className="text-lg font-semibold text-[#10a4b8]">
            {currentScenario + 1}/{scenarios.length}
          </div>
        </div>
        <div className="text-right text-lg font-semibold" style={{ color: '#333f48' }}>
          Puntuación: {score}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-[#e0f7fa] p-6 rounded-lg border" style={{ borderColor: '#10a4b8' }}>
          <div className="flex items-start gap-3 mb-4">
            <Heart className="text-[#10a4b8] mt-1 flex-shrink-0" />
            <h3 className="text-lg font-semibold" style={{ color: '#333f48' }}>Situación:</h3>
          </div>
          <p style={{ color: '#333f48' }}>
            {scenarios[currentScenario].situation}
          </p>
        </div>

        {!showFeedback ? (
          <div className="space-y-3">
            <h4 className="font-semibold mb-4" style={{ color: '#333f48' }}>¿Cuál sería tu respuesta?</h4>
            {scenarios[currentScenario].options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleOptionSelect(index)}
                variant="outline"
                className="w-full p-4 text-left justify-start hover:bg-[#e0f7fa] min-h-[60px]"
                style={{ borderColor: '#10a4b8', color: '#333f48' }}
              >
                <div className="text-wrap">{option}</div>
              </Button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${
              selectedOption === scenarios[currentScenario].bestOption
                ? 'bg-[#e0f7fa] border-[#10a4b8]'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-start gap-3">
                <Lightbulb className={`mt-1 flex-shrink-0 ${
                  selectedOption === scenarios[currentScenario].bestOption
                    ? 'text-[#10a4b8]'
                    : 'text-blue-600'
                }`} />
                <div>
                  <h4 className={`font-semibold mb-2 ${
                    selectedOption === scenarios[currentScenario].bestOption
                      ? 'text-[#10a4b8]'
                      : 'text-blue-800'
                  }`}>
                    Reflexión:
                  </h4>
                  <p className={`${
                    selectedOption === scenarios[currentScenario].bestOption
                      ? 'text-[#10a4b8]'
                      : 'text-blue-700'
                  }`}>
                    {selectedOption === scenarios[currentScenario].bestOption
                      ? scenarios[currentScenario].feedback.positive
                      : scenarios[currentScenario].feedback.negative
                    }
                  </p>
                </div>
              </div>
            </div>
            <Button 
              onClick={nextScenario}
              className="w-full bg-[#10a4b8] hover:bg-[#0e8ca0] text-white py-3"
            >
              {currentScenario < scenarios.length - 1 ? 'Siguiente Escenario' : 'Ver Resultados'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParentingScenarios;