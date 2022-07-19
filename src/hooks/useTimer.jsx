import React, { useEffect, useRef, useState } from 'react'

function useTimer() {
    const [time, setTime] = useState(0);
    const seconds = Math.floor(time / 1000);
    const milliSeconds = time % 1000;
    const updateTimeIntervalRef = useRef(null);
    // 2 states = started and stopped
    const [timerState, setTimerState] = useState("stopped");
    
    useEffect(() => {
        if (timerState === "started" && updateTimeIntervalRef.current === null) {
            // Setting updateTimeIntervalRef
            startTimer();
        }
    }, [time, timerState])

    useEffect(() => {
        return () => {
            console.log("Unmounting useTimer : ", updateTimeIntervalRef.current)
            if (updateTimeIntervalRef.current !== null) {
                clearInterval(updateTimeIntervalRef.current);
                updateTimeIntervalRef.current = null;
            }
        }
    }, [])
    const addToTimer = (timeInMs) => {
        setTime(time => time + timeInMs);
    }
    const resetTimer = () => {
        setTime(0);
        stopTimer();
    }
    const stopTimer = () => {
        if (updateTimeIntervalRef.current === null) return;
        console.log("Stopping timer")
        clearInterval(updateTimeIntervalRef.current)
        updateTimeIntervalRef.current = null;
        setTimerState("stopped")
    }
    const startTimer = () => {
        if (updateTimeIntervalRef.current !== null) return;

        console.log("Starting timer")
        updateTimeIntervalRef.current = setInterval(() => {
            setTime(time => time + 10);
        }, 10)
        setTimerState("started")
    }
    return {
        time: {
            seconds,
            milliSeconds
        },
        timerState,
        addToTimer,
        resetTimer,
        stopTimer,
        startTimer
    }
}

export default useTimer