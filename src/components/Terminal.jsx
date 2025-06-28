import { useState } from 'react';
import { parseCommand } from '../fs/commands';
import { createFileSystem } from '../fs/fileSystem';

export default function Terminal() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [fs, setFs] = useState(createFileSystem());
  const [cwd, setCwd] = useState('/');

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const result = parseCommand(input, fs, setFs, cwd, setCwd);
      setHistory([...history, `$ ${input}`, result]);
      setInput('');
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#0f0', padding: '1rem', height: '100vh', fontFamily: 'monospace' }}>
      {history.map((line, i) => <div key={i}>{line}</div>)}
      <div>
        <span>{cwd} $ </span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#0f0',
            outline: 'none',
            font: 'inherit',
            width: '90%',
          }}
          autoFocus
        />
      </div>
    </div>
  );
}
