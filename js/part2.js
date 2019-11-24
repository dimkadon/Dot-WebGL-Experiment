function three_init_part2() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

  function makeScene(elem) {
    const scene = new THREE.Scene();

    const fov = 45;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 1, 2);
    camera.lookAt(0, 0, 0);

    {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      scene.add(light);
    }

    return { scene, camera, elem };
  }

  function setupScene1() {
    const sceneInfo = makeScene(document.querySelector("#box"));
    const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: "red" });
    const mesh = new THREE.Mesh(geometry, material);
    sceneInfo.scene.add(mesh);
    sceneInfo.mesh = mesh;
    return sceneInfo;
  }

  function setupScene2() {
    const sceneInfo = makeScene(document.querySelector("#pyramid"));
    const radius = 0.8;
    const widthSegments = 4;
    const heightSegments = 2;
    const geometry = new THREE.SphereBufferGeometry(
      radius,
      widthSegments,
      heightSegments
    );
    const material = new THREE.MeshPhongMaterial({
      color: "blue",
      flatShading: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    sceneInfo.scene.add(mesh);
    sceneInfo.mesh = mesh;
    return sceneInfo;
  }

  const sceneInfo1 = setupScene1();
  const sceneInfo2 = setupScene2();

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function renderSceneInfo(sceneInfo) {
    const { scene, camera, elem } = sceneInfo;

    // get the viewport relative position opf this element
    const {
      left,
      right,
      top,
      bottom,
      width,
      height
    } = elem.getBoundingClientRect();

    const isOffscreen =
      bottom < 0 ||
      top > renderer.domElement.clientHeight ||
      right < 0 ||
      left > renderer.domElement.clientWidth;

    if (isOffscreen) {
      return;
    }

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
    renderer.setScissor(left, positiveYUpBottom, width, height);
    renderer.setViewport(left, positiveYUpBottom, width, height);

    renderer.render(scene, camera);
  }

  function render(time) {
    time *= 0.001;

    resizeRendererToDisplaySize(renderer);

    renderer.setScissorTest(false);
    renderer.clear(true, true);
    renderer.setScissorTest(true);

    sceneInfo1.mesh.rotation.y = time * 0.1;
    sceneInfo2.mesh.rotation.y = time * 0.1;

    renderSceneInfo(sceneInfo1);
    renderSceneInfo(sceneInfo2);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

// main();
