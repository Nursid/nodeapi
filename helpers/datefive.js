let date = new Date();

// Convert the date to Kolkata time zone (IST) without milliseconds
let kolkataTime = date.toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour12: false });

// Extract the hours and minutes
let timeParts = kolkataTime.split(', ')[1].split(':');
// const hours = parseInt(timeParts[0]);
const minutes = parseInt(timeParts[1]);
const hours = 7

module.exports = {
    hours,
    minutes
}