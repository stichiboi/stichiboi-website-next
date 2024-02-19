import {App} from "../projects/stichisand/App";
import Head from "next/head";
import {Lato} from "next/font/google";
import {NextPage} from "next";
import {RootAppComponentProps} from "./_app";

const lato = Lato({subsets: ["latin"], weight: ["100", "400", "700"]});

const StichiSandPage: NextPage<RootAppComponentProps> = ({lockLoading}) => {
  return (
    <main className={lato.className}>
      <Head>
        <title>{"Stichisand"}</title>
        <meta name="description" content="Analog? Digital? How about primitive..."/>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
      </Head>
      <App lockLoading={lockLoading}/>
    </main>
  );
}

export default StichiSandPage;