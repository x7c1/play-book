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

export function confirm(filePath: string): Promise<DirectoryPath> {
  const absolute = path.resolve(filePath);
  return promisify(fs.access)(absolute).then(
    () => new DirectoryPathImpl(absolute, filePath),
  );
}
