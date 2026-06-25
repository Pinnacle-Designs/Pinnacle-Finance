import { useMemo } from 'react';
import CalculatorPage from '../components/CalculatorPage';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import { useCurrencyInput } from '../hooks/useInput';
import { formatPercent } from '../utils/format';

export default function DebtToIncomeCalculator() {
  const income = useCurrencyInput('6,000');
  const housing = useCurrencyInput('1,500');
  const car = useCurrencyInput('400');
  const student = useCurrencyInput('300');
  const creditCard = useCurrencyInput('150');
  const other = useCurrencyInput('100');

  const results = useMemo(() => {
    const gross = income.numeric;
    const housingDebt = housing.numeric;
    const totalDebt = housingDebt + car.numeric + student.numeric + creditCard.numeric + other.numeric;
    const frontEnd = gross > 0 ? (housingDebt / gross) * 100 : 0;
    const backEnd = gross > 0 ? (totalDebt / gross) * 100 : 0;

    let variant = 'success';
    let interpretation = 'Excellent — lenders typically prefer under 43% back-end DTI.';
    if (backEnd >= 50) {
      variant = 'danger';
      interpretation = 'High — most lenders will have difficulty approving new loans. Focus on paying down debt.';
    } else if (backEnd >= 36) {
      variant = 'warning';
      interpretation = 'Moderate — you may qualify but with limited options. Lenders typically prefer under 43%.';
    }

    return { frontEnd, backEnd, variant, interpretation };
  }, [income.numeric, housing.numeric, car.numeric, student.numeric, creditCard.numeric, other.numeric]);

  return (
    <CalculatorPage
      title="Debt-to-Income Ratio Calculator"
      description="Calculate your DTI ratio to see if you qualify for a mortgage or loan. Free front-end and back-end DTI calculator."
      intro="Your debt-to-income (DTI) ratio is one of the most important numbers lenders use to evaluate your loan application. Calculate both your front-end (housing only) and back-end (all debt) DTI ratios instantly."
      howItWorks="Front-end DTI divides your monthly housing payment by gross monthly income. Back-end DTI includes all monthly debt obligations. Most mortgage lenders prefer a front-end DTI under 28% and a back-end DTI under 43%."
      currentPath="/debt-to-income-calculator"
      faq={[
        { question: 'What DTI do lenders want?', answer: 'Most mortgage lenders prefer a back-end DTI of 43% or lower, though some FHA loans allow up to 50%. Front-end DTI (housing only) should ideally be under 28%. Lower DTI ratios qualify you for better rates and terms.' },
        { question: 'Front-end vs back-end DTI?', answer: 'Front-end DTI only includes housing costs (mortgage/rent, taxes, insurance). Back-end DTI includes all monthly debt: housing, car loans, student loans, credit cards, and other obligations. Lenders focus primarily on back-end DTI.' },
        { question: 'How to lower DTI fast?', answer: 'Pay down high-balance debts, avoid taking on new debt, increase your income with a side job or raise, or consolidate debts to lower monthly payments. Even paying off one credit card can significantly improve your ratio.' },
        { question: 'Does DTI include utilities or groceries?', answer: 'No, DTI only includes debt obligations — payments you are required to make on borrowed money. Living expenses like utilities, groceries, and entertainment are not included in DTI calculations.' },
      ]}
      results={
        <>
          <ResultCard label="Front-End DTI (housing)" value={formatPercent(results.frontEnd, 1)} variant={results.frontEnd > 28 ? 'warning' : 'success'} />
          <ResultCard label="Back-End DTI (all debt)" value={formatPercent(results.backEnd, 1)} variant={results.variant} highlight />
          <div className="col-span-full bg-slate-50 rounded-lg p-4 text-slate-700">
            <p className="font-medium">{results.interpretation}</p>
          </div>
        </>
      }
    >
      <InputField label="Gross Monthly Income" id="income" value={income.display} onChange={income.onChange} onBlur={income.onBlur} onFocus={income.onFocus} placeholder="6,000" />
      <InputField label="Monthly Rent/Mortgage" id="housing" value={housing.display} onChange={housing.onChange} onBlur={housing.onBlur} onFocus={housing.onFocus} placeholder="1,500" />
      <InputField label="Car Payment" id="car" value={car.display} onChange={car.onChange} onBlur={car.onBlur} onFocus={car.onFocus} placeholder="400" />
      <InputField label="Student Loan" id="student" value={student.display} onChange={student.onChange} onBlur={student.onBlur} onFocus={student.onFocus} placeholder="300" />
      <InputField label="Credit Card Minimums" id="creditCard" value={creditCard.display} onChange={creditCard.onChange} onBlur={creditCard.onBlur} onFocus={creditCard.onFocus} placeholder="150" />
      <InputField label="Other Monthly Debt" id="other" value={other.display} onChange={other.onChange} onBlur={other.onBlur} onFocus={other.onFocus} placeholder="100" />
    </CalculatorPage>
  );
}
