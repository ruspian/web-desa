export const formatDateDisplay = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatDateTimeDisplay = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("id-ID", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export const getDayMonth = (dateString) => {
  if (!dateString) return { day: "-", month: "-" };
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("id-ID", { month: "short" });
  return { day, month };
};
