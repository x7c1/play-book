import { serve } from "./serve";

export class Book {
  serve(srcDir: string, dstDir: string): Promise<void> {
    return serve(srcDir, dstDir);
  }
}
