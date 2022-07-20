import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import useTimer from './hooks/useTimer'
import * as localStorageUtils from "@utils/localStorage"
import * as mathUtils from "@utils/math"
import { HIGH_SCORE_LOCAL_STORAGE_KEY, MAX_CHARACTERS, PENALTY_IN_MS } from "./constants"

const GAME_STATE = {
	INITIALIZED: "initialized",
	STARTED: "started",
	ENDED: "ended",
	PAUSED: "paused"
}

const generateRandomLetter = () => {
	return String.fromCharCode(mathUtils.getRandomNumberInRange(0, 25) + 65)
}
function App() {
	const { time, startTimer, timerState, resetTimer, stopTimer, addToTimer } = useTimer();
	const [highScore, setHighScore] = useState(localStorageUtils.getValue(HIGH_SCORE_LOCAL_STORAGE_KEY));
	const [inputText, setInputText] = useState("");
	const inputBoxRef = useRef(null);
	const [randomLetter, setRandomLetter] = useState(generateRandomLetter());
	// started,ended,paused,initialized
	const [gameState, setGameState] = useState(GAME_STATE.INITIALIZED);

	useEffect(() => {
		if (inputText !== "") {
			const letterToMatch = inputText.charAt(inputText.length - 1);
			if (letterToMatch != randomLetter)
				addToTimer(PENALTY_IN_MS);
		}
		if (inputText.length === MAX_CHARACTERS) {
			setGameState(GAME_STATE.ENDED);
			// alert("Fin.")
		} else
			setRandomLetter(generateRandomLetter());
	}, [inputText])

	useEffect(() => {
		if (gameState === GAME_STATE.ENDED && highScore !== null)
			localStorageUtils.setValue(HIGH_SCORE_LOCAL_STORAGE_KEY, highScore);
	}, [highScore])

	useEffect(() => {
		console.log(`update time in App : ${time.total}`)
		switch (gameState) {
			case GAME_STATE.INITIALIZED: initializeGame(); break;
			case GAME_STATE.STARTED: startGame(); break;
			case GAME_STATE.ENDED: endGame()
		}
	}, [gameState])

	const disableInput = () => {
		if (inputBoxRef.current !== null) {
			inputBoxRef.current.disabled = true;
		}
	}
	const enableAndFocusInput = () => {
		if (inputBoxRef.current !== null) {
			inputBoxRef.current.disabled = false;
			inputBoxRef.current.focus()
		}
	}
	const handleUserInput = (e) => {
		setInputText(e.target.value.toUpperCase())
	}

	const initializeGame = () => {
		disableInput()
	}
	const startGame = () => {
		enableAndFocusInput()
		startTimer()
	}
	const endGame = () => {
		disableInput()
		stopTimer();
		updateHighScore();
	}
	const resetGame = () => {
		setGameState(GAME_STATE.INITIALIZED)
		resetTimer();
		setInputText("");
		setRandomLetter(generateRandomLetter())
	}
	const updateHighScore = () => {
		if (!highScore || time.total < highScore) {
			setRandomLetter("Success!")
			setHighScore(time.total);
		} else {
			setRandomLetter("Failure!")
		}
	}
	return (
		<div className='h-screen w-screen bg-primary flex flex-col justify-center items-center'>
			<div className='text-white h-full flex flex-col items-center justify-center max-w-sm w-full px-2'>
				<h2 className="font-bold mb-4 text-3xl">Fast Type</h2>
				<p className="text-sm mb-6 break-words px-2">Typing game to see how fast can you type. Timer starts when you do :)</p>
				<div className={`h-100 w-full bg-white font-bold text-4xl h-24 border rounded-md flex justify-center items-center mb-7 ${randomLetter === "Failure!" ? "text-failure" : 'text-success'}`}>
					{randomLetter}
				</div>
				<p className='mb-7'>Time: {`${time.seconds}.${time.milliSeconds} s`}</p>
				<div className='flex w-full mb-4'>
					<input ref={inputBoxRef} type="text" placeholder='Type here' className='text-center text-black focus:outline-none px-1 py-1 bg-primary-input-bg disabled:opacity-50 disabled:cursor-not-allowed w-full font-bold' onChange={handleUserInput} value={inputText} />
					{gameState === GAME_STATE.INITIALIZED ? <button onClick={() => setGameState(GAME_STATE.STARTED)} className="bg-accent-2 p-1 px-2">Start</button> : <button onClick={resetGame} className="bg-accent-2 p-1 px-2">Reset</button>}
				</div>
				<p className="font-thin text-sm">my best time: {`${Math.floor(highScore / 1000)}.${highScore % 1000}`} s</p>
			</div>
		</div>
	)
}

export default App
