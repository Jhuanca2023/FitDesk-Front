import type { TrainerClass, CalendarEvent } from '../types';

export function convertClassesToEvents(classes: TrainerClass[]): CalendarEvent[] {
  if (!classes || !Array.isArray(classes)) {
    return [];
  }
  
  const events = classes.map(cls => {
    const classDate = new Date(cls.classDate);
    const [hours, minutes] = cls.startTime.split(':').map(Number);
    
    const startTime = new Date(classDate);
    startTime.setHours(hours, minutes, 0, 0);
    
    const endTime = new Date(startTime.getTime() + cls.duration * 60000);
    
    return {
      id: cls.id,
      title: cls.name,
      start: startTime,
      end: endTime,
      location: cls.location,
      capacity: cls.capacity,
      enrolledCount: cls.enrolledCount,
      status: cls.status,
      description: cls.description,
      members: cls.enrolledMembers
    };
  });
  
  return events;
}
