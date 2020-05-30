import { action, computed, observable } from "mobx";
import processFile, { IRawString } from "./processFile";
import extractMessages from "./extractMessages";
import pretify from "../../../../tools/pretify";

const fs = window.require("fs");
const Path = window.require("path");


export default class I18nStore {
  @observable
  public files: string[] = [];


  @observable
  public projectName: string = "test-project"

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
      const fileName = Path.basename(path).split(".")[0];
      const i18nname = `${fileName}.i18n.ts`;
      const i18nnameImport = `./${fileName}.i18n`;

      const [, generatedJsx, generatedI18nFile] = processFile(this.projectName, i18nnameImport, cached, ignores);


      fs.writeFileSync(Path.resolve(Path.dirname(path), i18nname), pretify(generatedI18nFile));
      fs.writeFileSync(path, pretify(generatedJsx));
      this.files.shift();
    } catch (e) {
      console.log(e, "Somethin happened");
      // any compile errors
    }
  }
}
