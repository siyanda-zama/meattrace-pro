import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth-store";

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
    <div className="min-h-screen flex items-center justify-center bg-primary relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm-6 6a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md mx-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent mb-4 shadow-gold"
          >
            <Shield className="w-8 h-8 text-accent-foreground" />
          </motion.div>
          <h1 className="text-2xl font-bold text-primary-foreground tracking-tight">
            MeatTrace <span className="text-gradient-gold">Pro</span>
          </h1>
          <p className="text-sm text-sidebar-foreground mt-1">Food Safety & Yield Management</p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-lg p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="you@meattracepro.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-gold"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">Demo Credentials</p>
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
                  className="text-xs px-3 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
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
