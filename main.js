let scene, camera, renderer, controls;
let book;
let raycaster, mouse;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a2e);
  scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(8, 6, 10);
  camera.lookAt(0, 2, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  document.getElementById('container').appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 5;
  controls.maxDistance = 20;
  controls.maxPolarAngle = Math.PI / 2;
  controls.target.set(0, 2, 0);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xfff4e6, 0.8);
  directionalLight.position.set(5, 10, 7);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;
  directionalLight.shadow.bias = -0.0001;
  scene.add(directionalLight);

  const fillLight = new THREE.DirectionalLight(0x6495ed, 0.3);
  fillLight.position.set(-5, 3, -5);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.2);
  rimLight.position.set(0, 5, -10);
  scene.add(rimLight);

  const floorGeometry = new THREE.PlaneGeometry(100, 100);
  const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  book = new Book();
  scene.add(book.group);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('click', onMouseClick);

  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersectObjects = [
    book.coverFront,
    book.coverBack,
    book.spine,
    ...book.pages.map(p => p.mesh)
  ];

  const intersects = raycaster.intersectObjects(intersectObjects, true);

  if (intersects.length > 0) {
    if (!book.isOpen) {
      book.openBook();
    } else {
      const clickX = event.clientX / window.innerWidth;

      if (clickX > 0.5) {
        book.flipForward();
      } else {
        book.flipBackward();
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener('DOMContentLoaded', init);
