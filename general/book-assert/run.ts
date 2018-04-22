import { spawn } from "child_process";

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
        console.log(`\n[run] ${line}`);
        process.chdir(dir);
        resolve();
      } catch (e) {
        reject(e);
      }
    }),

  stream: (command: string, args: string[]) =>
    new Promise<void>((resolve, reject) => {
      console.log(`\n[start] ${line}`);
      const proc = spawn(command, args);
      proc.stderr.on("data", onProcessData(_ => console.error(_)));
      proc.stdout.on("data", onProcessData(_ => console.log(_)));
      proc.on("close", code => {
        if (code === 0) {
          console.log(`\n[done] ${line}`);
          resolve();
        } else {
          console.error(`\n[failed] code(${code}): ${line}`);
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
    default:
      return runner.stream(command, args);
  }
};

export { run };
