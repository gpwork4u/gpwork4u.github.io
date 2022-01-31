import DateFormatter from '../components/date-formatter'
import Link from 'next/link'

export default function PostPreview({
  title,
  tags,
  date,
  slug,
}) {
  return (
    <div>
      <h3 className="text-3xl">
        <Link as={`./posts/${slug}`} href="./posts/[slug]">
          <a>{title}</a>
        </Link>
        <span className="text-2xl color-bg-emphasis color-fg-on-emphasis ml-3 rounded">
        {tags}
        </span >
      </h3>

      <div className="text-lg mb-4">
        <DateFormatter dateString={date} />
      </div>

    </div>
  )
}
