export interface Readme {
  title: string;
  path: string;
}

export class BookIndex {
  constructor(private readmePath: string) {}

  get readme(): Readme {
    return {
      title: "readme title",
      path: this.readmePath,
    };
  }
}
