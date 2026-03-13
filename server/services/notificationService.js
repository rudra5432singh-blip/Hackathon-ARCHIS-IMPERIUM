const twilio = require('twilio');
require('dotenv').config();

// Initialize Twilio client only if credentials exist
let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  } catch (err) {
    console.error('Failed to initialize Twilio client:', err);
  }
}

/**
 * Sends a notification using Twilio SMS or WhatsApp
 * @param {string} phone_number - The recipient's phone number
 * @param {string} complaint_id - The ID of the drafted complaint
 * @param {string} summary - The title/summary of the complaint
 * @param {string} name - The user's name
 */
const sendNotification = async (phone_number, complaint_id, summary, name = 'Citizen') => {
  if (!phone_number) {
    console.log('No phone number provided, skipping SMS notification.');
    return;
  }
  
  if (!client || !process.env.TWILIO_PHONE_NUMBER) {
    console.warn('Twilio credentials not configured. Skipping SMS notification to:', phone_number);
    return;
  }

  const messageBody = `Hello ${name},\n\nYour complaint has been successfully registered.\n\nComplaint ID: ${complaint_id}\n\nIssue:\n${summary}\n\nCurrent Status:\nComplaint Received\n\nYou will receive updates as the issue progresses.\n\nThank you for helping improve the city.\n– AI Civic Complaint Resolver`;

  try {
    // Basic formatting: ensure it starts with '+'
    const formattedPhone = phone_number.startsWith('+') ? phone_number : `+${phone_number}`;

    const message = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    console.log(`Notification sent successfully to ${formattedPhone}. SID: ${message.sid}`);
    return message;
  } catch (error) {
    // Log error but don't throw to prevent failing the main complaint submission
    console.error('Failed to send Twilio notification:', error.message);
  }
};

module.exports = {
  sendNotification
};
