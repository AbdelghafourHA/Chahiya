// pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../stores/auth.store";
import { toast } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { login, isAuthenticated, checkAuth } = useAuth();
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsLoading(false);
    };
    initAuth();
  }, [checkAuth]);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("البريد الإلكتروني مطلوب");
      return;
    }

    if (!password.trim()) {
      toast.error("كلمة المرور مطلوبة");
      return;
    }

    setIsLoggingIn(true);
    const success = await login(email, password);
    setIsLoggingIn(false);

    if (success) {
      navigate("/dashboard");
    }
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">جاري التحقق...</p>
        </div>
      </div>
    );
  }

  // If already authenticated, don't show login form (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">مرحباً بك</h1>
          <p className="text-white/60">تسجيل الدخول إلى لوحة التحكم</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#161616] rounded-2xl p-8 space-y-6"
        >
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm text-white/60">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full p-3 bg-[#111] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
              disabled={isLoggingIn}
              dir="ltr"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm text-white/60">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-[#111] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                disabled={isLoggingIn}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-primary py-3 rounded-xl text-white font-semibold hover:bg-primary/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جاري تسجيل الدخول...</span>
              </div>
            ) : (
              "تسجيل الدخول"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
