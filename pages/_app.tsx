import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {useCallback, useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import LoadingScreen from "../components/LoadingScreen";
import {IconoirProvider} from "iconoir-react";

const MIN_LOAD_TIME = 1000;

export interface RootAppComponentProps {
    isLoading: boolean,
    lockLoading: (v: boolean) => unknown
}

function RootApp({Component, pageProps}: AppProps) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const isLoadingLockedRef = useRef(false);

    const stopLoading = useCallback(() => {
        setIsLoading(isLoadingLockedRef.current);
        if (isLoadingLockedRef.current) {
            setTimeout(stopLoading, MIN_LOAD_TIME / 5);
        }
    }, []);

    useEffect(() => {
        setTimeout(stopLoading, MIN_LOAD_TIME);
    }, [stopLoading]);

    useEffect(() => {
        let recentSwitch = false;
        const handleStart = () => {
            recentSwitch = true;
            setIsLoading(true);
            setTimeout(() => recentSwitch = false, MIN_LOAD_TIME);
        }
        const handleStop = () => {
            if (!recentSwitch && !isLoadingLockedRef.current) {
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
    }, [router, isLoadingLockedRef, setIsLoading]);

    return (
        <IconoirProvider
            iconProps={{
                // iOS sets the color of svg to blue by default
                color: "currentColor"
            }}>
            <LoadingScreen isLoading={isLoading}/>
            <Component {...pageProps} isLoading={isLoading} lockLoading={(v: boolean) => {
                isLoadingLockedRef.current = v;
            }}/>
        </IconoirProvider>
    )
}

export default RootApp
