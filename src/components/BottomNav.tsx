import { PlusCircle, List, BarChart3, Home, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const tabs = [
  { path: "/", icon: PlusCircle, label: "Add" },
  { path: "/expenses", icon: List, label: "Expenses" },
  { path: "/insights", icon: BarChart3, label: "Insights" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleQuickAdd = () => {
    navigate("/");
    // Scroll to form for better UX
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-card via-card/95 to-card/80 backdrop-blur-2xl border-t border-border/50 shadow-2xl">
        <div className="flex items-center justify-around h-20 max-w-md mx-auto px-2 pb-2 pt-3">
          {tabs.map((tab) => {
            const active = location.pathname === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={cn(
                  "flex flex-col items-center gap-1 px-6 py-2.5 rounded-2xl transition-all duration-300 active:scale-95 group relative",
                  active 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <div className="absolute inset-0 rounded-2xl bg-primary/10 -z-10 animate-pulse" />
                )}
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300 flex items-center justify-center",
                  active 
                    ? "bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg" 
                    : "bg-muted/50 group-hover:bg-muted"
                )}>
                  <tab.icon className={cn(
                    "h-5 w-5 transition-all duration-300",
                    active && "stroke-[2.5] scale-110"
                  )} />
                </div>
                <span className={cn(
                  "text-[11px] font-bold transition-all duration-300 tracking-wide",
                  active ? "text-primary scale-110" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {tab.label}
                </span>
                {active && (
                  <div className="h-1 w-6 bg-primary rounded-full mt-0.5 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Floating Action Button */}
      <button
        onClick={handleQuickAdd}
        className="fixed bottom-24 right-5 z-40 rounded-full shadow-2xl active:scale-95 transition-all duration-200 group animate-bounce hover:animate-none"
        title="Quick add expense"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary/80 blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
        <Button
          size="lg"
          className="relative h-14 w-14 rounded-full bg-gradient-to-r from-primary to-primary/90 shadow-lg hover:shadow-xl transition-all hover:scale-110 p-0 flex items-center justify-center"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </button>
    </>
  );
}
