import React, { useEffect, useState } from "react";
import { Play, Pause, RefreshCw, Bell } from "lucide-react";
import { TimerProps } from "../../types/recipe";

const Timer: React.FC<TimerProps> = ({
  timer,
  setTimer,
  timerActive,
  toggleTimer,
  resetTimer,
}) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  // Timer effect
  useEffect(() => {
    if (!timerActive || timer <= 0) {
      if (timerActive && timer <= 0) {
        setIsCompleted(true);
        setShowNotification(true);
        playAlertSound();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev: number) => {
        const newValue = Math.max(prev - 1, 0);
        if (newValue === 0) {
          setIsCompleted(true);
          setShowNotification(true);
          playAlertSound();
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timer, setTimer]);

  // Function to play a beep sound when timer completes
  const playAlertSound = () => {
    try {
      const audio = new Audio('/timer-complete.mp3');
      // Fallback to browser beep if audio file not available
      audio.onerror = () => {
        console.log("Timer complete!");
        // Visual notification will still show
      };
      audio.play();
    } catch (error) {
      console.error("Could not play alert sound:", error);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle setting custom time
  const handleSetTimer = (minutes: number) => {
    setTimer(minutes * 60);
    setIsCompleted(false);
    setShowNotification(false);
  };

  // Handle start/pause button
  const handleToggleTimer = () => {
    if (isCompleted) {
      resetTimer();
      setIsCompleted(false);
      setShowNotification(false);
    }
    toggleTimer();
  };

  // Handle reset
  const handleReset = () => {
    resetTimer();
    setIsCompleted(false);
    setShowNotification(false);
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-lg text-gray-800 mb-4">Timer</h3>
      
      {/* Timer display */}
      <div className={`flex justify-center text-4xl font-bold mb-5 ${isCompleted ? "text-red-500" : "text-gray-800"}`}>
        {formatTime(timer)}
      </div>
      
      {/* Timer notification */}
      {showNotification && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center justify-center">
          <Bell size={18} className="mr-2 animate-pulse" />
          <span className="font-medium">Time's up!</span>
        </div>
      )}
      
      {/* Timer controls */}
      <div className="flex justify-center space-x-3 mb-5">
        <button
          onClick={handleToggleTimer}
          className={`px-5 py-2 rounded-lg flex items-center ${
            isCompleted
              ? "bg-green-500 hover:bg-green-600 text-white"
              : timerActive
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          } transition-colors`}
        >
          {isCompleted ? (
            <RefreshCw size={18} className="mr-2" />
          ) : timerActive ? (
            <Pause size={18} className="mr-2" />
          ) : (
            <Play size={18} className="mr-2" />
          )}
          {isCompleted ? "Restart" : timerActive ? "Pause" : "Start"}
        </button>
        <button
          onClick={handleReset}
          className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center transition-colors"
        >
          <RefreshCw size={18} className="mr-2" />
          Reset
        </button>
      </div>
      
      {/* Preset time buttons */}
      <div className="grid grid-cols-5 gap-2">
        {[1, 5, 10, 15, 30].map((min) => (
          <button
            key={min}
            onClick={() => handleSetTimer(min)}
            className="py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
          >
            {min}m
          </button>
        ))}
      </div>
    </div>
  );
};

export default Timer;