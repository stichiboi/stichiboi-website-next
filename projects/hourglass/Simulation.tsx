import {useCallback, useEffect, useRef, useState} from "react";
import {CanvasAnimation} from "@stichiboi/react-elegant-mouse-trail/lib/CanvasAnimation";
import {Grid, GRID_HEIGHT, GRID_WIDTH} from "./elements/Grid";
import {Sand} from "./elements/Sand";
import {Water} from "./elements/Water";
import {useEventListener} from "../common/hooks/useEventListener";
import styles from "./simulation.module.css";
import {Erase} from "iconoir-react";
import {Wall} from "./elements/Wall";

interface SimulationProps {
    brushRadius: number,
    isErase: boolean,
    material: string
}

export function Simulation({brushRadius, isErase, material}: SimulationProps) {
    const mouseDown = useRef(false);
    // const mousePosition = useRef({x: 0, y: 0});
    const grid = useRef<Grid>(new Grid());
    const [mouse, setMouse] = useState({x: 0, y: 0});
    const spawnGenerator = useCallback(() => {
        if (isErase) {
            return;
        }
        switch (material) {
            case "sand":
                return new Sand();
            case "water":
                return new Water();
            case "wall":
                return new Wall();
            default:
                return;
        }
    }, [material, isErase]);

    const addElements = useCallback(() => {
        const {x: mouseX, y: mouseY} = mouse;
        const rootX = Math.floor(mouseX / window.innerWidth * GRID_WIDTH);
        const rootY = Math.floor(mouseY / window.innerHeight * GRID_HEIGHT);
        grid.current.spawn(rootX, rootY, brushRadius, spawnGenerator);
    }, [spawnGenerator, brushRadius, mouse]);

    const draw = useCallback((ctx: CanvasRenderingContext2D) => {
        grid.current.draw(ctx);
    }, []);

    const move = useCallback(() => {
        if (mouseDown.current) {
            addElements();
        }
        grid.current = grid.current.update();
        grid.current.interact();
    }, [addElements]);

    useEventListener("mousedown", (ev) => {
        if ((ev.target as HTMLElement)?.tagName !== "BUTTON") {
            mouseDown.current = true;
        }
    });

    useEventListener("mouseup", () => {
        mouseDown.current = false;
    });

    useEventListener("mousemove", (ev) => {
        const {x, y} = ev as MouseEvent;
        setMouse({x, y});
        // mousePosition.current = {x, y}
    });

    const [cellSize, setCellSize] = useState(0);
    const calculateCellSize = useCallback(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const cellWidth = width / GRID_WIDTH;
        const cellHeight = height / GRID_HEIGHT;
        setCellSize(Math.round(Math.min(cellHeight, cellWidth)));
    }, [setCellSize]);

    useEffect(() => {
        calculateCellSize();
    }, [calculateCellSize]);

    useEventListener("resize", () => {
        calculateCellSize()
    });

    return (
        <div className={styles.main}>
            <div style={{
                width: `${brushRadius * cellSize * 2}px`,
                height: `${brushRadius * cellSize * 2}px`,
                top: `${mouse.y}px`,
                left: `${mouse.x}px`,
            }} className={styles.pointer}>
                {isErase && <Erase/>}
            </div>
            <CanvasAnimation draw={draw} move={move}/>
        </div>
    );
}