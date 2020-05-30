import { useEffect } from "react";

interface Props {
  code: string;
  cmd?: boolean;
  onKey: () => void;
}
export default (p: Props) => {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === p.code) {
        if (p.cmd !== undefined && e.metaKey) {
          p.onKey();
        }
      }
    };
    window.addEventListener("keydown", listener);

    return () => window.removeEventListener("keydown", listener);
  }, []);
  return null;
};
