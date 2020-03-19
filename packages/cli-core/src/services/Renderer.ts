import {Configuration, Injectable} from "@tsed/di";
import * as Consolidate from "consolidate";
import * as Fs from "fs-extra";
import {basename, dirname, join} from "path";
import {Observable} from "rxjs";

export interface IRenderOptions {
  templateDir?: string;
  rootDir?: string;
  output?: string;
}

export abstract class Renderer {
  templateDir: string;
  rootDir: string;

  async render(path: string, data: any, options: IRenderOptions = {}) {
    const {output, templateDir, rootDir} = this.mapOptions(path, options);
    const content = await Consolidate.handlebars(join(templateDir, path), data);

    const outputFile = join(...[rootDir, output].filter(Boolean));

    await Fs.ensureDir(dirname(outputFile));

    return Fs.writeFile(outputFile, content, {encoding: "utf8"});
  }

  async renderAll(paths: string[], data: any, options: IRenderOptions = {}) {
    let count = 0;

    return new Observable(observer => {
      observer.next(`[${count}/${paths.length}] Rendering files...`);

      const promises = paths.filter(Boolean).map(async path => {
        await this.render(path, data, options);

        count++;
        observer.next(`[${count}/${paths.length}] Rendering files...`);
      });

      Promise.all(promises).then(() => {
        observer.next(`[${count}/${paths.length}] Rendering files...`);
        observer.complete();
      });
    });
  }

  templateExists(path: string, options: IRenderOptions = {}) {
    const {templateDir} = this.mapOptions(path, options);

    return Fs.existsSync(join(templateDir, path));
  }

  protected mapOptions(path: string, options: IRenderOptions) {
    const {output = basename(path).replace(/\.hbs$/, ""), templateDir = this.templateDir, rootDir = this.rootDir} = options;

    return {output, templateDir, rootDir};
  }
}

@Injectable()
export class RootRendererService extends Renderer {
  @Configuration()
  private configuration: Configuration;

  get templateDir() {
    return this.configuration.templateDir;
  }

  set templateDir(path: string) {}

  get rootDir() {
    return this.configuration.project?.rootDir;
  }

  set rootDir(path: string) {
    console.trace("====");
  }
}

@Injectable()
export class SrcRendererService extends Renderer {
  @Configuration()
  private configuration: Configuration;

  get templateDir() {
    return this.configuration.templateDir;
  }

  set templateDir(path: string) {}

  get rootDir() {
    return join(...[this.configuration.project?.rootDir, this.configuration.project?.srcDir].filter(Boolean));
  }

  set rootDir(path: string) {}
}

@Injectable()
export class ScriptsRendererService extends Renderer {
  @Configuration()
  private configuration: Configuration;

  get templateDir() {
    return this.configuration.templateDir;
  }

  set templateDir(template: string) {}

  get rootDir() {
    return join(...[this.configuration.project?.rootDir, this.configuration.project?.scriptsDir].filter(Boolean));
  }

  set rootDir(template: string) {}
}