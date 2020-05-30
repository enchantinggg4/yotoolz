import { action, computed, observable } from "mobx";
import processFile, { IRawString } from "./processFile";
import extractMessages from "./extractMessages";
import pretify from "../../../../tools/pretify";

const fs = window.require("fs");
const Path = window.require("path");
interface IStore {
  ignores: {
    [key: string]: {
      str: IRawString;
      hovered: boolean;
      enabled: boolean;
    };
  };
  producedCode: string;
  producedI18n: string;
}

export default class I18nStore {
  @observable
  public files: string[] = [];

  @computed
  public get popFile(): string | undefined {
    return (this.files && this.files.length && this.files[0]) || undefined;
  }

  @action.bound
  public clear() {
    this.files = [];
  }

  @action.bound
  public loadFile(path: string) {
    if (fs.lstatSync(path).isDirectory()) {
      // if directory, recursively find
      const fls = fs.readdirSync(path);
      fls.forEach((filepath: string) => {
        this.loadFile(Path.join(path, filepath));
      });
    } else {
      // if file, add it to files array if its jsx
      const ext = Path.extname(path);
      if (ext === ".tsx") {
        this.files.push(Path.resolve(__dirname, path));
      }
    }
  }

  public extractMessages(code: string) {
    return extractMessages(code);
  }

  @action
  public generateFiles(path: string, cached: string, ignores: string[]) {
    try {
      const [, c, i] = processFile(cached, ignores);

      const fileName = Path.basename(path).split(".")[0];
      const i18nname = `${fileName}.i18n.ts`;

      fs.writeFileSync(Path.resolve(Path.dirname(path), i18nname), pretify(i));
      fs.writeFileSync(path, pretify(c));
      this.files.shift();
    } catch (e) {
      console.log(e, "Somethin happened");
      // any compile errors
    }
  }
}
