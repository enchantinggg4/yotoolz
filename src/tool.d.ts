import Require = NodeJS.Require;

interface NodeRequire extends NodeJS.Require {}

declare const window = {
  require: NodeRequire,
};
