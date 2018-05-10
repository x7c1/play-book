export interface ReadmeHeading {
  title: string;
  path: string;
}

export interface SectionHeading {
  title: string;
  path: string;
}

export interface ChapterHeading {
  title: string;
  path: string;
  sections: SectionHeading[];
}

export interface Summary {
  readme: ReadmeHeading;
  chapters: ChapterHeading[];
}
