
export const formatTime = (dateString) => {
  try {
    const date = new Date(dateString);

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, 
    });
  } catch (error) {
    console.error("Invalid date format:", dateString, error);
    return "Invalid Time";
  }
};
