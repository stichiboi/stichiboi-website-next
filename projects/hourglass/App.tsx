import {CanvasAnimation} from "@stichiboi/react-elegant-mouse-trail/lib/CanvasAnimation";
import {useCallback, useEffect, useRef, useState} from "react";
import styles from "./app.module.css";

const CELL_SIZE = 2;
const WIDTH = 200;
const HEIGHT = 100;
const COLORS = ["b0b2ad", "f4eade", "dcbcad", "dd967a", "d49955"];
const INITIAL_SPEED = 0.1;
const TERMINAL_VELOCITY = 12;
const ACCELERATION = 1.2;

function isGrain(grain: unknown | Grain): grain is Grain {
    return Boolean(grain) && (grain as Grain)?.speed !== undefined;
}

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

class Grain {
    speed: number = INITIAL_SPEED;
    private readonly fillStyle: string;
    isFreeFalling: boolean = true;
    inertialResistance: number = 0.1;
    fallDirection: number = getRandomElement([-1, 1])

    constructor() {
        this.fillStyle = `#${getRandomElement(COLORS)}`
    }

    draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
        const {width, height} = ctx.canvas;
        ctx.beginPath();
        const posX = x * width / WIDTH;
        const posY = y * height / HEIGHT;
        const wx = Math.max(1, width / WIDTH);
        const wy = Math.max(1, height / HEIGHT);
        ctx.rect(posX, posY, wx, wy)
        ctx.fillStyle = this.fillStyle;
        ctx.fill();
    }
}


export function App(): JSX.Element {

    const mouse = useRef({x: 0, y: 0, active: false});
    const dirtyRows = useRef<boolean[]>(Array.from({length: HEIGHT}).map(() => false));

    const createEmptyHourglass = useCallback(() => {
        return Array.from({length: HEIGHT}).map(() => {
            return Array.from({length: WIDTH});
        });
    }, []);

    const [isPaused, setIsPaused] = useState(false);
    // const [hourglass, setHourglass] = useState<(unknown | Grain)[][]>(createEmptyHourglass());
    const hourglass = useRef<(unknown | Grain)[][]>(createEmptyHourglass());
    const move = useCallback((canvas: HTMLCanvasElement) => {
        if (isPaused) {
            return;
        }
        const {width, height} = canvas;
        const prev = hourglass.current;
        const next = createEmptyHourglass();
        if (mouse.current.active) {
            const rootX = Math.floor(mouse.current.x / width * WIDTH);
            const rootY = Math.floor(mouse.current.y / height * HEIGHT);
            const radius = 5;
            for (let y = -radius; y < radius; y++) {
                const spawnY = (rootY + y);
                dirtyRows.current[spawnY] = true;
                for (let x = -radius; x < radius; x++) {
                    const spawnX = (rootX + x);
                    if (Math.random() < 0.2) {
                        if (spawnX >= 0 && spawnX < WIDTH && spawnY >= 0 && spawnY < HEIGHT) {
                            next[spawnY][spawnX] = new Grain();
                        }
                    }
                }
            }

        }
        next[prev.length - 1] = prev[prev.length - 1];

        function isValidCell(x: number, y: number) {
            return y > -1 && y < prev.length && x > -1 && x < prev[y].length;
        }

        function checkLevel(cell: Grain, x: number, y: number): {
            x: number,
            y: number
        } | undefined {
            if (y >= prev.length - 1) {
                return;
            }
            const nextY = y + 1;
            const nextA = x + cell.fallDirection;
            const nextB = x - cell.fallDirection;
            const bottom = prev[nextY][x];
            const bottomA = prev[nextY][nextA];
            const bottomB = prev[nextY][nextB];
            const bottomNext = next[nextY][x];
            const bottomANext = next[nextY][nextA];
            const bottomBNext = next[nextY][nextB];
            if (
                !isGrain(bottom)
                && !isGrain(bottomNext)
            ) {
                return {y: nextY, x: x}
            }
            if (cell.isFreeFalling) {
                if (
                    !isGrain(bottomA)
                    && !isGrain(bottomANext)
                    && isValidCell(nextA, nextY)
                ) {
                    return {y: nextY, x: nextA}
                } else if (
                    !isGrain(bottomB)
                    && !isGrain(bottomBNext)
                    && isValidCell(nextB, nextY)
                ) {
                    return {y: nextY, x: nextB}
                }
            }
        }

        const nextDirtyRows = Array.from({length: HEIGHT}).map(() => false);
        // no need to check the last row
        for (let y = prev.length - 2; y >= 0; y--) {
            if (!dirtyRows.current[y]) {
                next[y] = prev[y];
                continue
            }
            const row = prev[y];
            row.forEach((cell, x) => {
                if (isGrain(cell)) {
                    let hasMoved = false;
                    let bestRes = {x, y};
                    for (let i = 0; i < cell.speed; i++) {
                        const res = checkLevel(cell, bestRes.x, bestRes.y);
                        if (res) {
                            hasMoved = true;
                            bestRes = res;
                        } else {
                            break;
                        }
                    }
                    if (!hasMoved) {
                        cell.isFreeFalling = false;
                        cell.speed = INITIAL_SPEED;
                    } else {
                        nextDirtyRows[bestRes.y] = true;
                        nextDirtyRows[y] = true;
                        nextDirtyRows[y - 1] = true;
                        cell.speed *= ACCELERATION;
                        cell.speed = Math.min(cell.speed, TERMINAL_VELOCITY);
                    }
                    next[bestRes.y][bestRes.x] = cell;
                }
            });
        }

        dirtyRows.current = nextDirtyRows;

        function triggerFreeFall(cell: Grain | unknown) {
            if (isGrain(cell) && !cell.isFreeFalling) {
                if (Math.random() > cell.inertialResistance) {
                    cell.isFreeFalling = true;
                }
            }
        }


        next.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (isGrain(cell) && cell.isFreeFalling) {
                    const a = next[y][x - cell.fallDirection];
                    triggerFreeFall(a);
                    const b = next[y][x + cell.fallDirection];
                    triggerFreeFall(b);
                    if (y < next.length - 1) {
                        const bottom = next[y + 1][x];
                        triggerFreeFall(bottom);
                    }
                }
            })
        })
        hourglass.current = next;
        // setIsPaused(true);
    }, [isPaused]);

    const draw = useCallback((ctx: CanvasRenderingContext2D) => {
        const {width, height} = ctx.canvas;
        const rowHeight = height / HEIGHT;
        hourglass.current.forEach((row, y) => {
            if (dirtyRows.current[y]) {
                ctx.clearRect(
                    0, rowHeight * y,
                    width,
                    rowHeight
                );
                row.forEach((cell, x) => {
                    if (isGrain(cell)) {
                        cell.draw(ctx, x, y);
                    }
                });
            }
        });
    }, [hourglass]);

    useEffect(() => {
        function togglePause(event: KeyboardEvent) {
            if (event.key === ' ') {
                setIsPaused(prev => !prev);
            }
        }

        function onMouseMove(event: MouseEvent) {
            mouse.current.x = event.x;
            mouse.current.y = event.y;
        }

        function onMouseDown() {
            mouse.current.active = !mouse.current.active
        }

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('keydown', togglePause);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('keydown', togglePause);
        }
    }, []);

    return (
        <div style={{
            width: `${CELL_SIZE * WIDTH}px`,
            height: `${CELL_SIZE * HEIGHT}px`
        }}>
            <CanvasAnimation
                move={move}
                draw={draw}
                className={styles.main}
            />
        </div>
    )
}