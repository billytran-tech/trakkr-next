import { GetStaticPaths, GetStaticProps } from 'next';

import Footer from 'components/home/Footer';
import Head from 'next/head';
import Link from 'next/link';

interface Props {
  content: {
    attributes: { title: string; image: string; slug: string };
    html: string;
  };
}

const BlogDetailPage: React.FC<Props> = ({ content }) => {
  const { title, image } = content.attributes;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:image" content={image} />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="pb-32 bg-gray-900">
          <header className="container py-16 mx-auto md:py-24">
            <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
              <h1 className="text-4xl font-bold leading-9 text-center text-white">
                {title}
              </h1>
            </div>
          </header>
        </div>

        <main className="pb-16 mx-auto -mt-32 md:px-6 lg:px-32">
          <div className="max-w-4xl px-4 pb-12 mx-auto sm:px-6 lg:px-8">
            <div>
              <nav className="sm:hidden">
                <Link
                  href="/blog"
                  className="flex items-center mb-2 text-sm font-medium leading-5 text-gray-200 transition duration-150 ease-in-out hover:text-white"
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 mr-1 -ml-1 text-gray-200"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Back
                </Link>
              </nav>
              <nav className="items-center hidden mb-2 text-sm font-medium leading-5 sm:flex">
                <Link
                  href="/"
                  className="text-gray-200 transition duration-150 ease-in-out hover:text-white"
                >
                  Home
                </Link>
                <svg
                  className="flex-shrink-0 w-5 h-5 mx-2 text-gray-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <Link
                  href="/blog"
                  className="text-gray-200 transition duration-150 ease-in-out hover:text-white"
                >
                  Blogs
                </Link>
              </nav>
            </div>
            <div className="px-8 py-8 text-lg bg-white rounded-lg shadow-xl md:py-12">
              <article
                className="mx-auto overflow-hidden prose lg:prose-lg"
                dangerouslySetInnerHTML={{ __html: content.html }}
              ></article>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const content = await import(`../../content/posts/${params?.slug}.md`);

  return { props: { content: content.default } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const postSlugs = ((context) => {
    const keys = context.keys();
    const data = keys.map((key) => {
      //eslint-disable-next-line
      const slug = key.replace(/^.*[\\\/]/, '').slice(0, -3);

      return slug;
    });
    return data;
  })(require.context('../../content/posts', true, /\.md$/));

  const paths = postSlugs.map((slug) => {
    return `/blog/${slug}`;
  });

  return {
    paths,
    fallback: false,
  };
};

export default BlogDetailPage;
