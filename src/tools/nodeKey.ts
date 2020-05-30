import * as ts from "typescript";

export default (node: ts.Node, text: string = node.getFullText()) => {
  return `${text}${node.pos}`;
};
