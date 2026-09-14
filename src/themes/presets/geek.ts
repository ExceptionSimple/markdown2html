import type { ThemeConfig } from '../types'

export const geekTheme: ThemeConfig = {
  id: 'geek-dark',
  name: '极客赛博夜',
  description: '科技极客专享的深色终端美学，高对比度代码高亮与荧光霓虹色调。',
  author: 'Official',
  isBuiltin: true,

  typography: {
    fontFamily: '"JetBrains Mono", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '15px',
    lineHeight: '1.75',
    color: '#e2e8f0',
    backgroundColor: '#0f172a',
    paragraphMargin: '16px',
    letterSpacing: '0.4px',
    textAlign: 'left',
    textIndent: '0'
  },

  headings: {
    bodyNumbering: 'number',
    iconPrefix: '# ',
    h1: {
      fontSize: '22px',
      fontWeight: '800',
      color: '#38bdf8',
      textAlign: 'left',
      marginTop: '32px',
      marginBottom: '20px',
      borderBottom: '2px solid #0284c7',
      padding: '0 0 10px 0',
      prefixBar: {
        enabled: true,
        color: '#38bdf8',
        width: '5px'
      }
    },
    h2: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#818cf8',
      textAlign: 'left',
      marginTop: '28px',
      marginBottom: '16px',
      backgroundColor: '#1e1b4b',
      padding: '6px 12px',
      borderRadius: '6px',
      prefixBar: {
        enabled: true,
        color: '#818cf8',
        width: '4px'
      }
    },
    h3: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#c084fc',
      textAlign: 'left',
      marginTop: '22px',
      marginBottom: '12px'
    },
    h4: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#38bdf8',
      textAlign: 'left',
      marginTop: '18px',
      marginBottom: '10px'
    },
    h5: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#94a3b8',
      textAlign: 'left',
      marginTop: '14px',
      marginBottom: '8px'
    },
    h6: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#64748b',
      textAlign: 'left',
      marginTop: '12px',
      marginBottom: '6px'
    }
  },

  blockquote: {
    borderLeftColor: '#38bdf8',
    borderLeftWidth: '4px',
    backgroundColor: '#1e293b',
    color: '#94a3b8',
    padding: '12px 16px',
    borderRadius: '6px',
    margin: '18px 0',
    fontStyle: 'normal',
    icon: '⚡'
  },

  table: {
    headerBackground: '#1e293b',
    headerColor: '#38bdf8',
    borderColor: '#334155',
    borderWidth: '1px',
    cellPadding: '8px 12px',
    zebraBackground: '#162032',
    fontSize: '14px',
    borderRadius: '6px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
  },

  list: {
    orderedColor: '#38bdf8',
    unorderedBulletColor: '#818cf8',
    itemSpacing: '6px',
    paddingLeft: '22px'
  },

  inline: {
    boldColor: '#38bdf8',
    italicColor: '#c084fc',
    strikeColor: '#64748b',
    markBackground: '#1e3a8a',
    markColor: '#93c5fd',
    linkColor: '#38bdf8',
    linkUnderline: 'underline',
    kbd: {
      backgroundColor: '#1e293b',
      textColor: '#38bdf8',
      borderColor: '#334155'
    }
  },

  code: {
    inline: {
      color: '#f43f5e',
      backgroundColor: '#271924',
      fontSize: '13px',
      borderRadius: '4px',
      padding: '2px 6px',
      fontFamily: 'JetBrains Mono, monospace'
    },
    block: {
      shikiTheme: 'github-dark',
      fontSize: '13px',
      lineHeight: '1.6',
      backgroundColor: '#090d16',
      color: '#e2e8f0',
      borderRadius: '8px',
      padding: '14px 16px',
      showMacDots: true,
      macDotsStyle: 'colored',
      fontFamily: 'JetBrains Mono, monospace',
      showLineNumbers: false,
      lineNumberColor: '#64748b'
    }
  },

  image: {
    borderRadius: '8px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    border: '1px solid #1e293b',
    showCaption: true,
    captionColor: '#94a3b8',
    captionFontSize: '12px'
  },

  divider: {
    style: 'gradient',
    color: '#38bdf8',
    height: '2px',
    margin: '28px 0',
    symbol: '///'
  },

  footnotes: {
    linkToFootnote: true,
    title: '// REFERENCES',
    fontSize: '12px',
    textColor: '#94a3b8'
  },

  outputBlock: {
    title: 'TERMINAL_SESSION // STDOUT',
    showTerminalHeader: true,
    headerBackground: '#090d16',
    headerColor: '#38bdf8',
    backgroundColor: '#030712',
    textColor: '#34d399',
    borderColor: '#1e293b',
    borderWidth: '1px',
    borderRadius: '8px',
    fontSize: '13px',
    lineHeight: '1.6',
    padding: '12px 16px',
    fontFamily: 'JetBrains Mono, monospace',
    prefixPrompt: 'root@matrix:~#'
  },

  toc: {
    enabled: true,
    title: '// INDEX_TREE',
    minLevel: 1,
    maxLevel: 3,
    prefixStyle: 'number',
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    textColor: '#38bdf8',
    accentColor: '#818cf8',
    borderRadius: '8px'
  },

  alerts: {
    noteColor: '#38bdf8',
    tipColor: '#34d399',
    warningColor: '#fbbf24',
    importantColor: '#c084fc',
    cautionColor: '#f43f5e',
    borderRadius: '8px'
  }
}
