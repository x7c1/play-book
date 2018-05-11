import { watch } from "chokidar";
import { BookLoader } from "./BookLoader";
import { SummaryGenerator } from "./summary/SummaryGenerator";
import { confirm, DirectoryPath } from "../file-paths/DirectoryPath";

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
    await new SummaryGenerator(loader).generateTo(dst);
    return new Observer(loader).serve({ src, dst });
  };
