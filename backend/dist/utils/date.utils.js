"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.daysSince = exports.daysFromNow = exports.daysAgo = void 0;
/**
 * Subtracts `days` from the current date and returns the resulting Date.
 */
const daysAgo = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
};
exports.daysAgo = daysAgo;
/**
 * Adds `days` to the current date and returns the resulting Date.
 */
const daysFromNow = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
};
exports.daysFromNow = daysFromNow;
/**
 * Returns the number of whole days elapsed since `date`.
 */
const daysSince = (date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};
exports.daysSince = daysSince;
/**
 * Formats a Date as a human-readable string: "5 Aug 2026 14:08"
 */
const formatDate = (date) => date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
});
exports.formatDate = formatDate;
