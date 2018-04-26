import { Command } from "commander";

export const createCommand: (argv: string[]) => Command = argv =>
  new Command()
    .version("0.0.1")
    .option("--chapter <number>", "chapter to assert", n => {
      const i = parseInt(n, 10);
      return isNaN(i) ? "" : i.toString().padStart(3, "0");
    })
    .option("--section <title>", "section to assert")
    .option("--single", "assert only given chapter (or its section)")
    .parse(argv);
