import { AIChatbot } from '../components/AIChatbot';

export default function AIChatbotPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Asistente Virtual de FitDesk</h1>
        <p className="text-muted-foreground">
          Obtén recomendaciones personalizadas de entrenamiento basadas en tus estadísticas y objetivos.
        </p>
      </div>
      <AIChatbot />
    </div>
  );
}

