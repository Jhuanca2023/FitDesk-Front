import SesionesBanner from '../components/SesionesBanner';
import PlanesPapelSection from '../components/PlanesPapelSection';
import ClientesObjetivoSection from '../components/ClientesObjetivoSection';
import SeguimientoProgresoSection from '../components/SeguimientoProgresoSection';
import SoftwareSection from '../components/SofwareSection';
import FQASection from '../components/FQASection';

export default function SesionesPersonalizadasPage() {
  return (
    <main className="relative">
  
      <div className="pointer-events-none -z-10">
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-primary/30 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-64 left-1/2 transform -translate-x-1/2 w-60 h-60 bg-primary/20 rounded-full blur-2xl opacity-50" />
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary/25 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 w-72 h-72 bg-primary/20 rounded-full blur-2xl opacity-40" />
        <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2 w-72 h-72 bg-primary/20 rounded-full blur-2xl opacity-40" />
      </div>

      <SesionesBanner />
      <PlanesPapelSection />
      <ClientesObjetivoSection />
      <SeguimientoProgresoSection />
      <SoftwareSection />
      <FQASection />
    </main>
  );
}
