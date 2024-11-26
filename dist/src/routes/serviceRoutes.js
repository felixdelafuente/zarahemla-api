"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceController_1 = require("../controllers/serviceController");
const router = (0, express_1.Router)();
// Route for fetching all services
router.post('/', serviceController_1.addService);
// Route for fetching paginated services with optional search
router.get('/', serviceController_1.getAllServices);
// Route for fetching a single service by ID
router.get('/paginate', serviceController_1.getPaginatedServices);
// Route for adding a new service
router.get('/:id', serviceController_1.getServiceById);
// Route for updating a service by ID
router.put('/:id', serviceController_1.updateService);
// Route for deleting services by ID
router.delete('/', serviceController_1.deleteServices);
exports.default = router;
