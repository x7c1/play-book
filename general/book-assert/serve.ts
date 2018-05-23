import { watch } from "chokidar";
import { BookLoader } from "./BookLoader";
import { SummaryWriter } from "./summary/SummaryWriter";
import { confirm, DirectoryPath } from "../file-paths/DirectoryPath";
import { ChapterWriter } from "./BookChapter/ChapterWriter";

class Observer {
  constructor(private createLoader: () => Promise<BookLoader>) {}

  async serve(args: { src: DirectoryPath; dst: DirectoryPath }): Promise<void> {
    await this.reload(args);
    return new Promise<void>((resolve, reject) => {
      const watcher = watch(args.src.toAbsolute + "/**/*.md");
      const onError = (error: any) => {
        watcher.close();
        reject(error);
      };
      watcher
        .on("add", path => {
          console.log(path, "added");
        })
        .on("change", path => {
          console.log(path, "changed");
          this.reload(args).catch(onError);
        })
        .on("unlink", path => {
          console.log(path, "unlinked");
        })
        .on("error", onError);
    });
  }

  private async reload(args: { src: DirectoryPath; dst: DirectoryPath }) {
    const loader = await this.createLoader();
    await new SummaryWriter(loader).generateTo(args.dst);
    await new ChapterWriter(loader).generateTo(args.dst);
  }
}

export const serve = (createLoader: () => Promise<BookLoader>) =>
  async function(args: { src: string; dst: string }): Promise<void> {
    const src = await confirm.fromCurrent(args.src);
    const dst = await confirm.fromCurrent(args.dst);
    return new Observer(createLoader).serve({ src, dst });
  };
