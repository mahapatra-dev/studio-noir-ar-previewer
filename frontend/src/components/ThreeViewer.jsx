import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

// Renders a .glb/.gltf model with orbit controls, and offers a WebXR "View in AR" button
// when the browser/device supports immersive-ar (most Android Chrome browsers).
export default function ThreeViewer({ modelUrl }) {
  const mountRef = useRef(null);
  const arContainerRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 100);
    camera.position.set(0, 1, 2.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = true;
    mount.appendChild(renderer.domElement);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222222, 1.2);
    scene.add(hemiLight);
    const dirLight = new THREE.DirectionalLight(0xffd98a, 1.2);
    dirLight.position.set(2, 4, 2);
    scene.add(dirLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    let model = null;

    if (modelUrl) {
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          model = gltf.scene;
          // Center and scale the model to fit view
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3()).length();
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          const scale = size > 0 ? 1.5 / size : 1;
          model.scale.setScalar(scale);
          scene.add(model);
        },
        undefined,
        (err) => console.error('Model load error:', err)
      );
    } else {
      // Placeholder cube if no model uploaded yet
      const geo = new THREE.BoxGeometry(1, 1, 1);
      const mat = new THREE.MeshStandardMaterial({ color: 0xd4af37 });
      model = new THREE.Mesh(geo, mat);
      scene.add(model);
    }

    // WebXR AR Button - only shown/functional on supported devices (e.g. Android Chrome)
    if ('xr' in navigator) {
      const arButton = ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] });
      arButton.classList.add('btn', 'ar-btn');
      arContainerRef.current.appendChild(arButton);
    }

    let frameId;
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.setAnimationLoop(null);
      cancelAnimationFrame(frameId);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [modelUrl]);

  return (
    <div className="viewer-wrap" ref={mountRef}>
      <div ref={arContainerRef} />
    </div>
  );
}
