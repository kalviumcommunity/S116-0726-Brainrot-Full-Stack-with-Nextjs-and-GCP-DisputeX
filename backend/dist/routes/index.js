"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = exports.merchantRoutes = exports.notificationRoutes = exports.evidenceRoutes = exports.disputeRoutes = exports.authRoutes = void 0;
var auth_routes_1 = require("./auth.routes");
Object.defineProperty(exports, "authRoutes", { enumerable: true, get: function () { return __importDefault(auth_routes_1).default; } });
var dispute_routes_1 = require("./dispute.routes");
Object.defineProperty(exports, "disputeRoutes", { enumerable: true, get: function () { return __importDefault(dispute_routes_1).default; } });
var evidence_routes_1 = require("./evidence.routes");
Object.defineProperty(exports, "evidenceRoutes", { enumerable: true, get: function () { return __importDefault(evidence_routes_1).default; } });
var notification_routes_1 = require("./notification.routes");
Object.defineProperty(exports, "notificationRoutes", { enumerable: true, get: function () { return __importDefault(notification_routes_1).default; } });
var merchant_routes_1 = require("./merchant.routes");
Object.defineProperty(exports, "merchantRoutes", { enumerable: true, get: function () { return __importDefault(merchant_routes_1).default; } });
var admin_routes_1 = require("./admin.routes");
Object.defineProperty(exports, "adminRoutes", { enumerable: true, get: function () { return __importDefault(admin_routes_1).default; } });
