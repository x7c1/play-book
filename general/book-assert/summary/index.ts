export interface ReadmeHeading {
  title: string;
  path: string;
}

export interface PageHeading {
  title: string;
  path: string;
}

export interface ChapterHeading {
  title: string;
  path: string;
  nextPages: PageHeading[];
}

export interface Summary {
  readme: ReadmeHeading;
  chapters: ChapterHeading[];
}
