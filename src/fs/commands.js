import { getDir } from './helpers.js';

export function parseCommand(input, fs, setFs, cwd, setCwd) {
  const [cmd, ...args] = input.trim().split(/\s+/);

  switch (cmd) {
    case 'mkdir': return mkdir(args, fs, setFs, cwd);
    case 'ls': return ls(fs, cwd);
    case 'cd': return cd(args, fs, setCwd, cwd);
    case 'touch': return touch(args, fs, setFs, cwd);
    case 'rm': return rm(args, fs, setFs, cwd);
    case 'rmdir': return rmdir(args, fs, setFs, cwd);
    case 'mv': return mv(args, fs, setFs, cwd);
    case 'cp': return cp(args, fs, setFs, cwd);
    case 'curl': return curl(args);
    default: return `Command not recognized: ${cmd}`;
  }
}

function mkdir(args, fs, setFs, cwd) {
  const dirName = args[0];
  const current = getDir(fs, cwd);
  if (!current.children[dirName]) {
    current.children[dirName] = { type: 'dir', children: {} };
    setFs({ ...fs });
    return `Directory '${dirName}' created.`;
  }
  return `Directory '${dirName}' already exists.`;
}

function ls(fs, cwd) {
  const current = getDir(fs, cwd);
  return Object.keys(current.children).join('\n') || 'Empty';
}

function cd(args, fs, setCwd, cwd) {
  const dir = args[0];
  if (dir === '..') {
    const parts = cwd.split('/').filter(Boolean);
    parts.pop();
    const newPath = '/' + parts.join('/');
    setCwd(newPath || '/');
    return `Moved to ${newPath || '/'}`;
  }

  const current = getDir(fs, cwd);
  if (current.children[dir] && current.children[dir].type === 'dir') {
    const newPath = cwd === '/' ? `/${dir}` : `${cwd}/${dir}`;
    setCwd(newPath);
    return `Moved to ${newPath}`;
  }

  return `Directory '${dir}' not found.`;
}

function touch(args, fs, setFs, cwd) {
  const fileName = args[0];
  const current = getDir(fs, cwd);
  if (!fileName) return 'Please specify a filename.';
  if (!current.children[fileName]) {
    current.children[fileName] = { type: 'file', content: '' };
    setFs({ ...fs });
    return `File '${fileName}' created.`;
  }
  return `File '${fileName}' already exists.`;
}

function rm(args, fs, setFs, cwd) {
  const name = args[0];
  const dir = getDir(fs, cwd);
  if (dir.children[name] && dir.children[name].type === 'file') {
    delete dir.children[name];
    setFs({ ...fs });
    return `File '${name}' removed.`;
  }
  return `File '${name}' not found.`;
}

function rmdir(args, fs, setFs, cwd) {
  const name = args[0];
  const dir = getDir(fs, cwd);
  if (dir.children[name] && dir.children[name].type === 'dir') {
    if (Object.keys(dir.children[name].children).length === 0) {
      delete dir.children[name];
      setFs({ ...fs });
      return `Directory '${name}' removed.`;
    } else {
      return `Directory '${name}' is not empty.`;
    }
  }
  return `Directory '${name}' not found.`;
}

function mv(args, fs, setFs, cwd) {
  const [from, to] = args;
  const dir = getDir(fs, cwd);
  if (dir.children[from]) {
    dir.children[to] = dir.children[from];
    delete dir.children[from];
    setFs({ ...fs });
    return `Renamed '${from}' to '${to}'.`;
  }
  return `'${from}' not found.`;
}

function cp(args, fs, setFs, cwd) {
  const [from, to] = args;
  const dir = getDir(fs, cwd);
  if (dir.children[from]) {
    const item = JSON.parse(JSON.stringify(dir.children[from]));
    dir.children[to] = item;
    setFs({ ...fs });
    return `Copied '${from}' to '${to}'.`;
  }
  return `'${from}' not found.`;
}

function curl(args) {
  const url = args[0];
  if (url === 'https://jsonplaceholder.typicode.com/posts/1') {
    return JSON.stringify({ id: 1, title: 'Hello from curl!' }, null, 2);
  }
  return `Fetching from '${url}'...\n{\n  \"data\": \"Sample response from curl\"\n}`;
}