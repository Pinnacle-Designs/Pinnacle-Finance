import { useMemo, useState } from 'react';
import CalculatorPage from '../components/CalculatorPage';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import { useCurrencyInput, useNumberInput } from '../hooks/useInput';
import { formatCurrency } from '../utils/format';

export default function SavingsGoalCalculator() {
  const [mode, setMode] = useState('time');
  const goal = useCurrencyInput('20,000');
  const current = useCurrencyInput('2,000');
  const returnRate = useNumberInput('5');
  const contribution = useCurrencyInput('300');
  const [targetMonth, setTargetMonth] = useState('12');
  const [targetYear, setTargetYear] = useState('2028');

  const results = useMemo(() => {
    const G = goal.numeric;
    const C = current.numeric;
    const r = returnRate.numeric / 100 / 12;

    if (mode === 'time') {
      let balance = C;
      let months = 0;
      const maxMonths = 600;
      while (balance < G && months < maxMonths) {
        balance = balance * (1 + r) + contribution.numeric;
        months++;
      }
      const years = Math.floor(months / 12);
      const remMonths = months % 12;
      return {
        mode: 'time',
        months,
        display: years > 0 ? `${years} yr ${remMonths} mo` : `${months} months`,
        monthlyNeeded: null,
      };
    }

    const target = new Date(parseInt(targetYear), parseInt(targetMonth) - 1);
    const now = new Date();
    let months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
    if (months <= 0) months = 1;

    let monthlyNeeded;
    if (r === 0) {
      monthlyNeeded = (G - C) / months;
    } else {
      const fvCurrent = C * Math.pow(1 + r, months);
      monthlyNeeded = ((G - fvCurrent) * r) / (Math.pow(1 + r, months) - 1);
    }

    return {
      mode: 'monthly',
      months,
      display: formatCurrency(Math.max(0, monthlyNeeded)),
      monthlyNeeded: Math.max(0, monthlyNeeded),
    };
  }, [mode, goal.numeric, current.numeric, returnRate.numeric, contribution.numeric, targetMonth, targetYear]);

  const months = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: new Date(2000, i).toLocaleString('en', { month: 'long' }) }));
  const years = Array.from({ length: 20 }, (_, i) => ({ value: String(new Date().getFullYear() + i), label: String(new Date().getFullYear() + i) }));

  return (
    <CalculatorPage
      title="Savings Goal Calculator"
      description="Calculate how long to reach your savings goal or what to save monthly. Free savings goal planner."
      intro="Whether you're saving for a down payment, vacation, or emergency fund, this calculator helps you plan your path. Choose how long it will take with your current savings rate, or find out how much you need to save monthly to hit your target date."
      howItWorks="In time mode, we compound your current savings with monthly contributions at your expected return rate until you reach your goal. In monthly mode, we solve for the required monthly contribution to reach your goal by a target date."
      currentPath="/savings-goal-calculator"
      faq={[
        { question: 'How to save for a house down payment?', answer: 'Determine your target (typically 10-20% of home price), set a timeline, and automate monthly transfers to a high-yield savings account. On a $40,000 down payment goal, saving $500/month at 5% APY takes about 6 years.' },
        { question: 'High-yield savings vs investing for goals?', answer: 'Use HYSA for goals within 3 years (emergency fund, down payment). Invest in index funds for goals 5+ years away. The stock market can lose 20-30% in bad years — too risky for short-term goals.' },
        { question: 'How to stay motivated saving?', answer: 'Automate transfers on payday, track progress visually, celebrate milestones, and remind yourself of your goal. Breaking a large goal into smaller monthly targets makes it feel more achievable.' },
        { question: 'What is a realistic savings rate?', answer: 'Aim to save at least 20% of your gross income — including retirement contributions. If that feels impossible, start with 10% and increase by 1% each year or with each raise.' },
      ]}
      results={
        <>
          {mode === 'time' ? (
            <>
              <ResultCard label="Time to Reach Goal" value={results.display} highlight />
              <ResultCard label="Total Months" value={`${results.months} months`} />
            </>
          ) : (
            <>
              <ResultCard label="Required Monthly Savings" value={results.display} highlight />
              <ResultCard label="Months Until Target" value={`${results.months} months`} />
            </>
          )}
        </>
      }
    >
      <div className="col-span-full flex gap-2 mb-4">
        <button type="button" onClick={() => setMode('time')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === 'time' ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
          How long will it take?
        </button>
        <button type="button" onClick={() => setMode('monthly')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === 'monthly' ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
          What do I need to save monthly?
        </button>
      </div>
      <InputField label="Savings Goal" id="goal" value={goal.display} onChange={goal.onChange} onBlur={goal.onBlur} onFocus={goal.onFocus} placeholder="20,000" />
      <InputField label="Current Savings" id="current" value={current.display} onChange={current.onChange} onBlur={current.onBlur} onFocus={current.onFocus} placeholder="2,000" />
      <InputField label="Expected Annual Return" id="returnRate" value={returnRate.value} onChange={returnRate.onChange} placeholder="5" suffix="%" />
      {mode === 'time' ? (
        <InputField label="Monthly Contribution" id="contribution" value={contribution.display} onChange={contribution.onChange} onBlur={contribution.onBlur} onFocus={contribution.onFocus} placeholder="300" />
      ) : (
        <>
          <InputField label="Target Month" id="targetMonth" value={targetMonth} onChange={(e) => setTargetMonth(e.target.value)} options={months} />
          <InputField label="Target Year" id="targetYear" value={targetYear} onChange={(e) => setTargetYear(e.target.value)} options={years} />
        </>
      )}
    </CalculatorPage>
  );
}
