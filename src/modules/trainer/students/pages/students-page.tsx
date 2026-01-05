import { useState, useMemo, useEffect } from 'react';
import { BarChart3, RefreshCw, Users, BookOpen } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { useStudents } from '../hooks/use-students';
import { useStudentMetrics } from '../hooks/use-student-metrics';
import { useTrainerClasses, useClassStudents, useClassDetails } from '../hooks/use-class-students';
import { useStudentsStore } from '../store/students-store';

import { StudentFilters } from '../components/StudentFilters';
import { StudentsTable } from '../components/StudentsTable';
import { StudentAttendanceHistoryView } from '../components/StudentAttendanceHistoryView';
import { GeneralMetricsView } from '../components/GeneralMetricsView';

import type { Student, StudentStatus, ClassStudent } from '../types';

export default function StudentsPage() {
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<Student | null>(null);
  const [showHistoryView, setShowHistoryView] = useState(false);
  
  const { 
    filters, 
    selectedTab,
    setFilters, 
    setSelectedTab,
    pagination,
    setPagination
  } = useStudentsStore();

  // Fetch all classes for the trainer
  const { 
    data: classesData, 
    isLoading: isLoadingClasses,
    error: classesError,
    refetch: refetchClasses 
  } = useTrainerClasses();

  // Log classes data and error for debugging
  useEffect(() => {
    console.log('Clases cargadas:', classesData);
    if (classesError) {
      console.error('Error al cargar clases:', classesError);
    }
  }, [classesData, classesError]);

  // Fetch students for the selected class
  const { 
    data: classStudentsData, 
    isLoading: isLoadingClassStudents,
    refetch: refetchClassStudents 
  } = useClassStudents(selectedClassId, filters, pagination);


  // Get class details for the selected class
  const { data: selectedClass } = useClassDetails(selectedClassId);

  // Get all classes
  const classes = useMemo(() => classesData?.data || [], [classesData]);

  // Get students for the selected class
  const classStudents = useMemo(() => classStudentsData?.data || [], [classStudentsData]);
  const totalStudents = classStudentsData?.total || 0;
  // Remove unused totalPages variable

  // Handle class selection change
  const handleClassChange = (value: string) => {
    // Si el valor es 'all', establece selectedClassId como string vacío
    const newClassId = value === 'all' ? '' : value;
    setSelectedClassId(newClassId);
    // Reset pagination when changing classes
    setPagination({ ...pagination, page: 1 });
  };

  // Use regular students or class students based on selection
  const {
    students: allStudents,
    pagination: allStudentsPagination,
    isLoading: isLoadingStudents,
    refreshStudents,
    updateFilters,
    updatePagination,
    updateStatus,
    deleteStudent,
    isDeleting
  } = useStudents();

  const totalItems = selectedClassId ? totalStudents : allStudentsPagination.total;

  // Destructure only what's needed from useStudentMetrics
  useStudentMetrics();

  const displayPagination = selectedClassId ? {
    ...pagination,
    total: totalStudents,
    totalPages: Math.ceil(totalStudents / (pagination.limit || 10)),
    data: classStudents.map((classStudent: ClassStudent) => ({
      id: classStudent.id,
      firstName: classStudent.firstName,
      lastName: classStudent.lastName,
      email: classStudent.email,
      phone: classStudent.phone,
      profileImage: classStudent.profileImage,
      status: classStudent.membershipStatus as StudentStatus,
      joinDate: classStudent.joinDate,
      attendanceStatus: classStudent.attendanceStatus,
      membership: {
        type: classStudent.membershipType,
        startDate: '',
        endDate: '',
        status: classStudent.membershipStatus as 'ACTIVE' | 'EXPIRED' | 'SUSPENDED'
      },
      stats: {
        totalClasses: classStudent.totalClasses,
        attendedClasses: classStudent.attendedClasses,
        attendanceRate: classStudent.attendanceRate,
        currentStreak: 0,
        longestStreak: 0
      },
      createdAt: '',
      updatedAt: ''
    }))
  } : {
    ...allStudentsPagination,
    data: allStudents || [],
    page: allStudentsPagination.page || 1,
    limit: allStudentsPagination.limit || 10,
    total: allStudentsPagination.total || 0,
    totalPages: allStudentsPagination.totalPages || 1
  };
  
  const displayIsLoading = Boolean(isLoadingStudents || (selectedClassId && isLoadingClassStudents));

  // Handle page change
  const handlePageChange = (page: number) => {
    const newPagination = { ...displayPagination, page };
    if (selectedClassId) {
      setPagination(newPagination);
    } else {
      updatePagination(newPagination);
    }
  };

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setFilters(newFilters);
    updateFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    updateFilters({});
  };

  const handleStudentDelete = async (student: Student) => {
 
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar al estudiante ${student.firstName} ${student.lastName}?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmed) return;
    
    try {
      await deleteStudent(student.id);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleStudentStatusUpdate = async (studentId: string, status: StudentStatus) => {
    try {
      await updateStatus({ id: studentId, status });
    } catch (error) {
      console.error('Error updating student status:', error);
    }
  };

  const handleRefresh = () => {
    if (selectedClassId) {
      refetchClassStudents();
    } else {
      refreshStudents();
    }
    refetchClasses();
  };


  if (showHistoryView && selectedStudentForHistory) {
    return (
      <StudentAttendanceHistoryView 
        student={selectedStudentForHistory}
        classId={selectedClassId || undefined}
        onBack={() => setShowHistoryView(false)}
      />
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {selectedClass ? `Estudiantes de ${selectedClass.name}` : 'Gestión de Estudiantes'}
          </h1>
          <p className="text-muted-foreground">
            {selectedClass 
              ? `Administra los estudiantes de esta clase` 
              : 'Administra los estudiantes y sus asistencias'}
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Class Selector */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span>Seleccionar Clase</span>
          </CardTitle>
          <CardDescription>
            Selecciona una clase para ver sus estudiantes y métricas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => refetchClasses()}
              disabled={isLoadingClasses}
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingClasses ? 'animate-spin' : ''}`} />
            </Button>
            <Select 
              value={selectedClassId} 
              onValueChange={handleClassChange}
              disabled={isLoadingClasses}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder={isLoadingClasses ? 'Cargando clases...' : 'Selecciona una clase'} />
              </SelectTrigger>
              <SelectContent>
                {classesError ? (
                  <div className="p-2 text-sm text-red-500">
                    Error al cargar las clases. Intenta recargar la página.
                  </div>
                ) : (
                  <SelectItem value="all">
                    <span className="font-medium">Todos los estudiantes</span>
                  </SelectItem>
                )}
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    <div className="flex items-center gap-2">
                      <span>{cls.name}</span>
                      <Badge variant="outline" className="ml-2">
                        {cls.status}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedClass && (
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Instructor:</span> {selectedClass.trainer?.name || 'No especificado'}
                  <span className="mx-2">•</span>
                  <span className="font-medium">Horario:</span> {selectedClass.schedule?.[0] ? 
                    `${selectedClass.schedule[0].dayOfWeek} ${selectedClass.schedule[0].startTime}-${selectedClass.schedule[0].endTime}` : 
                    'No especificado'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs 
        value={selectedTab} 
        onValueChange={(value) => setSelectedTab(value as 'students' | 'metrics')}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Estudiantes</span>
              {selectedClassId && (
                <Badge variant="secondary" className="ml-1">
                  {totalItems}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="metrics" 
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Métricas</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="students" className="space-y-4">
          <StudentFilters 
            filters={filters} 
            onFiltersChange={handleFiltersChange} 
            onClearFilters={handleClearFilters} 
          />
          {isLoadingClasses ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : (
            <StudentsTable 
              students={displayPagination.data}
              pagination={{
                data: displayPagination.data,
                total: displayPagination.total,
                totalPages: displayPagination.totalPages,
                page: displayPagination.page || 1,
                limit: displayPagination.limit || 10
              }}
              isLoading={displayIsLoading}
              isClassSpecific={!!selectedClassId}
              onPageChange={handlePageChange}
              onStudentStatusUpdate={handleStudentStatusUpdate}
              onStudentDelete={handleStudentDelete}
              onStudentMessage={(student) => {
                
                console.log('Enviar mensaje a:', student.email);
              }}
              onStudentHistory={(student) => {
                setSelectedStudentForHistory(student);
                setShowHistoryView(true);
              }}
              isDeleting={isDeleting}
            />
          )}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <GeneralMetricsView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
