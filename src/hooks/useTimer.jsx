import React, { useEffect, useRef, useState } from 'react'
const TIMER_STATE = {
	STOPPED: "stopped",
	STARTED: "started"
}
function useTimer() {
	const [time, setTime] = useState(0);
	const seconds = Math.floor(time / 1000);
	const milliSeconds = time % 1000;
	const updateTimeIntervalRef = useRef(null);
	// 2 states = started and stopped
	const [timerState, setTimerState] = useState(TIMER_STATE.STOPPED);

	useEffect(() => {
		if (timerState === TIMER_STATE.STARTED && updateTimeIntervalRef.current === null) {
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
		console.log(`Adding ${timeInMs} ms to time : ${time}`)
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
		setTimerState(TIMER_STATE.STOPPED)
	}
	const startTimer = () => {
		if (updateTimeIntervalRef.current !== null) return;

		console.log("Starting timer")
		updateTimeIntervalRef.current = setInterval(() => {
			setTime(time => time + 10);
		}, 10)
		setTimerState(TIMER_STATE.STARTED)
	}
	return {
		time: {
			seconds,
			milliSeconds,
			total: time
		},
		timerState,
		addToTimer,
		resetTimer,
		stopTimer,
		startTimer
	}
}

export default useTimer