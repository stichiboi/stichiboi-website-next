import {Toggle} from "../common/toggle/Toggle";
import {EditPencil, Erase, Settings as SettingsIcon} from "iconoir-react";
import {Popup} from "../common/popup/Popup";
import {Slider} from "../common/slider/Slider";
import {useEventListener} from "../common/hooks/useEventListener";
import {Dispatch, SetStateAction, useCallback, useMemo} from "react";
import styles from "./saveForm.module.css";

interface SettingsProps {
    brushSize: number,
    onBrushSizeChange: Dispatch<SetStateAction<number>>,
    onIsEraseChange: Dispatch<SetStateAction<boolean>>,
    material: string,
    onMaterialChange: (v: string) => unknown,
    onPause: Dispatch<SetStateAction<boolean>>
}

const MAX_BRUSH_SIZE = 9;
const MIN_BRUSH_SIZE = 1;

export function Settings({
  brushSize,
  onBrushSizeChange,
  onIsEraseChange,
  material,
  onMaterialChange,
  onPause
}: SettingsProps) {


  // use a wrapper so it also toggles the eraser off
  const changeMaterial = useCallback((material: string) => {
    onMaterialChange(material);
    onIsEraseChange(false);
  }, [onIsEraseChange, onMaterialChange]);

  useEventListener("keyup", (ev) => {
    const target = ev.target as HTMLInputElement
    if (target.tagName === "INPUT" && target.type === "text") {
      return;
    }
    const {key} = ev as KeyboardEvent;
    switch (key.toLowerCase()) {
    case "s":
      changeMaterial("sand");
      break;
    case "w":
      changeMaterial("water");
      break;
    case "t":
      changeMaterial("wall");
      break;
    case "backspace":
    case "delete":
    case "enter":
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
  });

  const radioButtons = useMemo(() => {
    const materials = [["sand", "s"], ["water", "w"], ["wall", "t"]];
    return materials.map(([name, shortcut]) => {
      const id = `element-${name}`
      return (
        <div key={name} className={styles.radioContainer} title={`Shortcut: ${shortcut}`}>
          <input
            type={"radio"}
            name={"stichisand-element"}
            value={name}
            id={id}
            checked={material === name}
            onChange={() => changeMaterial(name)}
          />
          <label htmlFor={id}>{name}</label>
        </div>
      )
    })
  }, [material, changeMaterial]);

  return (
    <Popup label={<SettingsIcon/>} containerClassName={styles.popup}>
      <Toggle saveKey={"stichisand-erase"}
        onToggle={onIsEraseChange}
        leftIcon={<EditPencil/>}
        rightIcon={<Erase/>}
        tooltip={"Shortcut: Enter / Delete / Backspace"}
      />
      <Slider label={<label className={styles.label}>{"Brush Size"}</label>}
        defaultValue={brushSize}
        id={"stichisand-brush-size"}
        min={MIN_BRUSH_SIZE}
        max={MAX_BRUSH_SIZE}
        step={1}
        onChange={onBrushSizeChange}
        showValue
        tooltip={"Shortcut: Scroll Wheel"}
      />
      <div className={styles.materials}>
        {radioButtons}
      </div>
    </Popup>
  );
}