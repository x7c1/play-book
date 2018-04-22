import { Section } from "./Section";
import { concat } from "./Assertion";

export class SectionBinder {
  constructor(
    private sectionLabel: string,
    private bind: (section: Section) => void,
  ) {}

  setup(procedure: (register: Section) => void): void {
    console.log("running:", this.sectionLabel);
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
}
