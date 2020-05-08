import ts, { ScriptTarget } from "typescript";
import test from "./test";
import { cloneNode } from "@wessberg/ts-clone-node";
export default (v: string): [string, string] => {
  const [a, b]: any = test(v);
  return [a, b];
};
