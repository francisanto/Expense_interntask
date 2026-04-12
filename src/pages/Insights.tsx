import { useState, useMemo } from "react";
import { getExpenses, categories, categoryEmojis, categoryColors } from "@/lib/expenses";
import { startOfWeek, startOfMonth, endOfWeek, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Insights</h1>
        <div className="flex bg-muted rounded-lg p-1">
          {(["week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize",
                period === p ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="bg-primary text-primary-foreground rounded-2xl p-6 mb-6">
        <p className="text-sm opacity-80">Total this {period}</p>
        <p className="text-4xl font-bold mt-1">${total.toFixed(2)}</p>
        <p className="text-sm opacity-70 mt-1">{filtered.length} transactions</p>
      </div>

      {/* Breakdown */}
      <h2 className="text-sm font-semibold text-muted-foreground mb-3">Category Breakdown</h2>
      {breakdown.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">No expenses this {period}</p>
      ) : (
        <div className="space-y-3">
          {breakdown.map(({ category, amount }) => {
            const pct = total > 0 ? (amount / total) * 100 : 0;
            return (
              <div key={category} className="bg-card rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{categoryEmojis[category]}</span>
                    <span className="font-medium">{category}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{pct.toFixed(0)}%</p>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", categoryColors[category])}
                    style={{ width: `${pct}%` }}
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
