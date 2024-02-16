import {Element} from "./Element"

export function isElement(cell: unknown | Element): cell is Element {
    return cell instanceof Element;
}

export function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}


export function takePath(x1: number, y1: number, x2: number, y2: number, stop: (x: number, y: number) => boolean): {
    x: number,
    y: number
} {
    const slope = (y2 - y1) / (x2 - x1);
    let x = x1, y = y1;
    let prevX = x, prevY = y;
    const deltaX = Math.sign(x2 - x1);
    const deltaY = Math.sign(y2 - y1);
    const stepX = Math.abs(slope) < 1;
    while (x !== x2 || y !== y2) {
        if (stop(x, y)) {
            return {x: prevX, y: prevY}
        }
        prevX = x;
        prevY = y;
        if (stepX) {
            x += deltaX;
            y = y1 + Math.round(slope * (x - x1));
        } else {
            y += deltaY;
            x = x1 + Math.round((y - y1) / slope);
        }
    }
    if (stop(x, y)) {
        return {x: prevX, y: prevY}
    }
    return {
        x, y
    }
}

export function pathUntil(targetX: number, targetY: number, stop: (x: number, y: number) => any) {
    return takePath(0, 0, targetX, targetY, (x: number, y: number) => {
        if (!x && !y) {
            return false;
        }
        return Boolean(stop(x, y));
    });
}