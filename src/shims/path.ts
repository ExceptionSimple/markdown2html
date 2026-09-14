export const isAbsolute = (p: string): boolean => {
  if (typeof p !== 'string') return false
  return p.startsWith('/') || /^[a-zA-Z]:[\\/]/.test(p)
}

export const resolve = (...args: string[]): string => {
  return args.filter(Boolean).join('/').replace(/\/+/g, '/') || '/'
}

export const dirname = (p: string): string => {
  if (!p) return '.'
  const parts = p.split(/[\\/]/)
  parts.pop()
  return parts.join('/') || '/'
}

export const join = (...args: string[]): string => {
  return args.filter(Boolean).join('/').replace(/\/+/g, '/')
}

export const relative = (_from: string, to: string): string => {
  return to || ''
}

export const normalize = (p: string): string => p || ''

export const basename = (p: string, ext?: string): string => {
  if (!p) return ''
  let base = p.split(/[\\/]/).pop() || ''
  if (ext && base.endsWith(ext)) {
    base = base.slice(0, -ext.length)
  }
  return base
}

export const extname = (p: string): string => {
  if (!p) return ''
  const base = basename(p)
  const idx = base.lastIndexOf('.')
  return idx > 0 ? base.slice(idx) : ''
}

export const sep = '/'
export const delimiter = ':'

const pathShim = {
  resolve,
  isAbsolute,
  dirname,
  join,
  relative,
  normalize,
  basename,
  extname,
  sep,
  delimiter
}

export default pathShim
