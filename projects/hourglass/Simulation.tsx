import {useCallback, useRef} from "react";
import {CanvasAnimation} from "@stichiboi/react-elegant-mouse-trail/lib/CanvasAnimation";
import styles from "./app.module.css";
import {Grid, GRID_HEIGHT, GRID_WIDTH} from "./elements/Grid";
import {Sand} from "./elements/Sand";
import {Water} from "./elements/Water";
import {useEventListener} from "../common/hooks/useEventListener";

interface SimulationProps {
    brushRadius: number,
    isErase: boolean,
    material: string
}

export function Simulation({brushRadius, isErase, material}: SimulationProps) {
    const mouseDown = useRef(false);
    const mousePosition = useRef({x: 0, y: 0});
    const grid = useRef<Grid>(new Grid());

    const spawnGenerator = useCallback(() => {
        if (isErase) {
            return;
        }
        switch (material) {
            case "sand":
                return new Sand();
            case "water":
                return new Water();
            default:
                return;
        }
    }, [material, isErase]);

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

    useEventListener("mousedown", (ev) => {
        if ((ev.target as HTMLElement)?.tagName === "CANVAS") {
            mouseDown.current = true;
        }
    });

    useEventListener("mouseup", (ev) => {
        mouseDown.current = false;
    });

    useEventListener("mousemove", (ev) => {
        const {x, y} = ev as MouseEvent;
        mousePosition.current = {x, y}
    });

    return <CanvasAnimation draw={draw} move={move} className={styles.main}/>
}