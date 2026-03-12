import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth-store";

function HexagonLogo() {
  return (
    <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2L28.5 9.5V24.5L16 30L3.5 24.5V9.5L16 2Z" fill="hsl(42, 64%, 45%)" />
      <path d="M12 12L16 8L20 12V20L16 24L12 20V12Z" fill="hsl(213, 65%, 15%)" />
      <path d="M14 14L16 12L18 14V18L16 20L14 18V14Z" fill="hsl(42, 64%, 45%)" />
    </svg>
  );
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.success) {
      const user = useAuthStore.getState().user;
      if (user?.role === "OPERATOR") {
        navigate("/app");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'hsl(var(--mt-navy))' }}
    >
      {/* Background noise texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md mx-4 relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <HexagonLogo />
          </motion.div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            MeatTrace <span style={{ color: 'hsl(42, 64%, 45%)' }}>Pro</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Food Safety & Yield Management
          </p>
        </div>

        {/* Login Card */}
        <div
          className="p-8"
          style={{
            background: 'hsl(var(--mt-surface-0))',
            borderRadius: 'var(--mt-radius-lg)',
            border: '1px solid hsl(var(--mt-border))',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="mt-label block">Email</label>
              <Input
                type="email"
                placeholder="you@meattracepro.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
                style={{ borderRadius: 'var(--mt-radius-sm)' }}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="mt-label block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 pr-10"
                  style={{ borderRadius: 'var(--mt-radius-sm)' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'hsl(var(--mt-text-muted))' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm"
                style={{ color: 'hsl(var(--mt-alert))' }}
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 font-semibold text-white"
              style={{
                background: 'hsl(var(--mt-gold))',
                borderRadius: 'var(--mt-radius-md)',
              }}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-5" style={{ borderTop: '1px solid hsl(var(--mt-border))' }}>
            <p className="mt-label text-center mb-3">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Admin", email: "admin@meattracepro.com" },
                { label: "Manager", email: "manager@meattracepro.com" },
                { label: "Operator", email: "operator@meattracepro.com" },
                { label: "Auditor", email: "auditor@meattracepro.com" },
              ].map((cred) => (
                <button
                  key={cred.label}
                  type="button"
                  onClick={() => {
                    setEmail(cred.email);
                    setPassword(cred.label + "@123");
                  }}
                  className="text-xs px-3 py-2 font-medium transition-colors"
                  style={{
                    borderRadius: 'var(--mt-radius-sm)',
                    background: 'hsl(var(--mt-surface-1))',
                    color: 'hsl(var(--mt-text-secondary))',
                    border: '1px solid hsl(var(--mt-border))',
                  }}
                >
                  {cred.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
