export interface ReadmeHeading {
  title: string;
  path: string;
}

export interface ChapterHeading {
  title: string;
  path: string;
}

export interface Summary {
  readme: ReadmeHeading;
  chapters: ChapterHeading[];
}
