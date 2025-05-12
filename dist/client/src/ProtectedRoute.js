"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const ProtectedRoute = () => {
    const isAuthenticated = localStorage.getItem("auth"); // Check auth status
    return isAuthenticated ? <react_router_dom_1.Outlet /> : <react_router_dom_1.Navigate to="/login" replace/>;
};
exports.default = ProtectedRoute;
