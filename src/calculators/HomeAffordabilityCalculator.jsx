import { useMemo } from 'react';
import CalculatorPage from '../components/CalculatorPage';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import { useCurrencyInput, useNumberInput } from '../hooks/useInput';
import { formatCurrency, monthlyPayment } from '../utils/format';

export default function HomeAffordabilityCalculator() {
  const income = useCurrencyInput('90,000');
  const debt = useCurrencyInput('500');
  const downPayment = useCurrencyInput('40,000');
  const rate = useNumberInput('6.5');
  const term = useNumberInput('30');
  const propertyTax = useCurrencyInput('350');
  const insurance = useCurrencyInput('150');

  const results = useMemo(() => {
    const monthlyIncome = income.numeric / 12;
    const maxHousingConservative = monthlyIncome * 0.28;
    const maxHousingAggressive = monthlyIncome * 0.36 - debt.numeric;
    const termMonths = term.numeric * 12;
    const r = rate.numeric / 100 / 12;

    const calcMaxPrice = (maxHousing) => {
      const availableForPI = maxHousing - propertyTax.numeric - insurance.numeric;
      if (availableForPI <= 0 || r === 0) return 0;
      const maxLoan = (availableForPI * (Math.pow(1 + r, termMonths) - 1)) / (r * Math.pow(1 + r, termMonths));
      return maxLoan + downPayment.numeric;
    };

    const conservative = calcMaxPrice(maxHousingConservative);
    const aggressive = calcMaxPrice(maxHousingAggressive);
    const midPrice = (conservative + aggressive) / 2;
    const loanAmount = Math.max(0, midPrice - downPayment.numeric);
    const estPayment = monthlyPayment(loanAmount, rate.numeric, termMonths) + propertyTax.numeric + insurance.numeric;

    return { conservative, aggressive, estPayment, midPrice };
  }, [income.numeric, debt.numeric, downPayment.numeric, rate.numeric, term.numeric, propertyTax.numeric, insurance.numeric]);

  return (
    <CalculatorPage
      title="Home Affordability Calculator"
      description="Find out how much house you can afford based on your income and debt. Free home affordability calculator."
      intro="How much house can you afford? This calculator uses your income, existing debt, and down payment to estimate the maximum home price based on standard lending guidelines — 28% front-end DTI (conservative) and 36% back-end DTI (aggressive)."
      howItWorks="We calculate the maximum monthly housing payment you can afford based on your gross income and debt obligations, then work backward using your interest rate and loan term to determine the maximum home price including your down payment."
      currentPath="/home-affordability-calculator"
      faq={[
        { question: 'What percentage of income should go to housing?', answer: 'The 28/36 rule is standard: spend no more than 28% of gross monthly income on housing, and no more than 36% on total debt. Some lenders allow up to 43% back-end DTI for qualified borrowers.' },
        { question: 'How much do I need for a down payment?', answer: 'While 20% avoids PMI, many buyers put down 3-10%. FHA loans require as little as 3.5% down. A larger down payment reduces your monthly payment and total interest, but should not deplete your emergency fund.' },
        { question: 'What credit score do I need for a mortgage?', answer: 'Conventional loans typically require 620+. FHA loans accept scores as low as 580 with 3.5% down. Scores above 740 qualify for the best interest rates, which can save tens of thousands over the loan term.' },
        { question: 'Should I buy at the top of my budget?', answer: 'Buying at the conservative estimate leaves room for maintenance (1-2% of home value annually), property tax increases, and lifestyle changes. Many financial advisors recommend staying in the lower half of your approved range.' },
      ]}
      results={
        <>
          <ResultCard label="Max Price (Conservative — 28%)" value={formatCurrency(results.conservative)} />
          <ResultCard label="Max Price (Aggressive — 36%)" value={formatCurrency(results.aggressive)} />
          <ResultCard label="Recommended Price Range" value={`${formatCurrency(results.conservative)} – ${formatCurrency(results.aggressive)}`} highlight />
          <ResultCard label="Estimated Monthly Payment" value={formatCurrency(results.estPayment)} />
        </>
      }
    >
      <InputField label="Annual Gross Income" id="income" value={income.display} onChange={income.onChange} onBlur={income.onBlur} onFocus={income.onFocus} placeholder="90,000" />
      <InputField label="Monthly Debt Payments" id="debt" value={debt.display} onChange={debt.onChange} onBlur={debt.onBlur} onFocus={debt.onFocus} placeholder="500" />
      <InputField label="Down Payment Available" id="downPayment" value={downPayment.display} onChange={downPayment.onChange} onBlur={downPayment.onBlur} onFocus={downPayment.onFocus} placeholder="40,000" />
      <InputField label="Interest Rate" id="rate" value={rate.value} onChange={rate.onChange} placeholder="6.5" suffix="%" />
      <InputField label="Loan Term" id="term" value={term.value} onChange={term.onChange} options={[{ value: '15', label: '15 years' }, { value: '20', label: '20 years' }, { value: '30', label: '30 years' }]} />
      <InputField label="Monthly Property Tax" id="propertyTax" value={propertyTax.display} onChange={propertyTax.onChange} onBlur={propertyTax.onBlur} onFocus={propertyTax.onFocus} placeholder="350" />
      <InputField label="Monthly Insurance" id="insurance" value={insurance.display} onChange={insurance.onChange} onBlur={insurance.onBlur} onFocus={insurance.onFocus} placeholder="150" />
    </CalculatorPage>
  );
}
