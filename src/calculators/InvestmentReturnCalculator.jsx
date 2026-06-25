import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import CalculatorPage from '../components/CalculatorPage';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import { useCurrencyInput, useNumberInput } from '../hooks/useInput';
import { formatCurrency } from '../utils/format';

function projectGrowth(initial, monthly, annualRate, years) {
  const data = [];
  let balance = initial;
  const r = annualRate / 100 / 12;
  for (let y = 0; y <= years; y++) {
    if (y > 0) {
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + r) + monthly;
      }
    }
    data.push({ year: y, balance: Math.round(balance) });
  }
  const contributed = initial + monthly * 12 * years;
  return { data, final: balance, contributed, gains: balance - contributed };
}

export default function InvestmentReturnCalculator() {
  const initial = useCurrencyInput('10,000');
  const monthly = useCurrencyInput('500');
  const rate = useNumberInput('8');
  const years = useNumberInput('20');
  const compareRate = useNumberInput('6');
  const compareMonthly = useCurrencyInput('500');

  const results = useMemo(() => {
    const main = projectGrowth(initial.numeric, monthly.numeric, rate.numeric, years.numeric);
    const compare = projectGrowth(initial.numeric, compareMonthly.numeric, compareRate.numeric, years.numeric);

    const chartData = main.data.map((d, i) => ({
      year: d.year,
      scenario1: d.balance,
      scenario2: compare.data[i]?.balance || 0,
    }));

    const annualizedMain = years.numeric > 0 ? (Math.pow(main.final / initial.numeric, 1 / years.numeric) - 1) * 100 : 0;

    return { main, compare, chartData, annualizedMain };
  }, [initial.numeric, monthly.numeric, rate.numeric, years.numeric, compareRate.numeric, compareMonthly.numeric]);

  return (
    <CalculatorPage
      title="Investment Return Calculator"
      description="Calculate the return on any investment with or without regular contributions. Compare investment scenarios."
      intro="See how your investments could grow over time with compound returns and regular contributions. Optionally compare two scenarios with different return rates or contribution amounts to see the impact on your portfolio."
      howItWorks="We project your portfolio value by compounding monthly returns on your initial investment plus monthly contributions. The comparison scenario uses the same initial investment but different rate or contribution assumptions."
      currentPath="/investment-return-calculator"
      faq={[
        { question: 'What is a realistic stock market return?', answer: 'Historically, the S&P 500 has returned about 10% annually before inflation, or roughly 7% after inflation. For planning purposes, using 6-8% is conservative and accounts for fees, taxes, and market volatility.' },
        { question: 'What is the S&P 500 historical return?', answer: 'The S&P 500 has averaged approximately 10.5% annual returns since 1957. However, returns vary widely year to year — from -37% in 2008 to +32% in 2013. Long-term investing smooths out this volatility.' },
        { question: 'What is dollar cost averaging?', answer: 'Dollar cost averaging means investing a fixed amount regularly regardless of market conditions. You buy more shares when prices are low and fewer when high, reducing the impact of market timing and building discipline.' },
        { question: 'Should I invest a lump sum or monthly?', answer: 'Research shows lump-sum investing outperforms dollar cost averaging about two-thirds of the time because markets trend upward. However, DCA reduces emotional risk and is better if a lump sum would cause anxiety during market dips.' },
      ]}
      results={
        <>
          <ResultCard label="Final Portfolio Value" value={formatCurrency(results.main.final)} highlight />
          <ResultCard label="Total Contributed" value={formatCurrency(results.main.contributed)} />
          <ResultCard label="Total Gains" value={formatCurrency(results.main.gains)} variant="success" />
          <ResultCard label="Annualized Return" value={`${results.annualizedMain.toFixed(2)}%`} />
          <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="bg-slate-50 rounded-lg p-4 border border-brand-border">
              <p className="text-sm font-semibold text-slate-900 mb-2">Scenario 1 ({rate.value}% return)</p>
              <p className="text-lg font-bold text-brand-primary">{formatCurrency(results.main.final)}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-brand-border">
              <p className="text-sm font-semibold text-slate-900 mb-2">Scenario 2 ({compareRate.value}% return)</p>
              <p className="text-lg font-bold text-brand-secondary">{formatCurrency(results.compare.final)}</p>
            </div>
          </div>
          <div className="col-span-full mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={results.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
                <Line type="monotone" dataKey="scenario1" name={`${rate.value}% return`} stroke="#1B4FD8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="scenario2" name={`${compareRate.value}% return`} stroke="#0EA5E9" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      }
    >
      <InputField label="Initial Investment" id="initial" value={initial.display} onChange={initial.onChange} onBlur={initial.onBlur} onFocus={initial.onFocus} placeholder="10,000" />
      <InputField label="Monthly Contribution" id="monthly" value={monthly.display} onChange={monthly.onChange} onBlur={monthly.onBlur} onFocus={monthly.onFocus} placeholder="500" />
      <InputField label="Annual Return Rate" id="rate" value={rate.value} onChange={rate.onChange} placeholder="8" suffix="%" />
      <InputField label="Investment Period" id="years" value={years.value} onChange={years.onChange} placeholder="20" suffix="years" />
      <div className="col-span-full mt-2 mb-2">
        <h3 className="font-semibold text-slate-900">Compare Scenario (optional)</h3>
      </div>
      <InputField label="Compare Return Rate" id="compareRate" value={compareRate.value} onChange={compareRate.onChange} placeholder="6" suffix="%" />
      <InputField label="Compare Monthly Contribution" id="compareMonthly" value={compareMonthly.display} onChange={compareMonthly.onChange} onBlur={compareMonthly.onBlur} onFocus={compareMonthly.onFocus} placeholder="500" />
    </CalculatorPage>
  );
}
