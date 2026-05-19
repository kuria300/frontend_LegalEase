// function to convert 24hrs backend values into 12 hrs values
// -> "14:30" -> "02:30 PM" for display
export const formatTime = (time24) => {
  const [hh, mm] = time24.split(":");
  const hour = parseInt(hh);
 
  let period;
  let hour12;
 
  if (hour >= 12) {
    period = "PM";
  } else {
    period = "AM";
  }
 
  if (hour % 12 === 0) {
    hour12 = 12;
  } else {
    hour12 = hour % 12;
  }
 
  return `${hour12}:${mm} ${period}`;
};