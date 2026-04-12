import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { categories, categoryEmojis, addExpense, type Category } from "@/lib/expenses";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function AddExpense() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [note, setNote] = useState("");
  const [date, setDate] = useState<Date>(new Date());

  const handleSubmit = () => {
    if (!amount || !category) {
      toast.error("Please enter an amount and select a category");
      return;
    }
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    addExpense({ amount: parsed, category, note, date: date.toISOString() });
    toast.success("Expense added!");
    setAmount("");
    setCategory(null);
    setNote("");
    setDate(new Date());
    navigate("/expenses");
  };

  return (
    <div className="px-5 pt-6 pb-24 max-w-md mx-auto">
      <div className="animate-fade-in flex items-center gap-2 mb-8">
        <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Expense</h1>
          <p className="text-xs text-muted-foreground">Track your spending</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Amount */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.05s", opacity: 0 }}>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Amount</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-primary transition-transform group-focus-within:scale-110">$</span>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-10 h-16 text-3xl font-bold bg-card rounded-2xl border-2 border-transparent focus:border-primary transition-all shadow-sm focus:shadow-md"
            />
          </div>
        </div>

        {/* Category */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
          <label className="text-sm font-medium text-muted-foreground mb-3 block">Category</label>
          <div className="grid grid-cols-4 gap-2.5">
            {categories.map((cat, i) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200 active:scale-95",
                  category === cat
                    ? "border-primary bg-accent shadow-md scale-[1.02]"
                    : "border-transparent bg-card hover:bg-muted hover:scale-[1.02] shadow-sm"
                )}
                style={{ animationDelay: `${0.15 + i * 0.03}s` }}
              >
                <span className={cn("text-2xl transition-transform duration-200", category === cat && "scale-110")}>{categoryEmojis[cat]}</span>
                <span className="text-[11px] font-semibold">{cat}</span>
                {category === cat && (
                  <div className="animate-pop">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.15s", opacity: 0 }}>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start h-13 bg-card text-left font-normal rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
              <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* Note */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Note (optional)</label>
          <Textarea
            placeholder="What was this expense for?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-card resize-none rounded-2xl shadow-sm focus:shadow-md transition-shadow"
            rows={3}
          />
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.25s", opacity: 0 }}>
          <Button
            onClick={handleSubmit}
            className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            Add Expense
          </Button>
        </div>
      </div>
    </div>
  );
}
