import {Toggle} from "../common/toggle/Toggle";
import {EditPencil, Erase, Settings as SettingsIcon} from "iconoir-react";
import {Popup} from "../common/popup/Popup";
import {Slider} from "../common/slider/Slider";
import {useEventListener} from "../common/hooks/useEventListener";
import {Dispatch, SetStateAction} from "react";

interface SettingsProps {
    onBrushSizeChange: Dispatch<SetStateAction<number>>,
    onIsEraseChange: Dispatch<SetStateAction<boolean>>,
    onMaterialChange: (v: string) => unknown,
    onPause: Dispatch<SetStateAction<boolean>>
}

export function Settings({onBrushSizeChange, onIsEraseChange, onMaterialChange, onPause}: SettingsProps) {

    useEventListener("keyup", (ev) => {
        const {key} = ev as KeyboardEvent;
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
            case "Enter":
                onIsEraseChange(prev => !prev);
                break;
            case " ":
                onPause(prev => !prev);
                break;
        }
    });

    useEventListener("wheel", (ev) => {
        const {deltaY} = ev as WheelEvent;
        onBrushSizeChange(prev => {
            let next = prev;
            if (deltaY > 0) {
                next++;
            } else {
                next--;
            }
            // clip between 10 and 1
            return Math.min(10, Math.max(1, next));
        })

    })

    return (
        <Popup label={<SettingsIcon/>}>
            <Toggle saveKey={"stichisand-erase"} onToggle={onIsEraseChange} leftIcon={<EditPencil/>}
                    rightIcon={<Erase/>}/>
            <Slider label={"Brush Size"}
                    defaultValue={3}
                    id={"stichisand-brush-size"}
                    min={1}
                    max={6}
                    step={1}
                    onChange={onBrushSizeChange}/>
        </Popup>
    );
}