import type { SoundEffect } from "@/features/Stopwatch/useSoundEffect";
import { useEffect, useState } from "react";

type localStorageSettings = {
  breakTimeDivisor?: number;
  soundEffect?: SoundEffect;
  autoplay?: boolean;
  autoNextTask?: boolean;
  autoNextTaskOnComplete?: boolean;
  taskSectionVisible?: boolean;
  ringUntilDismissed?: boolean;
};

export default function useSettings() {
  const [breakTimeDivisor, setBreakTimeDivisor] = useState<number>(5);
  const [draftBreakTimeDivisor, setDraftBreakTimeDivisor] =
    useState(breakTimeDivisor);

  const [soundEffect, setSoundEffect] = useState<SoundEffect>("simple_chime");
  const [draftSoundEffect, setDraftSoundEffect] =
    useState<SoundEffect>("simple_chime");

  const [autoplay, setAutoplay] = useState<boolean>(false);
  const [draftAutoplay, setDraftAutoplay] = useState<boolean>(false);

  const [autoNextTask, setAutoNextTask] = useState<boolean>(false);
  const [draftAutoNextTask, setDraftAutoNextTask] = useState<boolean>(false);

  const [autoNextTaskOnComplete, setAutoNextTaskOnComplete] = useState<boolean>(false);
  const [draftAutoNextTaskOnComplete, setDraftAutoNextTaskOnComplete] = useState<boolean>(false);

  const [ringUntilDismissed, setRingUntilDismissed] = useState<boolean>(false);
  const [draftRingUntilDismissed, setDraftRingUntilDismissed] =
    useState<boolean>(false);

  const [taskSectionVisible, setTaskSectionVisible] = useState(true);

  useEffect(() => {
    const storedSettings = localStorage.getItem("flowtime_settings");
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      const parsedBreakTimeDivisor = parsedSettings["breakTimeDivisor"];
      setBreakTimeDivisor(parsedBreakTimeDivisor);
      setDraftBreakTimeDivisor(parsedBreakTimeDivisor);

      const parsedSoundEffect = parsedSettings["soundEffect"];
      setSoundEffect(parsedSoundEffect);
      setDraftSoundEffect(parsedSoundEffect);

      const parsedAutoplay = parsedSettings["autoplay"] || false;
      setAutoplay(parsedAutoplay);
      setDraftAutoplay(parsedAutoplay);

      const parsedAutoNextTask = parsedSettings["autoNextTask"] || false;
      setAutoNextTask(parsedAutoNextTask);
      setDraftAutoNextTask(parsedAutoNextTask);

      const parsedAutoNextTaskOnComplete = parsedSettings["autoNextTaskOnComplete"];
      setAutoNextTaskOnComplete(parsedAutoNextTaskOnComplete === true);
      setDraftAutoNextTaskOnComplete(parsedAutoNextTaskOnComplete === true);

      const parsedRingUntilDismissed =
        parsedSettings["ringUntilDismissed"] || false;
      setRingUntilDismissed(parsedRingUntilDismissed);
      setDraftRingUntilDismissed(parsedRingUntilDismissed);

      const parsedTaskVisibility = parsedSettings["taskSectionVisible"];
      setTaskSectionVisible(parsedTaskVisibility);
    }
  }, []);

  function updateTaskVisibility() {
    const currentSettings: localStorageSettings = {
      breakTimeDivisor: breakTimeDivisor,
      soundEffect: soundEffect,
      taskSectionVisible: !taskSectionVisible,
    };
    localStorage.setItem("flowtime_settings", JSON.stringify(currentSettings));
  }

  return {
    breakTimeDivisor,
    setBreakTimeDivisor,
    draftBreakTimeDivisor,
    setDraftBreakTimeDivisor,
    soundEffect,
    setSoundEffect,
    draftSoundEffect,
    setDraftSoundEffect,
    autoplay,
    setAutoplay,
    draftAutoplay,
    setDraftAutoplay,
    autoNextTask,
    setAutoNextTask,
    draftAutoNextTask,
    setDraftAutoNextTask,
    autoNextTaskOnComplete,
    setAutoNextTaskOnComplete,
    draftAutoNextTaskOnComplete,
    setDraftAutoNextTaskOnComplete,
    ringUntilDismissed,
    setRingUntilDismissed,
    draftRingUntilDismissed,
    setDraftRingUntilDismissed,
    taskSectionVisible,
    setTaskSectionVisible,
    updateTaskVisibility,
  };
}
