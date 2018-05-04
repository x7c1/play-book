import { Chapter } from "./Chapter";
import { createCommand } from "./command";
import * as path from "path";

type Settings = {
  argv: string[];
  outDir: string;
  docsDir: string;
  loader: (id: string) => Chapter;
};

const run = ({ argv, outDir, docsDir, loader }: Settings) => {
  const command = createCommand(argv);
  const chapter = () => {
    return loader(path.resolve(outDir, docsDir, command.chapter));
  };
  if (command.chapter && command.section && command.single) {
    return chapter().assertSection(command.section);
  }
  if (command.chapter && command.single) {
    return chapter().assertSections();
  }
  throw new Error("not implemented");
};

export const main = (settings: Settings) => {
  run(settings).catch(err => {
    console.error("[unexpected]", err);
    if (err.stdout) {
      console.error("[stdout]", err.stdout);
    }
    if (err.stderr) {
      console.error("[stderr]", err.stderr);
    }
    process.exit(1);
  });
};
