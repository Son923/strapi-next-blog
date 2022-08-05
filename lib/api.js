async function fetchAPI(query, { variables } = {}) {
  // const API_URL=`http://localhost:1337/graphql`
  const API_URL=`http://latteblog.herokuapp.com/graphql`
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
  const json = await res.json()
  if (json.errors) {
    throw new Error('Failed to fetch API')
  }

  return json.data
}

export async function getPreviewPostBySlug(slug) {
  const data = await fetchAPI(
    `
  query PostBySlug($where: JSON) {
    posts(where: $where) {
      slug
    }
  }
  `,
    {
      variables: {
        where: {
          slug,
        },
      },
    }
  )
  return data?.posts[0]
}

export async function getAllPostsWithSlug() {
  const data = fetchAPI(`
    {
      posts {
        data {
          attributes {
            slug
          }
        }
      }
    }
  `)
  return data?.posts
}

// DONE
export async function getAllPostsForHome(preview) {
  const data = await fetchAPI(
    `
    query {
      posts(sort: "date:desc") {
        data {
          attributes {
            title
            slug
            excerpt
            date
            coverImage {
              data {
                attributes {
                  url
                }
              }
            }
            author {
              data {
                attributes {
                  name
                  picture {
                    data {
                      attributes {
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        where: {
          ...(preview ? {} : { status: 'published' }),
        },
      },
    }
  )

  return data?.posts.data
}

// DOING
export async function getPostAndMorePosts(slug, preview) {
  const data = await fetchAPI(
    `
    query PostBySlug($where: String, $where_ne: String) {
      posts(filters: {slug: {eq: $where}}) {
        data {
          attributes {
            title
            slug
            content
            date
            ogImage: coverImage{
              data {
                attributes {
                  url
                }
              }
            }
            coverImage {
              data {
                attributes {
                  url
                }
              }
            }
            author {
              data {
                attributes {
                  name
                  picture {
                    data {
                      attributes {
                        url
                      }
                    }
                  }
                }
              }            
            }
          }
        }
      }
  
      morePosts: posts(sort: "date:desc", filters: {slug: {eq: $where_ne}}) {
        data {
          attributes {
             title
            slug
            excerpt
            date
            coverImage {
              data {
                attributes {
                  url
                }
              }
            }
            author {
              data {
                attributes {
                  name
                  picture {
                    data {
                      attributes {
                        url
                      }
                    }
                  }
                }
              }
            }   
          }
        }
      }
    }
  `,
    {
      preview,
      variables: {
        where: slug,
        where_ne: slug,
      },
    }
  )
  return data
}
