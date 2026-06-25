import { useState, useCallback } from 'react';
import { parseNumber, formatCurrencyInput } from '../utils/format';

export function useCurrencyInput(initial = '') {
  const [value, setValue] = useState(initial);
  const [display, setDisplay] = useState(initial);

  const onChange = useCallback((e) => {
    setDisplay(e.target.value);
    setValue(e.target.value);
  }, []);

  const onBlur = useCallback(() => {
    const num = parseNumber(display);
    setValue(String(num));
    setDisplay(formatCurrencyInput(num));
  }, [display]);

  const onFocus = useCallback(() => {
    setDisplay(String(parseNumber(display)));
  }, [display]);

  const numeric = parseNumber(value);

  return { display, numeric, onChange, onBlur, onFocus, setValue, setDisplay };
}

export function useNumberInput(initial = '') {
  const [value, setValue] = useState(initial);
  const numeric = parseNumber(value);
  const onChange = useCallback((e) => setValue(e.target.value), []);
  return { value, numeric, onChange, setValue };
}
