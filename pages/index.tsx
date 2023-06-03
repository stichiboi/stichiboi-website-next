import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Hero from "../components/Hero";
import Intro from "../components/Intro";
import Projects from "../components/Projects";
import { useCallback, useEffect, useState } from "react";
import { Footer } from "../components/Footer";

const colorLight = "#FFF";
const colorDark = "#05080c";

const SECTION_COLORS = [
  colorLight, // hero
  colorDark, // intro
  colorLight, // projects
  colorDark, // footer
].reverse(); // reverse so it matches the search order
const Home: NextPage = () => {

  const [sections, setSections] = useState<(HTMLElement | null)[]>([])

  const [themeColor, setThemeColor] = useState<string>(SECTION_COLORS[0]);

  const changeColor = useCallback(() => {
    // note: sections need to be searched in reverse
    // -> the section with negative top closest to 0 should be the first to be checked
    const index = sections.findIndex(section => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top < 1) {
        return true;
      }
    }) || 0;
    setThemeColor(SECTION_COLORS[index]);
  }, [sections]);

  useEffect(() => {
    // sections are reversed for performance improvements
    setSections([
      document.getElementById("hero"),
      document.getElementById("intro"),
      document.getElementById("projects"),
      document.getElementById("footer"),
    ].reverse());
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", changeColor);
    return () => window.removeEventListener("scroll", changeColor);
  }, [changeColor]);

  useEffect(() => {
    document.body.style.backgroundColor = themeColor;
  }, [themeColor]);

  return (
    <main className={styles.container}>
      <Head>
        <title>{"Stichiboi | Creative Developer"}</title>
        <meta name="description" content="Making tools for people since 2018"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
        {/*<meta name="theme-color" content={themeColor}/>*/}
      </Head>
      <Hero/>
      <Intro/>
      <Projects/>
      <Footer/>
    </main>
  )
}

export default Home;
