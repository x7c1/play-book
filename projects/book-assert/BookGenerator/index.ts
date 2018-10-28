
interface ContentsLocation {
  relativePath: string
}

interface BookStructure {
  start?: ContentsLocation
  chapters: ContentsLocation[]
  findChapterByNumber (num: number): ContentsLocation | undefined
}

export class BookGenerator {
  constructor (
    readonly startPath?: string,
    readonly chapterPaths: string[] = []) {
  }

  chapters (paths: string[]): BookGenerator {
    return new BookGenerator(
      this.startPath,
      this.chapterPaths.concat(paths),
    )
  }

  run (): BookStructure {
    const chapters = this.chapterPaths.map((path, index) => ({
      relativePath: path,
    }))
    return {
      chapters,
      start: this.startPath ?
        { relativePath: this.startPath } :
        undefined,
      findChapterByNumber (num: number) {
        return chapters[num - 1]
      },
    }
  }
}

export const start = (path: string): BookGenerator => {
  return new BookGenerator(path)
}
