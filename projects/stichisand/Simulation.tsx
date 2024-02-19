import {MutableRefObject, useCallback, useEffect, useRef, useState} from "react";
import {CanvasAnimation} from "@stichiboi/react-elegant-mouse-trail/lib/CanvasAnimation";
import {Grid} from "./elements/Grid";
import {Sand} from "./elements/Sand";
import {Water} from "./elements/Water";
import {useEventListener} from "../common/hooks/useEventListener";
import styles from "./simulation.module.css";
import {Erase, Pause} from "iconoir-react";
import {Wall} from "./elements/Wall";
import {Element} from "./elements/Element";


interface SimulationProps {
    brushRadius: number,
    isErase: boolean,
    material: string,
    pause: boolean,
    grid: MutableRefObject<Grid>
}

export function Simulation({brushRadius, isErase, material, pause, grid}: SimulationProps) {
    const mouseDown = useRef(false);

    // const mousePosition = useRef({x: 0, y: 0});
    // const grid = useRef<Grid>(new Grid());
    const [mouse, setMouse] = useState({x: 0, y: 0});
    const spawnGenerator = useCallback(() => {
        if (isErase) {
            return;
        }
        const spawnRate = 0.2;
        const withSpawnRate = (f: () => Element) => {
            if (Math.random() < spawnRate) {
                return f();
            }
        }
        switch (material) {
            case "sand":
                return withSpawnRate(() => new Sand());
            case "water":
                return withSpawnRate(() => new Water());
            case "wall":
                return new Wall();
            default:
                return;
        }
    }, [material, isErase]);

    const addElements = useCallback(() => {
        const {x: mouseX, y: mouseY} = mouse;
        const rootX = Math.floor(mouseX / window.innerWidth * grid.current.width);
        const rootY = Math.floor(mouseY / window.innerHeight * grid.current.height);
        grid.current.spawn(rootX, rootY, brushRadius, spawnGenerator, isErase);
    }, [spawnGenerator, brushRadius, mouse, isErase]);

    const draw = useCallback((ctx: CanvasRenderingContext2D) => {
        grid.current.draw(ctx);
        if (!pause) {
            grid.current = grid.current.update();
            grid.current.interact();
        }
    }, [pause]);

    const move = useCallback(() => {
        if (mouseDown.current) {
            addElements();
        }
    }, [addElements]);

    useEventListener("pointerdown", (ev) => {
        const tagName = (ev.target as HTMLElement)?.tagName
        if (tagName === "CANVAS" || tagName === "HEADER") {
            mouseDown.current = true;
            const {x, y} = ev as MouseEvent;
            setMouse({x, y});
        }
    });

    useEventListener(["pointerup", "pointerout", "pointercancel", "pointerleave"], () => {
        mouseDown.current = false;
    });

    useEventListener("pointermove", (ev) => {
        const {x, y} = ev as MouseEvent;
        setMouse({x, y});
    });

    const [cellSize, setCellSize] = useState(0);
    const calculateCellSize = useCallback(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const cellWidth = width / grid.current.width;
        const cellHeight = height / grid.current.height;
        setCellSize(Math.round(Math.min(cellHeight, cellWidth)));
    }, [setCellSize]);

    useEffect(() => {
        calculateCellSize();
    }, [calculateCellSize]);

    useEventListener("resize", () => {
        calculateCellSize();
        grid.current.dirtyAll();
    });

    return (
        <div className={styles.main}>
            <div style={{
                width: `${brushRadius * cellSize * 2}px`,
                height: `${brushRadius * cellSize * 2}px`,
                top: `${mouse.y}px`,
                left: `${mouse.x}px`,
            }} className={styles.pointer}>
                {isErase ? <Erase/> : pause ? <Pause/> : null}
            </div>
            <CanvasAnimation draw={draw} move={move}/>
        </div>
    );
}