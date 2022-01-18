import PostPreview from '../components/post-preview'

export default function MoreStories({ posts }) {
  return (
    <section>
      <h2 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
        Articles
      </h2>
      <div className="md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
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
