"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios"; // Make sure axios is imported
import jsQR from "jsqr"; // Ensure jsQR is installed and imported correctly

export default function Scan() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraScannerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: "environment",
          },
        })
        .then((stream: MediaStream) => {
          setCameraStream(stream);
          const cameraElement = videoRef.current;
          if (cameraElement) {
            cameraElement.srcObject = stream;
            cameraElement.onloadedmetadata = () => {
              cameraElement.play();
            };
          }
        })
        .catch((error: DOMException) =>
          console.error("Error accessing the camera:", error)
        );
    } else {
      alert("getUserMedia() is not supported by your browser.");
    }
  }, []);

  useEffect(() => {
    const cameraElement = videoRef.current;
    const canvasElement = canvasRef.current;
    if (cameraElement && canvasElement) {
      cameraElement.onloadeddata = () => {
        cameraScannerIntervalRef.current = setInterval(async () => {
          if (cameraElement.videoWidth > 0 && cameraElement.videoHeight > 0) {
            const canvas = canvasElement;
            canvas.width = cameraElement.videoWidth;
            canvas.height = cameraElement.videoHeight;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            if (!ctx) return;

            ctx.drawImage(cameraElement, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            const codeData = jsQR(
              imageData.data,
              imageData.width,
              imageData.height
            );

            if (codeData) {
              console.log("code data", codeData);
              // let url = codeData.data;
              // try {
              //   const { data } = await axios.get(`${codeData.data}/fetch`);
              //   url = data.long_url;
              // } catch (err) {
              //   console.error("Error fetching URL:", err);
              //   return;
              // }
              // const { search, searchParams } = new URL(url);
              // if (searchParams.get("_oob")) {
              //   console.log("search", search);
              //   if (cameraElement) {
              //     cameraElement.pause();
              //   }
              // } else {
              //   console.error(
              //     new Error(`oob not found on ${JSON.stringify(searchParams)}`),
              //     {
              //       componentStack: "scanner",
              //       digest: "on fetching URL params",
              //     }
              //   );
              // }
            }
          }
        }, 1000);
      };
    }

    const stopCamera = (cameraStream: MediaStream | null) => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };

    return () => {
      if (cameraScannerIntervalRef.current) {
        clearInterval(cameraScannerIntervalRef.current);
      }
      stopCamera(cameraStream);
    };
  }, [cameraStream]);

  return (
    <div className="bg-black min-h-screen">
      <h1 className="text-white text-4xl p-4">Scan Page</h1>
      <video
        ref={videoRef}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        playsInline
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
