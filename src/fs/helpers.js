// helpers.js

export function getDir(fs, path) {
  const parts = path.split('/').filter(Boolean);
  let current = fs['/'];

  for (let part of parts) {
    if (!current.children[part] || current.children[part].type !== 'dir') {
      return null;
    }
    current = current.children[part];
  }
  return current;
}
