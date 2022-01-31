import markdownStyles from './markdown-styles.module.css'
import useCopySnippet from '../lib/hooks/useCopySnippet'

export default function PostBody({ content }) {
  useCopySnippet();
  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={markdownStyles['markdown']}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}
