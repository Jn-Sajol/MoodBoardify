"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
function Login() {
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = yield fetch("http://localhost:3000/api/v1/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = yield response.json();
            if (!response.ok) {
                throw new Error(data.message || "Login failed! Please try again.");
            }
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("auth", "true");
            console.log("Login Successful:", data);
            // Redirect to home page
            navigate("/");
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    });
    return (<div className="flex flex-col items-center mt-16">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded-md w-full" required/>

        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 rounded-md w-full" required/>

        <button type="submit" className={`p-2 rounded-md w-full ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-teal-800 to-teal-600 text-white hover:from-blue-400 hover:to-blue-900 cursor-pointer"} text-white font-semibold`} disabled={loading}>
          {loading ? "Logging in..." : "Submit"}
        </button>
        <p>Not Register yet? <span className=" text-cyan-800"><react_router_dom_1.Link to={'/register'}>Register here</react_router_dom_1.Link></span></p>
      </form>
    </div>);
}
exports.default = Login;
