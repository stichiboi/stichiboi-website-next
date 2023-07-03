import * as THREE from "three";
import React, { useEffect } from "react";
import styles from "../styles/Cube.module.css";

import { EffectComposer, RenderPass } from "postprocessing";

const CANVAS_ID = "projects-cube-canvas";
const PETAL_ROWS = 15;
const PETAL_COLUMNS = 15;

export function Petals(): JSX.Element {

  useEffect(() => {
    function getSize() {
      return {
        height: window.innerHeight,
        width: document.body.clientWidth
      }
    }

    const { height, width } = getSize();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      .1,
      1000
    );
    camera.position.z = 5;
    const canvas = document.getElementById(CANVAS_ID);
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });

    renderer.setSize(width, height);

    const light = new THREE.DirectionalLight(0xffffff);
    light.castShadow = true;
    light.position.set(1, 1, 1);
    scene.add(light);

    const material = new THREE.MeshPhongMaterial({
      color: "#39E0CD",
      opacity: .3,
      transparent: true,
    });
    const objects = Array.from({ length: PETAL_ROWS }).map((_, row) => {
      return Array.from({ length: PETAL_COLUMNS }).map((_, column) => {
        const geometry = new THREE.BoxGeometry(.01, .2, .2);
        const petal = new THREE.Mesh(geometry, material);
        petal.position.y = -row * 0.3;
        petal.position.x = column * 0.3;
        return petal;
      });
    });

    objects
      .flatMap(row => row)
      .forEach(object => scene.add(object));
    const renderPass = new RenderPass(scene, camera);
    const composer = new EffectComposer(renderer);
    composer.addPass(renderPass);

    const resistance = .03;

    function animate() {
      const forces: number[][] = Array.from({ length: PETAL_ROWS })
        .map((_, row) => Array.from({ length: PETAL_COLUMNS })
          .map((_, column) => {
            if (!row || row === PETAL_ROWS - 1 || !column || column === PETAL_COLUMNS - 1) {
              // TODO Skipping borders for now
              return 0;
            }
            const neighbours = [[0, -1], [-1, 0], [0, 1], [1, 0]];
            return neighbours.reduce((prev, [y, x]) => {
              const rotation = objects[row + y][column + x].rotation;
              const push = rotation.y * y + rotation.x * x;
              // normalize by distance
              return prev + push / Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));
            }, 0);
          }));


      requestAnimationFrame(animate);
      composer.render();
    }

    animate();

    function onWindowResize() {
      const { width, height } = getSize();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      composer.setSize(width, height);
    }

    window.addEventListener("resize", onWindowResize);

    return () => {
      composer.passes.forEach(p => p.dispose());
      window.removeEventListener("resize", onWindowResize);
    }
  }, []);

  return (
    <div className={styles.container}>
      <canvas id={CANVAS_ID}/>
    </div>
  )
}