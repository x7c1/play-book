import * as path from "path";
import { FilePath } from "./FilePath";
import { Confirm } from "./Confirm";

export interface DirectoryPath extends FilePath {}

class DirectoryPathImpl implements DirectoryPath {
  constructor(readonly toAbsolute: string, readonly toRelative: string) {}

  resolve(...segments: string[]): string {
    return path.resolve(this.toAbsolute, ...segments);
  }
}

export const confirm: Confirm<DirectoryPath> = Confirm(DirectoryPathImpl);
