import { watch } from "chokidar";
import { Book } from "./Book";
import { SummaryGenerator } from "./summary/SummaryGenerator";
import { confirm, DirectoryPath } from "./DirectoryPath";

class Observer {
  constructor(private book: Book) {}
  serve(args: { src: DirectoryPath; dst: DirectoryPath }): Promise<void> {
    return new Promise((resolve, reject) => {
      const watcher = watch(args.src.toAbsolute + "/**/*.md");
      watcher
        .on("add", path => {
          console.log(path, "added");
        })
        .on("change", path => {
          console.log(path, "changed");
        })
        .on("unlink", path => {
          console.log(path, "unlinked");
        })
        .on("error", error => {
          watcher.close();
          reject(error);
        });
    });
  }
}

export const serve = (book: Book) =>
  async function(args: { src: string; dst: string }): Promise<void> {
    const src = await confirm(args.src);
    const dst = await confirm(args.dst);
    await SummaryGenerator.fromBook(book).generateTo(dst);
    return new Observer(book).serve({ src, dst });
  };
