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
import { CalendarIcon, Check, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AddExpense() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [note, setNote] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [errors, setErrors] = useState<{ amount?: string; category?: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!amount || amount.trim() === "") {
      newErrors.amount = "Amount is required";
    } else {
      const parsed = parseFloat(amount);
      if (isNaN(parsed)) {
        newErrors.amount = "Please enter a valid number";
      } else if (parsed <= 0) {
        newErrors.amount = "Amount must be greater than 0";
      }
    }

    if (!category) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const parsed = parseFloat(amount);
    addExpense({ amount: parsed, category: category!, note, date: date.toISOString() });
    toast.success("✓ Expense added successfully!", {
      description: `$${parsed.toFixed(2)} added to ${category}`,
    });
    setAmount("");
    setCategory(null);
    setNote("");
    setDate(new Date());
    setErrors({});
    navigate("/expenses");
  };

  return (
    <div className="px-5 pt-6 pb-24 max-w-md mx-auto">
      <div className="animate-fade-in flex items-center gap-2 mb-8">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Expense</h1>
          <p className="text-xs text-muted-foreground">Track your spending wisely</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Amount */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.05s", opacity: 0 }}>
          <label className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1">
            Amount
            {errors.amount && <span className="text-red-500 text-xs">({errors.amount})</span>}
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-primary transition-transform group-focus-within:scale-110">$</span>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors({ ...errors, amount: undefined });
              }}
              className={cn(
                "pl-10 h-16 text-3xl font-bold bg-gradient-to-br from-card to-card/95 rounded-2xl border-2 transition-all shadow-sm focus:shadow-lg",
                errors.amount
                  ? "border-red-500 focus:border-red-500"
                  : "border-transparent focus:border-primary"
              )}
            />
          </div>
        </div>

        {/* Category */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
          <label className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1">
            Category
            {errors.category && <span className="text-red-500 text-xs">({errors.category})</span>}
          </label>
          <div className="grid grid-cols-4 gap-2.5">
            {categories.map((cat, i) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  if (errors.category) setErrors({ ...errors, category: undefined });
                }}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200 active:scale-95",
                  category === cat
                    ? "border-primary bg-gradient-to-br from-accent to-accent/90 shadow-lg scale-[1.02]"
                    : "border-transparent bg-card hover:bg-muted hover:scale-[1.02] shadow-sm hover:shadow-md"
                )}
                style={{ animationDelay: `${0.15 + i * 0.03}s` }}
              >
                <span className={cn("text-2xl transition-transform duration-200", category === cat && "scale-120")}>{categoryEmojis[cat]}</span>
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
          <label className="text-sm font-semibold text-foreground mb-2 block">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start h-13 bg-gradient-to-r from-card to-card/95 text-left font-normal rounded-2xl shadow-sm hover:shadow-md transition-all border-transparent"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                <span className="font-medium">{format(date, "PPP")}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl border-0 shadow-lg" align="start">
              <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* Note */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
          <label className="text-sm font-semibold text-foreground mb-2 block">Note (optional)</label>
          <Textarea
            placeholder="What was this expense for? (e.g., Coffee & Breakfast)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-gradient-to-br from-card to-card/95 resize-none rounded-2xl shadow-sm focus:shadow-md transition-all border-transparent focus:border-primary text-sm"
            rows={3}
          />
          {note && <p className="text-xs text-muted-foreground mt-2">{note.length} characters</p>}
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.25s", opacity: 0 }}>
          <Button
            onClick={handleSubmit}
            disabled={!amount || !category}
            className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] bg-gradient-to-r from-primary to-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {amount && category ? "✓ Add Expense" : "Add Expense"}
          </Button>
        </div>
      </div>
    </div>
  );
}
