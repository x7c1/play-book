import { watch } from "chokidar";

export const serve: (srcDir: string, dstDir: string) => Promise<void> = (
  srcDir: string,
  dstDir: string,
) =>
  new Promise((resolve, reject) => {
    const watcher = watch(srcDir + "/**/*.md");
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
