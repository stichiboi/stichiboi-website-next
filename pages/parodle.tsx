import {App} from "../projects/parodle/App";
import Head from "next/head";
import {Lato} from "next/font/google";
import {NextPage} from "next";
import {RootAppComponentProps} from "./_app";

const lato = Lato({subsets: ["latin"], weight: ["100", "400", "700"]});

const ParodlePage: NextPage<RootAppComponentProps> = ({lockLoading}) => {
  return (
    <main className={lato.className}>
      <Head>
        <title>{"Parodle"}</title>
        <meta name="description" content="Wordle but with parole (it's in italian)"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/parodle-apple-touch-icon.png"/>
        <link rel="icon" href={"/parodle-favicon.ico"}/>
      </Head>
      <App lockLoading={lockLoading}/>
    </main>
  );
}

export default ParodlePage;