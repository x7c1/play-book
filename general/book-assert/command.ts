import { Command } from "commander";

export const createCommand: (argv: string[]) => Command = argv =>
  new Command()
    .version("0.0.1")
    .option("--serve", "Build then serve the gitbook files")
    .option("--chapter <number>", "Chapter to assert")
    .option("--section <title>", "Section to assert")
    .option("--single", "Assert only given chapter (or its section)")
    .parse(argv);
