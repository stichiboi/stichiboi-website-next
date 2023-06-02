import { App } from "../projects/sudoku/App";
import Head from "next/head";
import { Lato } from "next/font/google";

const lato = Lato({ subsets: ["latin"], weight: ["100", "400", "700"] });

export default function SudokuPage() {
  return (
    <main className={lato.className}>
      <Head>
        <title>{"Sudoku"}</title>
        <meta name="description" content="Self-inflicted homework for adults"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
      </Head>
      <App/>
    </main>
  );
}