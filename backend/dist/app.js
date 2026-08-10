"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const app_config_1 = require("./config/app.config");
const logging_middleware_1 = require("./middleware/logging.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const merchant_routes_1 = __importDefault(require("./routes/merchant.routes"));
const dispute_routes_1 = __importDefault(require("./routes/dispute.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const evidence_routes_1 = __importDefault(require("./routes/evidence.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const scheduler_1 = require("./jobs/scheduler");
const app = (0, express_1.default)();
// ── Security & Parsing Middleware ─────────────────────────────────────────────
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: app_config_1.appConfig.corsOrigins }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ── Request Logging ───────────────────────────────────────────────────────────
app.use(logging_middleware_1.loggingMiddleware);
// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'DisputeX API is running',
        env: app_config_1.appConfig.env,
        timestamp: new Date().toISOString(),
    });
});
// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', auth_routes_1.default);
app.use('/api/merchants', merchant_routes_1.default);
app.use('/api/disputes', dispute_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/evidence', evidence_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ status: 'error', message: 'Route not found.' });
});
// ── Global Error Handler (MUST be last) ──────────────────────────────────────
app.use(error_middleware_1.errorMiddleware);
// ── Background Jobs ───────────────────────────────────────────────────────────
(0, scheduler_1.initScheduler)();
exports.default = app;
