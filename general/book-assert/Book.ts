export interface Readme {
  title: string;
  path: string;
}

export class Book {
  serve(srcDir: string, dstDir: string): Promise<void> {
    return serve(srcDir, dstDir);
  }

  get readme(): Readme {
    return {
      title: "readme title",
      path: this.readmePath,
    };
  }

}
