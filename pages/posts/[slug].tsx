import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Head from 'next/head';

import { getAllPosts, getPostBySlug } from '@lib/getPosts';
import markdownToHtml from '@lib/parseMarkdownToHTML';
import { IPost } from '@interfaces/IPosts';

type Comment = {
    id: string,
    username: string,
    text: string,
    created_at: Date,
    slug: string
}

const Post = ({ post }: InferGetStaticPropsType<typeof getStaticProps>) => {
    const router = useRouter();

    const [commentsList, setCommentsList] = useState<any>([]);
    const [username, setUsername] = useState('');
    const [text, setText] = useState('');

    useEffect(() => {
        (async function () {
            const res = await fetch(`/api/comment?slug=${post?.slug}`, {
                method: 'GET'
            });

            res.json().then((comments ) => setCommentsList(comments));
        })();
    }, [post?.slug]);

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
            });

            router.reload();
            
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

                        <h1>Comentários</h1>

                        <section>
                            {commentsList?.comments?.map((comment: Comment) => (
                                <div key={comment.id}>
                                    <span>{comment.username} - {comment.created_at}</span>
                                    <p>{comment.text}</p>
                                </div>
                            ))}
                        </section>

                        <form onSubmit={createComment}>
                            <input type="text" placeholder="Seu nome" onChange={e => setUsername(e.target.value)} />
                            <input type="text" placeholder="Comentário" onChange={e => setText(e.target.value)} />

                            <button type="submit">Enviar</button>
                        </form>
                    </article>

                                       
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