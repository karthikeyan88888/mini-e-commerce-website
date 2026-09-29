import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RotateCw, ZoomIn, ZoomOut, RefreshCw, Move, X, Compass, Play, Pause, AlertCircle, Box } from 'lucide-react';

interface Product360ViewerProps {
  imageUrl: string;
  productName: string;
  isOpen?: boolean;
  onClose?: () => void;
  isInline?: boolean;
  modelUrl?: string | null;
  category?: string;
}

export const Product360Viewer: React.FC<Product360ViewerProps> = ({
  imageUrl,
  productName,
  isOpen = false,
  onClose,
  isInline = false,
  modelUrl = null,
  category = 'HEADPHONES',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interaction State
  const [rotationAngle, setRotationAngle] = useState(0); // 0 to 359 degrees
  const [pitchAngle, setPitchAngle] = useState(0); // -25 to +25 degrees
  const [zoomLevel, setZoomLevel] = useState(1.0); // 1.0x to 2.5x
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoOrbit, setIsAutoOrbit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [modelType, setModelType] = useState<'mesh' | 'prototype'>('prototype');

  // Drag tracking refs
  const dragStartRef = useRef<{ x: number; y: number; angle: number; pitch: number }>({
    x: 0,
    y: 0,
    angle: 0,
    pitch: 0,
  });

  // Touch pinch tracking
  const touchStartRef = useRef<{ x: number; y: number; dist: number; angle: number; pitch: number }>({
    x: 0,
    y: 0,
    dist: 0,
    angle: 0,
    pitch: 0,
  });

  // Three.js internal references
  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    pivotGroup: THREE.Group | null;
    animId: number | null;
    disposed: boolean;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    pivotGroup: null,
    animId: null,
    disposed: false,
  });

  // Keep rotation/zoom states mirrored in refs for render loop
  const stateRef = useRef({
    rotationAngle: 0,
    pitchAngle: 0,
    zoomLevel: 1.0,
    isAutoOrbit: false,
  });

  useEffect(() => {
    stateRef.current.rotationAngle = rotationAngle;
    stateRef.current.pitchAngle = pitchAngle;
    stateRef.current.zoomLevel = zoomLevel;
    stateRef.current.isAutoOrbit = isAutoOrbit;
  }, [rotationAngle, pitchAngle, zoomLevel, isAutoOrbit]);

  // Dedicated Auto Orbit continuous rotation animation
  useEffect(() => {
    if (!isAutoOrbit) return;
    let animId: number;
    const orbit = () => {
      setRotationAngle((prev) => (prev + 0.45) % 360);
      animId = requestAnimationFrame(orbit);
    };
    animId = requestAnimationFrame(orbit);
    return () => cancelAnimationFrame(animId);
  }, [isAutoOrbit]);

  // Procedural Prototype 3D Audio Models (NEXORO Obsidian + Copper Finishes)
  const buildPrototypeScene = useCallback(
    (isEarbuds: boolean): THREE.Group => {
      const group = new THREE.Group();

      // Premium NEXORO Materials
      const matObsidian = new THREE.MeshStandardMaterial({
        color: 0x111317,
        roughness: 0.32,
        metalness: 0.88,
      });

      const matGraphite = new THREE.MeshStandardMaterial({
        color: 0x1c2027,
        roughness: 0.48,
        metalness: 0.65,
      });

      const matCopper = new THREE.MeshStandardMaterial({
        color: 0xc8834a,
        roughness: 0.22,
        metalness: 0.94,
      });

      const matCushion = new THREE.MeshStandardMaterial({
        color: 0x090a0d,
        roughness: 0.88,
        metalness: 0.08,
      });

      const matSilicone = new THREE.MeshStandardMaterial({
        color: 0x14161c,
        roughness: 0.72,
        metalness: 0.12,
      });

      if (isEarbuds) {
        // --- PROTOTYPE: NEXORO WIRELESS EARBUDS & PEBBLE CHARGING CASE ---
        const caseGroup = new THREE.Group();

        // 1. Sleek Pebble Charging Case (Upper & Lower Shells)
        const caseLowerGeo = new THREE.CylinderGeometry(0.72, 0.6, 0.42, 36);
        caseLowerGeo.scale(1.2, 1, 0.85);
        const caseLowerMesh = new THREE.Mesh(caseLowerGeo, matObsidian);
        caseLowerMesh.position.y = -0.35;
        caseLowerMesh.castShadow = true;
        caseLowerMesh.receiveShadow = true;
        caseGroup.add(caseLowerMesh);

        // Case Lid
        const caseLidGeo = new THREE.SphereGeometry(0.75, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2);
        caseLidGeo.scale(1.15, 0.45, 0.82);
        const caseLidMesh = new THREE.Mesh(caseLidGeo, matObsidian);
        caseLidMesh.position.y = -0.14;
        caseLidMesh.castShadow = true;
        caseGroup.add(caseLidMesh);

        // Copper Trim Seam Ring around Case
        const caseCopperSeamGeo = new THREE.TorusGeometry(0.74, 0.016, 16, 48);
        caseCopperSeamGeo.scale(1.18, 0.84, 1);
        caseCopperSeamGeo.rotateX(Math.PI / 2);
        const caseCopperSeam = new THREE.Mesh(caseCopperSeamGeo, matCopper);
        caseCopperSeam.position.y = -0.14;
        caseGroup.add(caseCopperSeam);

        // LED Battery Indicator Dot (Cyan pulse)
        const ledGeo = new THREE.SphereGeometry(0.022, 16, 16);
        const ledMat = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          emissive: 0x06b6d4,
          emissiveIntensity: 2.5,
        });
        const ledMesh = new THREE.Mesh(ledGeo, ledMat);
        ledMesh.position.set(0, -0.25, 0.62);
        caseGroup.add(ledMesh);

        // 2. Dual Wireless Earbuds Resting in Front
        const createEarbud = (isRight: boolean) => {
          const bud = new THREE.Group();

          // Bud Acoustic Body
          const headGeo = new THREE.SphereGeometry(0.18, 24, 16);
          const headMesh = new THREE.Mesh(headGeo, matObsidian);
          headMesh.castShadow = true;
          bud.add(headMesh);

          // Copper Acoustic Nozzle Ring
          const nozzleGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.12, 20);
          const nozzleMesh = new THREE.Mesh(nozzleGeo, matCopper);
          nozzleMesh.position.set(isRight ? -0.12 : 0.12, 0.05, 0.1);
          nozzleMesh.rotation.z = isRight ? 0.4 : -0.4;
          bud.add(nozzleMesh);

          // Silicone Ear-tip
          const tipGeo = new THREE.TorusGeometry(0.1, 0.04, 16, 24);
          const tipMesh = new THREE.Mesh(tipGeo, matSilicone);
          tipMesh.position.copy(nozzleMesh.position);
          tipMesh.rotation.copy(nozzleMesh.rotation);
          bud.add(tipMesh);

          // Ergonomic Stem
          const stemGeo = new THREE.CylinderGeometry(0.045, 0.055, 0.42, 20);
          const stemMesh = new THREE.Mesh(stemGeo, matObsidian);
          stemMesh.position.set(0, -0.26, 0);
          stemMesh.castShadow = true;
          bud.add(stemMesh);

          // Copper Charging Contact Base
          const contactGeo = new THREE.CylinderGeometry(0.046, 0.046, 0.03, 16);
          const contactMesh = new THREE.Mesh(contactGeo, matCopper);
          contactMesh.position.set(0, -0.47, 0);
          bud.add(contactMesh);

          return bud;
        };

        const leftBud = createEarbud(false);
        leftBud.position.set(-0.46, 0.28, 0.35);
        leftBud.rotation.set(0.2, 0.35, -0.2);
        caseGroup.add(leftBud);

        const rightBud = createEarbud(true);
        rightBud.position.set(0.46, 0.28, 0.35);
        rightBud.rotation.set(0.2, -0.35, 0.2);
        caseGroup.add(rightBud);

        group.add(caseGroup);
      } else {
        // --- PROTOTYPE: NEXORO HIGH-END OVER-EAR HEADPHONE ---
        const hpGroup = new THREE.Group();

        // 1. Ear Cups (Left & Right)
        const createEarCup = (isRight: boolean) => {
          const cup = new THREE.Group();

          // Outer Cup Housing (Obsidian)
          const cupGeo = new THREE.CylinderGeometry(0.52, 0.5, 0.26, 36);
          cupGeo.rotateZ(Math.PI / 2);
          const cupMesh = new THREE.Mesh(cupGeo, matObsidian);
          cupMesh.castShadow = true;
          cupMesh.receiveShadow = true;
          cup.add(cupMesh);

          // Outer Copper Accent Bezel
          const copperRingGeo = new THREE.TorusGeometry(0.51, 0.024, 16, 48);
          copperRingGeo.rotateY(Math.PI / 2);
          const copperRing = new THREE.Mesh(copperRingGeo, matCopper);
          copperRing.position.x = isRight ? 0.06 : -0.06;
          cup.add(copperRing);

          // Outer Emblem Center Badge (Brushed Copper NEXORO disk)
          const badgeGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.02, 32);
          badgeGeo.rotateZ(Math.PI / 2);
          const badgeMesh = new THREE.Mesh(badgeGeo, matCopper);
          badgeMesh.position.x = isRight ? 0.13 : -0.13;
          cup.add(badgeMesh);

          // Deep Memory Foam Ear Cushion (Inward Facing)
          const cushionGeo = new THREE.TorusGeometry(0.44, 0.13, 20, 36);
          cushionGeo.rotateY(Math.PI / 2);
          cushionGeo.scale(1, 1.15, 0.85);
          const cushionMesh = new THREE.Mesh(cushionGeo, matCushion);
          cushionMesh.position.x = isRight ? -0.1 : 0.1;
          cup.add(cushionMesh);

          // Swivel Yoke Pivot Fork
          const yokeGeo = new THREE.TorusGeometry(0.6, 0.032, 12, 32, Math.PI);
          yokeGeo.rotateZ(Math.PI / 2);
          const yokeMesh = new THREE.Mesh(yokeGeo, matGraphite);
          yokeMesh.position.x = isRight ? 0.04 : -0.04;
          cup.add(yokeMesh);

          // Copper Pivot Screws
          const pinGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.1, 16);
          const pinTop = new THREE.Mesh(pinGeo, matCopper);
          pinTop.position.set(isRight ? 0.04 : -0.04, 0.6, 0);
          cup.add(pinTop);

          return cup;
        };

        const leftCup = createEarCup(false);
        leftCup.position.set(-0.96, -0.22, 0);
        leftCup.rotation.z = -0.08;
        hpGroup.add(leftCup);

        const rightCup = createEarCup(true);
        rightCup.position.set(0.96, -0.22, 0);
        rightCup.rotation.z = 0.08;
        hpGroup.add(rightCup);

        // 2. Telescoping Vertical Sliders
        const sliderGeo = new THREE.BoxGeometry(0.07, 0.38, 0.045);
        const leftSlider = new THREE.Mesh(sliderGeo, matGraphite);
        leftSlider.position.set(-0.96, 0.22, 0);
        hpGroup.add(leftSlider);

        const rightSlider = new THREE.Mesh(sliderGeo, matGraphite);
        rightSlider.position.set(0.96, 0.22, 0);
        hpGroup.add(rightSlider);

        // Copper Slider Lock Accents
        const lockGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.08, 16);
        const leftLock = new THREE.Mesh(lockGeo, matCopper);
        leftLock.position.set(-0.96, 0.38, 0);
        hpGroup.add(leftLock);

        const rightLock = new THREE.Mesh(lockGeo, matCopper);
        rightLock.position.set(0.96, 0.38, 0);
        hpGroup.add(rightLock);

        // 3. Main Headband Arch (Spring Steel + Obsidian Finish)
        const archGeo = new THREE.TorusGeometry(0.96, 0.045, 16, 64, Math.PI);
        const archMesh = new THREE.Mesh(archGeo, matObsidian);
        archMesh.position.set(0, 0.38, 0);
        archMesh.castShadow = true;
        hpGroup.add(archMesh);

        // Inner Ergonomic Leather Cushion Arch
        const innerArchGeo = new THREE.TorusGeometry(0.91, 0.038, 12, 48, Math.PI * 0.75);
        const innerArchMesh = new THREE.Mesh(innerArchGeo, matCushion);
        innerArchMesh.position.set(0, 0.42, 0);
        hpGroup.add(innerArchMesh);

        // Center Headband Copper Clamp / Badge
        const clampGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.14, 24);
        clampGeo.rotateZ(Math.PI / 2);
        const clampMesh = new THREE.Mesh(clampGeo, matCopper);
        clampMesh.position.set(0, 1.34, 0);
        hpGroup.add(clampMesh);

        group.add(hpGroup);
      }

      return group;
    },
    []
  );

  // Initialize and Run Three.js Scene
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    threeRef.current.disposed = false;
    setIsLoading(true);
    setHasError(false);

    // 1. Scene
    const scene = new THREE.Scene();
    threeRef.current.scene = scene;

    // 2. Camera
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.15, 3.2);
    threeRef.current.camera = camera;

    // 3. Renderer with Anti-Aliasing and Studio Tone Mapping
    let renderer: THREE.WebGLRenderer;
    try {
      // Pre-check WebGL context availability to prevent Three.js capability errors
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) {
        throw new Error('WebGL context is not supported or disabled on this client.');
      }

      renderer = new THREE.WebGLRenderer({
        canvas,
        context: gl as WebGLRenderingContext,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      threeRef.current.renderer = renderer;
    } catch (e) {
      console.warn('WebGL initialization failed, falling back to static visual preview:', e);
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // 4. Studio Lighting Architecture
    const ambientLight = new THREE.AmbientLight(0x20242e, 1.4);
    scene.add(ambientLight);

    // Warm Key Light (top front right)
    const keyLight = new THREE.DirectionalLight(0xffecd6, 2.4);
    keyLight.position.set(3.2, 4.0, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Cool Cyan Fill Light (left side)
    const fillLight = new THREE.DirectionalLight(0x55bbdd, 1.2);
    fillLight.position.set(-3.5, 1.8, 2.0);
    scene.add(fillLight);

    // Warm Copper Rim Light (back top)
    const rimLight = new THREE.DirectionalLight(0xc8834a, 2.2);
    rimLight.position.set(0, 3.2, -3.5);
    scene.add(rimLight);

    // Subtle Cyan Ground Bounce Light
    const bounceLight = new THREE.PointLight(0x06b6d4, 0.5, 6);
    bounceLight.position.set(0, -1.2, 0);
    scene.add(bounceLight);

    // Ground Contact Shadow Disk
    const shadowGeo = new THREE.RingGeometry(0.1, 1.2, 32);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.y = -1.02;
    scene.add(shadowMesh);

    // 5. Root Pivot Group (Rotated directly by telemetry & user interaction)
    const pivotGroup = new THREE.Group();
    scene.add(pivotGroup);
    threeRef.current.pivotGroup = pivotGroup;

    // 6. Model Loading Strategy: Real GLB if available, otherwise High-End Prototype
    const isEarbudsProduct =
      category === 'EARBUDS' ||
      productName.toLowerCase().includes('bud') ||
      productName.toLowerCase().includes('tws');

    const effectiveModelUrl =
      modelUrl ||
      (productName.toLowerCase().includes('halo x1')
        ? '/models/nexoro-halo-x1.glb'
        : productName.toLowerCase().includes('apex')
        ? '/models/nexoro-apex-pro.glb'
        : productName.toLowerCase().includes('vector')
        ? '/models/nexoro-vector-studio.glb'
        : null);

    if (effectiveModelUrl) {
      const loader = new GLTFLoader();
      loader.load(
        effectiveModelUrl,
        (gltf) => {
          if (threeRef.current.disposed) return;

          // Normalize and center model bounding box
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const targetScale = 1.9 / maxDim;

          gltf.scene.scale.setScalar(targetScale);
          gltf.scene.position.set(
            -center.x * targetScale,
            -center.y * targetScale,
            -center.z * targetScale
          );

          gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              if (mesh.material) {
                const mat = mesh.material as THREE.MeshStandardMaterial;
                mat.envMapIntensity = 1.2;
              }
            }
          });

          pivotGroup.add(gltf.scene);
          setModelType('mesh');
          setIsLoading(false);
        },
        undefined,
        (err) => {
          console.warn('GLB load error, falling back to prototype model:', err);
          if (threeRef.current.disposed) return;
          const proto = buildPrototypeScene(isEarbudsProduct);
          pivotGroup.add(proto);
          setModelType('prototype');
          setIsLoading(false);
        }
      );
    } else {
      // Use clean prototype demo object directly
      const proto = buildPrototypeScene(isEarbudsProduct);
      pivotGroup.add(proto);
      setModelType('prototype');
      setIsLoading(false);
    }

    // 7. Render Animation Loop
    let animId: number;
    const renderLoop = () => {
      if (threeRef.current.disposed) return;

      // Sync 3D Pivot Rotation directly to physical geometry
      if (pivotGroup) {
        // Physical geometry Y-rotation
        pivotGroup.rotation.y = (stateRef.current.rotationAngle * Math.PI) / 180;
        // Interactive pitch tilt
        pivotGroup.rotation.x = (stateRef.current.pitchAngle * Math.PI) / 180;
      }

      // Sync Camera Zoom
      if (camera) {
        camera.position.z = 3.2 / stateRef.current.zoomLevel;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(renderLoop);
      threeRef.current.animId = animId;
    };

    animId = requestAnimationFrame(renderLoop);
    threeRef.current.animId = animId;

    // 8. Responsive Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 9. Cleanup & Memory Disposal
    return () => {
      threeRef.current.disposed = true;
      if (animId) cancelAnimationFrame(animId);
      resizeObserver.disconnect();

      // Dispose scene resources
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else if (mesh.material) {
            mesh.material.dispose();
          }
        }
      });

      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [modelUrl, productName, category, buildPrototypeScene]);

  // Drag Interaction Handlers (Mouse & Touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoOrbit(false);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      angle: rotationAngle,
      pitch: pitchAngle,
    };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      // Horizontal drag: 1px = 0.75° rotation
      const newAngle = (dragStartRef.current.angle + deltaX * 0.75) % 360;
      setRotationAngle(newAngle < 0 ? newAngle + 360 : newAngle);

      // Vertical drag: 1px = 0.3° pitch tilt (clamped between -25° and 25°)
      const newPitch = Math.max(Math.min(dragStartRef.current.pitch - deltaY * 0.3, 25), -25);
      setPitchAngle(newPitch);
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch handlers (Mobile Drag & Pinch Zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsAutoOrbit(false);
    if (e.touches.length === 1) {
      setIsDragging(true);
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        dist: 0,
        angle: rotationAngle,
        pitch: pitchAngle,
      };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartRef.current.dist = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const deltaX = e.touches[0].clientX - touchStartRef.current.x;
      const deltaY = e.touches[0].clientY - touchStartRef.current.y;
      const newAngle = (touchStartRef.current.angle + deltaX * 0.75) % 360;
      setRotationAngle(newAngle < 0 ? newAngle + 360 : newAngle);
      const newPitch = Math.max(Math.min(touchStartRef.current.pitch - deltaY * 0.3, 25), -25);
      setPitchAngle(newPitch);
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ratio = dist / (touchStartRef.current.dist || 1);
      setZoomLevel((prev) => Math.min(Math.max(prev * (ratio > 1 ? 1.02 : 0.98), 1.0), 2.5));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    setZoomLevel((prev) => Math.min(Math.max(prev + delta, 1.0), 2.5));
  };

  // Reset view to default
  const handleReset = () => {
    setRotationAngle(0);
    setPitchAngle(0);
    setZoomLevel(1.0);
    setIsAutoOrbit(false);
  };

  const normalizedAngle = Math.round(rotationAngle);
  const rad = (rotationAngle * Math.PI) / 180;
  const lightPositionX = 50 + Math.cos(rad) * 35;

  const content = (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onDoubleClick={handleReset}
      className={`relative w-full overflow-hidden select-none bg-[#090a0d] border border-cyan-500/30 rounded-2xl flex flex-col justify-between ${
        isInline ? 'h-[460px] sm:h-[520px]' : 'h-[75vh] max-h-[800px]'
      }`}
    >
      {/* Dynamic studio lighting reflection backdrop */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-75 opacity-40"
        style={{
          background: `radial-gradient(circle at ${lightPositionX}% 40%, rgba(6, 182, 212, 0.18) 0%, transparent 60%)`,
        }}
      />

      {/* Top Telemetry Overlay */}
      <div className="relative z-20 flex items-center justify-between p-4 sm:p-6 border-b border-white/[0.08] bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded-md bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
            <RotateCw className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>360° VIEW</span>
          </div>

          <span className="text-white/40 text-xs font-mono">|</span>

          <span className="text-xs font-mono font-bold text-white tracking-wider">
            {productName}
          </span>

          <span className="hidden md:inline-block px-2 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase bg-white/5 border border-white/10 text-white/60">
            {modelType === 'mesh' ? 'HARDWARE MESH' : 'PROTOTYPE 3D'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Angle Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/60 border border-white/10 text-[11px] font-mono text-cyan-300">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold">{normalizedAngle}°</span>
          </div>

          {/* Zoom Badge */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-[11px] font-mono text-white/70">
            <span>{zoomLevel.toFixed(1)}x</span>
          </div>

          {!isInline && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
              aria-label="Close 360 viewer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Main 3D Canvas Area */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative flex-1 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden"
      >
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#090a0d]/90 backdrop-blur-md gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            <div className="text-center">
              <span className="text-[11px] font-mono tracking-widest text-cyan-300 uppercase font-bold block">
                LOADING 3D EXPERIENCE
              </span>
              <span className="text-[10px] text-white/40 font-mono tracking-wider mt-0.5 block">
                INITIALIZING THREE.JS HARDWARE PIPELINE
              </span>
            </div>
          </div>
        )}

        {/* Error Fallback with Image */}
        {hasError ? (
          <div className="relative z-20 flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-sm">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-amber-300 tracking-wider uppercase block">
                3D PREVIEW UNAVAILABLE
              </span>
              <p className="text-[11px] text-white/50 mt-1">
                WebGL rendering is restricted on this client. Retaining primary photographic view.
              </p>
            </div>
            <img
              src={imageUrl}
              alt={productName}
              className="max-h-48 object-contain rounded-lg border border-white/10"
            />
          </div>
        ) : (
          /* Actual 3D WebGL Canvas */
          <canvas
            ref={canvasRef}
            className="w-full h-full block touch-none pointer-events-auto"
          />
        )}

        {/* Center Drag Hint Overlay */}
        {!isDragging && !isAutoOrbit && normalizedAngle === 0 && !isLoading && !hasError && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/75 border border-white/15 text-[11px] font-mono text-white/70 backdrop-blur-md pointer-events-none flex items-center gap-2 animate-pulse">
            <Move className="w-3.5 h-3.5 text-cyan-400" />
            <span>DRAG HORIZONTALLY TO ROTATE 360° GEOMETRY</span>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="relative z-20 p-4 sm:p-5 border-t border-white/[0.08] bg-black/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        {/* Rotation Slider */}
        <div className="flex items-center gap-3 flex-1 min-w-[180px]">
          <span className="text-[10px] font-mono text-white/40 uppercase">ANGLE</span>
          <input
            type="range"
            min="0"
            max="359"
            value={normalizedAngle}
            onChange={(e) => {
              setIsAutoOrbit(false);
              setRotationAngle(Number(e.target.value));
            }}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-xs font-mono font-bold text-cyan-400 w-10 text-right">
            {normalizedAngle}°
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Auto Orbit Toggle */}
          <button
            onClick={() => setIsAutoOrbit(!isAutoOrbit)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              isAutoOrbit
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/10'
            }`}
          >
            {isAutoOrbit ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">AUTO-ORBIT</span>
          </button>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 1.0))}
              disabled={zoomLevel <= 1.0}
              className="p-1 text-white/70 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[10px] font-mono text-white/50">{zoomLevel.toFixed(1)}x</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
              disabled={zoomLevel >= 2.5}
              className="p-1 text-white/70 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset View Button */}
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Reset to 0° Angle & 1.0x Zoom"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  if (isInline) {
    return content;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-4xl shadow-2xl shadow-cyan-950/40">
        {content}
      </div>
    </div>
  );
};
