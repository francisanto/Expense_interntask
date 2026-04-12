import { useState, useMemo } from "react";
import { getExpenses, deleteExpense, categoryEmojis, type Expense } from "@/lib/expenses";
import { format, parseISO } from "date-fns";
import { Trash2, ListFilter, Calendar, Tag, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type GroupBy = "date" | "category";

export default function ExpenseList() {
  const [groupBy, setGroupBy] = useState<GroupBy>("date");
  const [expenses, setExpenses] = useState<Expense[]>(getExpenses);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const sorted = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const map = new Map<string, Expense[]>();
    for (const exp of sorted) {
      const key = groupBy === "date" ? format(parseISO(exp.date), "MMM d, yyyy") : exp.category;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(exp);
    }
    return map;
  }, [expenses, groupBy]);

  const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0);
  const avgExpense = expenses.length > 0 ? totalSpend / expenses.length : 0;

  const handleDelete = (id: string, category: string) => {
    setDeletingId(id);
    setTimeout(() => {
      deleteExpense(id);
      setExpenses(getExpenses());
      setDeletingId(null);
      toast.success(`Deleted $${expenses.find(e => e.id === id)?.amount.toFixed(2) || '0'} from ${category}`, {
        description: "Expense removed successfully",
      });
    }, 150);
  };

  return (
    <div className="px-5 pt-6 pb-24 max-w-md mx-auto">
      <div className="animate-fade-in flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg">
            <ListFilter className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
            <p className="text-xs text-muted-foreground">{expenses.length} transactions</p>
          </div>
        </div>
        <div className="flex bg-muted rounded-xl p-1">
          {(["date", "category"] as GroupBy[]).map((g) => (
            <button
              key={g}
              onClick={() => setGroupBy(g)}
              className={cn(
                "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 capitalize flex items-center gap-1",
                groupBy === g ? "bg-card text-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {g === "date" ? <Calendar className="h-3.5 w-3.5" /> : <Tag className="h-3.5 w-3.5" />}
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      {expenses.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-in">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-4 border border-primary/20">
            <p className="text-xs font-semibold text-primary/70 uppercase tracking-wider mb-1">Total Spend</p>
            <p className="text-2xl font-bold text-foreground">${totalSpend.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl p-4 border border-blue-500/20">
            <p className="text-xs font-semibold text-blue-600/70 uppercase tracking-wider mb-1">Avg Expense</p>
            <p className="text-2xl font-bold text-foreground">${avgExpense.toFixed(2)}</p>
          </div>
        </div>
      )}

      {expenses.length === 0 ? (
        <div className="animate-fade-in text-center py-20 text-muted-foreground">
          <div className="text-6xl mb-4 animate-bounce">💸</div>
          <p className="text-lg font-semibold">No expenses yet</p>
          <p className="text-sm mt-2">Start by adding your first expense</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([key, items], gi) => {
            const groupTotal = items.reduce((s, e) => s + e.amount, 0);
            return (
              <div key={key} className="animate-fade-in-up" style={{ animationDelay: `${gi * 0.08}s`, opacity: 0 }}>
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  {groupBy === "category" && (
                    <span className="text-lg">{categoryEmojis[key as keyof typeof categoryEmojis]}</span>
                  )}
                  {groupBy === "date" && <Calendar className="h-4 w-4 text-primary/60" />}
                  <span>{key}</span>
                  <span className="ml-auto text-[11px] font-bold bg-gradient-to-r from-primary/20 to-primary/10 text-primary px-3 py-1 rounded-full border border-primary/30">
                    {items.length} • ${groupTotal.toFixed(2)}
                  </span>
                </h2>
                <div className="space-y-2">
                  {items.map((exp, i) => (
                    <div
                      key={exp.id}
                      className={cn(
                        "flex items-center gap-3 bg-gradient-to-r from-card to-card/95 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 group border border-transparent hover:border-primary/30",
                        deletingId === exp.id && "opacity-0 scale-95"
                      )}
                      style={{ animationDelay: `${gi * 0.08 + i * 0.04}s` }}
                    >
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center text-xl shrink-0 border border-muted-foreground/10">
                        {categoryEmojis[exp.category]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground">{exp.category}</p>
                        {exp.note && (
                          <p className="text-xs text-muted-foreground truncate line-clamp-1">{exp.note}</p>
                        )}
                        {groupBy !== "date" && (
                          <p className="text-[11px] text-muted-foreground font-medium">{format(parseISO(exp.date), "MMM d, yyyy")}</p>
                        )}
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <p className="font-bold text-base text-foreground">${exp.amount.toFixed(2)}</p>
                        {groupBy === "date" && (
                          <p className="text-[10px] text-muted-foreground">{exp.category}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(exp.id, exp.category)}
                        className="text-muted-foreground/40 group-hover:text-destructive transition-all duration-200 p-2 rounded-lg hover:bg-destructive/10 ml-2"
                        title="Delete expense"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
