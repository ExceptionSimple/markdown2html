import type { ThemeConfig } from '../types'

export const zhihuTheme: ThemeConfig = {
  id: 'zhihu-modern',
  name: '知乎现代蓝',
  description: '经典知乎风格，清爽海天蓝主调，现代简约线条，适合知识问答与干货分享。',
  author: 'Official',
  isBuiltin: true,

  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '15px',
    lineHeight: '1.75',
    color: '#121212',
    backgroundColor: '#ffffff',
    paragraphMargin: '16px',
    letterSpacing: '0.3px',
    textAlign: 'left',
    textIndent: '0'
  },

  headings: {
    bodyNumbering: 'none',
    iconPrefix: '',
    h1: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#0066ff',
      textAlign: 'left',
      marginTop: '30px',
      marginBottom: '18px',
      borderBottom: '2px solid #e8f0fe',
      padding: '0 0 8px 0',
      prefixBar: {
        enabled: true,
        color: '#0066ff',
        width: '4px'
      }
    },
    h2: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b',
      textAlign: 'left',
      marginTop: '26px',
      marginBottom: '14px',
      borderBottom: 'none',
      prefixBar: {
        enabled: true,
        color: '#0066ff',
        width: '4px'
      }
    },
    h3: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#334155',
      textAlign: 'left',
      marginTop: '20px',
      marginBottom: '12px'
    },
    h4: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#475569',
      textAlign: 'left',
      marginTop: '16px',
      marginBottom: '10px'
    },
    h5: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#64748b',
      textAlign: 'left',
      marginTop: '14px',
      marginBottom: '8px'
    },
    h6: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#94a3b8',
      textAlign: 'left',
      marginTop: '12px',
      marginBottom: '6px'
    }
  },

  blockquote: {
    borderLeftColor: '#0066ff',
    borderLeftWidth: '3px',
    backgroundColor: '#f6f8fa',
    color: '#64748b',
    padding: '10px 16px',
    borderRadius: '4px',
    margin: '16px 0',
    fontStyle: 'normal',
    icon: '❝'
  },

  table: {
    headerBackground: '#f8fafc',
    headerColor: '#1e293b',
    borderColor: '#e2e8f0',
    borderWidth: '1px',
    cellPadding: '8px 12px',
    zebraBackground: '#ffffff',
    fontSize: '14px',
    borderRadius: '6px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
  },

  list: {
    orderedColor: '#0066ff',
    unorderedBulletColor: '#0066ff',
    itemSpacing: '6px',
    paddingLeft: '22px'
  },

  inline: {
    boldColor: '#0f172a',
    italicColor: '#475569',
    strikeColor: '#94a3b8',
    markBackground: '#e0f2fe',
    markColor: '#0369a1',
    linkColor: '#0066ff',
    linkUnderline: 'none',
    kbd: {
      backgroundColor: '#f6f8fa',
      textColor: '#1f2328',
      borderColor: '#d0d7de'
    }
  },

  code: {
    inline: {
      color: '#0055d6',
      backgroundColor: '#eef4ff',
      fontSize: '13.5px',
      borderRadius: '4px',
      padding: '2px 6px',
      fontFamily: '"JetBrains Mono", "Fira Code", Menlo, Monaco, Consolas, monospace',
      customCss: 'border: 1px solid #dbe8fe; font-weight: 500;'
    },
    block: {
      shikiTheme: 'tokyo-night',
      fontSize: '13.5px',
      lineHeight: '1.65',
      backgroundColor: '#1a1b26',
      color: '#c0caf5',
      borderRadius: '8px',
      padding: '14px 18px',
      showMacDots: true,
      macDotsStyle: 'colored',
      fontFamily: '"JetBrains Mono", "Fira Code", Menlo, Monaco, Consolas, monospace',
      showLineNumbers: false,
      lineNumberColor: '#565f89',
      customCss: 'border: 1px solid rgba(0, 102, 255, 0.22); box-shadow: 0 6px 20px -2px rgba(0, 70, 180, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.06);'
    }
  },

  image: {
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    border: 'none',
    showCaption: true,
    captionColor: '#8590a6',
    captionFontSize: '12px'
  },

  divider: {
    style: 'solid',
    color: '#ebebeb',
    height: '1px',
    margin: '24px 0',
    symbol: '—'
  },

  footnotes: {
    linkToFootnote: true,
    title: '参考引用',
    fontSize: '12px',
    textColor: '#8590a6'
  },

  outputBlock: {
    title: 'OUTPUT / 控制台输出',
    showTerminalHeader: true,
    headerBackground: '#131b2e',
    headerColor: '#7aa2f7',
    backgroundColor: '#0a101d',
    textColor: '#7dcfff',
    borderColor: 'rgba(0, 102, 255, 0.25)',
    borderWidth: '1px',
    borderRadius: '8px',
    fontSize: '13px',
    lineHeight: '1.6',
    padding: '12px 16px',
    fontFamily: '"JetBrains Mono", "Fira Code", Menlo, monospace',
    prefixPrompt: '>>>',
    customCss: 'box-shadow: 0 6px 20px -2px rgba(0, 70, 180, 0.12);'
  },

  toc: {
    enabled: true,
    title: '快速导航',
    minLevel: 1,
    maxLevel: 3,
    prefixStyle: 'none',
    backgroundColor: '#f6f8fa',
    borderColor: '#d0d7de',
    textColor: '#1f2328',
    accentColor: '#0066ff',
    borderRadius: '6px'
  },

  alerts: {
    noteColor: '#0969da',
    tipColor: '#1a7f37',
    warningColor: '#9a6700',
    importantColor: '#8250df',
    cautionColor: '#cf222e',
    borderRadius: '6px'
  }
}
