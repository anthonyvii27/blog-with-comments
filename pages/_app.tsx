import Head from 'next/head';
import type { AppProps } from 'next/app';
import '../public/style/main.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>NextJS Blog</title>
            </Head>

            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
