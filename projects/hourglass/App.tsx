import {useState} from "react";
import {Simulation} from "./Simulation";
import {Settings} from "./Settings";


export function App(): JSX.Element {

    const [brushRadius, setBrushRadius] = useState(3);
    const [isErase, setIsErase] = useState(false);


    return (
        <div>
            <Settings onBrushSizeChange={setBrushRadius} onIsEraseChange={setIsErase}/>
            <Simulation isErase={isErase} brushRadius={brushRadius}/>
        </div>
    )
}