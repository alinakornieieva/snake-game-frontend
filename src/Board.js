import { useEffect, useRef, useState } from "react"
import useInterval from "./hook.useInterval"
import './Board.css'

const Board = ({changeData}) => {
    const square = 50
    const DIRECTIONS = {
        38: [0, -1],
        40: [0, 1], 
        37: [-1, 0], 
        39: [1, 0]
    }
    const FOOD = ["yellowgreen", "lightblue", "orange"]
    const boardRef = useRef(null)
    const [name, setName] = useState('') 
    const [snake, setSnake] = useState([[4, 5], [4, 4]])
    const [score, setScore] = useState(0)
    const [food, setFood] = useState([4, 1])
    const [foodColor, setFoodColor] = useState(FOOD[Math.floor(Math.random() * FOOD.length)]) 
    const [direction, setDirection] = useState([0, -1])
    const [speed, setSpeed] = useState(null)
    const [gameOver, setGameOver] = useState(false)
    const [user, setUser] = useState(false)
    const startGame = () => {
        setScore(0)
        setGameOver(false)
        setSnake([[4, 3], [4, 4]])
        setFood([4, 1])
        setDirection([0, -1])
        setSpeed(500)
    }
    const endGame = async () => {
        setSpeed(null)
        setGameOver(true)
        if (name.length >= 1) {
            await fetch('http://localhost:5000/post-score', {method: 'POST', body: JSON.stringify({name, score}),
            headers: {
                "Content-Type": "application/json",
            }
            })
            .then(() => alert(`${name}, your score is - ${score}`))
            .catch((e) => {
                alert('Something went wrong...')
                console.error(e)
            })
            changeData(gameOver)
        }
    }
    const pauseGame = () => {
        alert('Game is Paused, Press OK or Enter Key to continue Playing !!')
    }
    const moveSnake = (e) => {
        if (e.keyCode >= 37 && e.keyCode <= 40) setDirection(DIRECTIONS[e.keyCode])
    }
    const createFood = () => {
        setFoodColor(FOOD[Math.floor(Math.random() * FOOD.length)])
        return food.map(() => Math.floor(Math.random() * 500/square))
    }
    const checkCollision = (headSquare, snakeArg = snake) => {
        if (headSquare[0] * square >= 500
            || headSquare[0] < 0
            || headSquare[1] * square >= 500
            || headSquare[1] < 0) return true 
        for (const piece of snakeArg) {
            if (headSquare[0] === piece[0] && headSquare[1] === piece[1]) return true
        }
        return false
    }
    const checkFoodCollision = (snakeArg) => {
        if (snakeArg[0][0] === food[0] && snakeArg[0][1] === food[1]) {
            let newFood = createFood()
            if (foodColor === 'yellowgreen') {
                setScore((prev) => prev + 1)
            }
            if (foodColor === 'lightblue') {
                setScore((prev) => prev + 5)
            }
            if (foodColor === 'orange') {
                setScore((prev) => prev + 10)
            }
            while (checkCollision(newFood, snakeArg)) {
                newFood = createFood()
            }
            setFood(newFood)
            return true
        }
        return false
    }
    const gameLoop = () => {
        const snakeCopy = JSON.parse(JSON.stringify(snake))
        const snakeCopyHead = [snakeCopy[0][0] + direction[0], snakeCopy[0][1] + direction[1]]
        snakeCopy.unshift(snakeCopyHead)
        if (checkCollision(snakeCopyHead)) endGame()
        if (!checkFoodCollision(snakeCopy)) snakeCopy.pop()
        setSnake(snakeCopy)
    }
    useEffect(() => {
        setSpeed((prev) => prev + 200)
    }, [score % 50 === 0])
    useEffect(() => {
        const context = boardRef?.current?.getContext('2d')
        if (context) {
            context.setTransform(square, 0, 0, square, 0, 0)
            context.clearRect(0, 0, window.innerWidth, window.innerHeight)
            context.fillStyle = "purple"
            snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1))
            context.fillStyle = foodColor
            context.fillRect(food[0], food[1], 1, 1)
        }
    }, [snake, food, gameOver, user])
    useInterval(() => gameLoop(), speed)
    if (!user) {
        return <form onSubmit={() => setUser(true)}>
            <input value={name} onChange={(e) => setName(e.target.value)}
            type="text" placeholder="Enter your name..."/>
            <button type="submit">Next</button>
        </form>
    }
    return <div role="button" tabIndex="0" 
        onKeyDown={(e) => moveSnake(e)}>
            <div className="greeting">Hi, {name}</div>
        <canvas width={500} height={500} ref={boardRef}
            className="board"
        />
        <div className="score">Your score: <strong>{score}</strong></div>
        <div>
            <button onClick={startGame}>Start</button>
            <button onClick={pauseGame}>Pause</button>
        </div>
    </div>
}

export default Board