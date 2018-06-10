import { Confirm } from "./Confirm";
import { HasAbsolutePath, PathResolver } from "./HasAbsolutePath";
import { PathBase } from "./PathBase";
import { confirm as confirmFile, FilePath } from "./FilePath";
import { basename, dirname, join } from "path";
import { HasRelativePath } from "./HasRelativePath";

export interface DirectoryPath extends HasAbsolutePath, HasRelativePath {
  withParent: WithParent;
  resolve(...segments: string[]): string;
}

export interface WithParent {
  confirmFile(path: string): Promise<FilePath>;
}

class DirectoryPathImpl extends PathResolver(PathBase)
  implements DirectoryPath {
  get withParent(): WithParent {
    return {
      confirmFile: (path: string) => {
        return confirmFile.fromRelative(
          dirname(this.toAbsolute),
          join(basename(this.toAbsolute), path),
        );
      },
    };
  }
}

export const confirm: Confirm<DirectoryPath> = Confirm(DirectoryPathImpl);
