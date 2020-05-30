export interface LineNumberAndColumn {
  pos: number;
  number: number;
  length: number;
}

export class ArrayUtils {
  static from<T>(iterator: Iterator<T>) {
    const array: T[] = [];
    while (true) {
      const next = iterator.next();
      if (next.done)
        return array;
      array.push(next.value);
    }
  }

  static binarySearch<T>(items: ReadonlyArray<T>, compareTo: (value: T) => number) {
    let top = items.length - 1;
    let bottom = 0;

    while (bottom <= top) {
      const mid = Math.floor((top + bottom) / 2);
      const comparisonResult = compareTo(items[mid]);
      if (comparisonResult === 0)
        return mid;
      else if (comparisonResult < 0)
        top = mid - 1;
      else
        bottom = mid + 1;
    }

    return -1;
  }

  private constructor() {
  }
}

export function createLineNumberAndColumns(text: string) {
  const lineInfos: LineNumberAndColumn[] = [];
  let lastPos = 0;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\n")
      pushLineInfo(i);
  }

  pushLineInfo(text.length);

  return lineInfos;

  function pushLineInfo(pos: number) {
    lineInfos.push({
      pos: lastPos,
      length: pos - lastPos,
      number: lineInfos.length + 1
    });
    lastPos = pos + 1;
  }
}

export class LineAndColumnComputer {
  private lineInfos: LineNumberAndColumn[];

  constructor(public readonly text: string) {
    this.lineInfos = createLineNumberAndColumns(text);
  }

  getNumberAndColumnFromPos(pos: number) {
    if (pos < 0)
      return { lineNumber: 1, column: 1 };

    const index = ArrayUtils.binarySearch(this.lineInfos, info => {
      if (pos < info.pos)
        return -1;
      if (pos >= info.pos && pos < info.pos + info.length + 1) // `+ 1` is for newline char
        return 0;
      return 1;
    });
    const lineInfo = index >= 0 ? this.lineInfos[index] : this.lineInfos[this.lineInfos.length - 1];

    if (lineInfo == null)
      return { lineNumber: 1, column: 1 };

    return { lineNumber: lineInfo.number, column: Math.min(pos - lineInfo.pos + 1, lineInfo.length + 1) };
  }

  getPosFromLineAndColumn(line: number, column: number) {
    if (this.lineInfos.length === 0 || line < 1)
      return 0;

    const lineInfo = this.lineInfos[line - 1];
    if (lineInfo == null) {
      const lastLineInfo = this.lineInfos[this.lineInfos.length - 1];
      return lastLineInfo.pos + lastLineInfo.length;
    }
    return lineInfo.pos + Math.min(lineInfo.length, column - 1);
  }
}