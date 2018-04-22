import { Assertion, concat } from "./Assertion";

export class Section {
  private _words: { [key: string]: string } = {};

  private _assertions: Assertion[] = [];

  constructor(readonly sectionLabel: string) {}

  assert(assert: Assertion): void {
    this._assertions.push(assert);
  }

  reveal(words: { [key: string]: string }): void {
    console.log("register words", words);
    this._words = { ...this._words, ...words };
  }

  extractAssertion(): Assertion {
    return concat(this._assertions);
  }

  extractWords(): { [key: string]: string } {
    return this._words;
  }
}
