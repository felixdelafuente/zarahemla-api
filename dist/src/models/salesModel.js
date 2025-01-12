"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const SalesSchema = new mongoose_1.Schema({
    transactionNumber: { type: Number, required: true, unique: true },
    branch: { type: String, required: true },
    client: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Client', required: true },
    cart: [{
            item: { type: mongoose_1.Schema.Types.ObjectId, required: true },
            itemPrice: { type: Number, required: true },
            quantity: { type: Number, required: true },
            subTotal: { type: Number, required: true }
        }],
    discount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    paid: { type: Boolean, default: false },
    dateIssued: { type: Date, default: Date.now },
    recurring: { type: Boolean, default: false },
});
const Sales = mongoose_1.default.model('Sales', SalesSchema);
exports.default = Sales;
