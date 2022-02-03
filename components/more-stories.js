import PostPreview from '../components/post-preview'

export default function MoreStories({ posts }) {
  return (
    <section className="mx-auto px-10 color-postlist pt-10 pb-5">
      <h2 className="text-6xl pb-2">
        Articles
      </h2>
      <div className="px-5">
        {posts.map((post) => (
          <PostPreview
            key={post.slug}
            tags={post.tags}
            title={post.title}
            date={post.createdAt}
            slug={post.slug}
          />
        ))}
      </div>
    </section>
  )
}
