import {Toggle} from "../common/toggle/Toggle";
import {EditPencil, Erase, Settings as SettingsIcon} from "iconoir-react";
import {Popup} from "../common/popup/Popup";
import {Slider} from "../common/slider/Slider";
import {useEventListener} from "../common/hooks/useEventListener";

interface SettingsProps {
    onBrushSizeChange: (v: number) => unknown,
    onIsEraseChange: (v: boolean) => unknown,
    onMaterialChange: (v: string) => unknown
}

export function Settings({onBrushSizeChange, onIsEraseChange, onMaterialChange}: SettingsProps) {

    useEventListener("keyup", (ev) => {
        const {key} = ev as KeyboardEvent;
        console.log(key);
        switch (key) {
            case "s":
                onMaterialChange("sand");
                break;
            case "w":
                onMaterialChange("water");
                break;
            case "t":
                onMaterialChange("wall");
                break;
            case "Backspace":
            case "Delete":
                onIsEraseChange(true);
                break;
            case "Enter":
                onIsEraseChange(false);
                break;
        }
    });


    return (
        <Popup label={<SettingsIcon/>}>
            <Toggle saveKey={"hourglass-erase"} onToggle={onIsEraseChange} leftIcon={<EditPencil/>}
                    rightIcon={<Erase/>}/>
            <Slider label={"Brush Size"}
                    defaultValue={3}
                    id={"hourglass-brush-size"}
                    min={1}
                    max={6}
                    step={1}
                    onChange={onBrushSizeChange}/>
        </Popup>
    );
}