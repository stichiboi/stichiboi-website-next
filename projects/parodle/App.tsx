import useSWR from "swr";
import {Parodle} from "./components/Parodle";
import LoadingScreen from "../../components/LoadingScreen";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function App() {
    const {data, error} = useSWR<{ words: string[] }>('/api/parodle/words', fetcher);

    if (error) return <div>Failed to load</div>;

    if (data) {
        return <Parodle words={data.words}/>
    }

    return (
        <LoadingScreen isLoading={!data}/>
    );
}