import { useState, useMemo } from "react";
import { getExpenses, deleteExpense, categoryEmojis, type Expense } from "@/lib/expenses";
import { format, parseISO } from "date-fns";
import { Trash2 } from "lucide-react";
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <div className="flex bg-muted rounded-lg p-1">
          {(["date", "category"] as GroupBy[]).map((g) => (
            <button
              key={g}
              onClick={() => setGroupBy(g)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize",
                groupBy === g ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No expenses yet</p>
          <p className="text-sm mt-1">Start by adding your first expense</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([key, items]) => (
            <div key={key}>
              <h2 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                {groupBy === "category" && <span>{categoryEmojis[key as keyof typeof categoryEmojis]}</span>}
                {key}
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  ${items.reduce((s, e) => s + e.amount, 0).toFixed(2)}
                </span>
              </h2>
              <div className="space-y-2">
                {items.map((exp) => (
                  <div key={exp.id} className="flex items-center gap-3 bg-card rounded-xl p-4 shadow-sm">
                    <span className="text-2xl">{categoryEmojis[exp.category]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{exp.category}</p>
                      {exp.note && <p className="text-sm text-muted-foreground truncate">{exp.note}</p>}
                      {groupBy !== "date" && (
                        <p className="text-xs text-muted-foreground">{format(parseISO(exp.date), "MMM d")}</p>
                      )}
                    </div>
                    <p className="font-bold text-lg">${exp.amount.toFixed(2)}</p>
                    <button onClick={() => handleDelete(exp.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
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
