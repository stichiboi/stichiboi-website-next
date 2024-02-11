import {useCallback, useEffect, useRef} from "react";
import {CanvasAnimation} from "@stichiboi/react-elegant-mouse-trail/lib/CanvasAnimation";
import styles from "./app.module.css";
import {Grid, GRID_HEIGHT, GRID_WIDTH} from "./elements/Grid";
import {Sand} from "./elements/Sand";

export function Simulation() {
    const mouseDown = useRef(false);
    const mousePosition = useRef({x: 0, y: 0});
    const grid = useRef<Grid>(new Grid());

    const addSand = useCallback(() => {
        const radius = 10;
        const {x: mouseX, y: mouseY} = mousePosition.current;
        const rootX = Math.floor(mouseX / window.innerWidth * GRID_WIDTH);
        const rootY = Math.floor(mouseY / window.innerHeight * GRID_HEIGHT);
        grid.current.spawn(rootX, rootY, radius, () => new Sand());
    }, []);

    const draw = useCallback((ctx: CanvasRenderingContext2D) => {
        grid.current.draw(ctx);
    }, []);

    const move = useCallback(() => {
        if (mouseDown.current) {
            addSand();
        }
        grid.current = grid.current.update();
    }, []);

    useEffect(() => {
        function onMouseDown() {
            mouseDown.current = true;
        }

        function onMouseUp() {
            mouseDown.current = false;
        }

        function onMouseMove(ev: MouseEvent) {
            mousePosition.current = {x: ev.x, y: ev.y}
        }

        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);
        return () => {
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousemove', onMouseMove);
        }
    }, []);

    return <CanvasAnimation draw={draw} move={move} className={styles.main}/>
}