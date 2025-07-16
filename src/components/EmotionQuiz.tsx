import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Lightbulb } from 'lucide-react';
import { toast } from "sonner";

interface EmotionQuizProps {
  onScore: (score: number) => void;
}

const EmotionQuiz = ({ onScore }: EmotionQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const questions = [
    {
      question: "¿Qué emoción describes mejor cuando alguien no respeta tus límites personales?",
      options: ["Tristeza", "Frustración", "Miedo", "Alegría"],
      correct: 1,
      explanation: "La frustración es una respuesta natural cuando nuestros límites no son respetados. Es importante comunicar nuestras necesidades de manera asertiva."
    },
    {
      question: "Un niño llora porque no puede tener un juguete. ¿Cuál es la mejor respuesta empática?",
      options: [
        "No llores, es solo un juguete",
        "Veo que estás muy triste porque querías ese juguete",
        "Los niños grandes no lloran",
        "Si sigues llorando no tendrás nada"
      ],
      correct: 1,
      explanation: "Validar las emociones del niño y nombrarlas ayuda a desarrollar su inteligencia emocional y se siente comprendido."
    },
    {
      question: "¿Cuál de estas es una técnica efectiva para manejar la ansiedad?",
      options: [
        "Ignorar los sentimientos",
        "Respiración profunda y consciente",
        "Beber café para tener más energía",
        "Evitar todas las situaciones difíciles"
      ],
      correct: 1,
      explanation: "La respiración consciente activa el sistema nervioso parasimpático, ayudando a reducir la ansiedad de manera natural."
    },
    {
      question: "¿Qué valor es fundamental en la crianza positiva?",
      options: ["Control total", "Respeto mutuo", "Obediencia ciega", "Competencia"],
      correct: 1,
      explanation: "El respeto mutuo crea un ambiente donde tanto padres como hijos se sienten valorados y pueden desarrollarse saludablemente."
    },
    {
      question: "¿Cómo puedes mostrar empatía cuando alguien está pasando por un momento difícil?",
      options: [
        "Darle consejos inmediatamente",
        "Escuchar activamente sin juzgar",
        "Cambiar de tema para animarlo",
        "Comparar con tus propios problemas"
      ],
      correct: 1,
      explanation: "La escucha activa sin juicio permite que la persona se sienta verdaderamente comprendida y apoyada."
    }
  ];

  const handleAnswer = (selectedAnswer: number) => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + 20);
      toast.success("¡Correcto! +20 puntos", {
        description: "Excelente comprensión emocional"
      });
    } else {
      toast.error("Respuesta incorrecta", {
        description: "No te preocupes, cada error es una oportunidad de aprender"
      });
    }
    
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
      onScore(score);
      toast.success(`¡Quiz completado! Puntuación final: ${score}/100`);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowExplanation(false);
    setQuizComplete(false);
  };

  if (quizComplete) {
    return (
      <Card className="max-w-2xl mx-auto bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-800 flex items-center justify-center gap-2">
            <CheckCircle className="text-green-600" />
            ¡Quiz Completado!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-6xl font-bold text-green-600">{score}/100</div>
          <div className="space-y-2">
            {score >= 80 && (
              <p className="text-lg text-green-700 font-semibold">
                ¡Excelente! Tienes una comprensión muy sólida de las habilidades socioemocionales.
              </p>
            )}
            {score >= 60 && score < 80 && (
              <p className="text-lg text-blue-700 font-semibold">
                ¡Buen trabajo! Estás en el camino correcto para desarrollar tu inteligencia emocional.
              </p>
            )}
            {score < 60 && (
              <p className="text-lg text-orange-700 font-semibold">
                ¡Sigue practicando! Cada paso en el aprendizaje emocional es valioso.
              </p>
            )}
          </div>
          <Button 
            onClick={resetQuiz}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
          >
            Intentar de Nuevo
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm border-2" style={{borderColor: '#f35444'}}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold" style={{ color: '#333f48' }}>
            Quiz de Emociones
          </CardTitle>
          <div className="text-lg font-semibold" style={{ color: '#f35444' }}>
            {currentQuestion + 1}/{questions.length}
          </div>
        </div>
        <div className="text-right text-lg font-semibold" style={{ color: '#333f48' }}>
          Puntuación: {score}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-[#fde6e1] p-4 rounded-lg border" style={{ borderColor: '#f35444' }}>
          <h3 className="text-xl font-semibold mb-4" style={{ color: '#333f48' }}>
            {questions[currentQuestion].question}
          </h3>
        </div>

        {!showExplanation ? (
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(index)}
                variant="outline"
                className="w-full p-4 text-left justify-start hover:bg-[#fde6e1]"
                style={{ color: '#333f48', borderColor: '#f35444' }}
              >
                {option}
              </Button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: '#333f48' }}>Explicación:</h4>
                  <p style={{ color: '#333f48' }}>{questions[currentQuestion].explanation}</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={nextQuestion}
              className="w-full bg-[#f35444] hover:bg-[#d13d2f] text-white py-3"
            >
              {currentQuestion < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionQuiz;