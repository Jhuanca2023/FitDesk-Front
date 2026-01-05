import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { ArrowLeft, User, Calendar, FileImage, Mail, Phone, MapPin, Briefcase, DollarSign, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import type { Trainer } from '../types';
import { CertificationImages } from './CertificationImages';


const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface TrainerDetailViewProps {
  trainer: Trainer;
  onBack: () => void;
}

export const TrainerDetailView: React.FC<TrainerDetailViewProps> = ({
  trainer,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('information');

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { label: 'Activo', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      INACTIVE: { label: 'Inactivo', className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' },
      SUSPENDED: { label: 'Suspendido', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.INACTIVE;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getContractTypeBadge = (contractType: string) => {
    const contractConfig = {
      FULL_TIME: { label: 'Tiempo completo', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
      PART_TIME: { label: 'Medio tiempo', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
      FREELANCE: { label: 'Freelance', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
      PER_HOUR: { label: 'Por hora', className: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400' }
    };
    
    const config = contractConfig[contractType as keyof typeof contractConfig] || contractConfig.FREELANCE;
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const ddmmyyyy = /^\d{2}-\d{2}-\d{4}$/;
    const yyyymmdd = /^\d{4}-\d{2}-\d{2}$/;
    let date: Date;
    if (ddmmyyyy.test(dateString)) {
      const [day, month, year] = dateString.split('-').map(Number);
      date = new Date(year, month - 1, day);
    } else if (yyyymmdd.test(dateString)) {
      date = new Date(dateString);
    } else {
      const tryDate = new Date(dateString);
      if (isNaN(tryDate.getTime())) return dateString;
      date = tryDate;
    }
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatSalary = (salary: number | null | undefined, contractType: string) => {
    if (salary == null || Number.isNaN(Number(salary))) {
      return 'N/A';
    }
    const amount = Number(salary);
    const formatted = amount.toLocaleString('es-PE');
    if (contractType === 'PER_HOUR') {
      return `S/ ${formatted} por hora`;
    }
    return `S/ ${formatted} mensuales`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Entrenadores
        </Button>
      </div>

      {/* Trainer Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.004 }}
        className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
       
        <div className="relative">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                {trainer.profileImage && typeof trainer.profileImage === 'string' ? (
                  <img
                    src={trainer.profileImage}
                    alt={`${trainer.firstName} ${trainer.lastName}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-primary" />
                )}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {trainer.firstName} {trainer.lastName}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {trainer.specialties}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    {getStatusBadge(trainer.status)}
                    {getContractTypeBadge(trainer.contractType)}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Experiencia</p>
                  <p className="text-lg font-semibold">
                    {trainer.yearsOfExperience} {trainer.yearsOfExperience === 1 ? 'año' : 'años'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
        <TabsList className="grid w-full grid-cols-3 bg-black/90 backdrop-blur-sm border border-white/10 rounded-xl p-1 h-12">
          <TabsTrigger 
            value="information" 
            className="flex items-center gap-2 text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-lg transition-all duration-200 font-medium"
          >
            <User className="h-4 w-4" />
            Mi Información
          </TabsTrigger>
          <TabsTrigger 
            value="schedule" 
            className="flex items-center gap-2 text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-lg transition-all duration-200 font-medium"
          >
            <Calendar className="h-4 w-4" />
            Mis Horarios
          </TabsTrigger>
          <TabsTrigger 
            value="certificates" 
            className="flex items-center gap-2 text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-lg transition-all duration-200 font-medium"
          >
            <FileImage className="h-4 w-4" />
            Mis Certificados
          </TabsTrigger>
        </TabsList>

        {/* Mi Información */}
        <TabsContent value="information" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información Personal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.005 }}
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
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nombres</p>
                      <p className="text-sm font-semibold">{trainer.firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Apellidos</p>
                      <p className="text-sm font-semibold">{trainer.lastName}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Documento</p>
                    <p className="text-sm font-mono font-semibold">{trainer.documentNumber}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</p>
                    <p className="text-sm font-semibold">{formatDate(trainer.birthDate)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Género</p>
                    <p className="text-sm font-semibold">
                      {trainer.gender === 'MALE' ? 'Masculino' : trainer.gender === 'FEMALE' ? 'Femenino' : 'Otro'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Información de Contacto */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.005 }}
              className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg p-3 bg-green-500/10">
                    <Mail className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-foreground text-lg font-semibold">
                    Contacto
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">{trainer.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">{trainer.phone}</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm font-semibold">{trainer.address}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Información Laboral */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.005 }}
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
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Especialidades</p>
                    <p className="text-sm font-semibold">{trainer.specialties}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Experiencia</p>
                    <p className="text-sm font-semibold">{trainer.yearsOfExperience} {trainer.yearsOfExperience === 1 ? 'año' : 'años'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fecha de Ingreso</p>
                    <p className="text-sm font-semibold">{formatDate(trainer.joinDate)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tipo de Contrato</p>
                    <div className="mt-1">
                      {getContractTypeBadge(trainer.contractType)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Información Financiera */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.005 }}
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
                    <p className="text-sm font-medium text-muted-foreground">Salario</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatSalary(trainer.salary, trainer.contractType)}
                    </p>
                  </div>
                  
                  {trainer.bankInfo && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Información Bancaria</p>
                      <p className="text-sm font-mono font-semibold">{trainer.bankInfo}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Notas */}
          {trainer.notes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.005 }}
              className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg p-3 bg-indigo-500/10">
                    <FileImage className="h-6 w-6 text-indigo-500" />
                  </div>
                  <h3 className="text-foreground text-lg font-semibold">
                    Notas Adicionales
                  </h3>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{trainer.notes}</p>
                </div>
              </div>
            </motion.div>
          )}
        </TabsContent>

        {/* Mis Horarios */}
        <TabsContent value="schedule" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.005 }}
            className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg p-3 bg-blue-500/10">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-foreground text-lg font-semibold">
                  Disponibilidad Semanal
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(trainer.availability).map(([day, available]) => (
                  <div
                    key={day}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-colors",
                      available
                        ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                        : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{day}</span>
                      <Badge
                        variant={available ? "default" : "secondary"}
                        className={available ? "bg-green-600" : ""}
                      >
                        {available ? "Disponible" : "No disponible"}
                      </Badge>
                    </div>
                    
                    {available && trainer.startTime && trainer.endTime && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        {trainer.startTime} - {trainer.endTime}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {trainer.startTime && trainer.endTime && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Horario General</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    {trainer.startTime} - {trainer.endTime}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </TabsContent>

        {/* Mis Certificados */}
        <TabsContent value="certificates" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.005 }}
            className="group relative bg-card/40 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg p-3 bg-green-500/10">
                  <FileImage className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-foreground text-lg font-semibold">
                  Certificados y Credenciales
                </h3>
              </div>
              
              <div className="space-y-6">
                {trainer.certifications && (
                  <div>
                    <h4 className="font-medium mb-2">Certificaciones</h4>
                    <p className="text-sm text-muted-foreground">{trainer.certifications}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-4">Documentos de Certificación</h4>
                  <CertificationImages
                    images={trainer.certificationImages}
                    trainerName={`${trainer.firstName} ${trainer.lastName}`}
                    certifications={trainer.certifications}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
