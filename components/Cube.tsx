import * as THREE from "three";
import React, { useEffect } from "react";
import styles from "../styles/Cube.module.css";

import { EffectComposer, RenderPass, BloomEffect, EffectPass } from "postprocessing";

const CANVAS_ID = "projects-cube-canvas"

export function Cube(): JSX.Element {

  useEffect(() => {

    const height = window.innerHeight;
    const width = document.body.clientWidth;

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

    // starting value of y, used to calculate offset of scroll from the sticky container
    const deltaY = canvas.getBoundingClientRect().y;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });

    renderer.setSize(width, height);
    renderer.setClearColor("#fff", 0.0);
    const light = new THREE.DirectionalLight(0xffffff);
    light.castShadow = true;
    light.position.set(0, 0, 1);
    scene.add(light);

    const size = 2;
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshPhongMaterial({
      color: "#ff0000",
    });
    const cube = new THREE.Mesh(geometry, material);

    const wireFrameMaterial = new THREE.MeshBasicMaterial({
      color: "#000",
      wireframe: true
    });
    const wireFrame = new THREE.Mesh(geometry, wireFrameMaterial);
    cube.add(wireFrame);
    scene.add(cube);

    const renderPass = new RenderPass(scene, camera);
    const bloomEffect = new BloomEffect({
      intensity: 0,
      luminanceThreshold: 0.05,
      luminanceSmoothing: 0.05,
    });
    const bloomPass = new EffectPass(camera, bloomEffect);
    const composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    const frameFactor = .01;
    const rescaleFactor = 400;
    let frames = 0;
    let direction = 1;
    let prevScroll = window.scrollY;

    function animate() {
      const scrollY = window.scrollY - deltaY;

      frames += direction;
      if (prevScroll !== scrollY) {
        direction = Math.sign(scrollY - prevScroll);
        prevScroll = scrollY;
      }

      bloomEffect.intensity = Math.min(scrollY * 2 / innerHeight, 1);
      camera.position.x = Math.min(scrollY * 2 / innerHeight, 1.5);

      const baseRotation = frames * frameFactor;
      const scrollRotation = scrollY / rescaleFactor;
      cube.rotation.x = baseRotation + scrollRotation;
      cube.rotation.y = baseRotation + scrollRotation;
      requestAnimationFrame(animate);
      composer.render();
    }

    animate();

    function onWindowResize() {
      const width = document.body.clientWidth;
      const height = window.innerHeight;
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