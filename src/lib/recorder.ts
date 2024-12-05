import { hidePluginWindow } from "./utils";
import { v4 as uuid } from "uuid";

let mediaRecorder: MediaRecorder;
let videoTransferFileName: string | undefined;

export const StartRecording = async (onSources: {
  screen: string;
  id: string;
  audio: string;
}) => {
  hidePluginWindow(true);

  videoTransferFileName = `${uuid()}-${onSources?.id.slice(0, 8)}.webm`;
  mediaRecorder?.start(1000);
};

export const onStopRecording = () => mediaRecorder.stop();
