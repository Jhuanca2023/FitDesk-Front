import {
  Dribbble,
  Facebook,
  Github,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react';
import { Link } from 'react-router';
import fitdeskLogo from '@/assets/logo.svg';
import { Image } from './ui/image';

const data = {
  facebookLink: 'https://facebook.com/fitdesk',
  instaLink: 'https://instagram.com/fitdesk',
  twitterLink: 'https://twitter.com/fitdesk',
  githubLink: 'https://github.com/fitdesk',
  dribbbleLink: 'https://dribbble.com/fitdesk',
  services: {
    webdev: '/desarrollo-web',
    webdesign: '/diseno-web',
    marketing: '/marketing-digital',
    googleads: '/anuncios-google',
  },
  about: {
    history: '/historia-empresa',
    team: '/nuestro-equipo',
    handbook: '/manual-empleado',
    careers: '/carreras',
  },
  help: {
    faqs: '/preguntas-frecuentes',
    support: '/soporte',
    livechat: '/chat-en-vivo',
  },
  contact: {
    email: 'fitdeskdev@gmail.com',
    phone: '+51 123 456 789',
    address: 'Trujillo, Perú',
  },
  company: {
    name: 'FitDesk',
    description:
      'Tu solución integral para el manejo de gimnasios y centros de entrenamiento. Ofrecemos herramientas poderosas para administrar clientes, clases y pagos.',
    logo: fitdeskLogo,
  },
};

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: data.facebookLink },
  { icon: Instagram, label: 'Instagram', href: data.instaLink },
  { icon: Twitter, label: 'Twitter', href: data.twitterLink },
  { icon: Github, label: 'GitHub', href: data.githubLink },
  { icon: Dribbble, label: 'Dribbble', href: data.dribbbleLink },
];

const aboutLinks = [
  { text: 'Nuestra Historia', href: data.about.history },
  { text: 'Conoce al Equipo', href: data.about.team },
  { text: 'Manual del Empleado', href: data.about.handbook },
  { text: 'Carreras', href: data.about.careers },
];

const serviceLinks = [
  { text: 'Desarrollo Web', href: data.services.webdev },
  { text: 'Diseño Web', href: data.services.webdesign },
  { text: 'Marketing Digital', href: data.services.marketing },
  { text: 'Anuncios de Google', href: data.services.googleads },
];

const helpfulLinks = [
  { text: 'Preguntas Frecuentes', href: data.help.faqs },
  { text: 'Soporte', href: data.help.support },
  { text: 'Chat en Vivo', href: data.help.livechat, hasIndicator: true },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];

export const Footer = () => {
  return (
    <footer className="bg-secondary dark:bg-secondary/20 mt-16 w-full place-self-end rounded-t-xl">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="text-primary flex justify-center gap-2 sm:justify-start">
              <Image
                src={data.company.logo}
                className="h-9 w-9"
                alt="Logo de FitDesk"
              />
              <span className="bg-gradient-to-r from-rose-500 to-rose-700 bg-clip-text text-xl font-bold text-transparent">
                {data.company.name}
              </span>
            </div>

            <p className="text-foreground/50 mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link prefetch="none" to={href}
                    className="text-primary hover:text-primary/80 transition"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-6" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Acerca de Nosotros</p>
              <ul className="mt-8 space-y-4 text-sm">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-secondary-foreground/70 transition"
                      href={href}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Nuestros Servicios</p>
              <ul className="mt-8 space-y-4 text-sm">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-secondary-foreground/70 transition"
                      href={href}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Enlaces Útiles</p>
              <ul className="mt-8 space-y-4 text-sm">
                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className={`${
                        hasIndicator
                          ? 'group flex justify-center gap-1.5 sm:justify-start'
                          : 'text-secondary-foreground/70 transition'
                      }`}
                    >
                      <span className="text-secondary-foreground/70 transition">
                        {text}
                      </span>
                      {hasIndicator && (
                        <span className="relative flex size-2">
                          <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                          <span className="bg-primary relative inline-flex size-2 rounded-full" />
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Contáctanos</p>
              <ul className="mt-8 space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text}>
                    <a
                      className="flex items-center justify-center gap-1.5 sm:justify-start"
                      href="/"
                    >
                      <Icon className="text-primary size-5 shrink-0 shadow-sm" />
                      {isAddress ? (
                        <address className="text-secondary-foreground/70 -mt-0.5 flex-1 not-italic transition">
                          {text}
                        </address>
                      ) : (
                        <span className="text-secondary-foreground/70 flex-1 transition">
                          {text}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm">
              <span className="block sm:inline">Todos los derechos reservados.</span>
            </p>

            <p className="text-secondary-foreground/70 mt-4 text-sm transition sm:order-first sm:mt-0">
              &copy; 2025 {data.company.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}