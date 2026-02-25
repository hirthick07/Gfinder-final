import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, User, Mail } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().trim().email("Invalid email address").max(255);
const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(128);

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      toast.error(emailResult.error.errors[0].message);
      return;
    }
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      toast.error(passwordResult.error.errors[0].message);
      return;
    }

    setLoading(true);
    if (isLogin) {
      const { error } = await signIn(emailResult.data, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome back!");
        navigate("/");
      }
    } else {
      if (!fullName.trim()) {
        toast.error("Please enter your full name");
        setLoading(false);
        return;
      }
      if (!phone.trim()) {
        toast.error("Please enter your phone number");
        setLoading(false);
        return;
      }
      if (phone.replace(/\D/g, '').length < 10) {
        toast.error("Please enter a valid phone number (at least 10 digits)");
        setLoading(false);
        return;
      }

      const { error } = await signUp(emailResult.data, password, fullName, phone);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created successfully!");
        setTimeout(() => navigate("/"), 1500);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gray-200 opacity-60" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-gray-200 opacity-60" />
      </div>

      <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl flex" style={{ minHeight: 420 }}>
        {/* Left panel - blue */}
        <div
          className="hidden md:flex flex-col items-center justify-center w-5/12 p-10 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1a3a8f 0%, #2d52cc 60%, #3b5fe0 100%)" }}
        >
          {/* Decorative diamond shapes */}
          <div className="absolute -top-8 -left-8 w-36 h-36 rounded-2xl opacity-20 bg-white rotate-12" />
          <div className="absolute bottom-8 right-4 w-28 h-28 rounded-2xl opacity-20 bg-white -rotate-12" />
          <div className="absolute top-1/2 left-1/4 w-20 h-20 rounded-xl opacity-10 bg-white rotate-45" />

          <div className="relative z-10 text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-sm text-blue-100 leading-relaxed mb-8">
              Stay connected by logging in with your credentials and continue your experience
            </p>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="border-2 border-white rounded-full px-8 py-2 text-sm font-bold tracking-widest hover:bg-white hover:text-blue-800 transition-all duration-200"
            >
              {isLogin ? "SIGN UP" : "LOGIN"}
            </button>
          </div>
        </div>

        {/* Right panel - white form */}
        <div className="flex-1 bg-white flex flex-col justify-center p-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Username</label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 gap-2 focus-within:border-blue-500 transition-colors">
                  <User className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Gmail Id</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 gap-2 focus-within:border-blue-500 transition-colors">
                <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 gap-2 focus-within:border-blue-500 transition-colors">
                  <User className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 gap-2 focus-within:border-blue-500 transition-colors">
                <Lock className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-xs text-blue-600 hover:underline">
                  Forgot your password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full text-white font-semibold text-sm tracking-wide transition-all duration-200 hover:opacity-90 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #2d52cc, #1a3a8f)" }}
            >
              {loading ? "Please wait..." : isLogin ? "SIGN IN" : "SIGN UP"}
            </button>
          </form>

          {/* Mobile toggle */}
          <div className="mt-4 text-center md:hidden">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
