import { useEffect, useState } from "react";

export const useAsyncEffect = <T = void>(
  func: () => Promise<T>,
  dependencies?: unknown[],
  cleanup?: () => void,
): { executing: boolean; result?: T; error?: Error } => {
  const [executing, setDoing] = useState(true);
  const [result, setResult] = useState<T>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    setDoing(true);
    setResult(undefined);
    setError(undefined);

    (async () => {
      try {
        setResult(await func());
        setDoing(false);
      } catch (err) {
        setError(err as Error);
        setDoing(false);
      }
    })();

    return cleanup || (() => {});
  }, dependencies || []);

  return { executing, result, error };
};
