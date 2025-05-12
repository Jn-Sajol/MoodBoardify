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
const react_router_1 = require("react-router");
const Register = () => {
    const [name, setUserName] = (0, react_1.useState)("");
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const navigate = (0, react_router_1.useNavigate)();
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = yield fetch("http://localhost:3000/api/v1/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });
            const data = yield response.json();
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong!");
            }
            console.log("Registration Success:", data);
            // Reset form fields after successful registration
            setUserName("");
            setEmail("");
            setPassword("");
            navigate("/login");
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    });
    return (<div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      
      {error && <p className="text-red-500 mb-3">{error}</p>}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input type="text" placeholder="User Name" value={name} onChange={(e) => setUserName(e.target.value)} className="border p-2 rounded-md w-full" required/>

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded-md w-full" required/>

        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 rounded-md w-full" required/>

        <button type="submit" className={`p-2 rounded-md w-full ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-teal-800 to-teal-600 text-white hover:from-blue-400 hover:to-blue-900 cursor-pointer"} text-white font-semibold`} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <p>ALready Registered? Go to <react_router_1.Link to={'/login'}> <span className=" text-blue-900">Log In</span> </react_router_1.Link></p>
      </form>
    </div>);
};
exports.default = Register;
