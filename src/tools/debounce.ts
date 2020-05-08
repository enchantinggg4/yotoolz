export default function debounce<T extends (...args: any[]) => any>(
  f: T,
  ms: number
): T {
  let isCooldown = false;

  return function (...args: any[]) {
    if (isCooldown) return;

    // @ts-ignore
    const t: any = this;
    f.apply(t, args);

    isCooldown = true;

    setTimeout(() => (isCooldown = false), ms);
  } as T;
}
