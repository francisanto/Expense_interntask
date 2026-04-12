import { useState, useMemo } from "react";
import { getExpenses, categories, categoryEmojis, categoryColors } from "@/lib/expenses";
import { startOfWeek, startOfMonth, endOfWeek, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

type Period = "week" | "month";

export default function Insights() {
  const [period, setPeriod] = useState<Period>("month");
  const expenses = getExpenses();

  const now = new Date();
  const interval = period === "week"
    ? { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) }
    : { start: startOfMonth(now), end: endOfMonth(now) };

  const filtered = useMemo(
    () => expenses.filter((e) => isWithinInterval(parseISO(e.date), interval)),
    [expenses, period]
  );

  const total = filtered.reduce((s, e) => s + e.amount, 0);

  const breakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of filtered) {
      map[e.category] = (map[e.category] || 0) + e.amount;
    }
    return categories
      .map((cat) => ({ category: cat, amount: map[cat] || 0 }))
      .filter((c) => c.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [filtered]);

  return (
    <div className="px-5 pt-6 pb-24 max-w-md mx-auto">
      <div className="animate-fade-in flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Insights</h1>
            <p className="text-xs text-muted-foreground">Your spending overview</p>
          </div>
        </div>
        <div className="flex bg-muted rounded-xl p-1">
          {(["week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 capitalize",
                period === p ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Total Card */}
      <div className="animate-scale-in bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-3xl p-6 mb-8 shadow-lg relative overflow-hidden">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary-foreground/10" />
        <div className="absolute -right-2 -bottom-8 h-32 w-32 rounded-full bg-primary-foreground/5" />
        <p className="text-sm font-medium opacity-80">Total this {period}</p>
        <p className="text-5xl font-extrabold mt-2 tracking-tight">${total.toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-3">
          <div className="h-6 px-2.5 rounded-full bg-primary-foreground/20 flex items-center">
            <span className="text-xs font-semibold">{filtered.length} transactions</span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 animate-fade-in" style={{ animationDelay: "0.15s" }}>
        Category Breakdown
      </h2>
      {breakdown.length === 0 ? (
        <div className="animate-fade-in text-center py-10">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-muted-foreground">No expenses this {period}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {breakdown.map(({ category, amount }, i) => {
            const pct = total > 0 ? (amount / total) * 100 : 0;
            return (
              <div
                key={category}
                className="bg-card rounded-2xl p-4 shadow-sm animate-fade-in-up hover:shadow-md transition-all duration-200"
                style={{ animationDelay: `${0.2 + i * 0.08}s`, opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-xl">
                      {categoryEmojis[category]}
                    </div>
                    <div>
                      <span className="font-semibold text-sm">{category}</span>
                      <p className="text-xs text-muted-foreground">{pct.toFixed(0)}% of total</p>
                    </div>
                  </div>
                  <p className="font-bold text-lg">${amount.toFixed(2)}</p>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full animate-bar-grow", categoryColors[category])}
                    style={{ "--bar-width": `${pct}%` } as React.CSSProperties}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
