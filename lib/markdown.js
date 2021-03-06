import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/core'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItToc from 'markdown-it-toc-done-right'
import markdownItContainer from 'markdown-it-container'

hljs.registerLanguage(
    'javascript',
    require('highlight.js/lib/languages/javascript')
  )
  hljs.registerLanguage('js', require('highlight.js/lib/languages/javascript'))
  hljs.registerLanguage(
    'typescript',
    require('highlight.js/lib/languages/typescript')
  )
  hljs.registerLanguage('ts', require('highlight.js/lib/languages/typescript'))
  hljs.registerLanguage('json', require('highlight.js/lib/languages/json'))
  hljs.registerLanguage('java', require('highlight.js/lib/languages/java'))
  hljs.registerLanguage(
    'markdown',
    require('highlight.js/lib/languages/markdown')
  )
  hljs.registerLanguage('md', require('highlight.js/lib/languages/markdown'))
  hljs.registerLanguage('shell', require('highlight.js/lib/languages/shell'))
  hljs.registerLanguage(
    'powershell',
    require('highlight.js/lib/languages/powershell')
  )
  hljs.registerLanguage('css', require('highlight.js/lib/languages/css'))
  hljs.registerLanguage('scss', require('highlight.js/lib/languages/scss'))
  hljs.registerLanguage('yaml', require('highlight.js/lib/languages/yaml'))
  hljs.registerLanguage('python', require('highlight.js/lib/languages/python'))
  hljs.registerLanguage('http', require('highlight.js/lib/languages/http'))
  hljs.registerLanguage('go', require('highlight.js/lib/languages/go'))
  hljs.registerLanguage('ruby', require('highlight.js/lib/languages/ruby'))
  hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'))

  const isHighlighted = (lineNumber, lines) => {
    return lines.some((l) => {
      if (Array.isArray(l)) {
        return l[0] <= lineNumber && lineNumber <= l[1]
      } else {
        return lineNumber === l
      }
    })
  }

  const processLang = (lang) => {
    const matchNumber = lang.match(/(.+)\=/)
    if (matchNumber) {
      return matchNumber[1]
    }

    return lang
  }

  const wrapCodeLines = (html, lang, langAttrs = '') => {
    let showLineNumber = false
    if (lang.match(/\w+\=/)) {
      showLineNumber = true
    }

    const lineOffsetMatch = lang.match(/\w+\=(\d+)/)
    let lineOffset = 0
    if (lineOffsetMatch) {
      lineOffset = Math.abs(parseInt(lineOffsetMatch[1], 10)) - 1
    }

    let highlightedLines = []
    const highlightedRangesMatch = langAttrs.match(/\[([\d-,\s]+)\]/)
    if (highlightedRangesMatch) {
      highlightedRangesMatch[1].split(',').forEach((s) => {
        if (s.includes('-')) {
          highlightedLines = [
            ...highlightedLines,
            s.split('-').map((n) => parseInt(n.trim(), 10)),
          ]
        } else {
          highlightedLines.push(parseInt(s.trim(), 10))
        }
      })
    }

    // Use slice(0, -1) to fix trailing line break
    const codes = html
      .slice(0, -1)
      .split('\n')
      .map((line, index) => {
        const lineNumber = index + 1 + lineOffset
        const highlighted = isHighlighted(lineNumber, highlightedLines)
          ? ' highlighted'
          : ''
        const wrappedLine = `<td class="hljs-line${highlighted}" id="LC${lineNumber}">${line}</td>`
        return `<tr><td class="hljs-line-number" data-line-number=${lineNumber}></td>${wrappedLine}</tr>`
      })
      .join('')

    const lineNumberClass = showLineNumber ? ' has-line-number' : ''
    const clipboardButton =
      '<button class="btn copy-snippet-button position-absolute top-1 right-1"><i class="fas fa-clipboard"></i><i class="fas fa-check"></i><svg aria-hidden="true" role="img" class="StyledOcticon-uhnt7w-0 iIOaoH" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display:inline-block;user-select:none;vertical-align:text-bottom;overflow:visible"><path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path></svg></button>'

    return `${clipboardButton}<table class="fence-wrapper${lineNumberClass}"><tbody>${codes}</tbody></table>`
  }

  function containerRenderer(tokens, idx, options, env, self) {
    const token = tokens[idx]

    // success, info, warning, danger
    const type = token.info.trim()
    token.attrJoin(
      'class',
      `container-block color-bg-${type} color-border-${type} rounded-2 p-3`
    )

    return self.renderToken(...arguments)
  }

  // TODO: extend markdown-it to be HackMD compatible
  const md = MarkdownIt('default', {
    linkify: true,
    typographer: true,
    html: true,
    highlight: function (code, lang, langAttrs) {
      const highlightedLang = processLang(lang)
      if (lang && hljs.getLanguage(highlightedLang)) {
        try {
          const highlightedCode = hljs.highlight(code, {
            language: highlightedLang,
          }).value
          return wrapCodeLines(highlightedCode, lang, langAttrs)
        } catch (__) {}
      } else {
        return wrapCodeLines(code, lang, langAttrs)
      }

      return ''
    },
  })

  md.use(require('markdown-it-abbr'))
  .use(require('markdown-it-deflist'))
  .use(require('markdown-it-mark'))
  .use(require('markdown-it-ins'))
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-sup'))
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-imsize'))
  .use(require('markdown-it-image-figures'), {
    dataType: true,
    figcaption: true,
  })
  .use(markdownItAnchor, {
    permalink: true,
    permalinkClass: 'anchor',
    permalinkBefore: true,
    permalinkSymbol:
      '<svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg>',
  })
  .use(markdownItToc)
  .use(markdownItContainer, 'success', { render: containerRenderer })
  .use(markdownItContainer, 'info', { render: containerRenderer })
  .use(markdownItContainer, 'warning', { render: containerRenderer })
  .use(markdownItContainer, 'danger', { render: containerRenderer })
  .use(markdownItContainer, 'spoiler', {
    validate: function (params) {
      return params.trim().match(/^spoiler(\s+.*)?$/)
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^spoiler(\s+.*)?$/)

      if (tokens[idx].nesting === 1) {
        // opening tag
        const summary = m[1] && m[1].trim()
        if (summary) {
          return `<details><summary>${md.renderInline(summary)}</summary>\n`
        } else {
          return '<details>\n'
        }
      } else {
        // closing tag
        return '</details>\n'
      }
    },
  })
  .use(require('markdown-it-ruby'))
  .use(require('markdown-it-emoji'))
  .use(require('markdown-it-task-lists'), {})

export function render(src) {
  return md.render(src)
}