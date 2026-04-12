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
import { CalendarIcon, Check } from "lucide-react";
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
      <h1 className="text-2xl font-bold mb-6">Add Expense</h1>

      <div className="space-y-5">
        {/* Amount */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">$</span>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-9 h-14 text-2xl font-semibold bg-card"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Category</label>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all",
                  category === cat
                    ? "border-primary bg-accent"
                    : "border-transparent bg-card hover:bg-muted"
                )}
              >
                <span className="text-xl">{categoryEmojis[cat]}</span>
                <span className="text-xs font-medium">{cat}</span>
                {category === cat && <Check className="h-3 w-3 text-primary" />}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start h-12 bg-card text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* Note */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Note (optional)</label>
          <Textarea
            placeholder="What was this expense for?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-card resize-none"
            rows={3}
          />
        </div>

        <Button onClick={handleSubmit} className="w-full h-14 text-lg font-semibold mt-4">
          Add Expense
        </Button>
      </div>
    </div>
  );
}
