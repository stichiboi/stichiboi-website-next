import {useCallback} from "react";
import confetti from "canvas-confetti";

export function useConfetti() {
  return useCallback(() => {
    function fire(particleRatio: number, opts?: confetti.Options) {
      const count = 200;
      const defaults = {
        origin: {y: 1}
      };
      return confetti(Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio)
      }));
    }

    function bigConfetti() {
      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }

    function smallConfetti() {
      fire(0.5, {
        particleCount: 100,
        spread: 70
      });
    }

    Math.random() > 0.5 ? smallConfetti() : bigConfetti();
  }, []);
}