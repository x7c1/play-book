
interface ContentsLocation {
  relativePath: string
}

interface BookStructure {
  start?: ContentsLocation
  chapter (num: number): ContentsLocation
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
    const f = (n: number) => this.chapterPaths[n - 1]
    return {
      start: this.startPath ?
        { relativePath: this.startPath } :
        undefined,
      chapter (num: number) {
        return {
          relativePath: f(num),
        }
      },
    }
  }
}

export const start = (path: string): BookGenerator => {
  return new BookGenerator(path)
}
