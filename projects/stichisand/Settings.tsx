import {Toggle} from "../common/toggle/Toggle";
import {EditPencil, Erase, Settings as SettingsIcon} from "iconoir-react";
import {Popup} from "../common/popup/Popup";
import {Slider} from "../common/slider/Slider";
import {useEventListener} from "../common/hooks/useEventListener";
import {Dispatch, SetStateAction, useCallback} from "react";
import styles from "./saveForm.module.css";

interface SettingsProps {
    onBrushSizeChange: Dispatch<SetStateAction<number>>,
    onIsEraseChange: Dispatch<SetStateAction<boolean>>,
    onMaterialChange: (v: string) => unknown,
    onPause: Dispatch<SetStateAction<boolean>>
}

const MAX_BRUSH_SIZE = 9;
const MIN_BRUSH_SIZE = 1;

export function Settings({onBrushSizeChange, onIsEraseChange, onMaterialChange, onPause}: SettingsProps) {


    // use a wrapper so it also toggles the eraser off
    const changeMaterial = useCallback((material: string) => {
        onMaterialChange(material);
        onIsEraseChange(false);
    }, []);

    useEventListener("keyup", (ev) => {
        const {key} = ev as KeyboardEvent;
        switch (key) {
            case "s":
                changeMaterial("sand");
                break;
            case "w":
                changeMaterial("water");
                break;
            case "t":
                changeMaterial("wall");
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
            return Math.min(MAX_BRUSH_SIZE, Math.max(MIN_BRUSH_SIZE, next));
        })

    })

    return (
        <Popup label={<SettingsIcon/>} containerClassName={styles.popup}>
            <Toggle saveKey={"stichisand-erase"}
                    onToggle={onIsEraseChange}
                    leftIcon={<EditPencil/>}
                    rightIcon={<Erase/>}
            />
            <Slider label={<label className={styles.label}>{"Brush Size"}</label>}
                    defaultValue={4}
                    id={"stichisand-brush-size"}
                    min={MIN_BRUSH_SIZE}
                    max={MAX_BRUSH_SIZE}
                    step={1}
                    onChange={onBrushSizeChange}
                    showValue
            />
        </Popup>
    );
}