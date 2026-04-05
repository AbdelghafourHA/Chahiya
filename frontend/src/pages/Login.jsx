import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      return setError("يرجى ملء جميع الحقول");
    }

    try {
      setLoading(true);

      // 🔥 READY FOR BACKEND
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Save token
      localStorage.setItem("token", data.token);

      // 👉 Redirect later to dashboard
      console.log("LOGIN SUCCESS");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white px-4">
      <div className="w-full max-w-md">
        {/* Title */}
        <h2 className="text-center font-heading text-2xl mb-8">تسجيل الدخول</h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#161616] p-6 rounded-3xl space-y-5"
        >
          {/* Email */}
          <div>
            <label className="text-xs text-white/60 block mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 text-sm rounded-xl bg-[#111] border border-border outline-none focus:border-primary"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-white/60 block mb-1">
              كلمة المرور
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 text-sm rounded-xl bg-[#111] border border-border outline-none focus:border-primary"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-400 text-xs">{error}</p>}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl text-sm hover:opacity-90 transition"
          >
            {loading ? "جارٍ الدخول..." : "دخول"}
          </button>
        </form>
      </div>
    </section>
  );
}
