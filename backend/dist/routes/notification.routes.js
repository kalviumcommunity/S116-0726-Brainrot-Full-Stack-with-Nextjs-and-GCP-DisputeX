"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const notification_validator_1 = require("../validators/notification.validator");
const router = (0, express_1.Router)();
// All notification routes require authentication
router.use(auth_middleware_1.authenticate);
router.get('/', (0, validation_middleware_1.validate)(notification_validator_1.getNotificationsSchema), notification_controller_1.getNotifications);
router.patch('/:id/read', (0, validation_middleware_1.validate)(notification_validator_1.markNotificationReadSchema), notification_controller_1.markNotificationAsRead);
router.patch('/read-all', (0, validation_middleware_1.validate)(notification_validator_1.markAllNotificationsReadSchema), notification_controller_1.markAllNotificationsAsRead);
exports.default = router;
