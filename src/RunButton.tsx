import React, { useCallback, useMemo } from "react";

export default function RunButton({
  children, instance, clear, handleError, code
}: {
  children: React.ReactNode,
  instance: WebAssembly.Instance,
  clear: () => void,
  handleError: (status: number) => void,
  code: number[]
}) {
  const { f0, f1, f2, main } = useMemo(() => instance.exports as {
    f0: (l: number) => void,
    f1: (i: number, v: number) => void,
    f2: () => number,
    main: () => void
  }, [instance]);
  
  const run = useCallback(() => {
    clear();
    main();
    f0(code.length);
    code.forEach((v, i) => {
      f1(i, v);
    });
    const status = f2();
    if (status === 0) {
      console.log("done!");
    } else {
      console.log("error");
      handleError(status);
    }
  }, [clear, handleError, code, f0, f1, f2, main]);

  return <button onClick={run}>{children}</button>
}
