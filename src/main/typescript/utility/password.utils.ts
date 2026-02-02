type PasswordRule = {
  test: (password: string) => boolean;
  message: string;
};

const PASSWORD_RULES: PasswordRule[] = [
  {
    test: (password) => password.length >= 12,
    message: "Au moins 12 caracteres"
  },
  {
    test: (password) => /[a-z]/.test(password),
    message: "Au moins une minuscule"
  },
  {
    test: (password) => /[A-Z]/.test(password),
    message: "Au moins une majuscule"
  },
  {
    test: (password) => /\d/.test(password),
    message: "Au moins un chiffre"
  },
  {
    test: (password) => /[^A-Za-z0-9]/.test(password),
    message: "Au moins un caractere special"
  }
];

export function getPasswordStrength(password: string) {
  const unmetRules = PASSWORD_RULES.filter((rule) => !rule.test(password)).map(
    (rule) => rule.message
  );

  return {
    isStrong: unmetRules.length === 0,
    unmetRules
  };
}
