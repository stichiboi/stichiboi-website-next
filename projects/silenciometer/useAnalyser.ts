import { useEffect, useState } from "react";

export function useAnalyser() {
  const [analyser, setAnalyser] = useState<AnalyserNode>();
  useEffect(() => {
    navigator.mediaDevices
      ?.getUserMedia({
        video: false,
        audio: {
          suppressLocalAudioPlayback: false,
          noiseSuppression: true
        }
      })
      .then((stream) => {
        const audioContext = new AudioContext({ latencyHint: "interactive" });
        const microphone = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        microphone.connect(analyser);
        setAnalyser(analyser);
      })
      .catch((err: DOMException) => {
        console.error(err.name, err.message, err.cause);
      });
  }, []);
  return analyser;
}