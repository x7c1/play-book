import { Book } from "../Book";

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

export const createSummary = function(book: Book): Summary {
  return {
    readme: book.readme,
    chapters: [],
  };
};
