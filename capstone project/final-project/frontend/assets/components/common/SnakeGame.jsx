'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const GRID_SIZE = 16;
const CELL_SIZE = 18;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const TICK_MS = 120;

const createInitialSnake = () => {
  const mid = Math.floor(GRID_SIZE / 2);
  return [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];
};

const isOppositeDirection = (next, current) =>
  next.x + current.x === 0 && next.y + current.y === 0;

const pickRandomFood = (snake) => {
  const occupied = new Set(snake.map((cell) => `${cell.x}-${cell.y}`));
  const maxAttempts = GRID_SIZE * GRID_SIZE;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    const key = `${x}-${y}`;
    if (!occupied.has(key)) {
      return { x, y };
    }
  }
  return { x: 0, y: 0 };
};

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const snakeRef = useRef(createInitialSnake());
  const foodRef = useRef(pickRandomFood(snakeRef.current));
  const directionRef = useRef({ x: 1, y: 0 });
  const nextDirectionRef = useRef({ x: 1, y: 0 });
  const runningRef = useRef(false);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!canvas.getContext) return;
    let ctx = null;
    try {
      ctx = canvas.getContext('2d');
    } catch {
      return;
    }
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const food = foodRef.current;
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    const snake = snakeRef.current;
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#22c55e' : '#16a34a';
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    });
  }, []);

  const resetGame = useCallback(
    (options = {}) => {
      const { shouldRun = true } = options;
      const nextSnake = createInitialSnake();
      snakeRef.current = nextSnake;
      foodRef.current = pickRandomFood(nextSnake);
      directionRef.current = { x: 1, y: 0 };
      nextDirectionRef.current = { x: 1, y: 0 };
      runningRef.current = shouldRun;
      setIsPlaying(shouldRun);
      setScore(0);
      setGameOver(false);
      draw();
    },
    [draw]
  );

  const startGame = useCallback(() => {
    if (gameOver) {
      resetGame({ shouldRun: true });
      return;
    }
    runningRef.current = true;
    setIsPlaying(true);
  }, [gameOver, resetGame]);

  const step = useCallback(() => {
    if (!runningRef.current) return;
    const nextDirection = nextDirectionRef.current;
    directionRef.current = nextDirection;
    const snake = snakeRef.current;
    const head = snake[0];
    const nextHead = {
      x: head.x + nextDirection.x,
      y: head.y + nextDirection.y,
    };

    const hitsWall =
      nextHead.x < 0 ||
      nextHead.x >= GRID_SIZE ||
      nextHead.y < 0 ||
      nextHead.y >= GRID_SIZE;
    const hitsBody = snake.some(
      (segment, index) =>
        index > 0 && segment.x === nextHead.x && segment.y === nextHead.y
    );

    if (hitsWall || hitsBody) {
      runningRef.current = false;
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    const nextSnake = [nextHead, ...snake];
    const food = foodRef.current;
    const ateFood = nextHead.x === food.x && nextHead.y === food.y;

    if (ateFood) {
      setScore((prev) => prev + 1);
      foodRef.current = pickRandomFood(nextSnake);
    } else {
      nextSnake.pop();
    }

    snakeRef.current = nextSnake;
    draw();
  }, [draw]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const nextMap = {
        arrowup: { x: 0, y: -1 },
        arrowdown: { x: 0, y: 1 },
        arrowleft: { x: -1, y: 0 },
        arrowright: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
      };
      const next = nextMap[key];
      if (!next) return;
      if (!isPlaying || gameOver) return;
      event.preventDefault();
      const { current } = directionRef;
      if (isOppositeDirection(next, current)) return;
      nextDirectionRef.current = next;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPlaying]);

  useEffect(() => {
    const id = setInterval(step, TICK_MS);
    return () => clearInterval(id);
  }, [step]);

  return (
    <div className='rounded-2xl border border-border bg-card p-4 shadow-sm'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm font-semibold'>Snake break</p>
          <p className='text-xs text-muted-foreground'>
            Use arrow keys or WASD to move.
          </p>
        </div>
        <div className='text-sm text-muted-foreground'>
          Score: <span className='font-semibold text-foreground'>{score}</span>
        </div>
      </div>
      <div className='mt-4 flex flex-col items-center gap-3'>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className='rounded-lg border border-border bg-slate-950'
        />
        {gameOver && (
          <p className='text-xs text-amber-600'>
            Game over. Press Restart to play again.
          </p>
        )}
        <button
          type='button'
          className='rounded-md border border-border px-3 py-1 text-xs font-semibold text-foreground hover:bg-muted'
          onClick={
            isPlaying || gameOver
              ? () => resetGame({ shouldRun: true })
              : startGame
          }
        >
          {isPlaying || gameOver ? 'Restart' : 'Start'}
        </button>
      </div>
    </div>
  );
}
