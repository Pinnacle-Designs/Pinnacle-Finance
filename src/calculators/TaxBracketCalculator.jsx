import { useMemo, useState } from 'react';
import CalculatorPage from '../components/CalculatorPage';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import { useCurrencyInput, useNumberInput } from '../hooks/useInput';
import { formatCurrency, formatPercent } from '../utils/format';

const STANDARD_DEDUCTIONS = {
  single: 15000,
  mfj: 30000,
  mfs: 15000,
  hoh: 22500,
};

const BRACKETS = {
  single: [
    { limit: 11925, rate: 0.10 },
    { limit: 48475, rate: 0.12 },
    { limit: 103350, rate: 0.22 },
    { limit: 197300, rate: 0.24 },
    { limit: 250525, rate: 0.32 },
    { limit: 626350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
  mfj: [
    { limit: 23850, rate: 0.10 },
    { limit: 96950, rate: 0.12 },
    { limit: 206700, rate: 0.22 },
    { limit: 394600, rate: 0.24 },
    { limit: 501050, rate: 0.32 },
    { limit: 751600, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
  mfs: [
    { limit: 11925, rate: 0.10 },
    { limit: 48475, rate: 0.12 },
    { limit: 103350, rate: 0.22 },
    { limit: 197300, rate: 0.24 },
    { limit: 250525, rate: 0.32 },
    { limit: 375800, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
  hoh: [
    { limit: 17000, rate: 0.10 },
    { limit: 64850, rate: 0.12 },
    { limit: 103350, rate: 0.22 },
    { limit: 197300, rate: 0.24 },
    { limit: 250500, rate: 0.32 },
    { limit: 626350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
};

function calculateTax(taxableIncome, brackets) {
  let tax = 0;
  let prev = 0;
  const breakdown = [];
  let marginalRate = 0;

  for (const bracket of brackets) {
    const taxable = Math.min(taxableIncome, bracket.limit) - prev;
    if (taxable <= 0) break;
    const bracketTax = taxable * bracket.rate;
    tax += bracketTax;
    breakdown.push({
      rate: bracket.rate,
      taxable,
      tax: bracketTax,
    });
    marginalRate = bracket.rate;
    prev = bracket.limit;
    if (taxableIncome <= bracket.limit) break;
  }

  return { tax, breakdown, marginalRate };
}

export default function TaxBracketCalculator() {
  const [status, setStatus] = useState('single');
  const income = useCurrencyInput('75,000');
  const retirement401k = useCurrencyInput('5,000');
  const otherPretax = useCurrencyInput('0');
  const itemized = useCurrencyInput('');

  const results = useMemo(() => {
    const gross = income.numeric;
    const pretax = retirement401k.numeric + otherPretax.numeric;
    const agi = gross - pretax;
    const standard = STANDARD_DEDUCTIONS[status];
    const itemizedAmt = itemized.numeric;
    const deduction = itemizedAmt > standard ? itemizedAmt : standard;
    const useItemized = itemizedAmt > standard;
    const taxableIncome = Math.max(0, agi - deduction);
    const { tax, breakdown, marginalRate } = calculateTax(taxableIncome, BRACKETS[status]);
    const effectiveRate = gross > 0 ? (tax / gross) * 100 : 0;

    return { agi, taxableIncome, tax, breakdown, marginalRate, effectiveRate, standard, itemizedAmt, useItemized, deduction };
  }, [status, income.numeric, retirement401k.numeric, otherPretax.numeric, itemized.numeric]);

  return (
    <CalculatorPage
      title="Tax Bracket Calculator"
      description="Calculate your federal income tax and effective tax rate for 2025. Free tax bracket calculator with breakdown."
      intro="Understand how federal income taxes work with our 2025 tax bracket calculator. Enter your income, filing status, and deductions to see your tax breakdown by bracket, marginal rate, and effective tax rate."
      howItWorks="We apply 2025 IRS federal tax brackets to your taxable income (gross income minus pre-tax deductions and standard or itemized deductions). Tax is calculated progressively — each bracket only taxes income within that range."
      currentPath="/tax-bracket-calculator"
      faq={[
        { question: 'What is marginal vs effective tax rate?', answer: 'Your marginal rate is the tax on your last dollar of income — the highest bracket you reach. Your effective rate is total tax divided by gross income. Most people pay a much lower effective rate than their marginal bracket suggests.' },
        { question: 'Should I itemize or take the standard deduction?', answer: 'Take whichever is larger. For 2025, the standard deduction is $15,000 (single), $30,000 (married filing jointly), and $22,500 (head of household). Only itemize if your deductible expenses exceed these amounts.' },
        { question: 'How does the tax bracket system work?', answer: 'The U.S. uses progressive tax brackets — higher income is taxed at higher rates, but only within each bracket. Moving into a higher bracket does not mean all your income is taxed at that rate, only the portion above the threshold.' },
        { question: 'Do 401k contributions reduce taxes?', answer: 'Yes. Traditional 401k and IRA contributions reduce your taxable income dollar-for-dollar. Contributing $5,000 to a 401k could save $1,100-$1,850 in federal taxes depending on your bracket.' },
      ]}
      results={
        <>
          <ResultCard label="Taxable Income" value={formatCurrency(results.taxableIncome)} />
          <ResultCard label="Total Federal Tax" value={formatCurrency(results.tax)} />
          <ResultCard label="Marginal Tax Rate" value={formatPercent(results.marginalRate * 100, 0)} />
          <ResultCard label="Effective Tax Rate" value={formatPercent(results.effectiveRate, 1)} highlight />
          <div className="col-span-full bg-slate-50 rounded-lg p-4 text-sm">
            <p className="font-medium text-slate-900 mb-2">
              Deduction: {results.useItemized ? 'Itemized' : 'Standard'} — {formatCurrency(results.deduction)}
            </p>
            <p className="text-brand-muted">
              Standard: {formatCurrency(results.standard)} | Itemized: {formatCurrency(results.itemizedAmt)}
            </p>
          </div>
          <div className="col-span-full overflow-x-auto">
            <table className="w-full text-sm mt-2">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="text-left py-2 font-semibold">Bracket</th>
                  <th className="text-right py-2 font-semibold">Taxable Amount</th>
                  <th className="text-right py-2 font-semibold">Tax</th>
                </tr>
              </thead>
              <tbody>
                {results.breakdown.map((row, i) => (
                  <tr key={i} className="border-b border-brand-border">
                    <td className="py-2">{formatPercent(row.rate * 100, 0)}</td>
                    <td className="text-right py-2">{formatCurrency(row.taxable)}</td>
                    <td className="text-right py-2">{formatCurrency(row.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      }
    >
      <InputField label="Filing Status" id="status" value={status} onChange={(e) => setStatus(e.target.value)} options={[{ value: 'single', label: 'Single' }, { value: 'mfj', label: 'Married Filing Jointly' }, { value: 'mfs', label: 'Married Filing Separately' }, { value: 'hoh', label: 'Head of Household' }]} />
      <InputField label="Gross Annual Income" id="income" value={income.display} onChange={income.onChange} onBlur={income.onBlur} onFocus={income.onFocus} placeholder="75,000" />
      <InputField label="401k/Traditional IRA Contributions" id="retirement401k" value={retirement401k.display} onChange={retirement401k.onChange} onBlur={retirement401k.onBlur} onFocus={retirement401k.onFocus} placeholder="5,000" />
      <InputField label="Other Pre-Tax Deductions" id="otherPretax" value={otherPretax.display} onChange={otherPretax.onChange} onBlur={otherPretax.onBlur} onFocus={otherPretax.onFocus} placeholder="0" />
      <InputField label="Itemized Deductions" id="itemized" value={itemized.display} onChange={itemized.onChange} onBlur={itemized.onBlur} onFocus={itemized.onFocus} placeholder="Leave blank for standard" tooltip="If less than standard deduction, standard will be used" />
    </CalculatorPage>
  );
}