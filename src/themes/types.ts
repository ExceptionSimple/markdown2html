export interface HeadingStyle {
  fontSize: string
  fontWeight: string
  color: string
  textAlign: 'left' | 'center' | 'right'
  marginTop: string
  marginBottom: string
  borderBottom?: string
  backgroundColor?: string
  padding?: string
  borderRadius?: string
  prefixBar?: {
    enabled: boolean
    color: string
    width: string
    radius?: string
  }
  customCss?: string
}

export interface ThemeConfig {
  id: string
  name: string
  description: string
  author?: string
  isBuiltin?: boolean

  typography: {
    fontFamily: string
    fontSize: string
    lineHeight: string
    color: string
    backgroundColor: string
    paragraphMargin: string
    letterSpacing: string
    textAlign: 'left' | 'justify'
    textIndent: string // e.g. '0' or '2em' (Chinese WeChat standard)
    customCss?: string
  }

  headings: {
    bodyNumbering?: 'none' | 'number' | 'chapter' // 正文各级标题自动编号
    iconPrefix?: string // 标题前缀图标，如 '✦ ' 或 '📌 '
    treatFirstH1AsTitle?: boolean // 文首单个 H1 视作大标题（不参与章节编号与目录）
    h1: HeadingStyle
    h2: HeadingStyle
    h3: HeadingStyle
    h4: HeadingStyle
    h5: HeadingStyle
    h6: HeadingStyle
  }

  blockquote: {
    borderLeftColor: string
    borderLeftWidth: string
    backgroundColor: string
    color: string
    padding: string
    borderRadius: string
    margin: string
    fontStyle: 'normal' | 'italic'
    icon?: string // 前置引用图标，如 '❝' 或 '💬' 或 ''
    customCss?: string
  }

  table: {
    headerBackground: string
    headerColor: string
    borderColor: string
    borderWidth: string
    cellPadding: string
    zebraBackground: string
    fontSize: string
    borderRadius?: string
    boxShadow?: string
    customCss?: string
  }

  list: {
    orderedColor: string
    unorderedBulletColor: string
    itemSpacing: string
    paddingLeft: string
    customCss?: string
  }

  inline: {
    boldColor: string
    italicColor: string
    strikeColor?: string
    markBackground: string
    markColor: string
    linkColor: string
    linkUnderline: 'none' | 'underline'
    kbd?: {
      backgroundColor: string
      textColor: string
      borderColor: string
    }
    customCss?: string
  }

  code: {
    inline: {
      color: string
      backgroundColor: string
      fontSize: string
      borderRadius: string
      padding: string
      fontFamily: string
      customCss?: string
    }
    block: {
      shikiTheme: string
      fontSize: string
      lineHeight: string
      backgroundColor: string
      color: string
      borderRadius: string
      padding: string
      showMacDots: boolean
      macDotsStyle: 'colored' | 'monochrome'
      fontFamily: string
      showLineNumbers?: boolean
      lineNumberColor?: string
      customCss?: string
    }
  }

  image: {
    borderRadius: string
    boxShadow: string
    border: string
    showCaption: boolean
    captionColor: string
    captionFontSize: string
    customCss?: string
  }

  divider: {
    style: 'solid' | 'dashed' | 'gradient' | 'symbol'
    color: string
    height: string
    margin: string
    symbol: string // 例如 '✦ ✦ ✦' 或 '***'
    customCss?: string
  }

  footnotes: {
    linkToFootnote: boolean // 是否将外部链接自动提取为文末参考链接
    title: string          // 标题，如 '参考链接 / 引用'
    fontSize: string
    textColor: string
    customCss?: string
  }

  outputBlock: {
    title: string
    showTerminalHeader: boolean
    headerBackground: string
    headerColor: string
    backgroundColor: string
    textColor: string
    borderColor: string
    borderWidth: string
    borderRadius: string
    fontSize: string
    lineHeight: string
    padding: string
    fontFamily: string
    prefixPrompt: string
    customCss?: string
  }

  toc: {
    enabled: boolean
    autoInsert?: boolean
    title: string
    minLevel: number // 1 to 6
    maxLevel: number // 1 to 6
    prefixStyle: 'none' | 'number' | 'chapter' // 'none': 无前缀纯标题; 'number': 1.1 / 1.2; 'chapter': 第一章 / 1.1
    backgroundColor: string
    borderColor: string
    textColor: string
    accentColor: string
    borderRadius: string
    customCss?: string
  }

  alerts: {
    noteColor: string
    tipColor: string
    warningColor: string
    importantColor: string
    cautionColor: string
    borderRadius: string
    customCss?: string
  }
}
