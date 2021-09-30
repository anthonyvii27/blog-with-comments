// eslint-disable-next-line @next/next/no-document-import-in-page
import NextDocument, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

export default class MyDocument extends NextDocument {
    static getInitialProps(ctx: DocumentContext) {
        return NextDocument.getInitialProps(ctx)
    }

    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta charSet="utf-8" />
                    <meta 
                        name="description" 
                        content="NextJS blog with comments" 
                    />
                </Head>

                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}