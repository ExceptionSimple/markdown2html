export const fileURLToPath = (url: string | URL): string => {
  const str = typeof url === 'string' ? url : url.href
  return str.replace(/^file:\/\//, '')
}

export const pathToFileURL = (filepath: string): URL => {
  try {
    return new URL(`file://${filepath.startsWith('/') ? filepath : '/' + filepath}`)
  } catch {
    return {
      href: filepath,
      toString: () => filepath
    } as unknown as URL
  }
}

const urlShim = {
  fileURLToPath,
  pathToFileURL
}

export default urlShim
