export const getWeatherIconName = (text) => {
  const condition = text.toLowerCase();

  if (condition.includes("sunny")) return "sunny";
  if (condition.includes("cloud")) return "cloudy";
  if (condition.includes("rain")) return "rain";
  if (condition.includes("thunder")) return "thunderstorm";
  if (condition.includes("snow")) return "snow";
  if (condition.includes("fog") || condition.includes("mist")) return "fog";

  return "sunny"; // default
};
