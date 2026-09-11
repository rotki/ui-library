class AssertionError extends Error {
  constructor(msg?: string, options?: ErrorOptions) {
    super(msg ?? 'AssertionError', options);
    this.name = 'AssertionError';
  }
}

export function assert(condition: unknown, msg?: string): asserts condition {
  if (!condition)
    throw new AssertionError(msg);
}
