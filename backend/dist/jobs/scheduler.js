"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initScheduler = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const escalation_job_1 = require("./escalation.job");
const reminder_job_1 = require("./reminder.job");
const initScheduler = () => {
    // Run everyday at midnight (0 0 * * *)
    node_cron_1.default.schedule('0 0 * * *', () => {
        console.log('[Scheduler] Running daily jobs...');
        (0, escalation_job_1.escalationJob)();
        (0, reminder_job_1.reminderJob)();
    });
    console.log('[Scheduler] Jobs initialized.');
};
exports.initScheduler = initScheduler;
