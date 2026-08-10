"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const evidence_controller_1 = require("../controllers/evidence.controller");
const upload_service_1 = require("../storage/upload.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All evidence routes require authentication
router.use(auth_middleware_1.authenticate);
// POST /api/evidence/:id/upload — upload evidence for a dispute
router.post('/:id/upload', upload_service_1.uploadService.single('file'), evidence_controller_1.evidenceController.uploadEvidence);
// GET /api/evidence/:id — get evidence URL for a dispute
router.get('/:id', evidence_controller_1.evidenceController.getEvidence);
exports.default = router;
