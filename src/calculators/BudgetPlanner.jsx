import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import CalculatorPage from '../components/CalculatorPage';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import { useCurrencyInput } from '../hooks/useInput';
import { formatCurrency, formatPercent } from '../utils/format';

const CATEGORIES = [
  { key: 'housing', label: 'Housing', recommended: 28 },
  { key: 'food', label: 'Food/Groceries', recommended: 10 },
  { key: 'transport', label: 'Transportation', recommended: 10 },
  { key: 'utilities', label: 'Utilities', recommended: 5 },
  { key: 'insurance', label: 'Insurance', recommended: 5 },
  { key: 'healthcare', label: 'Healthcare', recommended: 5 },
  { key: 'entertainment', label: 'Entertainment', recommended: 5 },
  { key: 'personal', label: 'Personal Care', recommended: 3 },
  { key: 'clothing', label: 'Clothing', recommended: 3 },
  { key: 'savings', label: 'Savings', recommended: 20 },
  { key: 'investments', label: 'Investments', recommended: 10 },
  { key: 'debt', label: 'Debt Payments', recommended: 0 },
  { key: 'other', label: 'Other', recommended: 0 },
];

const COLORS = ['#1B4FD8', '#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#64748B', '#14B8A6', '#F97316', '#6366F1', '#84CC16', '#EF4444', '#94A3B8'];

export default function BudgetPlanner() {
  const income = useCurrencyInput('5,000');
  const housing = useCurrencyInput('1,400');
  const food = useCurrencyInput('500');
  const transport = useCurrencyInput('400');
  const utilities = useCurrencyInput('200');
  const insurance = useCurrencyInput('250');
  const healthcare = useCurrencyInput('100');
  const entertainment = useCurrencyInput('200');
  const personal = useCurrencyInput('75');
  const clothing = useCurrencyInput('100');
  const savings = useCurrencyInput('500');
  const investments = useCurrencyInput('300');
  const debt = useCurrencyInput('200');
  const other = useCurrencyInput('100');

  const values = { housing, food, transport, utilities, insurance, healthcare, entertainment, personal, clothing, savings, investments, debt, other };

  const results = useMemo(() => {
    const inc = income.numeric;
    const expenses = CATEGORIES.map((cat) => ({
      ...cat,
      amount: values[cat.key].numeric,
      pct: inc > 0 ? (values[cat.key].numeric / inc) * 100 : 0,
      overBudget: inc > 0 && cat.recommended > 0 && (values[cat.key].numeric / inc) * 100 > cat.recommended * 1.5,
    }));
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    const remaining = inc - total;

    const needs = housing.numeric + food.numeric + transport.numeric + utilities.numeric + insurance.numeric + healthcare.numeric;
    const wants = entertainment.numeric + personal.numeric + clothing.numeric + other.numeric;
    const saveInvest = savings.numeric + investments.numeric;
    const needsPct = inc > 0 ? (needs / inc) * 100 : 0;
    const wantsPct = inc > 0 ? (wants / inc) * 100 : 0;
    const savePct = inc > 0 ? (saveInvest / inc) * 100 : 0;

    const chartData = expenses.filter((e) => e.amount > 0).map((e) => ({ name: e.label, value: e.amount }));

    return { total, remaining, expenses, chartData, needsPct, wantsPct, savePct };
  }, [income.numeric, housing.numeric, food.numeric, transport.numeric, utilities.numeric, insurance.numeric, healthcare.numeric, entertainment.numeric, personal.numeric, clothing.numeric, savings.numeric, investments.numeric, debt.numeric, other.numeric]);

  return (
    <CalculatorPage
      title="Monthly Budget Planner"
      description="Plan your monthly budget and see where your money goes. Free budget planner with 50/30/20 rule comparison."
      intro="Take control of your finances with a monthly budget. Enter your take-home income and planned spending across categories to see your breakdown, compare against the 50/30/20 rule, and identify areas where you may be overspending."
      howItWorks="Enter your monthly take-home income and budgeted amounts for each category. We calculate totals, percentages, and compare your spending against the 50/30/20 rule: 50% needs, 30% wants, 20% savings and debt repayment."
      currentPath="/budget-planner"
      faq={[
        { question: 'What is the 50/30/20 rule?', answer: 'The 50/30/20 rule allocates 50% of after-tax income to needs (housing, food, utilities), 30% to wants (entertainment, dining out), and 20% to savings and debt repayment. It is a simple starting framework for budgeting.' },
        { question: 'How to stick to a budget?', answer: 'Track every expense for the first month, automate savings transfers on payday, use the envelope method for problem categories, review weekly, and adjust categories that are consistently over or under budget.' },
        { question: "What's a realistic food budget?", answer: 'The USDA estimates $250-$400 per person per month for a moderate food plan. A couple might budget $500-$700. Meal planning, cooking at home, and reducing food waste can cut this by 20-30%.' },
        { question: 'Should I budget gross or net income?', answer: 'Always budget based on take-home (net) pay — what actually hits your bank account. This accounts for taxes, health insurance, and retirement contributions already deducted from your paycheck.' },
      ]}
      results={
        <>
          <ResultCard label="Total Budgeted" value={formatCurrency(results.total)} />
          <ResultCard label="Remaining" value={formatCurrency(results.remaining)} variant={results.remaining >= 0 ? 'success' : 'danger'} highlight />
          <div className="col-span-full grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className={`rounded-lg p-4 border ${results.needsPct > 55 ? 'border-brand-warning bg-amber-50' : 'border-brand-border bg-white'}`}>
              <p className="text-sm text-brand-muted">Needs (target 50%)</p>
              <p className="text-lg font-bold text-brand-primary">{formatPercent(results.needsPct, 1)}</p>
            </div>
            <div className={`rounded-lg p-4 border ${results.wantsPct > 35 ? 'border-brand-warning bg-amber-50' : 'border-brand-border bg-white'}`}>
              <p className="text-sm text-brand-muted">Wants (target 30%)</p>
              <p className="text-lg font-bold text-brand-primary">{formatPercent(results.wantsPct, 1)}</p>
            </div>
            <div className={`rounded-lg p-4 border ${results.savePct < 15 ? 'border-brand-warning bg-amber-50' : 'border-brand-border bg-white'}`}>
              <p className="text-sm text-brand-muted">Savings (target 20%)</p>
              <p className="text-lg font-bold text-brand-primary">{formatPercent(results.savePct, 1)}</p>
            </div>
          </div>
          <div className="col-span-full">
            {results.expenses.filter((e) => e.overBudget).map((e) => (
              <p key={e.key} className="text-sm text-brand-warning mb-1">⚠ {e.label} is {formatPercent(e.pct, 1)} of income (recommended: {e.recommended}%)</p>
            ))}
          </div>
          <div className="col-span-full mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={results.chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                  {results.chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      }
    >
      <InputField label="Monthly Take-Home Income" id="income" value={income.display} onChange={income.onChange} onBlur={income.onBlur} onFocus={income.onFocus} placeholder="5,000" />
      {CATEGORIES.map((cat) => (
        <InputField key={cat.key} label={cat.label} id={cat.key} value={values[cat.key].display} onChange={values[cat.key].onChange} onBlur={values[cat.key].onBlur} onFocus={values[cat.key].onFocus} placeholder="0" />
      ))}
    </CalculatorPage>
  );
}
