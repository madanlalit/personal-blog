
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './SnakeGame.css';

interface SnakeGameProps {
    onExit: () => void;
}

const BOARD_SIZE = 20;
const INITIAL_SPEED = 150;

const SnakeGame: React.FC<SnakeGameProps> = ({ onExit }) => {
    const [snake, setSnake] = useState<{ x: number, y: number }[]>([{ x: 10, y: 10 }]);
    const [food, setFood] = useState<{ x: number, y: number }>({ x: 15, y: 15 });
    const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const gameLoopRef = useRef<number | null>(null);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onExit();
        if (gameOver) return;

        switch (e.key) {
            case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
            case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
            case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
            case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        }
    }, [direction, gameOver, onExit]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (gameOver) return;

        const moveSnake = () => {
            setSnake(prevSnake => {
                const head = { ...prevSnake[0] };

                switch (direction) {
                    case 'UP': head.y -= 1; break;
                    case 'DOWN': head.y += 1; break;
                    case 'LEFT': head.x -= 1; break;
                    case 'RIGHT': head.x += 1; break;
                }

                // Check Walls
                if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
                    setGameOver(true);
                    return prevSnake;
                }

                // Check Self
                if (prevSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
                    setGameOver(true);
                    return prevSnake;
                }

                const newSnake = [head, ...prevSnake];

                // Eat Food
                if (head.x === food.x && head.y === food.y) {
                    setScore(s => s + 10);
                    // Spawn new food next tick or effectively now (since state update is async, logic is here)
                    // But we can't easily call spawnFood() here with fresh state.
                    setFood({
                        x: Math.floor(Math.random() * BOARD_SIZE),
                        y: Math.floor(Math.random() * BOARD_SIZE)
                    });
                } else {
                    newSnake.pop(); // Remove tail
                }

                return newSnake;
            });
        };

        gameLoopRef.current = window.setInterval(moveSnake, INITIAL_SPEED);
        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        };
    }, [direction, food, gameOver]); // Dependency on food might cause jitter if spawn logic isn't careful, but simple is ok

    return (
        <div className="snake-overlay fade-in">
            <div className="snake-window tui-window">
                <div className="snake-header">
                    <h2>TERMINAL SNAKE</h2>
                    <p>Score: {score} | [ESC] to Exit</p>
                </div>

                {gameOver ? (
                    <div className="game-over-screen">
                        <h3>GAME OVER</h3>
                        <p>Final Score: {score}</p>
                        <button onClick={onExit} autoFocus>[ EXIT ]</button>
                    </div>
                ) : (
                    <div className="snake-grid" style={{
                        gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                        gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`
                    }}>
                        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) => {
                            const x = i % BOARD_SIZE;
                            const y = Math.floor(i / BOARD_SIZE);
                            const isSnake = snake.some(s => s.x === x && s.y === y);
                            const isFood = food.x === x && food.y === y;

                            return (
                                <div key={i} className={`cell ${isSnake ? 'snake-body' : ''} ${isFood ? 'snake-food' : ''}`}>
                                    {isSnake && '█'}
                                    {isFood && '★'}
                                    {!isSnake && !isFood && '·'}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SnakeGame;
