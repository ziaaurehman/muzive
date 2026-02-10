import { useMemo } from 'react';

export const useValidationRules = () => {

  return useMemo(
    () => [
      {
        id: 'upper',
        rule: 'Password must have a capital letter',
        validate: (v: string) => /[A-Z]/.test(v),
      },
      {
        id: 'lower',
        rule: 'Password must have a lowercase letter',
        validate: (v: string) => /[a-z]/.test(v),
      },
      {
        id: 'number',
        rule: 'Password must have a number',
        validate: (v: string) => /\d/.test(v),
      },
      {
        id: 'length',
        rule: 'Password must be at least 8 characters long',
        validate: (v: string) => v.length >= 8,
      },
    ],
    [],
  );
};
