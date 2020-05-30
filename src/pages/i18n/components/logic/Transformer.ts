import { IRawString } from "./processFile";
import * as ts from "typescript";
import { JsxText } from "typescript";
import { JsxAttribute } from "typescript";
import { StringLiteral } from "typescript";
import { JsxExpression } from "typescript";

export default class Transformer {
  private messages: IRawString[] = [];
  private keyIndex = 0;

  constructor(private ignores: string[]) {}

  public parse() {}

  private handleJsxText(node: JsxText) {
    if (Transformer.ignoreString(node.getText())) return node;
    const uniqueKey = `${node.getText().trim()}`;
    if (this.ignores.includes(uniqueKey)) return node;
    const key = this.translateKey();
    this.messages.push({
      start: node.getFullStart(),
      end: node.getEnd(),
      raw: node.getText(),
      formatted: node.getText().trim(),
      key,
    });
    const id = ts.createIdentifier("i18n");
    return ts.createJsxExpression(undefined, ts.createPropertyAccess(id, key));
  }

  private handleAttributeString(node: JsxAttribute) {
    const attrName = node.name.text;
    // its our case
    // name="hehe"
    const id = ts.createIdentifier("i18n");
    const literal = node.initializer as StringLiteral;
    const rawString = literal.text.trim();
    const uniqueKey = `${rawString}`;
    if (this.ignores.includes(uniqueKey)) return node;
    if (Transformer.ignoreString(rawString)) return node;

    const key = this.translateKey();

    this.messages.push({
      start: literal.getFullStart(),
      end: literal.getEnd(),
      raw: literal.text,
      formatted: rawString,
      key,
    });

    return ts.createJsxAttribute(
      ts.createIdentifier(attrName),
      ts.createJsxExpression(undefined, ts.createPropertyAccess(id, key))
    );
  }

  private handleAttributeExpressionString(node: JsxAttribute) {
    // its our case
    // name={"hehe"}
    const rawString = ((node.initializer as JsxExpression)
      .expression as StringLiteral).text.trim();

    const uniqueKey = `${rawString}`;
    const attr = node as JsxAttribute;
    const attrName = attr.name.text;
    const attrValue = attr.initializer;

    if (this.ignores.includes(uniqueKey)) return node;
    if (Transformer.ignoreString(rawString)) return node;

    const id = ts.createIdentifier("i18n");
    const key = this.translateKey();

    const literal = (node.initializer as JsxExpression)
      .expression as StringLiteral;
    this.messages.push({
      raw: literal.text,
      start: literal.getFullStart(),
      end: literal.getEnd(),
      formatted: rawString,
      key,
    });
    const access = ts.createPropertyAccess(id, key);
    return ts.createJsxAttribute(
      ts.createIdentifier(attrName),
      ts.createJsxExpression(undefined, access)
    );
  }

  private translateKey() {
    return `generated_i18n_${this.keyIndex++}`;
  }

  private static ignoreString = (str: string): boolean => {
    return str.trim().length === 0;
  };
}
