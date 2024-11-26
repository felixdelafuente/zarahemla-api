"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = __importDefault(require("./src/config/db"));
const userRoutes_1 = __importDefault(require("./src/routes/userRoutes"));
const tradingRoutes_1 = __importDefault(require("./src/routes/tradingRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const serviceRoutes_1 = __importDefault(require("./src/routes/serviceRoutes"));
const clientRoutes_1 = __importDefault(require("./src/routes/clientRoutes"));
const discountRoutes_1 = __importDefault(require("./src/routes/discountRoutes"));
const vehicleRoutes_1 = __importDefault(require("./src/routes/vehicleRoutes"));
const salesRoutes_1 = __importDefault(require("./src/routes/salesRoutes"));
dotenv_1.default.config(); // Load environment variables
const app = (0, express_1.default)();
(0, db_1.default)(); // Establish database connection
// Middleware
app.use((0, cors_1.default)({
    exposedHeaders: ['Pagination'] // Expose the 'Pagination' header to the client
}));
app.use(body_parser_1.default.json());
// Route handling
app.use("/api/users", userRoutes_1.default);
app.use('/api/tradings', tradingRoutes_1.default);
app.use('/api/services', serviceRoutes_1.default);
app.use('/api/clients', clientRoutes_1.default);
app.use('/api/client/discounts', discountRoutes_1.default);
app.use('/api/client/vehicles', vehicleRoutes_1.default);
app.use('/api/sales', salesRoutes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
