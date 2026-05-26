// utils/formatTime.js
export const formatTime = (timeValue) => {
  return new Date(timeValue).toLocaleTimeString('en-KE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Nairobi', 
  });
};