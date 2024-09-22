
// TODO:  - fix the the deleting numbers problem - build a generic function for that
//        - make a function that handel change in etch cell, update the cells to a 2 digits format after etch run

import React, { useState, useEffect } from 'react';

let hoursValue = 0;
let minutesValue= 0;
let secondsValue = 0;
const CountdownTimer = () => {
    const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [isRunning, setIsRunning] = useState(false);
    const [isEditable, setIsEditable] = useState(true);
    const [lastKey, setLastKey] = useState('');

    // Create a ref for the audio component
    const audioRef = React.createRef();

    // The timer itself
    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                const { hours, minutes, seconds } = time;
                if (seconds > 0) {
                    setTime({ hours, minutes, seconds: seconds - 1 });
                } else if (minutes > 0) {
                    setTime({ hours, minutes: minutes - 1, seconds: 59 });
                } else if (hours > 0) {
                    setTime({ hours: hours - 1, minutes: 59, seconds: 59 });
                } else {
                    setIsRunning(false);
                    setIsEditable(true);
                    // Play the beep sound when timer hits zero
                    audioRef.current.play();
                    document.title = "Time's up!";
                }
            }, 1000);
        }
        return () => {
            clearInterval(timer);
            // document.title = "CountdownTimer";
        };
    }, [isRunning, time]);

    // Event listener for the 'Enter' key
    useEffect(() => {
        const handleKeyDown = (event) => {
            let key = event.key;
            setLastKey(key);  // Set the last key pressed
            if (key === 'Enter' && isEditable) {
                handleStartPause();
            } else if (key === ' ') {
                handleStartPause();
            } else if (key === 'Escape') {
                handleRestart();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }); // Ensure this effect is dependent on isEditable

    // Changing the title so the time will be visible in the tab name
    useEffect(() => {
        if (isRunning) {
            document.title = `${time.hours.toString().padStart(2, '0')}:
            ${time.minutes.toString().padStart(2, '0')}:
            ${time.seconds.toString().padStart(2, '0')}`;
        }
    }, [time, isRunning]);

    const handleStartPause = () => {
        setIsRunning(!isRunning);
        setIsEditable(false);

        // making sure that the time format is correct
        let min = (minutes + Math.floor(seconds / 60))
        let hour = hours + Math.floor(min / 60)
        // set the correct time format
        setTime({ hours: hour, minutes: min % 60, seconds: seconds % 60 });
    };

    const handleRestart = () => {
        setIsRunning(false);
        setIsEditable(true);
        hoursValue = 0;
        minutesValue = 0;
        secondsValue = 0;
        setTime({ hours: hoursValue, minutes: minutesValue, seconds: secondsValue });
        document.title = `00:00:00`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let numericValue = parseInt(value, 10) || 0;  // Default to 0 if not a valid number

        /*if (lastKey === 'Backspace' || lastKey === 'Delete') {
            // TODO: fix this
            if (name === "hours") {
                hoursValue = numericValue;
            } else if (name === "minutes") {
                minutesValue = ((hoursValue % 10) * 10) + numericValue

                if (hoursValue < 10) {
                    hoursValue = 0;
                } else {
                    hoursValue = hoursValue % 10
                }
            } else {
                // update the seconds value according to the current numeric value
                secondsValue = ((minutesValue % 10) * 10) + numericValue
                // handel the minutes
                if (minutesValue > 99) {
                    minutesValue = Math.floor(minutesValue / 10)
                } else {
                    minutesValue = ((hoursValue % 10) * 10) + Math.floor(minutesValue / 10)
                }
                // handel the hours
                if (hoursValue < 10) {
                    hoursValue = 0;
                } else {
                    hoursValue = hoursValue % 10
                }
            }
        } else {
            // update the hh:mm:ss from the point the user inserted a new value
            // etch numeric value is max 3 digits (ony in a few edge cases is 4)
            if (name === "hours") {
                hoursValue = numericValue;
            } else if (name === "minutes") {
                if ((minutesValue % 100) === minutesValue) {
                    hoursValue = (((hoursValue * 10) + Math.floor(numericValue / 100)))
                }else {
                    hoursValue = (((hoursValue % 100) * 10) + Math.floor(numericValue / 100))
                }
                minutesValue = (numericValue)
            } else {
                // update the minutes value according to the seconds value and the current numeric value
                if ((secondsValue % 100) === secondsValue && numericValue !== 0) {
                    minutesValue = (((minutesValue * 10) + Math.floor(numericValue / 100)))
                } else {
                    minutesValue = (((minutesValue % 100) * 10) + Math.floor(numericValue / 100))
                }
                // update the hours value according to the minutes value and the current numeric value
                if ((minutesValue % 100) === minutesValue) {
                    hoursValue = (((hoursValue * 10) + Math.floor(minutesValue / 100)))
                }else {
                    hoursValue = (((hoursValue % 100) * 10) + Math.floor(minutesValue / 100))
                }
                // update the seconds value according to the current numeric value
                secondsValue = (numericValue)
            }
        }*/

        // handel numbers deletion
        if (lastKey === 'Backspace' || lastKey === 'Delete') {
            if (name === "hours") {
                hoursValue = numericValue;
            } else if (name === "minutes") {
                minutesValue = ((hoursValue % 10) * 10) + numericValue

                if (hoursValue < 10) {
                    hoursValue = 0;
                } else {
                    hoursValue = hoursValue % 10
                }
            } else {
                secondsValue = ((minutesValue % 10) * 10) + numericValue
                minutesValue = ((hoursValue % 10) * 10) + Math.floor(minutesValue / 10)

                if (hoursValue < 10) {
                    hoursValue = 0;
                } else {
                    hoursValue = hoursValue % 10
                }
            }
        } else {
            // update the hh:mm:ss from the point the user inserted a new value
            if (name === "hours") {
                hoursValue = numericValue % 100;
            } else if (name === "minutes") {
                hoursValue = (((hoursValue % 10) * 10) + Math.floor(minutesValue / 10))
                minutesValue = numericValue % 100
            } else {
                hoursValue = (((hoursValue % 10) * 10) + Math.floor(minutesValue / 10))
                minutesValue = (((minutesValue % 10) * 10) + Math.floor(secondsValue / 10))
                secondsValue = numericValue % 100
            }
        }

        setTime({ hours: hoursValue % 100, minutes: minutesValue % 100, seconds: secondsValue % 100 });
    };

    const handleKeyDown = (e) => {
        setLastKey(e.key);  // Set the last key pressed
    };

    const formatTime = (value) => {
        const numStr = value.toString();
        const formatted = numStr.length < 3 ? numStr.padStart(2, '0') : numStr;
        return { formatted, length: numStr.length };
        /*return numStr.length < 3 ? numStr.padStart(2, '0') : numStr;*/
    };

    const { hours, minutes, seconds } = time;

    return (
        <div className="container">
            <div className="timer">
                <input
                    type="text"
                    name="hours"
                    value={formatTime(hours).formatted}
                    onChange={handleChange}
                    /*onKeyDown={handleKeyDown}*/
                    className="input"
                    style={{ width: formatTime(hours).length >= 3 ? '2em' : '1.25em' }}
                    disabled={!isEditable}
                /> h :
                <input
                    type="text"
                    name="minutes"
                    value={formatTime(minutes).formatted}
                    onChange={handleChange}
                    /*onKeyDown={handleKeyDown}*/
                    className="input"
                    disabled={!isEditable}
                /> m :
                <input
                    type="text"
                    name="seconds"
                    value={formatTime(seconds).formatted}
                    onChange={handleChange}
                    /*onKeyDown={handleKeyDown}*/
                    className="input"
                    disabled={!isEditable}
                /> s
            </div>
            <div className="buttons">
                <button onClick={handleStartPause} className="button">
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                <button onClick={handleRestart} className="button">
                    Restart
                </button>
            </div>
            <audio ref={audioRef} src="beep.mp3"/>
        </div>
    );
};

export default CountdownTimer;