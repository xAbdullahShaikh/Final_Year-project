// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const twilio = require('twilio');

// Load Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize the Twilio client
const client = twilio(accountSid, authToken);

// Function to get the current time in a readable format
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleString(); // Format: "2/23/2025, 12:34:56 PM"
}

// Function to get the city using ipinfo.io API
async function getCity() {
  try {
    const fetch = (await import('node-fetch')).default; // Dynamic import
    //const response = await fetch('https://ipinfo.io/json?token=87a00f55-4ed3-48fd-97ac-9a95477029c8');//  // Your ipinfo.io token
    const response = await fetch('http://ip-api.com/json/');
    
    const data = await response.json();
    return data.city; // Returns the city name
  } catch (error) {
    console.error('Error fetching city:', error);
    return 'Karachi'; // Fallback if the API fails
  }
}

// Function to send SMS
async function sendSMS(to, message) {
  try {
    const sms = await client.messages.create({
      body: message, // The SMS message body
      from: twilioPhoneNumber, // Your Twilio phone number
      to: to, // Recipient's phone number (with country code, e.g., +1234567890)
    });

    console.log('SMS sent successfully!');
    console.log('Message SID:', sms.sid);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
}

// Main function to send the alert
async function sendAlert() {
  const recipientPhoneNumber = '+923100033956'; // Replace with the recipient's phone number (no spaces)

  // Get real-time data
  const time = getCurrentTime();
  const city = await getCity();

  // Construct the message
  const message = `Alert! Crime detected in location: ${city}. Time: ${time}. Urgent Action Required.`;

  // Send the SMS
  sendSMS(recipientPhoneNumber, message);
}

// Run the alert function
sendAlert();
