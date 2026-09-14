export const existsSync = (_path: string): boolean => false
export const readFileSync = (_path: string, _encoding?: string): string => ''
export const realpathSync = (path: string): string => path
export const statSync = () => ({
  isFile: () => false,
  isDirectory: () => false
})
export const promises = {
  readFile: async () => '',
  stat: async () => ({ isFile: () => false, isDirectory: () => false })
}

const fsShim = {
  existsSync,
  readFileSync,
  realpathSync,
  statSync,
  promises
}

export default fsShim
