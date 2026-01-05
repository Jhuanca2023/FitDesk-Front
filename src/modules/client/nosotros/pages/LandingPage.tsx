import { Header } from '../components/Header';
import Marcas from '../components/Marcas';
import NuestraHistoria from '../components/NuestraHistoria';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <NuestraHistoria />
      <Marcas />
    </div>
  );
};

export default LandingPage;