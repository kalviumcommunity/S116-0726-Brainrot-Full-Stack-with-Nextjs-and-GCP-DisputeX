"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dispute_controller_1 = require("../controllers/dispute.controller");
const upload_service_1 = require("../storage/upload.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const dispute_validator_1 = require("../validators/dispute.validator");
const router = (0, express_1.Router)();
// All dispute routes require authentication
router.use(auth_middleware_1.authenticate);
router.post('/', (0, validation_middleware_1.validate)(dispute_validator_1.createDisputeSchema), dispute_controller_1.disputeController.createDispute);
router.get('/', (0, validation_middleware_1.validate)(dispute_validator_1.listDisputesSchema), dispute_controller_1.disputeController.getDisputes);
router.get('/:id', (0, validation_middleware_1.validate)(dispute_validator_1.getDisputeByIdSchema), dispute_controller_1.disputeController.getDisputeById);
router.patch('/:id/status', (0, validation_middleware_1.validate)(dispute_validator_1.updateDisputeStatusSchema), dispute_controller_1.disputeController.updateDisputeStatus);
router.get('/:id/activities', (0, validation_middleware_1.validate)(dispute_validator_1.getDisputeByIdSchema), dispute_controller_1.disputeController.getDisputeActivities);
// Evidence upload (uses multer middleware)
router.post('/:id/evidence', upload_service_1.uploadService.single('file'), dispute_controller_1.disputeController.uploadEvidence);
exports.default = router;
