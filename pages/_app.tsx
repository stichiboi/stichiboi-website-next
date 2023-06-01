import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LoadingScreen from "../components/LoadingScreen";
import { MouseTrail } from "@stichiboi/react-elegant-mouse-trail";


const BASE_LOAD_TIME = 0;//1300;


function MyApp({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => setIsLoading(false), BASE_LOAD_TIME + Math.random() * 1000);
  }, []);

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    }
    const handleStop = () => {
      setIsLoading(false);
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router]);

  return (
    <>
      <LoadingScreen isLoading={isLoading}/>
      <Component {...pageProps} />
      <MouseTrail/>
    </>
  )
}

export default MyApp
