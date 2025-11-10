"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { useRouter } from "next/navigation";
import { useAgentStore } from "../../../store/agentStore";
import { toast } from "sonner";

export default function Scan() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraScannerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraPermission, setCameraPermission] = useState<string | null>(null); // Added for permission tracking
  const router = useRouter();
  const { acceptInvitationUrl } = useAgentStore();

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Check permission status before requesting camera access
      navigator.permissions.query({ name: "camera" }).then((permissionStatus) => {
        setCameraPermission(permissionStatus.state);
        if (permissionStatus.state !== "denied") {
          navigator.mediaDevices
            .getUserMedia({
              video: {
                facingMode: "environment",
              },
            })
            .then((stream: MediaStream) => {
              setCameraStream(stream);
              setCameraPermission("granted"); // Update permission state on success
              const cameraElement = videoRef.current;
              if (cameraElement) {
                cameraElement.srcObject = stream;
                cameraElement.onloadedmetadata = () => {
                  cameraElement.play();
                };
              }
            })
            .catch((error: DOMException) => {
              console.error("Error accessing the camera:", error);
              setCameraPermission("denied"); // Update permission state on failure
            });
        }
      }).catch((error) => {
        console.error("Permission check failed:", error);
        setCameraPermission("denied");
      });
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
              const codeString = codeData.data;
              console.log("code string", codeString);
              stopCamera(cameraStream);
              if (cameraScannerIntervalRef.current) {
                clearInterval(cameraScannerIntervalRef.current);
              }
              // Verify if the codeString is a valid URL
              const isValidUrl = (url: string) => {
                try {
                  new URL(url);
                  return true;
                } catch (e) {
                  return false;
                }
              };
              if (isValidUrl(codeString)) {
                toast.success("QR code scanned successfully!");
                try {
                  await acceptInvitationUrl(codeString);
                  toast.success("Credential added successfully.");
                  router.push("/dashboard/credentials");
                } catch (error) {
                  console.error("Error adding credential:", error);
                  toast.error("Failed to add credential. Please try again.");
                }
              } else {
                toast.error("Invalid QR code. Please try again.");
              }
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
  }, [cameraStream, router, acceptInvitationUrl]);

  // Render permission denied message if access is blocked
  if (cameraPermission === "denied") {
    return (
      <div className="text-white p-4">
        <p>Camera access is denied. Please enable it in your iOS settings:</p>
        <ol className="list-decimal ml-4">
          <li>Go to Settings &gt; Safari &gt; Camera</li>
          <li>Set to &quot;Ask&quot; or &quot;Allow&quot;</li>
          <li>Reload the app</li>
        </ol>
      </div>
    );
  }

  return (
    <div className="bg-black" style={{ height: "calc(var(--vh, 1vh) * 100)" }}>
      <h1 className="text-white text-xl p-4">Scan Page</h1>
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
