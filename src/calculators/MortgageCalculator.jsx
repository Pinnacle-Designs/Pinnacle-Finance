import { useMemo, useState } from 'react';
import CalculatorPage from '../components/CalculatorPage';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import { useCurrencyInput, useNumberInput } from '../hooks/useInput';
import { formatCurrency, formatDate, monthlyPayment } from '../utils/format';

export default function MortgageCalculator() {
  const homePrice = useCurrencyInput('350,000');
  const downPayment = useCurrencyInput('70,000');
  const [downType, setDownType] = useState('dollar');
  const term = useNumberInput('30');
  const rate = useNumberInput('6.5');
  const propertyTax = useCurrencyInput('4,200');
  const insurance = useCurrencyInput('1,200');
  const pmiRate = useNumberInput('0.5');

  const results = useMemo(() => {
    const price = homePrice.numeric;
    let down = downPayment.numeric;
    if (downType === 'percent') down = price * (downPayment.numeric / 100);
    const loanAmount = Math.max(0, price - down);
    const downPercent = price > 0 ? (down / price) * 100 : 0;
    const termMonths = term.numeric * 12;
    const pi = monthlyPayment(loanAmount, rate.numeric, termMonths);
    const monthlyTax = propertyTax.numeric / 12;
    const monthlyIns = insurance.numeric / 12;
    const monthlyPmi = downPercent < 20 ? (loanAmount * (pmiRate.numeric / 100)) / 12 : 0;
    const totalMonthly = pi + monthlyTax + monthlyIns + monthlyPmi;
    const totalPaid = pi * termMonths;
    const totalInterest = totalPaid - loanAmount;
    const totalCost = totalPaid + down + propertyTax.numeric * term.numeric + insurance.numeric * term.numeric + monthlyPmi * 12 * term.numeric;
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + termMonths);

    return { pi, monthlyTax, monthlyIns, monthlyPmi, totalMonthly, totalInterest, totalCost, payoffDate, downPercent };
  }, [homePrice.numeric, downPayment.numeric, downType, term.numeric, rate.numeric, propertyTax.numeric, insurance.numeric, pmiRate.numeric]);

  return (
    <CalculatorPage
      title="Mortgage Payment Calculator"
      description="Calculate your monthly mortgage payment with taxes, insurance, and PMI. Free mortgage calculator with instant results."
      intro="Use our mortgage payment calculator to estimate your full monthly housing cost, including principal, interest, property taxes, homeowner's insurance, and PMI. Enter your home price, down payment, loan term, and interest rate to see a complete breakdown."
      howItWorks="Your monthly principal and interest payment uses the standard amortization formula: M = P[r(1+r)^n]/[(1+r)^n-1], where P is the loan amount, r is the monthly interest rate, and n is the number of payments. Property tax, insurance, and PMI are added to give your total monthly payment."
      currentPath="/mortgage-calculator"
      faq={[
        { question: "What's a good mortgage rate?", answer: "As of 2025, a good mortgage rate for a 30-year fixed loan is typically between 6% and 7%, though rates vary based on credit score, down payment, and market conditions. Shopping multiple lenders can save thousands over the life of your loan." },
        { question: 'What is PMI?', answer: "Private Mortgage Insurance (PMI) protects the lender if you default on your loan. It's required when your down payment is less than 20% of the home's purchase price. PMI typically costs 0.5% to 1% of the loan amount annually and can be removed once you reach 20% equity." },
        { question: 'How does a 15 vs 30-year loan compare?', answer: "A 15-year mortgage has higher monthly payments but significantly less total interest paid. For example, on a $280,000 loan at 6.5%, a 15-year term saves over $150,000 in interest compared to 30 years, but monthly payments are roughly 40% higher." },
        { question: 'What does escrow mean?', answer: "Escrow is an account held by your lender to pay property taxes and homeowner's insurance on your behalf. Your lender collects 1/12 of these annual costs each month as part of your mortgage payment, then pays the bills when they're due." },
      ]}
      results={
        <>
          <ResultCard label="Monthly Principal & Interest" value={formatCurrency(results.pi)} />
          <ResultCard label="Monthly Property Tax" value={formatCurrency(results.monthlyTax)} />
          <ResultCard label="Monthly Insurance" value={formatCurrency(results.monthlyIns)} />
          {results.downPercent < 20 && <ResultCard label="Monthly PMI" value={formatCurrency(results.monthlyPmi)} />}
          <ResultCard label="Total Monthly Payment" value={formatCurrency(results.totalMonthly)} highlight />
          <ResultCard label="Total Interest Paid" value={formatCurrency(results.totalInterest)} />
          <ResultCard label="Total Cost of Loan" value={formatCurrency(results.totalCost)} />
          <ResultCard label="Payoff Date" value={formatDate(results.payoffDate)} />
        </>
      }
    >
      <InputField label="Home Price" id="homePrice" value={homePrice.display} onChange={homePrice.onChange} onBlur={homePrice.onBlur} onFocus={homePrice.onFocus} placeholder="350,000" tooltip="The total purchase price of the home" />
      <InputField label="Down Payment" id="downPayment" value={downPayment.display} onChange={downPayment.onChange} onBlur={downPayment.onBlur} onFocus={downPayment.onFocus} placeholder="70,000" />
      <InputField label="Down Payment Type" id="downType" value={downType} onChange={(e) => setDownType(e.target.value)} options={[{ value: 'dollar', label: 'Dollar amount ($)' }, { value: 'percent', label: 'Percentage (%)' }]} />
      <InputField label="Loan Term" id="term" value={term.value} onChange={term.onChange} options={[{ value: '10', label: '10 years' }, { value: '15', label: '15 years' }, { value: '20', label: '20 years' }, { value: '30', label: '30 years' }]} />
      <InputField label="Interest Rate" id="rate" value={rate.value} onChange={rate.onChange} placeholder="6.5" suffix="%" />
      <InputField label="Property Tax (annual)" id="propertyTax" value={propertyTax.display} onChange={propertyTax.onChange} onBlur={propertyTax.onBlur} onFocus={propertyTax.onFocus} placeholder="4,200" />
      <InputField label="Homeowner's Insurance (annual)" id="insurance" value={insurance.display} onChange={insurance.onChange} onBlur={insurance.onBlur} onFocus={insurance.onFocus} placeholder="1,200" />
      {results.downPercent < 20 && (
        <InputField label="PMI Rate" id="pmiRate" value={pmiRate.value} onChange={pmiRate.onChange} placeholder="0.5" suffix="%" tooltip="Annual PMI rate as a percentage of loan amount" />
      )}
    </CalculatorPage>
  );
}