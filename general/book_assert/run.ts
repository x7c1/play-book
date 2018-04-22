import { spawn } from "child_process";

type ProcessData = Buffer | string;

type Listener<A> = (a: A) => void;

const onProcessData = (listener: Listener<string>) => (data: ProcessData) => {
  const line = data.toString().trim();
  if (line.length > 0) {
    listener(line);
  }
};

const run: (line: string) => Promise<void> = (line: string) =>
  new Promise((resolve, reject) => {
    const [command, ...args] = line.split(" ");
    if (command === "cd") {
      try {
        console.log(`\n[run] ${line}`);
        process.chdir(args[0]);
        resolve();
      } catch (e) {
        reject(e);
      }
    } else {
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
    }
  });

export { run };
