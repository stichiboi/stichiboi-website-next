import {Toggle} from "../common/toggle/Toggle";
import {EditPencil, Erase, Settings as SettingsIcon} from "iconoir-react";
import styles from "./settings.module.css";
import {Popup} from "../common/popup/Popup";
import {Slider} from "../common/slider/Slider";

interface SettingsProps {
    onBrushSizeChange: (v: number) => unknown,
    onIsEraseChange: (v: boolean) => unknown
}

export function Settings({onBrushSizeChange, onIsEraseChange}: SettingsProps) {
    return (
        <Popup label={<SettingsIcon/>} labelClassName={styles.container}>
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