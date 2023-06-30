import { App } from "../projects/parodle/App";
import Head from "next/head";
import { Lato } from "next/font/google";

const lato = Lato({ subsets: ["latin"], weight: ["100", "400", "700"] });

export default function ParodlePage() {
  return (
    <main className={lato.className}>
      <Head>
        <title>{"Parodle"}</title>
        <meta name="description" content="Wordle but with parole (it's in italian)"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
      </Head>
      <App/>
    </main>
  );
}