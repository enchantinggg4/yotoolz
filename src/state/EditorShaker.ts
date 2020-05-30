import { observable, action } from "mobx";
import debounce from "../tools/debounce";

export default class EditorShaker {
  @observable
  public _shake: number = 0;

  @action.bound
  public shake = () => {
    this._shake++;
  };

  public debouncedShaker = debounce(this.shake, 100);
}
