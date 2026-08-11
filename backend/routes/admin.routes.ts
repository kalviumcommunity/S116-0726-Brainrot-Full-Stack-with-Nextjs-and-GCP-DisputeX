import { Router } from 'express';
import { getAdminStats, getAllMerchantsAdmin, getAllDisputesAdmin, getAuditLogsAdmin, globalSearchAdmin } from '../controllers/admin.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// All admin routes require authentication AND the ADMIN role
router.use(authenticate, requireRole(['ADMIN']));

// GET /api/admin/global-search — global search across all admin resources
router.get('/global-search', globalSearchAdmin);

// GET /api/admin/stats — dashboard stats (dispute counts, recent activity)
router.get('/stats', getAdminStats);

// GET /api/admin/merchants — paginated list of all merchants with dispute counts
router.get('/merchants', getAllMerchantsAdmin);

// GET /api/admin/disputes — paginated list of all disputes (filterable by status, merchantId)
router.get('/disputes', getAllDisputesAdmin);

// GET /api/admin/activities — paginated list of all audit logs
router.get('/activities', getAuditLogsAdmin);

export default router;
