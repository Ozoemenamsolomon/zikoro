// import cron from 'node-cron';
// import nodemailer from 'nodemailer';
// import { createClient } from '@supabase/supabase-js';
// import dayjs from 'dayjs';

// // Initialize Supabase client
// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);

// // Initialize Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Function to send an email reminder
// async function sendEmailReminder(email, eventName, eventTime) {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: `Reminder: ${eventName} is happening soon!`,
//     text: `Dear user,\n\nYour event "${eventName}" is scheduled to start at ${eventTime}. This is a reminder that your event is happening in less than 1 hour and 20 minutes.\n\nThank you!`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`Reminder sent to ${email}`);
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// }

// // Function to check events and send reminders
// async function checkAndSendReminders() {
//   const now = dayjs();
//   const reminderTime = now.add(1, 'hour').add(20, 'minute').toISOString();

//   const { data: events, error } = await supabase
//     .from('events') // Replace 'events' with your actual table name
//     .select('*')
//     .gte('event_time', now.toISOString())
//     .lte('event_time', reminderTime);

//   if (error) {
//     console.error('Error fetching events:', error);
//     return;
//   }

//   if (events.length === 0) {
//     console.log('No events needing reminders at this time.');
//     return;
//   }

//   for (const event of events) {
//     const { email, event_name, event_time } = event;
//     await sendEmailReminder(email, event_name, event_time);
//   }
// }

// // Schedule the cron job to run every minute
// cron.schedule('* * * * *', () => {
//   console.log('Running cron job...');
//   checkAndSendReminders();
// });
