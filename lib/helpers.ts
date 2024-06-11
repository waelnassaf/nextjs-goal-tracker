export const extractDateComponents = (date: Date) => {
  const jsDate = new Date(date); // Convert MongoDB date to JavaScript Date object
  const yyyy = jsDate.getFullYear();
  const mm = String(jsDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based in JavaScript
  const dd = String(jsDate.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const calculateTimeDifference = (targetDate: Date) => {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor(
    (difference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30),
  );
  const days = Math.floor(
    (difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24),
  );
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
  };
};
