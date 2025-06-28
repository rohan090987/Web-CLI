// fileSystem.js
export function createFileSystem() {
  return {
    '/': {
      type: 'dir',
      children: {}
    }
  };
}
