import * as path from "path";
import * as fs from "fs";
import { promisify } from "util";

export interface PathConstructor<A> {
  new (absolute: string, relative: string): A;
}

const access = <A>(klass: PathConstructor<A>) => (
  absolute: string,
  relative: string,
) => promisify(fs.access)(absolute).then(() => new klass(absolute, relative));

export interface Confirm<A> {
  fromCurrent: (filePath: string) => Promise<A>;
  fromRelative: (base: string, filePath: string) => Promise<A>;
}

export const Confirm = <A>(klass: PathConstructor<A>) => ({
  fromCurrent: (filePath: string) => {
    const absolute = path.resolve(filePath);
    return access(klass)(absolute, filePath);
  },
  fromRelative: (base: string, filePath: string) => {
    const absolute = path.resolve(base, filePath);
    return access(klass)(absolute, filePath);
  },
});
