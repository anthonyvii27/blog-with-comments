import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Link from 'next/link';

import { IPostList } from '../interfaces/IPosts';
import { getAllPosts } from '../lib/getPosts';

const Home: NextPage = ({ allPosts }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <main>
            {allPosts?.length ? 
                allPosts?.map((post: IPostList) => (
                    <article key={post?.slug}>
                        <Link href={`/posts/${post?.slug}`}>
                            <a>{post?.title}</a>
                        </Link>

                        <p>{post?.author}</p>

                        <time>{post?.date}</time>
                    </article>
                ))
                
                : <p>Nenhum post publicado até o momento</p>
            }
        </main>
    );
}

export default Home;

export const getStaticProps: GetStaticProps = async () => {
    const allPosts = getAllPosts(['slug', 'title', 'author', 'date']);

    return {
        props: { allPosts },
    }
}