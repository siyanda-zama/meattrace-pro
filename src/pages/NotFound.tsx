import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

function HexagonIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 8L68 24V56L40 72L12 56V24L40 8Z" stroke="hsl(213, 65%, 15%)" strokeWidth="1.5" opacity="0.15" fill="none" />
      <path d="M40 16L60 28V52L40 64L20 52V28L40 16Z" stroke="hsl(42, 64%, 45%)" strokeWidth="1" opacity="0.25" fill="none" />
      <text x="40" y="46" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="700" fontSize="20" fill="hsl(213, 65%, 15%)" opacity="0.6">404</text>
    </svg>
  );
}

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'hsl(var(--mt-surface-1))' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-4"
      >
        <HexagonIcon />
        <h1 className="mt-display mt-4">Page Not Found</h1>
        <p className="mt-body mt-2">
          The route you requested does not exist in the MeatTrace Pro system. 
          This may be a broken link or a page that has been moved.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            style={{ borderRadius: 'var(--mt-radius-sm)' }}
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Go Back
          </Button>
          <Button
            onClick={() => navigate("/dashboard")}
            className="text-white font-semibold"
            style={{ background: 'hsl(var(--mt-gold))', borderRadius: 'var(--mt-radius-sm)' }}
          >
            Command Centre
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
