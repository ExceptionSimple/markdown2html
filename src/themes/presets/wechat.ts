import type { ThemeConfig } from '../types'

export const wechatTheme: ThemeConfig = {
  id: 'wechat-default',
  name: '微信雅致绿',
  description: '专为微信公众号深度优化的经典排版，翡翠绿点缀，排版呼吸感强，阅读温润舒适。',
  author: 'Official',
  isBuiltin: true,

  typography: {
    fontFamily: '-apple-system-font, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    fontSize: '15px',
    lineHeight: '1.75',
    color: '#2b2b2b',
    backgroundColor: '#ffffff',
    paragraphMargin: '16px',
    letterSpacing: '0.5px',
    textAlign: 'justify',
    textIndent: '0'
  },

  headings: {
    bodyNumbering: 'none',
    iconPrefix: '',
    h1: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#07c160',
      textAlign: 'center',
      marginTop: '32px',
      marginBottom: '20px',
      borderBottom: '2px dashed #07c160',
      padding: '0 0 10px 0',
      prefixBar: {
        enabled: false,
        color: '#07c160',
        width: '4px'
      }
    },
    h2: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#07c160',
      textAlign: 'left',
      marginTop: '28px',
      marginBottom: '16px',
      borderBottom: 'none',
      backgroundColor: '#f0fdf4',
      padding: '6px 12px',
      borderRadius: '6px',
      prefixBar: {
        enabled: true,
        color: '#07c160',
        width: '4px',
        radius: '2px'
      }
    },
    h3: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#166534',
      textAlign: 'left',
      marginTop: '22px',
      marginBottom: '12px',
      prefixBar: {
        enabled: true,
        color: '#22c55e',
        width: '3px'
      }
    },
    h4: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#1f2937',
      textAlign: 'left',
      marginTop: '18px',
      marginBottom: '10px'
    },
    h5: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      textAlign: 'left',
      marginTop: '14px',
      marginBottom: '8px'
    },
    h6: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#4b5563',
      textAlign: 'left',
      marginTop: '12px',
      marginBottom: '6px'
    }
  },

  blockquote: {
    borderLeftColor: '#07c160',
    borderLeftWidth: '4px',
    backgroundColor: '#f8fafc',
    color: '#64748b',
    padding: '12px 16px',
    borderRadius: '4px',
    margin: '18px 0',
    fontStyle: 'normal',
    icon: '❝'
  },

  table: {
    headerBackground: '#f0fdf4',
    headerColor: '#166534',
    borderColor: '#dcfce7',
    borderWidth: '1px',
    cellPadding: '8px 12px',
    zebraBackground: '#f9fdfa',
    fontSize: '14px',
    borderRadius: '6px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },

  list: {
    orderedColor: '#07c160',
    unorderedBulletColor: '#07c160',
    itemSpacing: '6px',
    paddingLeft: '22px'
  },

  inline: {
    boldColor: '#07c160',
    italicColor: '#4b5563',
    strikeColor: '#9ca3af',
    markBackground: '#dcfce7',
    markColor: '#15803d',
    linkColor: '#07c160',
    linkUnderline: 'none',
    kbd: {
      backgroundColor: '#f3f4f6',
      textColor: '#1f2937',
      borderColor: '#d1d5db'
    }
  },

  code: {
    inline: {
      color: '#07c160',
      backgroundColor: '#f0fdf4',
      fontSize: '13px',
      borderRadius: '4px',
      padding: '2px 6px',
      fontFamily: 'Fira Code, Menlo, Monaco, Consolas, monospace'
    },
    block: {
      shikiTheme: 'github-dark',
      fontSize: '13px',
      lineHeight: '1.6',
      backgroundColor: '#1e293b',
      color: '#e2e8f0',
      borderRadius: '8px',
      padding: '14px 16px',
      showMacDots: true,
      macDotsStyle: 'colored',
      fontFamily: 'JetBrains Mono, Fira Code, monospace',
      showLineNumbers: false,
      lineNumberColor: '#64748b'
    }
  },

  image: {
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: 'none',
    showCaption: true,
    captionColor: '#6b7280',
    captionFontSize: '12px'
  },

  divider: {
    style: 'symbol',
    color: '#07c160',
    height: '1px',
    margin: '28px 0',
    symbol: '✦ ✦ ✦'
  },

  footnotes: {
    linkToFootnote: true,
    title: '参考链接',
    fontSize: '12px',
    textColor: '#6b7280'
  },

  outputBlock: {
    title: 'OUTPUT / 执行结果',
    showTerminalHeader: true,
    headerBackground: '#0f172a',
    headerColor: '#94a3b8',
    backgroundColor: '#020617',
    textColor: '#4ade80',
    borderColor: '#1e293b',
    borderWidth: '1px',
    borderRadius: '8px',
    fontSize: '13px',
    lineHeight: '1.6',
    padding: '12px 16px',
    fontFamily: 'JetBrains Mono, Menlo, monospace',
    prefixPrompt: '>'
  },

  toc: {
    enabled: true,
    title: '文章导读 · 目录',
    minLevel: 1,
    maxLevel: 3,
    prefixStyle: 'none',
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    textColor: '#166534',
    accentColor: '#07c160',
    borderRadius: '8px'
  },

  alerts: {
    noteColor: '#3b82f6',
    tipColor: '#10b981',
    warningColor: '#f59e0b',
    importantColor: '#8b5cf6',
    cautionColor: '#ef4444',
    borderRadius: '8px'
  }
}
