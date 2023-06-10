import { App } from "../projects/silenciometer/App";
import Head from "next/head";
import { Lato } from "next/font/google";

const lato = Lato({ subsets: ["latin"], weight: ["100", "400", "700"] });

export default function SilenciometerPage(): JSX.Element {
  return (
    <main className={lato.className}>
      <Head>
        <title>{"Silenciometer"}</title>
        <meta name="description" content="Quiet! I'm trying to figure out what noise does a giraffe make"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
      </Head>
      <App/>
    </main>
  )
}