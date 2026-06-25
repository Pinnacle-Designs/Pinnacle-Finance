import { useMemo, useState } from 'react';
import CalculatorPage from '../components/CalculatorPage';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import { useCurrencyInput, useNumberInput } from '../hooks/useInput';
import { formatCurrency } from '../utils/format';

const SECURITY_MULTIPLIERS = {
  'very-stable': { months3: 3, months6: 6, months9: 6 },
  stable: { months3: 3, months6: 6, months9: 9 },
  unstable: { months3: 4, months6: 6, months9: 9 },
  'self-employed': { months3: 4, months6: 6, months9: 9 },
};

export default function EmergencyFundCalculator() {
  const housing = useCurrencyInput('1,500');
  const food = useCurrencyInput('600');
  const transport = useCurrencyInput('400');
  const utilities = useCurrencyInput('200');
  const insurance = useCurrencyInput('300');
  const other = useCurrencyInput('200');
  const [security, setSecurity] = useState('stable');
  const dependents = useNumberInput('0');
  const currentSavings = useCurrencyInput('5,000');

  const results = useMemo(() => {
    const monthly = housing.numeric + food.numeric + transport.numeric + utilities.numeric + insurance.numeric + other.numeric;
    const dependentBonus = dependents.numeric * 500;
    const adjustedMonthly = monthly + dependentBonus;
    const mult = SECURITY_MULTIPLIERS[security];
    const target3 = adjustedMonthly * mult.months3;
    const target6 = adjustedMonthly * mult.months6;
    const target9 = adjustedMonthly * mult.months9;
    const recommended = security === 'unstable' || security === 'self-employed' ? target9 : target6;
    const gap = Math.max(0, recommended - currentSavings.numeric);

    return { monthly: adjustedMonthly, target3, target6, target9, recommended, gap };
  }, [housing.numeric, food.numeric, transport.numeric, utilities.numeric, insurance.numeric, other.numeric, security, dependents.numeric, currentSavings.numeric]);

  return (
    <CalculatorPage
      title="Emergency Fund Calculator"
      description="Calculate your ideal emergency fund size based on your monthly expenses and job security."
      intro="An emergency fund is your financial safety net for unexpected expenses like job loss, medical bills, or major repairs. Enter your essential monthly expenses to calculate how much you should have saved."
      howItWorks="We total your essential monthly expenses and multiply by the recommended number of months based on your job security and dependents. Most experts recommend 3-6 months of expenses, with 9 months for self-employed or unstable income."
      currentPath="/emergency-fund-calculator"
      faq={[
        { question: 'How many months of expenses for an emergency fund?', answer: 'Most experts recommend 3-6 months of essential expenses. If you have unstable income or are self-employed, aim for 6-9 months. Dual-income households with stable jobs may need only 3 months.' },
        { question: 'Where should I keep my emergency fund?', answer: 'Keep it in a high-yield savings account (HYSA) earning 4-5% APY. It should be easily accessible but separate from your checking account to avoid accidental spending. Do not invest emergency funds in stocks.' },
        { question: 'What counts as an emergency?', answer: 'True emergencies include job loss, medical emergencies, urgent home or car repairs, and unexpected travel for family crises. Planned expenses like vacations, holiday gifts, or routine car maintenance are not emergencies.' },
        { question: 'Should I pay off debt or build an emergency fund first?', answer: 'Build a starter emergency fund of $1,000-$2,000 first, then focus on high-interest debt, then grow your fund to 3-6 months. This prevents new debt when unexpected expenses arise.' },
      ]}
      results={
        <>
          <ResultCard label="Monthly Essential Expenses" value={formatCurrency(results.monthly)} />
          <ResultCard label="3-Month Emergency Fund" value={formatCurrency(results.target3)} />
          <ResultCard label="6-Month Emergency Fund (Recommended)" value={formatCurrency(results.target6)} highlight />
          <ResultCard label="9-Month Emergency Fund" value={formatCurrency(results.target9)} />
          {results.gap > 0 && (
            <ResultCard label="Amount Needed to Reach Goal" value={formatCurrency(results.gap)} variant="warning" />
          )}
        </>
      }
    >
      <InputField label="Monthly Housing" id="housing" value={housing.display} onChange={housing.onChange} onBlur={housing.onBlur} onFocus={housing.onFocus} placeholder="1,500" />
      <InputField label="Monthly Food" id="food" value={food.display} onChange={food.onChange} onBlur={food.onBlur} onFocus={food.onFocus} placeholder="600" />
      <InputField label="Monthly Transportation" id="transport" value={transport.display} onChange={transport.onChange} onBlur={transport.onBlur} onFocus={transport.onFocus} placeholder="400" />
      <InputField label="Monthly Utilities" id="utilities" value={utilities.display} onChange={utilities.onChange} onBlur={utilities.onBlur} onFocus={utilities.onFocus} placeholder="200" />
      <InputField label="Monthly Insurance" id="insurance" value={insurance.display} onChange={insurance.onChange} onBlur={insurance.onBlur} onFocus={insurance.onFocus} placeholder="300" />
      <InputField label="Other Monthly Essentials" id="other" value={other.display} onChange={other.onChange} onBlur={other.onBlur} onFocus={other.onFocus} placeholder="200" />
      <InputField label="Job Security" id="security" value={security} onChange={(e) => setSecurity(e.target.value)} options={[{ value: 'very-stable', label: 'Very Stable' }, { value: 'stable', label: 'Stable' }, { value: 'unstable', label: 'Unstable' }, { value: 'self-employed', label: 'Self-Employed' }]} />
      <InputField label="Dependents" id="dependents" value={dependents.value} onChange={dependents.onChange} placeholder="0" />
      <InputField label="Current Emergency Savings" id="currentSavings" value={currentSavings.display} onChange={currentSavings.onChange} onBlur={currentSavings.onBlur} onFocus={currentSavings.onFocus} placeholder="5,000" tooltip="Optional — see how much more you need" />
    </CalculatorPage>
  );
}
