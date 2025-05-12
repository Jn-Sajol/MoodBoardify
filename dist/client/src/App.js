"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("tailwindcss");
const Register_1 = __importDefault(require("./Register"));
const Login_1 = __importDefault(require("./Login"));
const Homepage_1 = __importDefault(require("./Homepage"));
const react_router_1 = require("react-router");
const CreateMood_1 = __importDefault(require("./CreateMood"));
const Navbar_1 = __importDefault(require("./Navbar"));
const Recommendation_1 = __importDefault(require("./Recommendation"));
const Statistics_1 = __importDefault(require("./Statistics"));
const ProtectedRoute_1 = __importDefault(require("./ProtectedRoute"));
function App() {
    return (<>
      <react_router_1.Routes>
        <react_router_1.Route path="/register" element={<Register_1.default />}/>
        <react_router_1.Route path="/login" element={<Login_1.default />}/>
        <react_router_1.Route element={<Navbar_1.default />}>
          <react_router_1.Route index element={<Homepage_1.default />}/>
          <react_router_1.Route element={<ProtectedRoute_1.default />}>
            <react_router_1.Route path="/moods" element={<CreateMood_1.default />}/>
            <react_router_1.Route path="/recommendation" element={<Recommendation_1.default />}/>
            <react_router_1.Route path="/statistic" element={<Statistics_1.default />}/>
          </react_router_1.Route>
        </react_router_1.Route>
      </react_router_1.Routes>
    </>);
}
exports.default = App;
