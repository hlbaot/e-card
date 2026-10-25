let pending: Promise<unknown> = Promise.resolve();

export function withAuthLock<T>(action: () => Promise<T>): Promise<T> {
  const run = async (): Promise<T> => {
    if (typeof navigator !== "undefined" && navigator.locks) {
      return await navigator.locks.request("ecard-auth-session", action);
    }
    return action();
  };
  const result = pending.then(run, run);
  pending = result.catch(() => {});
  return result;
}

