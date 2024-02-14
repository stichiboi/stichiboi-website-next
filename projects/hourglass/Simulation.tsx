import {useCallback, useEffect, useRef} from "react";
import {CanvasAnimation} from "@stichiboi/react-elegant-mouse-trail/lib/CanvasAnimation";
import styles from "./app.module.css";
import {Grid, GRID_HEIGHT, GRID_WIDTH} from "./elements/Grid";
import {Sand} from "./elements/Sand";
import {Water} from "./elements/Water";

interface SimulationProps {
    brushRadius: number,
    isErase: boolean
}

export function Simulation({brushRadius, isErase}: SimulationProps) {
    const mouseDown = useRef(false);
    const mousePosition = useRef({x: 0, y: 0});
    const grid = useRef<Grid>(new Grid());
    const spawnElement = useRef<"sand" | "water">("sand");

    const spawnGenerator = useCallback(() => {
        if (isErase) {
            return;
        }
        switch (spawnElement.current) {
            case "sand":
                return new Sand();
            case "water":
                return new Water();
            default:
                return;
        }
    }, [spawnElement, isErase]);

    const addElements = useCallback(() => {
        const {x: mouseX, y: mouseY} = mousePosition.current;
        const rootX = Math.floor(mouseX / window.innerWidth * GRID_WIDTH);
        const rootY = Math.floor(mouseY / window.innerHeight * GRID_HEIGHT);
        grid.current.spawn(rootX, rootY, brushRadius, spawnGenerator);
    }, [spawnGenerator, brushRadius]);

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

    useEffect(() => {
        function onMouseDown(ev: MouseEvent) {
            if ((ev.target as HTMLElement)?.tagName === "CANVAS") {
                mouseDown.current = true;
            }
        }

        function onMouseUp() {
            mouseDown.current = false;
        }

        function onMouseMove(ev: MouseEvent) {
            mousePosition.current = {x: ev.x, y: ev.y}
        }

        function onKeyboard(ev: KeyboardEvent) {
            if (ev.key === "w") {
                spawnElement.current = "water";
            }
            if (ev.key === "s") {
                spawnElement.current = "sand";
            }
        }

        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('keypress', onKeyboard);
        return () => {
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('keypress', onKeyboard);
        }
    }, []);

    return <CanvasAnimation draw={draw} move={move} className={styles.main}/>
}