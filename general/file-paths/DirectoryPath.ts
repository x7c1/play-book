import { Confirm } from "./Confirm";
import { HasAbsolutePath, PathResolver } from "./HasAbsolutePath";
import { PathBase } from "./PathBase";

export interface DirectoryPath extends HasAbsolutePath {
  toRelative: string;
  resolve(...segments: string[]): string;
}

class DirectoryPathImpl extends PathResolver(PathBase)
  implements DirectoryPath {}

export const confirm: Confirm<DirectoryPath> = Confirm(DirectoryPathImpl);
