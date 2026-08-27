import { useEffect, useRef } from 'react';

import { settings } from '@/lib/content';
import { useIsFinePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/**
 * Immersive Three.js hero visual: a slow orbital ecosystem — a luminous cobalt
 * ring, orbiting nodes and a fine particle field — that responds to the cursor.
 *
 * Three is imported dynamically with named bindings (so it tree-shakes) and never
 * blocks first paint. The renderer is DPR-capped and paused off-screen / when the
 * tab is hidden; reduced-motion users get a composed still frame instead.
 */
export function HeroCanvas() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isFinePointer = useIsFinePointer();

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !settings.enableHero3D) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const boot = async () => {
      const {
        WebGLRenderer,
        Scene,
        PerspectiveCamera,
        Group,
        Mesh,
        TorusGeometry,
        MeshBasicMaterial,
        SphereGeometry,
        BoxGeometry,
        MeshStandardMaterial,
        BufferGeometry,
        BufferAttribute,
        Points,
        PointsMaterial,
        AmbientLight,
        DirectionalLight,
        PointLight,
        Clock,
      } = await import('three');

      if (disposed || !hostRef.current) return;

      const width = host.clientWidth || 1;
      const height = host.clientHeight || 1;

      const renderer = new WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      host.appendChild(renderer.domElement);

      const scene = new Scene();
      const camera = new PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 9);

      const root = new Group();
      scene.add(root);

      const ink = 0x14151a;
      const cobalt = 0x2647e0;

      // Luminous primary orbit ring.
      const ring = new Mesh(
        new TorusGeometry(2.7, 0.016, 12, 220),
        new MeshBasicMaterial({ color: cobalt, transparent: true, opacity: 0.85 }),
      );
      ring.rotation.x = Math.PI / 2.35;
      root.add(ring);

      // Faint outer counter-ring.
      const ring2 = new Mesh(
        new TorusGeometry(3.4, 0.008, 12, 220),
        new MeshBasicMaterial({ color: ink, transparent: true, opacity: 0.25 }),
      );
      ring2.rotation.x = Math.PI / 1.8;
      root.add(ring2);

      // Orbiting nodes sitting on the primary ring.
      const nodeGroup = new Group();
      nodeGroup.rotation.x = Math.PI / 2.35;
      const nodeCount = 6;
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const isKey = i === 0;
        const node = new Mesh(
          new SphereGeometry(isKey ? 0.09 : 0.05, 20, 20),
          new MeshBasicMaterial({
            color: isKey ? cobalt : ink,
            transparent: true,
            opacity: isKey ? 1 : 0.55,
          }),
        );
        node.position.set(Math.cos(angle) * 2.7, Math.sin(angle) * 2.7, 0);
        nodeGroup.add(node);
      }
      root.add(nodeGroup);

      // Central architectural core: matte shards.
      const core = new Group();
      const shardMat = new MeshStandardMaterial({
        color: 0xe9e5dc,
        roughness: 0.55,
        metalness: 0.15,
      });
      for (let i = 0; i < 5; i++) {
        const shard = new Mesh(
          new BoxGeometry(1.5 - i * 0.22, 0.06, 0.9 - i * 0.1),
          shardMat,
        );
        shard.position.y = i * 0.24 - 0.5;
        shard.rotation.y = i * 0.28;
        core.add(shard);
      }
      root.add(core);

      // Fine particle field.
      const particleCount = 380;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const r = 3.2 + Math.random() * 2.4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
        positions[i * 3 + 2] = r * Math.cos(phi);
      }
      const particleGeo = new BufferGeometry();
      particleGeo.setAttribute('position', new BufferAttribute(positions, 3));
      const particles = new Points(
        particleGeo,
        new PointsMaterial({ color: ink, size: 0.018, transparent: true, opacity: 0.4 }),
      );
      root.add(particles);

      // Lights.
      scene.add(new AmbientLight(0xffffff, 0.85));
      const key = new DirectionalLight(0xffffff, 1.4);
      key.position.set(2, 3, 4);
      scene.add(key);
      const accent = new PointLight(cobalt, 20, 30);
      accent.position.set(-3, 1.5, 3);
      scene.add(accent);

      // Cursor parallax (fine pointers only).
      const target = { x: 0, y: 0 };
      const onPointer = (event: PointerEvent) => {
        target.x = (event.clientX / window.innerWidth - 0.5) * 2;
        target.y = (event.clientY / window.innerHeight - 0.5) * 2;
      };
      if (isFinePointer && !prefersReducedMotion) {
        window.addEventListener('pointermove', onPointer, { passive: true });
      }

      const clock = new Clock();
      let raf = 0;
      let visible = true;

      const renderFrame = () => {
        const t = clock.getElapsedTime();

        root.rotation.y += (target.x * 0.25 - root.rotation.y) * 0.04;
        root.rotation.x += (target.y * 0.12 - root.rotation.x) * 0.04;

        ring.rotation.z = t * 0.12;
        nodeGroup.rotation.z = t * 0.12;
        ring2.rotation.z = -t * 0.05;
        core.rotation.y = t * 0.18;
        core.position.y = Math.sin(t * 0.6) * 0.08;
        particles.rotation.y = t * 0.02;

        renderer.render(scene, camera);
      };

      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (visible && !document.hidden) renderFrame();
      };

      if (prefersReducedMotion) {
        root.rotation.y = 0.35;
        root.rotation.x = 0.08;
        renderer.render(scene, camera);
      } else {
        loop();
      }

      const onResize = () => {
        const w = host.clientWidth || 1;
        const h = host.clientHeight || 1;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        if (prefersReducedMotion) renderer.render(scene, camera);
      };
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(host);

      const io = new IntersectionObserver((entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      });
      io.observe(host);

      cleanup = () => {
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        io.disconnect();
        window.removeEventListener('pointermove', onPointer);
        renderer.dispose();
        scene.traverse((obj) => {
          const mesh = obj as unknown as {
            isMesh?: boolean;
            isPoints?: boolean;
            geometry?: { dispose: () => void };
            material?: { dispose: () => void } | { dispose: () => void }[];
          };
          if (mesh.isMesh || mesh.isPoints) {
            mesh.geometry?.dispose();
            if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
            else mesh.material?.dispose();
          }
        });
        if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
      };
    };

    boot();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [prefersReducedMotion, isFinePointer]);

  return <div ref={hostRef} className="absolute inset-0" aria-hidden="true" />;
}
