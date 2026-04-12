import { useState, useMemo } from "react";
import { getExpenses, deleteExpense, categoryEmojis, type Expense } from "@/lib/expenses";
import { format, parseISO } from "date-fns";
import { Trash2, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type GroupBy = "date" | "category";

export default function ExpenseList() {
  const [groupBy, setGroupBy] = useState<GroupBy>("date");
  const [expenses, setExpenses] = useState<Expense[]>(getExpenses);

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

  const handleDelete = (id: string) => {
    deleteExpense(id);
    setExpenses(getExpenses());
    toast.success("Expense deleted");
  };

  return (
    <div className="px-5 pt-6 pb-24 max-w-md mx-auto">
      <div className="animate-fade-in flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center">
            <ListFilter className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
            <p className="text-xs text-muted-foreground">{expenses.length} total</p>
          </div>
        </div>
        <div className="flex bg-muted rounded-xl p-1">
          {(["date", "category"] as GroupBy[]).map((g) => (
            <button
              key={g}
              onClick={() => setGroupBy(g)}
              className={cn(
                "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 capitalize",
                groupBy === g ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="animate-fade-in text-center py-20 text-muted-foreground">
          <div className="text-5xl mb-4">💸</div>
          <p className="text-lg font-medium">No expenses yet</p>
          <p className="text-sm mt-1">Start by adding your first expense</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([key, items], gi) => (
            <div key={key} className="animate-fade-in-up" style={{ animationDelay: `${gi * 0.08}s`, opacity: 0 }}>
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-2">
                {groupBy === "category" && <span className="text-base">{categoryEmojis[key as keyof typeof categoryEmojis]}</span>}
                {key}
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                  ${items.reduce((s, e) => s + e.amount, 0).toFixed(2)}
                </span>
              </h2>
              <div className="space-y-2">
                {items.map((exp, i) => (
                  <div
                    key={exp.id}
                    className="flex items-center gap-3 bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] group"
                    style={{ animationDelay: `${gi * 0.08 + i * 0.04}s` }}
                  >
                    <div className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
                      {categoryEmojis[exp.category]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{exp.category}</p>
                      {exp.note && <p className="text-xs text-muted-foreground truncate">{exp.note}</p>}
                      {groupBy !== "date" && (
                        <p className="text-[11px] text-muted-foreground">{format(parseISO(exp.date), "MMM d")}</p>
                      )}
                    </div>
                    <p className="font-bold text-base">${exp.amount.toFixed(2)}</p>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="text-muted-foreground/0 group-hover:text-muted-foreground hover:!text-destructive transition-all p-1.5 rounded-lg hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
