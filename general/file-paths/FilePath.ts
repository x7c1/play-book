import { Confirm } from "./Confirm";
import { HasAbsolutePath, PathResolver } from "./HasAbsolutePath";
import { PathBase } from "./PathBase";

export interface FilePath extends HasAbsolutePath {
  toRelative: string;
  resolve(...segments: string[]): string;
}

class FilePathImpl extends PathResolver(PathBase) implements FilePath {}

export const confirm: Confirm<FilePath> = Confirm(FilePathImpl);
