import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import LoadingScreen from "../components/LoadingScreen";
import {IconoirProvider} from "iconoir-react";

const MIN_LOAD_TIME = 1000;


function RootApp({Component, pageProps}: AppProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => setIsLoading(false), MIN_LOAD_TIME);
  }, []);

  useEffect(() => {
    let recentSwitch = false;
    const handleStart = () => {
      recentSwitch = true;
      setIsLoading(true);
      setTimeout(() => recentSwitch = false, MIN_LOAD_TIME);
    }
    const handleStop = () => {
      if (!recentSwitch) {
        setIsLoading(false);
      } else {
        // check at intervals
        setTimeout(handleStop, MIN_LOAD_TIME / 5);
      }
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
    <IconoirProvider
      iconProps={{
        // iOS sets the color of svg to blue by default
        color: "currentColor"
      }}>
      <LoadingScreen isLoading={isLoading}/>
      <Component {...pageProps} isLoading={isLoading}/>
    </IconoirProvider>
  )
}

export default RootApp
