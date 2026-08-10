"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllNotificationsAsRead = exports.markNotificationAsRead = exports.getNotifications = void 0;
const notification_repository_1 = require("../repositories/notification.repository");
const response_1 = require("../utils/response");
const error_interface_1 = require("../interfaces/error.interface");
const getNotifications = async (req, res, next) => {
    try {
        const merchantId = Array.isArray(req.query.merchantId)
            ? req.query.merchantId[0]
            : req.query.merchantId;
        if (!merchantId) {
            throw new error_interface_1.AppError('merchantId query parameter is required.', 400, 'MISSING_MERCHANT_ID');
        }
        const isReadParam = req.query.isRead;
        const isReadStr = Array.isArray(isReadParam) ? isReadParam[0] : isReadParam;
        const isReadBool = isReadStr === 'true' ? true : isReadStr === 'false' ? false : undefined;
        const notifications = await notification_repository_1.notificationRepository.findByMerchant(merchantId, isReadBool);
        const unreadCount = await notification_repository_1.notificationRepository.countUnread(merchantId);
        return (0, response_1.sendSuccess)(res, 200, {
            data: { notifications, unreadCount },
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.getNotifications = getNotifications;
const markNotificationAsRead = async (req, res, next) => {
    try {
        const notification = await notification_repository_1.notificationRepository.markAsRead(req.params['id']);
        return (0, response_1.sendSuccess)(res, 200, {
            message: 'Notification marked as read.',
            data: { notification },
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.markNotificationAsRead = markNotificationAsRead;
const markAllNotificationsAsRead = async (req, res, next) => {
    try {
        const { merchantId } = req.body;
        if (!merchantId) {
            throw new error_interface_1.AppError('merchantId is required.', 400, 'MISSING_MERCHANT_ID');
        }
        await notification_repository_1.notificationRepository.markAllAsRead(merchantId);
        return (0, response_1.sendSuccess)(res, 200, { message: 'All notifications marked as read.' });
    }
    catch (error) {
        return next(error);
    }
};
exports.markAllNotificationsAsRead = markAllNotificationsAsRead;
