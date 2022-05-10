import {Injectable} from "@tsed/di";
import type {SyncOptions, Options} from "execa";
import execa from "execa";
import {filter, merge} from "rxjs/operators";
import "any-observable/register/rxjs-all";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import streamToObservable from "@samverschueren/stream-to-observable";

const split = require("split");

@Injectable()
export class CliExeca {
  readonly raw = execa;

  /**
   *
   * @param cmd
   * @param args
   * @param opts
   */
  run(cmd: string, args: string[], opts?: Options) {
    const cp = this.raw(cmd, args, opts);
    const stdout = streamToObservable(cp.stdout!.pipe(split()), {await: cp});
    const stderr = streamToObservable(cp.stderr!.pipe(split()), {await: cp});

    return stdout.pipe(merge(stderr)).pipe(filter(Boolean));
  }

  runSync(cmd: string, args: string[], opts?: SyncOptions) {
    return this.raw.sync(cmd, args, opts);
  }

  async getAsync(cmd: string, args: string[], opts?: SyncOptions) {
    return (await this.raw(cmd, args, opts)).stdout;
  }

  get(cmd: string, args: string[], opts?: SyncOptions) {
    return this.raw.sync(cmd, args, opts).stdout;
  }
}
