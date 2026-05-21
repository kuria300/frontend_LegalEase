// convert a date object unto a YYYY-MM-DD string for API calls
export const toDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Builds a full ISO datetime string with EAT offset (+03:00)
// Prisma receives this and stores the correct UTC equivalent in the DB
export const createParsedDate = (date, time) => {
  const [hh, mm] = time.split(":").map(Number);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(hh).padStart(2, "0");
  const minutes = String(mm).padStart(2, "0");

  // +03:00 tells Prisma this datetime is in EAT
  // Prisma converts and stores as UTC internally
  return `${year}-${month}-${day}T${hours}:${minutes}:00+03:00`;
};

// Formats a date string or Date object for human-readable display
export const formatDisplayDate = (date) =>
  new Date(date).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
