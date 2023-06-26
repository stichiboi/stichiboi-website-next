import * as THREE from "three";
import React, { useEffect } from "react";
import styles from "../styles/Cube.module.css";

import { EffectComposer, RenderPass } from "postprocessing";

const CANVAS_ID = "projects-cube-canvas";
const STACK_COUNT = 15;

export function Stack(): JSX.Element {

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

    const size = 2;
    const material = new THREE.MeshPhysicalMaterial({
      color: "#39E0CD",
      opacity: .3,
      transparent: true,
    });
    const objects = Array.from({ length: STACK_COUNT }).map((_, i) => {
      const height = size / 6;
      const geometry = new THREE.BoxGeometry(size, height, size);

      const cube = new THREE.Mesh(geometry, material);
      cube.position.y = -i * height + 1;
      return cube;
    });

    objects.forEach(object => scene.add(object));
    const renderPass = new RenderPass(scene, camera);
    const composer = new EffectComposer(renderer);
    composer.addPass(renderPass);

    const frameFactor = .01;
    const rescaleFactor = 400;
    let frames = 0;
    let direction = 1;
    let prevScroll = window.scrollY;
    const parentRect = canvas.parentElement?.parentElement?.getBoundingClientRect();
    const parentHeight = parentRect?.height || 1;
    // starting value of y, used to calculate offset of scroll from the sticky container
    const deltaY = (parentRect?.top || 0) - document.body.getBoundingClientRect().y;

    function animate() {
      const scrollY = window.scrollY - deltaY;
      frames += direction;
      if (prevScroll !== scrollY) {
        direction = Math.sign(scrollY - prevScroll);
        prevScroll = scrollY;
      }
      camera.position.x = -(0.5 - scrollY / parentHeight) * 4;
      camera.position.y = -scrollY / parentHeight * 2;
      const baseRotation = frames * frameFactor;
      const scrollRotation = scrollY / rescaleFactor;
      objects.forEach((object, i) => {
        object.rotation.y = baseRotation + scrollRotation + i / 7;
      });
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