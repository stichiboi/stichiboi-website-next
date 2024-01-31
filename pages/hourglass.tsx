import { App } from "../projects/hourglass/App";
import Head from "next/head";
import { Lato } from "next/font/google";

const lato = Lato({ subsets: ["latin"], weight: ["100", "400", "700"] });

export default function HourglassPage() {
  return (
    <main className={lato.className}>
      <Head>
        <title>{"Hourglass"}</title>
        <meta name="description" content="Analog? Digital? How about primitive..."/>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
      </Head>
      <App/>
    </main>
  );
}