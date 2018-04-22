import { Section } from "./Section";
import { concat } from "./Assertion";

export class SectionBinder {
  constructor(
    private sectionLabel: string,
    private bind: (section: Section) => void,
  ) {}

  setup(procedure: (register: Section) => void): void {
    const section = new Section(this.sectionLabel);
    this.bind(section);
    procedure(section);
  }
}

export class Chapter {
  constructor(private sections: Section[] = []) {}

  section(sectionLabel: string): SectionBinder {
    return new SectionBinder(sectionLabel, traverser =>
      this.sections.push(traverser),
    );
  }

  assertSections(): Promise<void> {
    const assertions = this.sections.map(_ => _.extractAssertion());
    const assertion = concat(assertions);
    return assertion();
  }

  assertSection(sectionLabel: string): Promise<void> {
    const section = this.sections.find(_ => _.sectionLabel === sectionLabel);
    const assertion = section
      ? section.extractAssertion()
      : () => Promise.reject(`unknown section: ${sectionLabel}`);

    return assertion();
  }
}
