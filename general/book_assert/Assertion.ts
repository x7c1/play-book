export type Assertion = () => Promise<void>;

const nop: Assertion = () => Promise.resolve();

const append = (a1: Assertion, a2: Assertion) => () => a1().then(a2);

export function concat(assertions: Assertion[]): Assertion {
  return assertions.reduce(append, nop);
}
