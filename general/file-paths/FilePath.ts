import * as path from "path";
import { Confirm } from "./Confirm";

export interface FilePath {
  toAbsolute: string;
  toRelative: string;
  resolve(...segments: string[]): string;
}

class FilePathImpl implements FilePath {
  constructor(readonly toAbsolute: string, readonly toRelative: string) {}

  resolve(...segments: string[]): string {
    return path.resolve(this.toAbsolute, ...segments);
  }
}

export const confirm: Confirm<FilePath> = Confirm(FilePathImpl);
