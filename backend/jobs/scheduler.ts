import cron from 'node-cron';
import { escalationJob } from './escalation.job';
import { reminderJob } from './reminder.job';

export const initScheduler = () => {
  // Run everyday at midnight (0 0 * * *)
  cron.schedule('0 0 * * *', () => {
    console.log('[Scheduler] Running daily jobs...');
    escalationJob();
    reminderJob();
  });

  console.log('[Scheduler] Jobs initialized.');
};
