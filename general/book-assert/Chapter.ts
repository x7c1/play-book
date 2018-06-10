import * as path from "path";
import { Section } from "./Section";
import { concat } from "./Assertion";

export class SectionBinder {
  constructor(
    private sectionTitle: string,
    private bind: (section: Section) => void,
  ) {}

  setup(procedure: (register: Section) => void): void {
    const section = new Section(this.sectionTitle);
    this.bind(section);
    procedure(section);
  }
}

const here = (dirname: string) => {
  const matches = dirname.match(/([^/]+\/[^/]+)$/);
  if (matches === null) {
    throw new Error(`invalid file location: ${dirname}`);
  }
  return (name: string) => path.resolve(matches[0], name);
};

export class Chapter {
  constructor(
    private sections: Section[] = [],
    public readonly nextPages: string[] = [],
  ) {}

  static fromHere(dirname: string) {
    return {
      chapter: new Chapter(),
      here: here(dirname),
    };
  }

  section(sectionTitle: string): SectionBinder {
    return new SectionBinder(sectionTitle, traverser =>
      this.sections.push(traverser),
    );
  }

  nextPage(pageFile: string) {
    this.nextPages.push(pageFile);
  }

  assertSections(): Promise<void> {
    const assertions = this.sections.map(_ => _.extractAssertion());
    const assertion = concat(assertions);
    return assertion();
  }

  assertSection(sectionTitle: string): Promise<void> {
    const section = this.sections.find(_ => _.sectionTitle === sectionTitle);
    const assertion = section
      ? section.extractAssertion()
      : () => Promise.reject(`unknown section: ${sectionTitle}`);

    return assertion();
  }
}
