import { useState, useMemo } from "react";
import { getExpenses, categories, categoryEmojis, categoryColors } from "@/lib/expenses";
import { generateInsights } from "@/lib/insights";
import { startOfWeek, startOfMonth, endOfWeek, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { TrendingUp, Lightbulb, BarChart3, PieChart } from "lucide-react";

type Period = "week" | "month";

export default function Insights() {
  const [period, setPeriod] = useState<Period>("month");
  const expenses = getExpenses();
  const smartInsights = useMemo(() => generateInsights(), [expenses]);

  const now = new Date();
  const interval = period === "week"
    ? { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) }
    : { start: startOfMonth(now), end: endOfMonth(now) };

  const filtered = useMemo(
    () => expenses.filter((e) => isWithinInterval(parseISO(e.date), interval)),
    [expenses, period]
  );

  const total = filtered.reduce((s, e) => s + e.amount, 0);
  const avgPerDay = filtered.length > 0 ? total / Math.ceil((interval.end.getTime() - interval.start.getTime()) / (1000 * 60 * 60 * 24)) : 0;

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

  const topCategory = breakdown.length > 0 ? breakdown[0] : null;

  const insightStyles = {
    warning: "bg-gradient-to-r from-orange-50 to-orange-50/50 border border-orange-200 text-orange-900 dark:from-orange-950/40 dark:to-orange-950/20 dark:border-orange-800 dark:text-orange-200",
    positive: "bg-gradient-to-r from-emerald-50 to-emerald-50/50 border border-emerald-200 text-emerald-900 dark:from-emerald-950/40 dark:to-emerald-950/20 dark:border-emerald-800 dark:text-emerald-200",
    info: "bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-200 text-blue-900 dark:from-blue-950/40 dark:to-blue-950/20 dark:border-blue-800 dark:text-blue-200",
  };

  return (
    <div className="px-5 pt-6 pb-24 max-w-md mx-auto">
      <div className="animate-fade-in flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
            <p className="text-xs text-muted-foreground">Spending analysis & trends</p>
          </div>
        </div>
        <div className="flex bg-muted rounded-xl p-1">
          {(["week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 capitalize",
                period === p ? "bg-card text-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {/* Total Card */}
        <div className="animate-scale-in bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-foreground/10 blur-2xl" />
          <div className="absolute -left-4 -bottom-8 h-24 w-24 rounded-full bg-primary-foreground/5 blur-xl" />
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-90 flex items-center gap-2">
              <span className="text-lg">💰</span>
              Total this {period}
            </p>
            <p className="text-5xl font-extrabold mt-2 tracking-tight">${total.toFixed(2)}</p>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <div className="px-3 py-1.5 rounded-full bg-primary-foreground/20 backdrop-blur">
                <span className="text-xs font-semibold">{filtered.length} transactions</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-primary-foreground/20 backdrop-blur">
                <span className="text-xs font-semibold">${avgPerDay.toFixed(2)}/day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Category Card */}
        {topCategory && (
          <div className="animate-slide-up bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-3xl p-5 border border-blue-500/30 shadow-sm">
            <p className="text-xs font-semibold text-blue-600/70 uppercase tracking-wider mb-2">Highest Spending</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center text-2xl">
                  {categoryEmojis[topCategory.category]}
                </div>
                <div>
                  <p className="font-bold text-foreground">{topCategory.category}</p>
                  <p className="text-xs text-muted-foreground">{((topCategory.amount / total) * 100).toFixed(0)}% of total</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">${topCategory.amount.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Smart Insights */}
      {smartInsights.length > 0 && (
        <div className="mb-7">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2 animate-fade-in">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            Smart Insights
          </h2>
          <div className="space-y-2.5">
            {smartInsights.map((insight, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-2xl p-4 text-sm font-medium animate-fade-in-up flex items-start gap-3",
                  insightStyles[insight.type]
                )}
                style={{ animationDelay: `${0.1 + i * 0.08}s`, opacity: 0 }}
              >
                <span className="text-lg shrink-0 mt-0.5">{insight.emoji}</span>
                <p className="leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Breakdown */}
      <div>
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 animate-fade-in flex items-center gap-2" style={{ animationDelay: "0.15s" }}>
          <BarChart3 className="h-4 w-4" />
          Category Breakdown
        </h2>
        {breakdown.length === 0 ? (
          <div className="animate-fade-in text-center py-12 bg-muted/30 rounded-2xl">
            <div className="text-5xl mb-3 inline-block animate-bounce">📊</div>
            <p className="text-muted-foreground font-medium">No expenses this {period}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Start tracking to see insights</p>
          </div>
        ) : (
          <div className="space-y-3">
            {breakdown.map(({ category, amount }, i) => {
              const pct = total > 0 ? (amount / total) * 100 : 0;
              return (
                <div
                  key={category}
                  className="bg-gradient-to-r from-card to-card/80 rounded-2xl p-4 shadow-sm animate-fade-in-up hover:shadow-md transition-all duration-200 border border-transparent hover:border-primary/20"
                  style={{ animationDelay: `${0.2 + i * 0.08}s`, opacity: 0 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 flex-1">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center text-xl border border-muted-foreground/10">
                        {categoryEmojis[category]}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">{category}</p>
                        <p className="text-xs text-muted-foreground">{pct.toFixed(1)}% of budget</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-foreground">${amount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-muted/60 rounded-full overflow-hidden border border-muted/40">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500 animate-bar-grow", categoryColors[category])}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

  return (
    <div className="px-5 pt-6 pb-24 max-w-md mx-auto">
      <div className="animate-fade-in flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
            <p className="text-xs text-muted-foreground">Spending analysis & trends</p>
          </div>
        </div>
        <div className="flex bg-muted rounded-xl p-1">
          {(["week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 capitalize",
                period === p ? "bg-card text-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {/* Total Card */}
        <div className="animate-scale-in bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-foreground/10 blur-2xl" />
          <div className="absolute -left-4 -bottom-8 h-24 w-24 rounded-full bg-primary-foreground/5 blur-xl" />
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-90 flex items-center gap-2">
              <span className="text-lg">💰</span>
              Total this {period}
            </p>
            <p className="text-5xl font-extrabold mt-2 tracking-tight">${total.toFixed(2)}</p>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <div className="px-3 py-1.5 rounded-full bg-primary-foreground/20 backdrop-blur">
                <span className="text-xs font-semibold">{filtered.length} transactions</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-primary-foreground/20 backdrop-blur">
                <span className="text-xs font-semibold">${avgPerDay.toFixed(2)}/day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Category Card */}
        {topCategory && (
          <div className="animate-slide-up bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-3xl p-5 border border-blue-500/30 shadow-sm">
            <p className="text-xs font-semibold text-blue-600/70 uppercase tracking-wider mb-2">Highest Spending</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center text-2xl">
                  {categoryEmojis[topCategory.category]}
                </div>
                <div>
                  <p className="font-bold text-foreground">{topCategory.category}</p>
                  <p className="text-xs text-muted-foreground">{((topCategory.amount / total) * 100).toFixed(0)}% of total</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">${topCategory.amount.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Smart Insights */}
      {smartInsights.length > 0 && (
        <div className="mb-7">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2 animate-fade-in">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            Smart Insights
          </h2>
          <div className="space-y-2.5">
            {smartInsights.map((insight, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-2xl p-4 text-sm font-medium animate-fade-in-up flex items-start gap-3",
                  insightStyles[insight.type]
                )}
                style={{ animationDelay: `${0.1 + i * 0.08}s`, opacity: 0 }}
              >
                <span className="text-lg shrink-0 mt-0.5">{insight.emoji}</span>
                <p className="leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Breakdown */}
      <div>
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 animate-fade-in flex items-center gap-2" style={{ animationDelay: "0.15s" }}>
          <BarChart3 className="h-4 w-4" />
          Category Breakdown
        </h2>
        {breakdown.length === 0 ? (
          <div className="animate-fade-in text-center py-12 bg-muted/30 rounded-2xl">
            <div className="text-5xl mb-3 inline-block animate-bounce">📊</div>
            <p className="text-muted-foreground font-medium">No expenses this {period}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Start tracking to see insights</p>
          </div>
        ) : (
          <div className="space-y-3">
            {breakdown.map(({ category, amount }, i) => {
              const pct = total > 0 ? (amount / total) * 100 : 0;
              return (
                <div
                  key={category}
                  className="bg-gradient-to-r from-card to-card/80 rounded-2xl p-4 shadow-sm animate-fade-in-up hover:shadow-md transition-all duration-200 border border-transparent hover:border-primary/20"
                  style={{ animationDelay: `${0.2 + i * 0.08}s`, opacity: 0 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 flex-1">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center text-xl border border-muted-foreground/10">
                        {categoryEmojis[category]}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">{category}</p>
                        <p className="text-xs text-muted-foreground">{pct.toFixed(1)}% of budget</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-foreground">${amount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-muted/60 rounded-full overflow-hidden border border-muted/40">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500 animate-bar-grow", categoryColors[category])}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
