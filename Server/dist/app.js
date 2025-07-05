"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// using  type Request, type Response as remove error for build
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
const borrowRoutes_1 = __importDefault(require("./routes/borrowRoutes"));
const errorHandler_1 = require("./utils/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["https://m-library-m-system-client.vercel.app"],
}));
app.use(express_1.default.json());
// Log middleware
app.use((req, _res, next) => {
    console.log("Incoming request body:", req.body);
    next();
});
// Routes
app.use("/api/books", bookRoutes_1.default);
app.use("/api/borrows", borrowRoutes_1.default);
app.get("/", (_req, res) => {
    res.send("Minimal Library Management System");
});
app.use(errorHandler_1.errorHandler);
exports.default = app;
