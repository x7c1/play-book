import * as path from "path";
import * as fs from "fs";
import { promisify } from "util";

export interface DirectoryPath {
  toAbsolute: string;
  toRelative: string;
  resolve(...segments: string[]): string;
}

class DirectoryPathImpl implements DirectoryPath {
  constructor(readonly toAbsolute: string, readonly toRelative: string) {}

  resolve(...segments: string[]): string {
    return path.resolve(this.toAbsolute, ...segments);
  }
}

function access(absolute: string, relative: string): Promise<DirectoryPath> {
  return promisify(fs.access)(absolute).then(
    () => new DirectoryPathImpl(absolute, relative),
  );
}

export const confirm = (filePath: string) => {
  const absolute = path.resolve(filePath);
  return access(absolute, filePath);
};

export const confirmFrom = (base: string, filePath: string) => {
  const absolute = path.resolve(base, filePath);
  return access(absolute, filePath);
};
