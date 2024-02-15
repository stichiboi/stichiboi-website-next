import {useState} from "react";
import {Simulation} from "./Simulation";
import {Settings} from "./Settings";


export function App(): JSX.Element {

    const [brushRadius, setBrushRadius] = useState(3);
    const [isErase, setIsErase] = useState(false);
    const [material, setMaterial] = useState("sand");


    return (
        <div>
            <Settings onBrushSizeChange={setBrushRadius} onIsEraseChange={setIsErase} onMaterialChange={setMaterial}/>
            <Simulation isErase={isErase} brushRadius={brushRadius} material={material}/>
        </div>
    )
}