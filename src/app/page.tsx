'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Brain, Users, Target, ArrowLeft, Gamepad2 } from 'lucide-react';
import EmotionQuiz from '@/components/EmotionQuiz';
import BreathingExercise from '@/components/BreathingExercise';
import ParentingScenarios from '@/components/ParentingScenarios';
import CoordinationGame from '@/components/CoordinationGame';
import BoardGame from '@/components/BoardGame';
//import RetroGame from '@/components/RetroGame';
import Image from "next/image";
import Logo from "@/components/Logo";

const Index = () => {
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [userScore, setUserScore] = useState(0);

  const games = [
    {
      id: 'boardgame',
      title: 'Juego de Mesa Virtual',
      description: 'Experimenta todos los desafíos en un emocionante juego de mesa multijugador',
      icon: Gamepad2,
      color: 'bg-[#f0f2f4] hover:bg-[#e0e4e8] border-[#c2c8d0]',
      iconColor: 'text-[#333F48]',
      featured: true
    },
    {
      id: 'emotions',
      title: 'Quiz de Emociones',
      description: 'Identifica y comprende diferentes emociones y sentimientos',
      icon: Heart,
      color: 'bg-[#fde6e1] hover:bg-[#fcd2c8] border-[#f35444]', // rosa -> #f35444
      iconColor: 'text-[#f35444]'
    },
    {
      id: 'breathing',
      title: 'Ejercicios de Respiración',
      description: 'Aprende técnicas de relajación y manejo del estrés',
      icon: Brain,
      color: 'bg-[#e0f7fa] hover:bg-[#b2eaf2] border-[#10a4b8]', // azul -> #10a4b8
      iconColor: 'text-[#10a4b8]'
    },
    {
      id: 'parenting',
      title: 'Crianza Positiva',
      description: 'Practica habilidades de comunicación y crianza respetuosa',
      icon: Users,
      color: 'bg-[#e0f7fa] hover:bg-[#b2eaf2] border-[#10a4b8]', // verde -> #10a4b8
      iconColor: 'text-[#10a4b8]'
    },
    {
      id: 'coordination',
      title: 'Coordinación Mental',
      description: 'Mejora tu coordinación y habilidades cognitivas',
      icon: Target,
      color: 'bg-[#fff8e1] hover:bg-[#fbeab6] border-[#fbc932]', // amarillo -> #fbc932
      iconColor: 'text-[#fbc932]'
    }
  ];

  const renderCurrentGame = () => {
    switch (currentGame) {
      case 'boardgame':
        return <BoardGame />;
      case 'emotions':
        return <EmotionQuiz onScore={(score) => setUserScore(prev => prev + score)} />;
      case 'breathing':
        return <BreathingExercise />;
      case 'parenting':
        return <ParentingScenarios onScore={(score) => setUserScore(prev => prev + score)} />;
      case 'coordination':
        return <CoordinationGame onScore={(score) => setUserScore(prev => prev + score)} />;
      default:
        return null;
    }
  };

  if (currentGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f2f4] to-pink-50 p-4"> {/* Updated gradient */}
      <Logo />
        <div className="max-w-4xl mx-auto">
          {(
            <Button
              onClick={() => setCurrentGame(null)}
              className="mb-6 bg-[#333F48] hover:bg-[#2a343c]" // Pantone 432 C
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Menú
            </Button>
          )}
          {renderCurrentGame()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f2f4] to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Logo en la parte superior izquierda */}
        <div className="flex items-center mb-4">
          <div className="w-24 h-24 relative">
            <Image
              src="/logo.png" // Cambia esta ruta si tu logo está en otra ubicación
              alt="Logo CIDEPO"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-[#333F48] mb-4 flex items-center justify-center gap-3">
            {/*<Heart className="text-[#F35444] animate-pulse" /> */}
            CIDEPO
            {/*<Heart className="text-[#F35444] animate-pulse" /> */}
          </h1>
          <p className="text-xl text-[#333F48] max-w-2xl mx-auto">
            Un espacio seguro para explorar emociones, desarrollar habilidades socioemocionales 
            y practicar la crianza positiva de manera divertida e interactiva.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-lg font-semibold text-[#333F48]">
              Puntuación Total: {userScore}
            </span>
          </div>
        </div>

        {/* Featured Game */}
        {games.filter(game => game.featured).map((game) => {
          const IconComponent = game.icon;
          return (
            <Card 
              key={game.id} 
              className={`${game.color} border-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl mb-8`}
              onClick={() => setCurrentGame(game.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-6 rounded-full bg-white shadow-lg">
                    <IconComponent className={`w-12 h-12 ${game.iconColor}`} />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-800">
                  {game.title}
                </CardTitle>
                <div className="text-lg text-[#333F48] font-semibold"> </div> {/* Pantone 432 C */}
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-center text-xl leading-relaxed mb-4">
                  {game.description}
                </p>
                <Button 
                  className="w-full mt-6 bg-[#333F48] hover:bg-[#2a343c] text-white font-bold py-4 text-lg" // Pantone 432 C
                >
                  ¡Jugar Ahora!
                </Button>
              </CardContent>
            </Card>
          );
        })}

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#333F48]">O juega los desafíos por separado:</h2> {/* Pantone 432 C */}
        </div>

        {/* Individual Games Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {games.filter(game => !game.featured).map((game) => {
            const IconComponent = game.icon;
            return (
              <Card 
                key={game.id} 
                className={`${game.color} border-2 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                onClick={() => setCurrentGame(game.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-white shadow-md">
                      <IconComponent className={`w-8 h-8 ${game.iconColor}`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    {game.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-center text-lg leading-relaxed">
                    {game.description}
                  </p>
                  <Button 
                    className="w-full mt-6 bg-white text-gray-800 hover:bg-gray-50 font-semibold py-3"
                  >
                    ¡Comenzar!
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Benefits Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#c2c8d0]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-[#333F48]">
              Beneficios del Aprendizaje Socioemocional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-3">
                <div className="p-3 bg-[#fde6e1] rounded-full w-fit mx-auto">
                  <Heart className="w-6 h-6 text-[#f35444]" />
                </div>
                <h3 className="font-semibold text-[#333F48]">Inteligencia Emocional</h3>
                <p className="text-[#333F48]">Desarrolla la capacidad de reconocer y gestionar emociones</p>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-[#e0f7fa] rounded-full w-fit mx-auto">
                  <Users className="w-6 h-6 text-[#10a4b8]" />
                </div>
                <h3 className="font-semibold text-[#333F48]">Relaciones Saludables</h3>
                <p className="text-[#333F48]">Mejora la comunicación y vínculos con otros</p>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-[#fff8e1] rounded-full w-fit mx-auto">
                  <Brain className="w-6 h-6 text-[#fbc932]" />
                </div>
                <h3 className="font-semibold text-[#333F48]">Bienestar Mental</h3>
                <p className="text-[#333F48]">Reduce el estrés y aumenta la resiliencia</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;