import { useState, useEffect, useCallback } from "react";
import { EyeCanvas } from "./components/EyeCanvas";
import { ProfilePage } from "./components/ProfilePage";

export function App() {
  const [phase, setPhase] = useState<"idle" | "opening" | "dolby" | "profile">("idle");

  useEffect(() => {
    const t = setTimeout(() => setPhase("opening"), 600);
    return () => clearTimeout(t);
  }, []);

  const handleEyeOpened = useCallback(() => {
    setTimeout(() => setPhase("dolby"), 600);
  }, []);

  const handleZoomComplete = useCallback(() => {
    setPhase("profile");
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {phase !== "profile" && (
        <EyeCanvas
          phase={phase}
          onEyeOpened={handleEyeOpened}
          onZoomComplete={handleZoomComplete}
        />
      )}
      {phase === "profile" && <ProfilePage />}
    </div>
  );
}
