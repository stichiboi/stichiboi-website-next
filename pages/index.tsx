import type {NextPage} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Hero from "../components/Hero";
import Intro from "../components/Intro";
import Projects from "../components/Projects";
import {useCallback, useEffect, useMemo, useState} from "react";

const Home: NextPage = () => {

    const [sections, setSections] = useState<(HTMLElement | null)[]>([])
    const [activeSection, setActiveSection] = useState(0);
    const SECTION_COLORS = useMemo(() => ([
        "transparent",
        "#FFA693",
        "red"
    ]), []);

    const changeColor = useCallback(() => {
        const yScroll = window.scrollY || window.pageYOffset;
        //Note: sections need to be searched in reverse
        // -> the section with highest .top should be the first to be checked
        const index = sections.findIndex(section => {
            if (!section) return;
            const rect = section.getBoundingClientRect();
            if (yScroll > rect.top) {
                return true;
            }
        }) || 0;
        //SECTION_COLORS are not in reverse
        setActiveSection(sections.length - 1 - index);
    }, [sections]);

    useEffect(() => {
        //Sections are reversed for performance improvements
        setSections([
            document.getElementById("home"),
            document.getElementById("mountains"),
            document.getElementById("projects")
        ].reverse());
    }, []);

    useEffect(() => {
        document.getElementById("home")?.style
            .setProperty("background-color", SECTION_COLORS[activeSection || 0]);
    }, [SECTION_COLORS, activeSection]);

    useEffect(() => {
        window.addEventListener("scroll", () => changeColor());

        return window.removeEventListener("scroll", () => changeColor());
    }, [changeColor]);

    return (
        <div className={styles.container}>
            <Head>
                <title>{"Stichiboi | Creative Developer"}</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
            </Head>
            <main id={"home"} className={styles.main}>
                <Hero/>
                <Intro/>
                <Projects/>
            </main>
        </div>
    )
}

export default Home;
