type InputRuleValue<T> = T | { value: T; message: string };

export type InputRules = {
  required?: InputRuleValue<boolean>;
  email?: InputRuleValue<boolean>;
  min?: InputRuleValue<number>;
  max?: InputRuleValue<number>;
  minLength?: InputRuleValue<number>;
  maxLength?: InputRuleValue<number>;
  pattern?: InputRuleValue<RegExp>;
  greaterThan?: InputRuleValue<number>;
  validate?: (value: string) => string | boolean;
};

export type OutputRules = {
  required?: { value: boolean; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: (value: string) => string | boolean;
};
