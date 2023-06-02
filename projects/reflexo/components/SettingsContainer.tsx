import { useContext } from "react";
import { SettingsContext } from "./SettingsContext";
import { Settings } from "iconoir-react";
import Popup from "./Popup";
import { Stepper } from "../../common/stepper/Stepper";
import { Minus, Plus } from "iconoir-react";
import { ButtonCTA } from "../../common/button/ButtonCTA";

const NUM_TRIES_KEY = 'reflexo-num-tries';

interface SettingsContainerProps {
  clearLocalScore: () => void
}

export default function SettingsContainer({
  clearLocalScore
}: SettingsContainerProps) {

  const { setNumberOfTries } = useContext(SettingsContext);
  return (
    <Popup label={<Settings/>}>
      <Stepper
        label={"Number of tries"}
        saveKey={NUM_TRIES_KEY}
        onChange={setNumberOfTries}
        min={3}
        leftIcon={<Minus/>}
        rightIcon={<Plus/>}
      />
      <ButtonCTA onClick={clearLocalScore}>
        {"Reset best score"}
      </ButtonCTA>
    </Popup>
  )
}