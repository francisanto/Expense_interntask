import { getExpenses, categories, type Category, type Expense } from "./expenses";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subWeeks,
  subMonths,
  isWithinInterval,
  parseISO,
} from "date-fns";

export interface SmartInsight {
  emoji: string;
  text: string;
  type: "warning" | "info" | "positive";
}

function filterByInterval(expenses: Expense[], start: Date, end: Date) {
  return expenses.filter((e) => isWithinInterval(parseISO(e.date), { start, end }));
}

function getCategoryTotal(expenses: Expense[], cat: Category) {
  return expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0);
}

export function generateInsights(): SmartInsight[] {
  const all = getExpenses();
  if (all.length === 0) return [];

  const now = new Date();
  const insights: SmartInsight[] = [];

  // Week-over-week comparison per category
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
  const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

  const thisWeek = filterByInterval(all, thisWeekStart, thisWeekEnd);
  const lastWeek = filterByInterval(all, lastWeekStart, lastWeekEnd);

  for (const cat of categories) {
    const curr = getCategoryTotal(thisWeek, cat);
    const prev = getCategoryTotal(lastWeek, cat);
    if (prev > 0 && curr > 0) {
      const pctChange = ((curr - prev) / prev) * 100;
      if (pctChange >= 30) {
        insights.push({
          emoji: "📈",
          text: `You spent ${Math.round(pctChange)}% more on ${cat} this week compared to last week.`,
          type: "warning",
        });
      } else if (pctChange <= -30) {
        insights.push({
          emoji: "📉",
          text: `You spent ${Math.round(Math.abs(pctChange))}% less on ${cat} this week — nice saving!`,
          type: "positive",
        });
      }
    }
  }

  // Month-over-month total comparison
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const thisMonthTotal = filterByInterval(all, thisMonthStart, thisMonthEnd).reduce((s, e) => s + e.amount, 0);
  const lastMonthTotal = filterByInterval(all, lastMonthStart, lastMonthEnd).reduce((s, e) => s + e.amount, 0);

  if (lastMonthTotal > 0 && thisMonthTotal > 0) {
    const pct = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    if (Math.abs(pct) >= 10) {
      insights.push({
        emoji: pct > 0 ? "💰" : "🎉",
        text:
          pct > 0
            ? `Your spending is up ${Math.round(pct)}% this month vs last month.`
            : `You've cut spending by ${Math.round(Math.abs(pct))}% this month — great job!`,
        type: pct > 0 ? "warning" : "positive",
      });
    }
  }

  // Top category insight
  const thisMonthExpenses = filterByInterval(all, thisMonthStart, thisMonthEnd);
  if (thisMonthExpenses.length > 0) {
    const catTotals = categories.map((c) => ({ cat: c, total: getCategoryTotal(thisMonthExpenses, c) }));
    const top = catTotals.sort((a, b) => b.total - a.total)[0];
    if (top.total > 0) {
      const totalMonth = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);
      const pct = Math.round((top.total / totalMonth) * 100);
      insights.push({
        emoji: "🏷️",
        text: `${top.cat} is your biggest expense this month (${pct}% of total).`,
        type: "info",
      });
    }
  }

  // Streak: consecutive days with expenses
  const dates = [...new Set(all.map((e) => parseISO(e.date).toDateString()))].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );
  if (dates.length >= 3) {
    insights.push({
      emoji: "🔥",
      text: `You've logged expenses on ${dates.length} different days — keep tracking!`,
      type: "positive",
    });
  }

  return insights.slice(0, 4);
}
