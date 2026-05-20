// convert a date object unto a YYYY-MM-DD string for API calls
export const toDateString = (date) => date.toISOString().split("T")[0];

// create full ISO datetime string 
// -> combining date & "HH:mm" time string

export const createParsedDate = (date, time) => {
  const [hh, mm] = time.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hh, mm, 0, 0);
  return combined.toISOString();
};

// format date into a human readable display
export const formatDisplayDate = (date) =>
  new Date(date).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });