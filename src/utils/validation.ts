import { VALID_EMAIL_REGEX } from "../constants";
import { InputRules, OutputRules } from "../types/rule";

export const formatRules = (rules?: Partial<InputRules>): OutputRules => {
  if (!rules || !Object.keys(rules).length) {
    return {};
  }

  return Object.entries(rules).reduce((next, [key, validation]) => {
    if (typeof validation === "object" && !(validation instanceof RegExp)) {
      return { ...next, [key]: validation };
    }

    switch (key) {
      case "email": {
        return {
          ...next,
          pattern: {
            value: VALID_EMAIL_REGEX,
            message: "error.invalidEmail",
          },
        };
      }

      case "required": {
        return {
          ...next,
          [key]: { value: validation, message: "validation.required" },
        };
      }

      case "maxLength": {
        return {
          ...next,
          [key]: { value: validation, message: "validation.maxLength" },
        };
      }

      case "minLength": {
        return {
          ...next,
          [key]: { value: validation, message: "validation.minLength" },
        };
      }

      case "min": {
        return {
          ...next,
          [key]: { value: validation, message: "validation.minValueExceeded" },
        };
      }

      case "max": {
        return {
          ...next,
          [key]: { value: validation, message: "validation.maxValueExceeded" },
        };
      }

      case "greaterThan": {
        return {
          ...next,
          min: {
            value: (validation as number) + Number.MIN_VALUE,
            message: "validation.greaterThan",
          },
        };
      }

      default:
        return { ...next, [key]: { value: validation } };
    }
  }, {});
};
