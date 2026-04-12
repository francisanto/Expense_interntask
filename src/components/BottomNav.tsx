import { PlusCircle, List, BarChart3 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/", icon: PlusCircle, label: "Add" },
  { path: "/expenses", icon: List, label: "Expenses" },
  { path: "/insights", icon: BarChart3, label: "Insights" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border/50">
      <div className="flex items-center justify-around h-18 max-w-md mx-auto py-2">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-5 py-2 rounded-2xl transition-all duration-200 active:scale-90",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-200",
                active && "bg-primary/10"
              )}>
                <tab.icon className={cn("h-5 w-5 transition-all", active && "stroke-[2.5]")} />
              </div>
              <span className={cn("text-[10px] font-semibold", active && "text-primary")}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
