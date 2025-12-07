export function createCoverMaterial() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 512, 512);
  gradient.addColorStop(0, '#2d1b4e');
  gradient.addColorStop(0.5, '#1b2d5e');
  gradient.addColorStop(1, '#1a1f3a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = Math.random() * 2;
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.15})`;
    ctx.fillRect(x, y, size, size);
  }

  ctx.strokeStyle = '#8fa3c4';
  ctx.lineWidth = 8;
  ctx.strokeRect(30, 30, 452, 452);

  ctx.strokeStyle = '#6a7fa0';
  ctx.lineWidth = 4;
  ctx.strokeRect(50, 50, 412, 412);

  const texture = new THREE.CanvasTexture(canvas);

  return new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.7,
    metalness: 0.1,
    color: 0xffffff
  });
}

export function createSpineMaterial() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 128, 0);
  gradient.addColorStop(0, '#0a0a0a');
  gradient.addColorStop(0.5, '#1a1a2e');
  gradient.addColorStop(1, '#0a0a0a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 512);

  const texture = new THREE.CanvasTexture(canvas);

  return new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.8,
    metalness: 0.05
  });
}

export function createPageMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0xf2ebe0,
    roughness: 0.9,
    metalness: 0.0,
    side: THREE.DoubleSide,
    clearcoat: 0.05,
    clearcoatRoughness: 0.8
  });
}

export function createPageEdgeMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0xe8ddc8,
    roughness: 1.0,
    metalness: 0.0
  });
}
