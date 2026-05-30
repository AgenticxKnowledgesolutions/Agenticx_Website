import { useEffect, useRef } from 'react';
import './NeuralCanvas.css';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulseOffset: number;
  connectionsCount: number;
}

interface TempNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  life: number;
}

export default function NeuralCanvas({ nodeCount }: { nodeCount?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const tempNodesRef = useRef<TempNode[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    // Track frame count for animations
    let frameId: number;
    let frameCount = 0;

    // Adjust canvas dimensions and node count
    const updateSize = (width: number, height: number) => {
      canvas.width = width;
      canvas.height = height;

      const isMobile = window.innerWidth < 768;
      const targetCount = nodeCount !== undefined ? nodeCount : (isMobile ? 40 : 90);
      const currentCount = nodesRef.current.length;

      if (currentCount === 0) {
        // First initialization
        const newNodes: Node[] = [];
        for (let i = 0; i < targetCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 0.4 + 0.2;
          newNodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: Math.random() * 2 + 2, // 2-4px
            opacity: Math.random() * 0.2 + 0.6, // 0.6-0.8
            pulseOffset: Math.random() * Math.PI * 2,
            connectionsCount: 0
          });
        }
        nodesRef.current = newNodes;
      } else {
        // Adjust existing node count
        if (currentCount < targetCount) {
          const diff = targetCount - currentCount;
          for (let i = 0; i < diff; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 0.4 + 0.2;
            nodesRef.current.push({
              x: Math.random() * width,
              y: Math.random() * height,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              radius: Math.random() * 2 + 2,
              opacity: Math.random() * 0.2 + 0.6,
              pulseOffset: Math.random() * Math.PI * 2,
              connectionsCount: 0
            });
          }
        } else if (currentCount > targetCount) {
          nodesRef.current = nodesRef.current.slice(0, targetCount);
        }

        // Clamp positions to bounds
        nodesRef.current.forEach(node => {
          if (node.x > width) node.x = Math.random() * width;
          if (node.y > height) node.y = Math.random() * height;
        });
      }
    };

    // ResizeObserver to track parent container dimensions dynamically
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        updateSize(width, height);
      }
    });

    resizeObserver.observe(parent);

    // Mouse Tracking Event Listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = null;
    };

    // On Click: Spawn temporary burst particles
    const handleMouseClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const spawnCount = Math.floor(Math.random() * 5) + 8; // 8-12 nodes
      const newTemps: TempNode[] = [];

      for (let i = 0; i < spawnCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 3; // 3-5px/frame
        newTemps.push({
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 2 + 2, // 2-4px
          opacity: Math.random() * 0.2 + 0.6, // 0.6-0.8
          life: 1.0 // 1.5s fade out (based on frame decrement)
        });
      }

      tempNodesRef.current.push(...newTemps);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleMouseClick);

    // Animation Loop
    const draw = () => {
      frameCount++;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const tempNodes = tempNodesRef.current;
      const mouse = mouseRef.current;

      // Update positions & apply repulsion
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Apply mouse repulsion if near
        if (mouse) {
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 0) {
            const force = (180 - dist) * 0.012;
            node.x += (dx / dist) * force;
            node.y += (dy / dist) * force;
          }
        }

        // Apply standard velocity
        node.x += node.vx;
        node.y += node.vy;

        // Toroidal Wrap
        if (node.x < 0) node.x += width;
        if (node.x > width) node.x -= width;
        if (node.y < 0) node.y += height;
        if (node.y > height) node.y -= height;

        node.connectionsCount = 0;
      }

      // Draw Connections (limit max connections per node for performance)
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          if (n1.connectionsCount >= 6 || n2.connectionsCount >= 6) continue;

          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const distSq = dx * dx + dy * dy;
          const thresholdSq = 140 * 140;

          if (distSq < thresholdSq) {
            const dist = Math.sqrt(distSq);
            n1.connectionsCount++;
            n2.connectionsCount++;

            const opacity = (1 - dist / 140) * 0.25; // Transparent node connections
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(0, 201, 200, ${opacity})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      // Draw lines from cursor to nearby nodes (200px range)
      if (mouse) {
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const mouseThresholdSq = 200 * 200;

          if (distSq < mouseThresholdSq) {
            const dist = Math.sqrt(distSq);
            const opacity = (1 - dist / 200) * 0.35;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 201, 200, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw main nodes (with pulsing size and opacity)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const pulse = Math.sin(frameCount * 0.05 + node.pulseOffset) * 0.15 + 0.85;
        const radius = node.radius * pulse;
        const opacity = node.opacity * (Math.sin(frameCount * 0.03 + node.pulseOffset) * 0.1 + 0.9);

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 201, 200, ${opacity})`;
        ctx.fill();
      }

      // Update & Draw click particles (temp nodes with 1.5s lifespan)
      for (let i = tempNodes.length - 1; i >= 0; i--) {
        const temp = tempNodes[i];
        temp.x += temp.vx;
        temp.y += temp.vy;
        temp.life -= 1 / 90; // fade out in 90 frames (1.5s at 60fps)

        if (temp.life <= 0) {
          tempNodes.splice(i, 1);
          continue;
        }

        const opacity = temp.opacity * temp.life;
        ctx.beginPath();
        ctx.arc(temp.x, temp.y, temp.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 201, 200, ${opacity})`;
        ctx.fill();
      }

      frameId = requestAnimationFrame(draw);
    };

    draw();

    // Clean up
    return () => {
      resizeObserver.disconnect();
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleMouseClick);
      cancelAnimationFrame(frameId);
    };
  }, [nodeCount]);

  return <canvas ref={canvasRef} className="neural-canvas" />;
}
