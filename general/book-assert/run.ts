import { exec, spawn } from "child_process";
import { promisify } from "util";

type ProcessData = Buffer | string;

type Listener<A> = (a: A) => void;

const onProcessData = (listener: Listener<string>) => (data: ProcessData) => {
  const line = data.toString().trim();
  if (line.length > 0) {
    listener(line);
  }
};

const toRunner = (line: string) => ({
  cd: (dir: string) =>
    new Promise<void>((resolve, reject) => {
      try {
        console.log(`[run] ${line}`);
        process.chdir(dir);
        resolve();
      } catch (e) {
        reject(e);
      }
    }),

  exec: () =>
    Promise.resolve(0)
      .then(_ => {
        console.log(`[run] ${line}`);
      })
      .then(_ => promisify(exec)(line))
      .then(({ stdout, stderr }) => {
        if (typeof stderr === "string" && stderr.trim().length > 0) {
          return Promise.reject(stderr);
        } else {
          console.log(stdout);
          return Promise.resolve();
        }
      }),

  stream: (command: string, args: string[]) =>
    new Promise<void>((resolve, reject) => {
      console.log(`[start] ${line}`);
      const proc = spawn(command, args);
      proc.stderr.on("data", onProcessData(_ => console.error(_)));
      proc.stdout.on("data", onProcessData(_ => console.log(_)));
      proc.on("close", code => {
        if (code === 0) {
          console.log(`[done] ${line}`);
          resolve();
        } else {
          console.error(`[failed] status(${code}): ${line}`);
          reject();
        }
      });
    }),
});

const run: (line: string) => Promise<void> = line => {
  const [command, ...args] = line.split(" ");
  const runner = toRunner(line);
  switch (command) {
    case "cd":
      return runner.cd(args[0]);
    case "sbt":
      return runner.stream(command, args);
    default:
      return runner.exec();
  }
};

export { run };
