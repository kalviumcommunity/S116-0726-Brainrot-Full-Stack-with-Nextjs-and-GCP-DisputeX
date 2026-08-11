"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All admin routes require authentication AND the ADMIN role
router.use(auth_middleware_1.authenticate, (0, auth_middleware_1.requireRole)(['ADMIN']));
// GET /api/admin/global-search — global search across all admin resources
router.get('/global-search', admin_controller_1.globalSearchAdmin);
// GET /api/admin/stats — dashboard stats (dispute counts, recent activity)
router.get('/stats', admin_controller_1.getAdminStats);
// GET /api/admin/merchants — paginated list of all merchants with dispute counts
router.get('/merchants', admin_controller_1.getAllMerchantsAdmin);
// GET /api/admin/disputes — paginated list of all disputes (filterable by status, merchantId)
router.get('/disputes', admin_controller_1.getAllDisputesAdmin);
// GET /api/admin/activities — paginated list of all audit logs
router.get('/activities', admin_controller_1.getAuditLogsAdmin);
exports.default = router;
