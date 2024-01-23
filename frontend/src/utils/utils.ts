export function formatTimestampToDateTime(timestamp: number) {
  // Create a new Date object using the timestamp
  const date = new Date(timestamp);

  // Get the month name and day
  const monthName = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();

  // Get the hours and minutes
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Format the time to 12-hour clock and add AM/PM
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = hours || 12; // Handle midnight (0:00)

  // Add leading zero to minutes if needed
  minutes = minutes < 10 ? '0' + minutes : minutes;

  // Construct the formatted date and time string
  const formattedDateTime = `${monthName} ${day} ${hours}.${minutes} ${ampm}`;

  return formattedDateTime;
}

