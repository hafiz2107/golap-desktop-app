/* eslint-disable @typescript-eslint/no-unused-vars */
import { hidePluginWindow } from "./utils";
import { v4 as uuid } from "uuid";
import io from "socket.io-client";

let mediaRecorder: MediaRecorder;
let videoTransferFileName: string | undefined;
let userId: string;

const socket = io(import.meta.env.VITE_SOCKET_URL as string);

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

const stopRecording = () => {
  hidePluginWindow(false);
  socket.emit("process-video", {
    filename: videoTransferFileName,
    userId,
  });
};

export const onDataAvailable = (e: BlobEvent) => {
  socket.emit("video-chunks", {
    chunks: e.data,
    filename: videoTransferFileName,
  });
};

export const selectSources = async (
  onSources: {
    screen: string;
    audio: string;
    id: string;
    preset: "HD" | "SD";
  },
  videoElement: React.RefObject<HTMLVideoElement>
) => {
  if (onSources && onSources.screen && onSources.audio && onSources.id) {
    const constraints: any = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: onSources.screen,
          minWidth: onSources.preset === "HD" ? 1920 : 1280,
          maxWidth: onSources.preset === "HD" ? 1920 : 1280,
          minHeight: onSources.preset === "HD" ? 1080 : 720,
          maxHeight: onSources.preset === "HD" ? 1080 : 720,
          frameRate: 60,
        },
      },
    };

    userId = onSources.id;
    //Creating the stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    //Audio and webcam stream
    const audioStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: onSources?.audio
        ? {
            deviceId: { exact: onSources.audio },
          }
        : false,
    });
    if (videoElement && videoElement.current) {
      videoElement.current.srcObject = stream;
      await videoElement.current.play();
    }

    const combinedStream = new MediaStream([
      ...stream.getTracks(),
      ...audioStream.getTracks(),
    ]);

    mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType: "video/webm; codecs=vp9",
    });

    mediaRecorder.ondataavailable = onDataAvailable;
    mediaRecorder.onstop = stopRecording;
  }
};
