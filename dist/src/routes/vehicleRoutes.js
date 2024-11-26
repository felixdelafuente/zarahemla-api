"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vehicleController_1 = require("../controllers/vehicleController");
const router = express_1.default.Router();
// Route for fetching all Vehicles
router.get('/', vehicleController_1.getAllVehicles);
// Route for fetching paginated items with optional search
router.get('/paginate', vehicleController_1.getPaginatedVehicles);
// Route for fetching a single item by ID
router.get('/:id', vehicleController_1.getVehicleById);
// Route for adding a new Vehicle
router.post('/', vehicleController_1.addVehicle);
// Route for updating an Vehicle by ID
router.put('/:id', vehicleController_1.updateVehicle);
// Route for deleting Vehicles by ID
router.delete('/', vehicleController_1.deleteVehicles);
exports.default = router;
