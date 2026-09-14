import type { ThemeConfig } from '../types'

export const academicTheme: ThemeConfig = {
  id: 'academic-classic',
  name: '经典学术蓝',
  description: '严谨沉稳的学术论文风格，精细深海军蓝阶梯标题，适合技术报告与深度长文。',
  author: 'Official',
  isBuiltin: true,

  typography: {
    fontFamily: '"Noto Serif SC", "Source Han Serif SC", Georgia, "Times New Roman", SimSun, serif',
    fontSize: '15px',
    lineHeight: '1.8',
    color: '#1f2937',
    backgroundColor: '#ffffff',
    paragraphMargin: '16px',
    letterSpacing: '0.4px',
    textAlign: 'justify',
    textIndent: '2em'
  },

  headings: {
    bodyNumbering: 'chapter',
    iconPrefix: '',
    h1: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#1e3a8a',
      textAlign: 'center',
      marginTop: '32px',
      marginBottom: '20px',
      borderBottom: '2px solid #1e3a8a',
      padding: '0 0 8px 0'
    },
    h2: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e40af',
      textAlign: 'left',
      marginTop: '28px',
      marginBottom: '16px',
      borderBottom: '1px solid #bfdbfe',
      padding: '0 0 6px 0',
      prefixBar: {
        enabled: true,
        color: '#1e40af',
        width: '4px'
      }
    },
    h3: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1d4ed8',
      textAlign: 'left',
      marginTop: '22px',
      marginBottom: '12px'
    },
    h4: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#2563eb',
      textAlign: 'left',
      marginTop: '18px',
      marginBottom: '10px'
    },
    h5: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#3b82f6',
      textAlign: 'left',
      marginTop: '14px',
      marginBottom: '8px'
    },
    h6: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#60a5fa',
      textAlign: 'left',
      marginTop: '12px',
      marginBottom: '6px'
    }
  },

  blockquote: {
    borderLeftColor: '#2563eb',
    borderLeftWidth: '3px',
    backgroundColor: '#eff6ff',
    color: '#334155',
    padding: '12px 18px',
    borderRadius: '2px',
    margin: '18px 0',
    fontStyle: 'normal',
    icon: '💬'
  },

  table: {
    headerBackground: '#f1f5f9',
    headerColor: '#0f172a',
    borderColor: '#cbd5e1',
    borderWidth: '1px',
    cellPadding: '8px 14px',
    zebraBackground: '#f8fafc',
    fontSize: '14px',
    borderRadius: '4px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
  },

  list: {
    orderedColor: '#1d4ed8',
    unorderedBulletColor: '#2563eb',
    itemSpacing: '6px',
    paddingLeft: '22px'
  },

  inline: {
    boldColor: '#1e3a8a',
    italicColor: '#334155',
    strikeColor: '#94a3b8',
    markBackground: '#dbeafe',
    markColor: '#1e40af',
    linkColor: '#1d4ed8',
    linkUnderline: 'underline',
    kbd: {
      backgroundColor: '#f1f5f9',
      textColor: '#0f172a',
      borderColor: '#cbd5e1'
    }
  },

  code: {
    inline: {
      color: '#1e40af',
      backgroundColor: '#eff6ff',
      fontSize: '13px',
      borderRadius: '3px',
      padding: '2px 5px',
      fontFamily: 'Fira Code, Consolas, monospace'
    },
    block: {
      shikiTheme: 'github-light',
      fontSize: '13px',
      lineHeight: '1.6',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      borderRadius: '6px',
      padding: '14px 16px',
      showMacDots: true,
      macDotsStyle: 'monochrome',
      fontFamily: 'JetBrains Mono, Fira Code, monospace',
      showLineNumbers: false,
      lineNumberColor: '#94a3b8'
    }
  },

  image: {
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
    showCaption: true,
    captionColor: '#64748b',
    captionFontSize: '12px'
  },

  divider: {
    style: 'solid',
    color: '#cbd5e1',
    height: '1px',
    margin: '24px 0',
    symbol: '—'
  },

  footnotes: {
    linkToFootnote: true,
    title: '参考文献与引用',
    fontSize: '12px',
    textColor: '#64748b'
  },

  outputBlock: {
    title: 'EXECUTION OUTPUT / 终端回显',
    showTerminalHeader: true,
    headerBackground: '#1e293b',
    headerColor: '#cbd5e1',
    backgroundColor: '#0f172a',
    textColor: '#e2e8f0',
    borderColor: '#334155',
    borderWidth: '1px',
    borderRadius: '6px',
    fontSize: '13px',
    lineHeight: '1.6',
    padding: '12px 16px',
    fontFamily: 'JetBrains Mono, Menlo, monospace',
    prefixPrompt: '$'
  },

  toc: {
    enabled: true,
    title: 'CONTENTS / 章节目录',
    minLevel: 1,
    maxLevel: 3,
    prefixStyle: 'chapter',
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    textColor: '#1e3a8a',
    accentColor: '#2563eb',
    borderRadius: '4px'
  },

  alerts: {
    noteColor: '#2563eb',
    tipColor: '#059669',
    warningColor: '#d97706',
    importantColor: '#7c3aed',
    cautionColor: '#dc2626',
    borderRadius: '4px'
  }
}
