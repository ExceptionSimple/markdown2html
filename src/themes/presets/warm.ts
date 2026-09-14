import type { ThemeConfig } from '../types'

export const warmTheme: ThemeConfig = {
  id: 'warm-orange',
  name: '暖阳活力橙',
  description: '热情洋溢的暖橙色彩，富有视觉冲击力与现代杂志质感，适合生活方式与创意写作。',
  author: 'Official',
  isBuiltin: true,

  typography: {
    fontFamily: '-apple-system-font, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    fontSize: '15px',
    lineHeight: '1.75',
    color: '#262626',
    backgroundColor: '#ffffff',
    paragraphMargin: '16px',
    letterSpacing: '0.4px',
    textAlign: 'justify',
    textIndent: '0'
  },

  headings: {
    bodyNumbering: 'none',
    iconPrefix: '✦ ',
    h1: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#ea580c',
      textAlign: 'center',
      marginTop: '32px',
      marginBottom: '20px',
      borderBottom: '2px solid #fdba74',
      padding: '0 0 10px 0',
      prefixBar: {
        enabled: false,
        color: '#ea580c',
        width: '4px'
      }
    },
    h2: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#c2410c',
      textAlign: 'left',
      marginTop: '28px',
      marginBottom: '16px',
      backgroundColor: '#fff7ed',
      padding: '6px 12px',
      borderRadius: '6px',
      prefixBar: {
        enabled: true,
        color: '#ea580c',
        width: '4px'
      }
    },
    h3: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#9a3412',
      textAlign: 'left',
      marginTop: '22px',
      marginBottom: '12px',
      prefixBar: {
        enabled: true,
        color: '#f97316',
        width: '3px'
      }
    },
    h4: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#431407',
      textAlign: 'left',
      marginTop: '18px',
      marginBottom: '10px'
    },
    h5: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#7c2d12',
      textAlign: 'left',
      marginTop: '14px',
      marginBottom: '8px'
    },
    h6: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#9a3412',
      textAlign: 'left',
      marginTop: '12px',
      marginBottom: '6px'
    }
  },

  blockquote: {
    borderLeftColor: '#f97316',
    borderLeftWidth: '4px',
    backgroundColor: '#fffaf5',
    color: '#78716c',
    padding: '12px 16px',
    borderRadius: '4px',
    margin: '18px 0',
    fontStyle: 'normal',
    icon: '💡'
  },

  table: {
    headerBackground: '#ffedd5',
    headerColor: '#9a3412',
    borderColor: '#fed7aa',
    borderWidth: '1px',
    cellPadding: '8px 12px',
    zebraBackground: '#fffaf5',
    fontSize: '14px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(234,88,12,0.08)'
  },

  list: {
    orderedColor: '#ea580c',
    unorderedBulletColor: '#f97316',
    itemSpacing: '6px',
    paddingLeft: '22px'
  },

  inline: {
    boldColor: '#c2410c',
    italicColor: '#78716c',
    strikeColor: '#a8a29e',
    markBackground: '#ffedd5',
    markColor: '#c2410c',
    linkColor: '#ea580c',
    linkUnderline: 'none',
    kbd: {
      backgroundColor: '#fff7ed',
      textColor: '#9a3412',
      borderColor: '#fed7aa'
    }
  },

  code: {
    inline: {
      color: '#c2410c',
      backgroundColor: '#fff7ed',
      fontSize: '13px',
      borderRadius: '4px',
      padding: '2px 6px',
      fontFamily: 'Fira Code, Menlo, Monaco, Consolas, monospace'
    },
    block: {
      shikiTheme: 'github-dark',
      fontSize: '13px',
      lineHeight: '1.6',
      backgroundColor: '#1c1917',
      color: '#f5f5f4',
      borderRadius: '8px',
      padding: '14px 16px',
      showMacDots: true,
      macDotsStyle: 'colored',
      fontFamily: 'JetBrains Mono, monospace',
      showLineNumbers: false,
      lineNumberColor: '#78716c'
    }
  },

  image: {
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(234,88,12,0.12)',
    border: 'none',
    showCaption: true,
    captionColor: '#a8a29e',
    captionFontSize: '12px'
  },

  divider: {
    style: 'symbol',
    color: '#f97316',
    height: '1px',
    margin: '28px 0',
    symbol: '✦ ✦ ✦'
  },

  footnotes: {
    linkToFootnote: true,
    title: '文章引用',
    fontSize: '12px',
    textColor: '#a8a29e'
  },

  outputBlock: {
    title: 'PROGRAM OUTPUT / 运行结果',
    showTerminalHeader: true,
    headerBackground: '#1c1917',
    headerColor: '#fb923c',
    backgroundColor: '#0c0a09',
    textColor: '#fdba74',
    borderColor: '#292524',
    borderWidth: '1px',
    borderRadius: '8px',
    fontSize: '13px',
    lineHeight: '1.6',
    padding: '12px 16px',
    fontFamily: 'JetBrains Mono, monospace',
    prefixPrompt: '>>>'
  },

  toc: {
    enabled: true,
    title: '本篇导读',
    minLevel: 1,
    maxLevel: 3,
    prefixStyle: 'chapter',
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
    textColor: '#9a3412',
    accentColor: '#ea580c',
    borderRadius: '8px'
  },

  alerts: {
    noteColor: '#ea580c',
    tipColor: '#16a34a',
    warningColor: '#d97706',
    importantColor: '#9333ea',
    cautionColor: '#dc2626',
    borderRadius: '8px'
  }
}
