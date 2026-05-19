export const getLawyers = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:3000/api/lawyers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch lawyers");
  }

  return await response.json();
};