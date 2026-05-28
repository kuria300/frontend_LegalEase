export const formatTime = (timeValue) => {
  if (!timeValue) return "—";

  let date;

  if (typeof timeValue === "string" && timeValue.includes("T")) {
    date = new Date(timeValue);
  } else if (typeof timeValue === "string" && timeValue.includes(":")) {
    date = new Date(`1970-01-01T${timeValue}Z`);
  } else {
    date = new Date(timeValue);
  }

  if (isNaN(date.getTime())) return "—";

  return date.toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
};