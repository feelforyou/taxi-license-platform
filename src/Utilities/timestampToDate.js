export const timestampToDate = (timestamp) => {
  if (!timestamp) return null;

  const dateOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  return new Date(timestamp.seconds * 1000).toLocaleString(
    "en-US",
    dateOptions
  );
};
