import * as path from "path";

export type Constructor<T = {}> = new (...args: any[]) => T;

export interface HasAbsolutePath {
  toAbsolute: string;
}

export function PathResolver<T extends Constructor<HasAbsolutePath>>(
  target: T,
) {
  return class extends target {
    resolve(...segments: string[]): string {
      return path.resolve(this.toAbsolute, ...segments);
    }
  };
}
