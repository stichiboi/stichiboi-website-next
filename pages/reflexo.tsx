import { App } from "../projects/reflexo/App";
import Head from "next/head";
import { Lato } from "next/font/google";

const lato = Lato({ subsets: ["latin"], weight: ["100", "400", "700"] });

export default function ReflexoPage() {
  return (
    <main className={lato.className}>
      <Head>
        <title>{"Reflexo"}</title>
        <meta name="description" content="Cats can react in less than 100ms. How fast are you?"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
      </Head>
      <App/>
    </main>
  );
}