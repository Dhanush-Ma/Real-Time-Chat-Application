import React, { useEffect, useRef, useState } from "react";
import { formatSeconds } from "../utils/utils";

const AudioRecorder = ({ sendMessage, setShowAudioRecordModal }) => {
  const [isRecording, setIsRecording] = useState<{ duration: number } | false>(
    false
  );
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Array<Blob>>([]);

  useEffect(() => {
    let interval: any;

    if (isRecording) {
      interval = setInterval(() => {
        setIsRecording({ duration: isRecording.duration + 1 });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/mp3" });
        console.log(audioBlob);
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Audio = event.target?.result;
          if (base64Audio) {
            console.log(base64Audio.toString());
            sendMessage(base64Audio.toString(), "audio");
            setShowAudioRecordModal(false);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording({ duration: 0 });
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen text-white">
      {isRecording ? (
        <button onClick={stopRecording}>
          <p className="font-bold text-2xl">
            {formatSeconds(isRecording.duration)}
          </p>{" "}
          Stop Recording
        </button>
      ) : (
        <button onClick={startRecording}>Start Recording</button>
      )}
    </div>
  );
};

export default AudioRecorder;
