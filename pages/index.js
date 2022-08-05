import Container from '@/components/container'
import MoreStories from '@/components/more-stories'
import HeroPost from '@/components/hero-post'
import Intro from '@/components/intro'
import Layout from '@/components/layout'
import { getAllPostsForHome } from '@/lib/api'
import Head from 'next/head'
import { CMS_NAME } from '@/lib/constants'
import { he } from 'date-fns/locale'

export default function Index({ allPosts, preview }) {
  const heroPost = allPosts[0].attributes
  const morePosts = allPosts.slice(1)
  const author = heroPost.author.data.attributes
  const coverImage = {...heroPost.coverImage.data[0].attributes}

  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>SaikaBlog</title>
        </Head>
        <Container>
          <Intro />
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={coverImage}
              date={heroPost.date}
              author={author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
            />
          )}
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps({ preview = null }) {
  const allPosts = (await getAllPostsForHome(preview)) || []
  return {
    props: { allPosts, preview },
  }
}
