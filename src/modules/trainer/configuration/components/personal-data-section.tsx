import { memo } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  DollarSign,
  Award
} from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { usePersonalData } from '../hooks/use-configuration';
import { Skeleton } from '@/shared/components/ui/skeleton';

const PersonalDataSection = memo(() => {
  const { data: personalData, isLoading, error } = usePersonalData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-card/40 border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/40 border rounded-xl p-6 text-center"
      >
        <p className="text-destructive">Error al cargar los datos personales</p>
      </motion.div>
    );
  }

  if (!personalData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/40 border rounded-xl p-6 text-center"
      >
        <p className="text-muted-foreground">No se encontraron datos personales</p>
      </motion.div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/20">Activo</Badge>;
      case 'INACTIVE':
        return <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 border-gray-500/20">Inactivo</Badge>;
      case 'SUSPENDED':
        return <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/20">Suspendido</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getContractBadge = (contractType: string) => {
    const contractLabels = {
      'FULL_TIME': 'Tiempo Completo',
      'PART_TIME': 'Medio Tiempo',
      'FREELANCE': 'Freelance',
      'HOURLY': 'Por Horas'
    };
    
    return (
      <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/20">
        {contractLabels[contractType as keyof typeof contractLabels] || contractType}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header con foto y datos básicos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.01 }}
        className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="relative flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={personalData.profileImage} alt={`${personalData.firstName} ${personalData.lastName}`} />
            <AvatarFallback className="text-lg font-semibold">
              {getInitials(personalData.firstName, personalData.lastName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {personalData.firstName} {personalData.lastName}
            </h2>
            <div className="flex items-center gap-3 mb-3">
              {getStatusBadge(personalData.status)}
              {getContractBadge(personalData.contractType)}
            </div>
            <div className="flex flex-wrap gap-2">
              {personalData.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/20">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Experiencia</p>
            <p className="text-2xl font-bold text-foreground">{personalData.experience} años</p>
          </div>
        </div>
      </motion.div>

      {/* Información Personal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.01 }}
        className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg p-3 bg-blue-500/10">
              <User className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-foreground text-lg font-semibold">
              Información Personal
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Nombres</p>
              <p className="font-semibold text-foreground">{personalData.firstName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Apellidos</p>
              <p className="font-semibold text-foreground">{personalData.lastName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
              <p className="font-semibold text-foreground">{formatDate(personalData.dateOfBirth)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Género</p>
              <p className="font-semibold text-foreground">
                {personalData.gender === 'MALE' ? 'Masculino' : personalData.gender === 'FEMALE' ? 'Femenino' : 'Otro'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Información de Contacto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.01 }}
        className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg p-3 bg-green-500/10">
              <Mail className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-foreground text-lg font-semibold">
              Información de Contacto
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold text-foreground">{personalData.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-semibold text-foreground">{personalData.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p className="font-semibold text-foreground">{personalData.address}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Información Laboral */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.01 }}
        className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg p-3 bg-purple-500/10">
              <Briefcase className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-foreground text-lg font-semibold">
              Información Laboral
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Fecha de Ingreso</p>
              <p className="font-semibold text-foreground">{formatDate(personalData.hireDate)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tipo de Contrato</p>
              <div>{getContractBadge(personalData.contractType)}</div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Experiencia</p>
              <p className="font-semibold text-foreground">{personalData.experience} años</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Estado</p>
              <div>{getStatusBadge(personalData.status)}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Información Financiera */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.01 }}
        className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg p-3 bg-amber-500/10">
              <DollarSign className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="text-foreground text-lg font-semibold">
              Información Financiera
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Salario</p>
              <p className="text-2xl font-bold text-green-500">{formatCurrency(personalData.salary)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Certificaciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.01 }}
        className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg p-3 bg-indigo-500/10">
              <Award className="h-6 w-6 text-indigo-500" />
            </div>
            <h3 className="text-foreground text-lg font-semibold">
              Certificaciones
            </h3>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Certificados obtenidos</p>
            <p className="font-semibold text-foreground">{personalData.certifications}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

PersonalDataSection.displayName = 'PersonalDataSection';

export { PersonalDataSection };
