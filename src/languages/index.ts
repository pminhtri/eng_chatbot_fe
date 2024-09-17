import supportedLanguages from "./languages.json";

export const SUPPORTED_LANGUAGE_CODES = supportedLanguages.map(
  ({ code }) => code,
);

export { supportedLanguages };
