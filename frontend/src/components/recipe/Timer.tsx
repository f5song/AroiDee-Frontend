import React from "react";
import { Play, Pause, RefreshCw } from "lucide-react";
import { TimerProps } from "../../types/recipe";

const Timer: React.FC<TimerProps> = ({ 
  timer, 
  timerActive, 
  toggleTimer, 
  resetTimer, 
  setTimerMinutes 
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-lg text-gray-800 mb-4">จับเวลา</h3>
      <div className="flex justify-center text-4xl font-bold mb-5 text-gray-800">
        {formatTime(timer)}
      </div>
      <div className="flex justify-center space-x-3 mb-5">
        <button
          onClick={toggleTimer}
          className={`px-5 py-2 rounded-lg flex items-center ${
            timerActive 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-green-500 hover:bg-green-600 text-white"
          } transition-colors`}
        >
          {timerActive ? <Pause size={18} className="mr-2" /> : <Play size={18} className="mr-2" />}
          {timerActive ? "หยุด" : "เริ่ม"}
        </button>
        <button
          onClick={resetTimer}
          className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center transition-colors"
        >
          <RefreshCw size={18} className="mr-2" />
          รีเซ็ต
        </button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        <button
          onClick={() => setTimerMinutes(1)}
          className="py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
        >
          1m
        </button>
        <button
          onClick={() => setTimerMinutes(5)}
          className="py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
        >
          5m
        </button>
        <button
          onClick={() => setTimerMinutes(10)}
          className="py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
        >
          10m
        </button>
        <button
          onClick={() => setTimerMinutes(15)}
          className="py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
        >
          15m
        </button>
        <button
          onClick={() => setTimerMinutes(30)}
          className="py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
        >
          30m
        </button>
      </div>
    </div>
  );
};

export default Timer;