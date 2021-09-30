import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import { useState } from 'react';
import Head from 'next/head';

import { getAllPosts, getPostBySlug } from '../../lib/getPosts';
import markdownToHtml from '../../lib/parseMarkdownToHTML';

import { IPost } from '../../interfaces/IPosts';

const Post = ({ post }: InferGetStaticPropsType<typeof getStaticProps>) => {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [text, setText] = useState('');

    if (!router.isFallback && !post?.slug) {
        return <ErrorPage statusCode={404} />
    }

    async function createComment(e: any) {
        e.preventDefault();

        try {
            await fetch(`/api/comment?slug=${post?.slug}`, {
                method: 'POST',
                body: JSON.stringify({ username, text }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        } catch(_) {
            throw new Error('Unexpected error occurred')
        }
    }

    return (
        <main>
            <Head>
                <title>
                    {`${post?.title} | NextJS Blog`}
                </title>
            </Head>

            {router.isFallback 
                ? <div>Loading…</div>
                : <div>
                    <article>
                        <header>
                            <h1>
                                {post?.title}
                            </h1>
                            
                            <p>{post?.author}</p>
                            
                            <time>
                                {post?.date}
                            </time>
                        </header>

                        <div
                            className="prose mt-10"
                            dangerouslySetInnerHTML={{ __html: post?.content }}
                        />
                    </article>

                    <form onSubmit={createComment}>
                        <input type="text" placeholder="Seu nome" onChange={e => setUsername(e.target.value)} />
                        <input type="text" placeholder="Comentário" onChange={e => setText(e.target.value)} />

                        <button type="submit">Enviar</button>
                    </form>
                </div>
            }
        </main>
    );
}

export default Post;


export const getStaticProps: GetStaticProps = async ({ params }) => {
    const post: IPost = getPostBySlug(params?.slug as string, [
        'slug',
        'title',
        'author',
        'date',
        'content',
    ]);

    if (!post.content) {
        return {
            notFound: true,
        }
    }
    
    const content = await markdownToHtml(post.content || '')

    return {
        props: {
            post: {
                ...post,
                content,
            },
        },
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = getAllPosts(['slug']);

    return {
        paths: posts.map(({ slug }) => {
            return {
                params: {
                    slug,
                },
            }
        }),
        fallback: false,
    }
}