export function formatCurrency(value, decimals = 0) {
  if (value == null || isNaN(value)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value, decimals = 2) {
  if (value == null || isNaN(value)) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
}

export function parseNumber(value) {
  if (typeof value === 'number') return value;
  if (!value || value === '') return 0;
  const cleaned = String(value).replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function formatCurrencyInput(value) {
  if (value === '' || value == null) return '';
  const num = parseNumber(value);
  if (num === 0 && value !== '0' && value !== 0) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

export function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function monthlyPayment(principal, annualRate, termMonths) {
  if (principal <= 0 || termMonths <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (principal * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
}

export function loanPayoffSchedule(balance, annualRate, monthlyPayment, extraPayment = 0) {
  const r = annualRate / 100 / 12;
  let remaining = balance;
  let totalInterest = 0;
  let months = 0;
  const maxMonths = 600;

  if (balance <= 0) {
    return { months: 0, totalInterest: 0, payoffDate: new Date(), paysOff: true };
  }

  while (remaining > 0.01 && months < maxMonths) {
    const interest = remaining * r;
    const principalPaid = monthlyPayment + extraPayment - interest;
    if (principalPaid <= 0) {
      return { months, totalInterest, payoffDate: null, paysOff: false };
    }
    totalInterest += interest;
    remaining -= principalPaid;
    months++;
  }

  return { months, totalInterest, payoffDate: addMonths(new Date(), months), paysOff: true };
}

export function compoundGrowth(principal, annualRate, years, frequency, monthlyContribution = 0) {
  const r = annualRate / 100;
  const periodsPerYear = { daily: 365, monthly: 12, quarterly: 4, annually: 1 }[frequency] || 12;
  const ratePerPeriod = r / periodsPerYear;
  let balance = principal;
  let totalContributions = principal;
  const chartData = [{ year: 0, balance: Math.round(balance) }];

  for (let year = 1; year <= years; year++) {
    for (let month = 0; month < 12; month++) {
      balance += monthlyContribution;
      totalContributions += monthlyContribution;

      if (frequency === 'daily') {
        const dailyRate = r / 365;
        for (let day = 0; day < 30; day++) {
          balance *= 1 + dailyRate;
        }
      } else if (frequency === 'monthly') {
        balance *= 1 + ratePerPeriod;
      } else if (frequency === 'quarterly') {
        if (month % 3 === 2) balance *= 1 + ratePerPeriod;
      } else if (month === 11) {
        balance *= 1 + ratePerPeriod;
      }
    }
    chartData.push({ year, balance: Math.round(balance) });
  }

  return {
    finalBalance: balance,
    totalContributions,
    totalInterest: balance - totalContributions,
    chartData,
  };
}
