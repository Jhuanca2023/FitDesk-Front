import type { Class } from '../types/class';


export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location: string;
  capacity: number;
  trainer: string;
  description?: string;
  active: boolean;
}

export function convertClassesToEvents(classes: Class[]): CalendarEvent[] {
  if (!classes || !Array.isArray(classes)) {
    console.log('No classes provided or not an array:', classes);
    return [];
  }
  
  console.log('Converting classes to events:', classes);
  
  return classes.map(cls => {
    let classDate: Date;
    if (typeof cls.classDate === 'string') {
      const [day, month, year] = cls.classDate.split('-');
      classDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      console.log('Parsed date from string:', cls.classDate, '->', classDate);
    } else {
      classDate = new Date(cls.classDate);
      console.log('Parsed date from Date object:', cls.classDate, '->', classDate);
    }
    

    if (isNaN(classDate.getTime())) {
      console.error('Invalid date in calendar utils:', cls.classDate);
      classDate = new Date();
    }
    

    let startTime: Date;
    let endTime: Date;
    
    if (cls.schedule && typeof cls.schedule === 'string') {

      const [startTimeStr, endTimeStr] = cls.schedule.split(' - ');
      const [startHour, startMinute] = startTimeStr.split(':').map(Number);
      const [endHour, endMinute] = endTimeStr.split(':').map(Number);
      
      startTime = new Date(classDate);
      startTime.setHours(startHour, startMinute, 0, 0);
      
      endTime = new Date(classDate);
      endTime.setHours(endHour, endMinute, 0, 0);
      
      console.log('Parsed schedule:', cls.schedule, '-> start:', startTime, 'end:', endTime);
    } else {
      startTime = new Date(classDate);
      startTime.setHours(9, 0, 0, 0);
      
      endTime = new Date(startTime.getTime() + (cls.duration || 60) * 60000);
    }
    
    const event = {
      id: cls.id || '',
      title: cls.className || 'Clase sin nombre',
      start: startTime,
      end: endTime,
      location: cls.locationName || 'Sala no especificada',
      capacity: cls.maxCapacity || 0,
      trainer: cls.trainerName || 'Entrenador no asignado',
      description: cls.description,
      active: cls.active ?? true
    };
    
    console.log('Created event:', event);
    return event;
  });
}
