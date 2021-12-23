import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const cacheDir = join(process.cwd(), './.next/cache/posts')
fs.ensureDirSync(cacheDir)

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
}

export async function getPostBySlug(slug) {
  const fullPath = join(cacheDir, `${slug}.json`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const data = JSON.parse(fileContents);
  const source_content = await fetch_post(slug);
  const { _, content } = matter(source_content)
  data.content = content
  return data
}

export function fetch_post(slug){
  const content = fetch(`https://hackmd.io/${slug}/download`).then(res=>{return res.text()});
  return content;
}
export function getPost(note){

  const post = {
    id: note.id,
    title: note.title,
    content: note.content,
    slug: note.id,
    tags: note.tags,
    createdAt: note.createdAt,
    lastchangeAt: note.lastchangeAt,
  }
  fs.writeFileSync(
    join(cacheDir, `${note.id}.json`),
    JSON.stringify(
      post,
      null,
      2
    ),
    'utf-8'
  )
  return post
}

export async function getAllPosts() {
  const resp = await fetch(`https://hackmd.io/api/@${process.env.HACKMD_PROFILE}/overview`);
  const data = await resp.json();
  if(!data){
    return []
  }
  const post_list = data['notes']
  const posts = post_list.map((note) => getPost(note));
  return posts;
}