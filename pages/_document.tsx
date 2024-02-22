import {Html, Head, Main, NextScript} from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link
          href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&family=Lato:wght@100;400&display=swap"
          rel="stylesheet"/>
        <link rel={"icon"} href={"/favicon.ico"}/>
        <link rel="manifest" href="/manifest.json"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png"/>
        <meta name={"og:image"} content={"/social_media_preview.png"}/>
        <meta name={"og:image:alt"} content={"I make stuff because it's fun"}/>
      </Head>
      <body>
      <Main/>
      <NextScript/>
      </body>
    </Html>
  );
}