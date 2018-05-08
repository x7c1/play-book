export interface Readme {
  title: string;
  path: string;
}

export class Book {
  constructor(private readmePath: string) {}

  get readme(): Readme {
    return {
      title: "readme title",
      path: this.readmePath,
    };
  }
}
