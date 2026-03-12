import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

const ComingSoon = () => {
  const { pathname } = useLocation();
  const pageName = pathname.split("/").pop() || "page";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Construction className="w-12 h-12 text-accent mb-4" />
      <h1 className="text-xl font-bold capitalize">{pageName.replace("-", " ")}</h1>
      <p className="text-sm text-muted-foreground mt-1">This module is coming in the next iteration.</p>
    </div>
  );
};

export default ComingSoon;
