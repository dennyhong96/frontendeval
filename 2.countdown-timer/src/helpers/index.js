export const getTimeDisplay = (type, seconds) => {
  switch (type) {
    case "hours": {
      return `${Math.floor(seconds / (60 * 60))}`.padStart(2, "0");
    }
    case "minutes": {
      return `${Math.floor((seconds % (60 * 60)) / 60)}`.padStart(2, "0");
    }
    case "seconds": {
      return `${Math.floor((seconds % (60 * 60)) % 60)}`.padStart(2, "0");
    }
    default: {
      return "";
    }
  }
};
