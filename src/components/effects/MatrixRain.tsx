import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { matrixColors } from '../../theme/cyberpunkTheme';

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters
    const chars = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789:・.";=*+-<>¦｜╌ﾘ';
    const charArray = chars.split('');

    // Raindrop settings
    const fontSize = 12;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -canvas.height;
    }

    // Draw function
    const draw = () => {
      ctx.fillStyle = 'rgba(12, 12, 12, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = matrixColors.neonGreen;
      ctx.font = `${fontSize}px "Press Start 2P"`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Draw character
        const x = i * fontSize;
        const y = drops[i];
        
        // Add glow effect
        ctx.shadowBlur = 5;
        ctx.shadowColor = matrixColors.neonGreen;
        
        // Draw with varying opacity based on position
        const opacity = 1 - (y / canvas.height);
        ctx.fillStyle = `rgba(0, 255, 65, ${Math.max(0.3, opacity)})`;
        ctx.fillText(char, x, y);
        
        // Reset shadow
        ctx.shadowBlur = 0;

        // Move drop
        drops[i] += fontSize;
        
        // Reset drop to top with random delay
        if (drops[i] > canvas.height) {
          drops[i] = Math.random() * -100;
        }
      }
    };

    // Animation loop
    let animationFrame: number;
    const animate = () => {
      draw();
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        opacity: 0.3,
        pointerEvents: 'none',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </Box>
  );
};

export default MatrixRain; 