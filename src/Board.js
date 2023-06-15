import { useEffect, useRef, useState } from "react"
import './Board.css'
import useInterval from "./hook.useInterval";

const Board = () => {
    const square = 50
    const DIRECTIONS = {
        38: [0, -1], // up
        40: [0, 1], // down
        37: [-1, 0], // left
        39: [1, 0] // right
      };
    const boardRef = useRef() 
    const [snake, setSnake] = useState([[4, 5], [4, 4]])
    const [score, setScore] = useState(0)
    const [food, setFood] = useState([4, 1])
    const [direction, setDirection] = useState([0, -1])
    const [speed, setSpeed] = useState(null)
    const [gameOver, setGameOver] = useState(false)
    const startGame = () => {
        setScore(0)
        setGameOver(false)
        setSnake([[4, 5], [4, 4]])
        setFood([4, 1])
        setDirection([0, -1])
        setSpeed(500)
    }
    const endGame = () => {
        setSpeed(null)
        setGameOver(true)
    }
    const moveSnake = (e) => {
        if (e.keyCode >= 37 && e.keyCode <= 40) setDirection(DIRECTIONS[e.keyCode])
    }
    const createFood = () => {
        return food.map(() => Math.floor(Math.random() * 500/50))
    }
    const checkCollision = (headSquare, snakeArg = snake) => {
        if (headSquare[0] * square >= 500
            || headSquare[0] < 0
            || headSquare[1] * square >= 500
            || headSquare[1] < 0) return true 
        snakeArg.forEach((piece) => {
            if (headSquare[0] === piece[0] && headSquare[1] === piece[1]) return true
        })
        // for (const piece of snakeArg) {
        //     if (headSquare[0] === piece[0] && headSquare[1] === piece[1]) return true
        // }
        return false
    }
    const checkFoodCollision = (snakeArg) => {
        if (snakeArg[0][0] === food[0] && snakeArg[0][1] === food[1]) {
            setScore((score) => score += 1)
            let newFood = createFood()
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
        const context = boardRef.current.getContext('2d')
        context.setTransform(square, 0, 0, square, 0, 0)
        context.clearRect(0, 0, window.innerWidth, window.innerHeight)
        context.fillStyle = "purple"
        snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1))
        context.fillStyle = "yellowgreen"
        context.fillRect(food[0], food[1], 1, 1)
    }, [snake, food, gameOver])
    useInterval(() => gameLoop(), speed)
    return <div role="button" tabIndex="0" 
    onKeyDown={(e) => moveSnake(e)}>
        <canvas width={500} height={500} ref={boardRef}
            className="board"
        />
        <button onClick={startGame}>Start</button>
        <div>{score}</div>
        {gameOver && <div>Game over!!</div>}
    </div>
}

export default Board