import { watch } from "chokidar";
import { BookLoader } from "./BookLoader";
import { SummaryWriter } from "./summary/SummaryWriter";
import { confirm, DirectoryPath } from "../file-paths/DirectoryPath";
import { ChapterWriter } from "./BookChapter/ChapterWriter";

class Observer {
  constructor(private loader: BookLoader) {}
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

export const serve = (loader: BookLoader) =>
  async function(args: { src: string; dst: string }): Promise<void> {
    const src = await confirm.fromCurrent(args.src);
    const dst = await confirm.fromCurrent(args.dst);
    await new SummaryWriter(loader).generateTo(dst);
    await new ChapterWriter(loader).generateTo(dst);
    return new Observer(loader).serve({ src, dst });
  };
