import React, {MutableRefObject, useCallback, useEffect, useRef} from "react";

export default function CanvasAnimation({
                                            className,
                                            draw,
                                            animatePoints
                                        }: { className: string, draw: (canvas: HTMLCanvasElement) => unknown, animatePoints: (ctx: CanvasRenderingContext2D) => unknown }): JSX.Element {
    const canvas = useRef<HTMLCanvasElement>() as MutableRefObject<HTMLCanvasElement>;
    const context = useRef<CanvasRenderingContext2D>();

    const resizeCanvas = useCallback(() => {
        if (context.current?.canvas) {
            context.current.canvas.width = window.innerWidth;
            context.current.canvas.height = window.innerHeight
        }
    }, [context]);

    const loop = useCallback(() => {
        if (canvas.current) {
            draw(canvas.current);
        }
        if (context.current) {
            animatePoints(context.current);
        }
        window.requestAnimationFrame(loop);
    }, [draw, animatePoints]);

    useEffect(() => {
        const tempContext = canvas.current.getContext('2d');
        if (!tempContext) throw Error("Cannot create canvas context");
        tempContext.lineJoin = "round";
        context.current = tempContext;

        window.addEventListener('resize', resizeCanvas);

        loop();
        resizeCanvas();
        return () => {
            window.removeEventListener('resize', resizeCanvas);
        }
    }, [context, canvas, loop, resizeCanvas]);

    return (
        <canvas ref={canvas} className={className}/>
    );
}