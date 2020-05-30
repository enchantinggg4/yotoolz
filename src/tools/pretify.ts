import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";

export default (s: string) => prettier.format(
  s,
  { parser: "babel", plugins: [parserBabel] }
)