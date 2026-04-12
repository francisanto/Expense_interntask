export type Category = "Food" | "Travel" | "Shopping" | "Bills" | "Entertainment" | "Health" | "Other";

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  note: string;
  date: string; // ISO string
}

const STORAGE_KEY = "expenses";

export const categories: Category[] = ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Other"];

export const categoryColors: Record<Category, string> = {
  Food: "bg-orange-500",
  Travel: "bg-blue-500",
  Shopping: "bg-purple-500",
  Bills: "bg-red-500",
  Entertainment: "bg-pink-500",
  Health: "bg-emerald-500",
  Other: "bg-gray-500",
};

export const categoryEmojis: Record<Category, string> = {
  Food: "🍔",
  Travel: "✈️",
  Shopping: "🛍️",
  Bills: "📄",
  Entertainment: "🎬",
  Health: "💊",
  Other: "📦",
};

export function getExpenses(): Expense[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function addExpense(expense: Omit<Expense, "id">): Expense {
  const expenses = getExpenses();
  const newExpense = { ...expense, id: crypto.randomUUID() };
  expenses.push(newExpense);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  return newExpense;
}

export function deleteExpense(id: string) {
  const expenses = getExpenses().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}
