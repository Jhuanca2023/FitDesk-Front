let audioInstance: HTMLAudioElement | null = null;

export const playNotificationSound = () => {
  try {
    
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
    }
    
    
    audioInstance = new Audio('/sounds/notifi.mp3');
    audioInstance.volume = 0.5; 
   
    audioInstance.play().catch(error => {
      console.error('Error playing notification sound:', error);
    });
    
    
    audioInstance.onended = () => {
      if (audioInstance) {
        audioInstance.remove();
        audioInstance = null;
      }
    };
    
  } catch (error) {
    console.error('Error with notification sound:', error);
  }
};
