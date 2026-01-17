import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

import RunButton from './RunButton';
import TextAreaWithLabel from './TextAreaWithLabel';

const BF_INSTS = ["+", "-", ">", "<", ",", ".", "[", "]"];

function App() {
  const [rawCode, setRawCode] = useState("++++++++[>++++++++<-]>+.");
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [wasmInstance, setWasmInstance] = useState<WebAssembly.Instance | undefined>(undefined);

  const clear = useCallback(() => {
    setStdout("");
    setStderr("");
  }, [setStdout, setStderr]);
  
  const code = useMemo(
    () => Array.from(rawCode).map(c => BF_INSTS.findIndex(v => v === c)).filter(v => v >= 0),
    [rawCode]
  );

  const handleError = useCallback((status: number) => {
    const errorMessage = `構文エラー: '${status === 1 ? "[" : "]"}'が多すぎます`;
    setStderr(errorMessage);
  }, [setStderr]);
  
  useEffect(() => {
    const bf_print_handle = (cont: number) => {
      setStdout(stdout => stdout + String.fromCharCode(cont));
    };

    WebAssembly.instantiateStreaming(fetch("/interpreter.wasm"), {
      env: { print_i32: bf_print_handle }
    }).then((result) => {
      setWasmInstance(result.instance);
    }).catch((error) => {
      console.log(error)
    })
  }, []);

  if (wasmInstance === undefined) {
    return (
      <>
        <h1>Sui-BF</h1>
        <div>Now loading...</div>
      </>
    )
  }

  return (
    <>
      <h1>Sui-BF</h1>
      <br />
      <TextAreaWithLabel
        textAreaName="コード" value={rawCode} onChange={e => setRawCode(e.target.value)}
        autoComplete="off" autoFocus={true} rows={16} cols={64}
      />
      <br />
      <RunButton instance={wasmInstance} clear={clear} handleError={handleError} code={code}>実行</RunButton>
      <br />
      <br />
      <TextAreaWithLabel textAreaName="出力" value={stdout} rows={6} cols={64} disabled={true} />
      <br />
      <TextAreaWithLabel textAreaName="エラー" value={stderr} rows={6} cols={64} disabled={true} />
      <br />
      <p>Source code available at <a href="https://github.com/Bokume2/sui_bf" target="_blank" rel="norefferer noopener" title="Bokume2/sui_bf: Sui-BF - Brainf*ck Interpreter written in sui-lang">GitHub repository</a></p>
      <p>Made with <a href="https://github.com/TakatoHonda/sui-lang" target="_blank" rel="norefferer noopener" title="TakatoHonda/sui-lang: 粋 (Sui) - A programming language optimized for LLM code generation">Sui</a></p>
    </>
  )
}

export default App
