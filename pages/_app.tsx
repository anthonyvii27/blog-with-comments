import type { AppProps, NextWebVitalsMetric } from 'next/app';
import Head from 'next/head';

import '@public/style/main.css';

export default function MyApp({ Component, pageProps }: AppProps) {
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

// export function reportWebVitals(metric: NextWebVitalsMetric) {
//     console.log(metric)
// }
