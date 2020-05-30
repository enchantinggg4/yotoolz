const fs = window.require("fs");
const Path = window.require("path");

export default (path: string) => {
  return fs.readFileSync(path, "utf-8");
};
