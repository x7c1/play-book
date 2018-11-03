
interface BookDivision {
  relativePath: string
}

interface BookStructure {
  findDivision (relativePath: string): BookDivision | undefined
  countDivisions (): number
  intro?: BookDivision
}

export class BookGenerator {
  constructor (
    readonly introPath?: string,
    readonly chapterPaths: string[] = []) {
  }

  chapters (paths: string[]): BookGenerator {
    return new BookGenerator(
      this.introPath,
      this.chapterPaths.concat(paths),
    )
  }

  run (): BookStructure {
    const intro = this.introPath ?
      [{ relativePath: this.introPath }] :
      []

    const chapters = this.chapterPaths.map(path => ({
      relativePath: path,
    }))
    const divisions = intro.concat(chapters)
    return {
      findDivision (relativePath: string) {
        return divisions.find(_ => _.relativePath === relativePath)
      },
      countDivisions () {
        return divisions.length
      },
      intro: intro[0],
    }
  }
}

export const start = (path: string): BookGenerator => {
  return new BookGenerator(path)
}
