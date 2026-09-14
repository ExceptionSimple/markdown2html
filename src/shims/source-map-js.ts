export class SourceMapConsumer {
  static with<T>(_rawSourceMap: any, fn: (consumer: SourceMapConsumer) => T): T {
    return fn(new SourceMapConsumer())
  }
  originalPositionFor() {
    return { source: null, line: null, column: null, name: null }
  }
  destroy() {}
}

export class SourceMapGenerator {
  addMapping() {}
  setSourceContent() {}
  toJSON() {
    return {}
  }
  toString() {
    return ''
  }
}

const sourceMapShim = {
  SourceMapConsumer,
  SourceMapGenerator
}

export default sourceMapShim
