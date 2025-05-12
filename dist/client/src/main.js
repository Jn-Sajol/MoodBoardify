"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("react-dom/client");
require("./index.css");
const App_tsx_1 = __importDefault(require("./App.tsx"));
const react_router_1 = require("react-router");
(0, client_1.createRoot)(document.getElementById('root')).render(<react_router_1.BrowserRouter>
  <App_tsx_1.default />
</react_router_1.BrowserRouter>);
