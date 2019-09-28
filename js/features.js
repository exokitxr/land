(() => {

let renderer, scene, camera, iframe, container, avatarMesh, avatarMesh2, exobotMesh, sceneMesh, bg;

const localVector = new THREE.Vector3();
const localVector2 = new THREE.Vector3();
const localVector3 = new THREE.Vector3();
const localCoord = new THREE.Vector2();
const localPlane = new THREE.Plane();
const localLine = new THREE.Line3();
const localLine2 = new THREE.Line3();
const localRaycaster = new THREE.Raycaster();

function init() {
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('features-canvas'),
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.sortObjects = false;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  // window.browser.magicleap.RequestDepthPopulation(true);
  // renderer.autoClear = false;

  scene = new THREE.Scene();
  scene.matrixAutoUpdate = false;
  // scene.background = new THREE.Color(0xFFFFFF);

  camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000);
  // camera.rotation.order = 'YXZ';
  scene.add(camera);

  /* const SCENES = {
    desktop: {
      camera: new THREE.Vector3(-1.5, 1, 2),
    },
    mobile: {
      camera: new THREE.Vector3(0, 1.8, 2),
    },
  };
  const _setCamera = () => {
    const SCENE = SCENES[window.innerWidth >= 800 ? 'desktop' : 'mobile'];
    camera.position.copy(SCENE.camera);

    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
  };
  _setCamera(); */

  container = new THREE.Object3D();

  const ambientLight = new THREE.AmbientLight(0x808080);
  scene.add(ambientLight);

  {
    const SHADOW_MAP_WIDTH = 1024;
    const SHADOW_MAP_HEIGHT = 1024;

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3);
    directionalLight.position.set(10, 10, 5);
    directionalLight.target.position.set(0, 0, 0);

    directionalLight.castShadow = true;

    directionalLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 80, 1, 0.1, 1000 ) );
    // directionalLight.shadow.bias = 0.0001;

    directionalLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    directionalLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    container.add(directionalLight);
  }

  /* const groundMesh = (() => {
    const geometry = new THREE.PlaneBufferGeometry(10, 100, 1, 1);
    const uvs = geometry.attributes.uv.array;
    for (let i = 0; i < uvs.length; i += 2) {
      uvs[i+1] *= 10;
    }

    const texture = new THREE.Texture(
      null,
      THREE.UVMapping,
      THREE.RepeatWrapping,
      THREE.RepeatWrapping,
      THREE.NearestFilter,
      THREE.NearestFilter,
      THREE.RGBAFormat,
      THREE.UnsignedByteType,
      1
    );
    new Promise((accept, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = 'assets/graphy.png';
      img.onload = () => {
        accept(img);
      };
      img.onerror = err => {
        reject(err);
      };
    })
      .then(img => {
        texture.image = img;
        texture.needsUpdate = true;
      });

    const material = new THREE.MeshPhongMaterial({
      map: texture,
      color: 0x808080,
    });
    const mesh = new THREE.Mesh(geometry, material);

    // mesh.position.set(0, 0, 0);
    mesh.rotation.x = -Math.PI/2;
    // mesh.scale.set( 100, 100, 100 );

    // mesh.castShadow = false;
    mesh.receiveShadow = true;

    return mesh;
  })();
  container.add(groundMesh); */

  avatarMesh = (() => {
    const DEFAULT_SKIN_URL = 'img/skin2.png';

    const mesh = skin({
      limbs: true,
    });
    mesh.rotation.y = Math.PI;
    mesh.castShadow = true;

    new Promise((accept, reject) => {
      const skinImg = new Image();
      skinImg.crossOrigin = 'Anonymous';
      skinImg.src = DEFAULT_SKIN_URL;
      skinImg.onload = () => {
        accept(skinImg);
      };
      skinImg.onerror = err => {
        reject(err);
      };
    })
      .then(skinImg => {
        mesh.setImage(skinImg);
      });

    return mesh;
  })();
  container.add(avatarMesh);

  avatarMesh2 = (() => {
    const DEFAULT_SKIN_URL = 'img/skin3.png';

    const mesh = skin({
      limbs: true,
    });
    mesh.position.x = -1;
    mesh.position.z = -2;
    mesh.rotation.y = Math.PI;
    mesh.castShadow = true;

    new Promise((accept, reject) => {
      const skinImg = new Image();
      skinImg.crossOrigin = 'Anonymous';
      skinImg.src = DEFAULT_SKIN_URL;
      skinImg.onload = () => {
        accept(skinImg);
      };
      skinImg.onerror = err => {
        reject(err);
      };
    })
      .then(skinImg => {
        mesh.setImage(skinImg);
      });

    return mesh;
  })();
  container.add(avatarMesh2);

  /* const boxMesh = (() => {
    // const geometry = new THREE.BoxBufferGeometry(0.3, 0.3, 0.3);
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      // wireframe: true,
    });
    const mesh = new THREE.Mesh(boxGeometry.clone().applyMatrix(new THREE.Matrix4().makeScale(0.3, 0.3, 0.3)), material);

    const glassesMesh = (() => {
      // const geometry = new THREE.EdgesGeometry(new THREE.BoxBufferGeometry(0.35, 0.15, 0.05));
      const material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        // wireframe: true,
      });
      const mesh = new THREE.Mesh(boxGeometry.clone().applyMatrix(new THREE.Matrix4().makeScale(0.35, 0.15, 0.05)), material);
      mesh.position.set(0, 0.07, -0.3/2 - 0.05/2);

      const eyeMesh = (() => {
        const geometry = new THREE.PlaneBufferGeometry(0.3, 0.1);
        const material = new THREE.MeshBasicMaterial({
          color: 0xec407a,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geometry, material);
        // mesh.position.set(0.09, 0, -0.05/2);
        mesh.position.set(0, 0, -0.05/2);
        return mesh;
      })();
      mesh.add(eyeMesh);

      const leftFrameMesh = (() => {
        const mesh = new THREE.Mesh(boxGeometry.clone().applyMatrix(new THREE.Matrix4().makeScale(0.05, 0.05, 0.3)), material);
        mesh.position.set(-0.18, 0.07, 0.3/2 + 0.05/2);
        mesh.rotation.x = -0.1 * Math.PI;
        mesh.rotation.order = 'YXZ';
        return mesh;
      })();
      mesh.add(leftFrameMesh);
      const rightFrameMesh = (() => {
        const mesh = new THREE.Mesh(boxGeometry.clone().applyMatrix(new THREE.Matrix4().makeScale(0.05, 0.05, 0.3)), material);
        mesh.position.set(0.18, 0.07, 0.3/2 + 0.05/2);
        mesh.rotation.x = -0.1 * Math.PI;
        mesh.rotation.order = 'YXZ';
        return mesh;
      })();
      mesh.add(rightFrameMesh);
      const backFrameMesh = (() => {
        const mesh = new THREE.Mesh(boxGeometry.clone().applyMatrix(new THREE.Matrix4().makeScale(0.3, 0.05, 0.05)), material);
        mesh.position.set(0, 0.13, 0.34);
        mesh.rotation.x = -0.1 * Math.PI;
        mesh.rotation.order = 'YXZ';
        return mesh;
      })();
      mesh.add(backFrameMesh);

      return mesh;
    })();
    mesh.add(glassesMesh);

    return mesh;
  })();
  container.add(boxMesh); */

  scene.add(container);

  exobotMesh = (() => {
    const object = new THREE.Object3D();
    object.rotation.order = 'YXZ';
    object.basePosition = new THREE.Vector3(0, 0.8, 1);
    object.baseScale = new THREE.Vector3(0.2, 0.2, 0.2);

    const loader = new THREE.GLTFLoader().setPath( 'models/' );
    loader.load( 'exobot.glb', function ( o ) {

      o = o.scene;
      o.traverse(e => {
        e.castShadow = true;
      });

      /* o.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(0, 0, 1)
      ); */
      o.updateMatrixWorld();
      object.add(o);

    }, undefined, function ( e ) {

      console.error( e );

    } );

    return object;
  })();
  container.add(exobotMesh);

  sceneMesh = (() => {
    const object = new THREE.Object3D();
    object.tabs = [];
    object.boxMesh = null;

    const loader = new THREE.GLTFLoader().setPath( 'models/' );
    loader.load( 'scene.glb', function ( o ) {

      o = o.scene;

      // console.log(o);

      for (let i = 0; i < o.children.length; i++) {
        const child = o.children[i];
        let match;
        if (match = child.name.match(/^tab_([0-9]+)$/i)) {
          const tab = child;
          tab.basePosition = child.position.clone();
          object.tabs[parseInt(match[1], 10) - 1] = tab;
        } else if (/^box$/i.test(child.name)) {
          object.boxMesh = child;
          // window.boxMesh = object.boxMesh;
        }
      }
      /* o.traverse(e => {
        e.castShadow = true;
      }); */

      o.updateMatrixWorld();
      object.add(o);

    }, undefined, function ( e ) {

      console.error( e );

    } );

    return object;
  })();
  container.add(sceneMesh);

  const tabMeshes = (() => {
    const object = new THREE.Object3D();

    const tabMesh1 = (() => {
      const material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        // wireframe: true,
      });
      const mesh = new THREE.Mesh(boxGeometry.clone().applyMatrix(new THREE.Matrix4().makeScale(1, 1, 0)), material);
      mesh.position.set(-2, 1.2, 1);
      mesh.rotation.y = Math.PI/6;
      mesh.rotation.order = 'YXZ';

      const labelMesh = (() => {
        const geometry = new THREE.PlaneBufferGeometry(1, 0.2);
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024 * 0.2;
        // canvas.style.backgroundColor = 'red';
        const ctx = canvas.getContext('2d');
        ctx.font = '140px -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        ctx.fillText('http://A-Frame', 0, 150);
        // window.document.body.appendChild(canvas);
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          alphaTest: 0.5,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0.7;
        return mesh;
      })();
      mesh.add(labelMesh);

      return mesh;
    })();
    object.add(tabMesh1);
    const innerMesh1 = (() => {
      const geometry = new THREE.PlaneBufferGeometry(1, 1);
      const mesh = new THREE.Reflector(geometry, {
        clipBias: 0.003,
        textureWidth: 1024 * window.devicePixelRatio,
        textureHeight: 1024 * window.devicePixelRatio,
        color: 0x889999,
        addColor: 0x7e57c2,
        recursion: 1
      });
      mesh.position.copy(tabMesh1.position);
      mesh.rotation.copy(tabMesh1.rotation);
      mesh.scale.copy(tabMesh1.scale);
      return mesh;
    })();
    object.add(innerMesh1);

    const tabMesh2 = (() => {
      const material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        // wireframe: true,
      });
      const mesh = new THREE.Mesh(boxGeometry.clone().applyMatrix(new THREE.Matrix4().makeScale(1, 1, 0)), material);
      mesh.position.set(1.2, 1.5, -1);
      // mesh.rotation.y = Math.PI/6;
      // mesh.rotation.order = 'YXZ';

      const labelMesh = (() => {
        const geometry = new THREE.PlaneBufferGeometry(1, 0.2);
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024 * 0.2;
        // canvas.style.backgroundColor = 'red';
        const ctx = canvas.getContext('2d');
        ctx.font = '140px -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        ctx.fillText('http://myxr.com', 0, 150);
        // window.document.body.appendChild(canvas);
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          alphaTest: 0.5,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0.7;
        return mesh;
      })();
      mesh.add(labelMesh);

      return mesh;
    })();
    object.add(tabMesh2);
    const innerMesh2 = (() => {
      const geometry = new THREE.PlaneBufferGeometry(1, 1);
      const mesh = new THREE.Reflector(geometry, {
        clipBias: 0.003,
        textureWidth: 1024 * window.devicePixelRatio,
        textureHeight: 1024 * window.devicePixelRatio,
        color: 0x889999,
        addColor: 0x66bb6a,
        recursion: 1
      });
      mesh.position.copy(tabMesh2.position);
      mesh.rotation.copy(tabMesh2.rotation);
      mesh.scale.copy(tabMesh2.scale);
      return mesh;
    })();
    object.add(innerMesh2);

    return object;
  })();
  scene.add(tabMeshes);

  bg = (() => {
    const geometry = new THREE.SphereGeometry(100, 16, 10);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('');
    const uniforms = {  
      texture: {
        type: 't',
        value: loader.load('assets/milk.jpg')
      },
      diffuse: {
        type: 'f',
        value: 0,
      },
    };
    const material = new THREE.ShaderMaterial( {  
      uniforms: uniforms,
      vertexShader: `
        varying vec2 vUV;
        void main() {  
          vUV = uv;
          vec4 pos = vec4(position, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * pos;
        }
      `,
      fragmentShader: `
        uniform sampler2D texture;
        uniform float diffuse;
        varying vec2 vUV;
        void main() {  
          vec4 sample = texture2D(texture, vUV);
          gl_FragColor = vec4((1.0-sample.xyz*diffuse), sample.w);
        }
      `,
    });
    bg = new THREE.Mesh(geometry, material);
    // bg.renderDepth = 1000.0;  
    bg.material.side = THREE.BackSide;
    bg.position.x = -0.45;
    bg.position.y = 2.2;
    bg.rotateZ(1/4*Math.PI);
    // bg.rotateY(1/4*Math.PI);
    return bg;
  })();
  scene.add(bg);

  const walkRate = 500;
  window.addEventListener('scroll', e => {
    const parent = document.getElementById('featuresParent');
    const bodyBox = document.body.getBoundingClientRect();
    const parentBox = parent.getBoundingClientRect();
    const parentBoxAbs = {
      top: parentBox.top - bodyBox.top,
      height: parentBox.height,
    };
    const featuresRight = document.getElementById('featuresRight');
    const featuresRightChildren = featuresRight.querySelectorAll('a');

    const factor = (window.pageYOffset >= parentBoxAbs.top) ?
      (window.scrollY % walkRate) / walkRate
    : 0;
    const factor2 = (factor + 0.2) % 1;
    const factor3 = factor2;
    const factor4 = Math.min(Math.max((window.pageYOffset - parentBoxAbs.top) / (parentBoxAbs.height - window.innerHeight), 0), 1);
    const factor5 = factor4 * featuresRightChildren.length;
    const factor6 = factor5 + 0.5;
    const factor7 = Math.min(Math.max((factor5-2.5)/1.5, 0), 1);
    const factor8 = Math.min(Math.max((factor7 - 0.95)/0.05, 0), 1);

    if (factor5 < 2.5) {
      {
        avatarMesh.rotation.x = -Math.PI/10;
        avatarMesh.material.uniforms.theta.value = Math.sin(factor * Math.PI*2)*1.2;

        const quaternion = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(Math.sin(factor*2 * Math.PI*2)*0.2, Math.sin(Math.PI/8 + factor * Math.PI*2)*0.2, 0, 'YXZ')
        );
        avatarMesh.material.uniforms.headRotation.value.x = quaternion.x;
        avatarMesh.material.uniforms.headRotation.value.y = quaternion.y;
        avatarMesh.material.uniforms.headRotation.value.z = quaternion.z;
        avatarMesh.material.uniforms.headRotation.value.w = quaternion.w;

        avatarMesh.position.y = 0.18 + Math.sin(factor*2 * Math.PI*2)*0.05;
        avatarMesh.matrixWorldNeedsUpdate = true;
      }
      {
        avatarMesh2.rotation.x = -Math.PI/10;
        avatarMesh2.material.uniforms.theta.value = Math.sin(factor2 * Math.PI*2)*1.2;

        const quaternion = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(-Math.PI/20 + Math.sin(factor2*2 * Math.PI*2)*0.2, -Math.PI/8 + Math.sin(Math.PI/8 + factor2 * Math.PI*2)*0.1, 0, 'YXZ')
        );
        avatarMesh2.material.uniforms.headRotation.value.x = quaternion.x;
        avatarMesh2.material.uniforms.headRotation.value.y = quaternion.y;
        avatarMesh2.material.uniforms.headRotation.value.z = quaternion.z;
        avatarMesh2.material.uniforms.headRotation.value.w = quaternion.w;

        avatarMesh2.position.y = 0.18 + Math.sin(factor2*2 * Math.PI*2)*0.05;
        avatarMesh2.matrixWorldNeedsUpdate = true;

        avatarMesh2.visible = true;
      }
      {
        exobotMesh.position
          .copy(exobotMesh.basePosition)
          .add(new THREE.Vector3(Math.cos(factor3 * Math.PI*2)*0.05, Math.sin(factor3 * Math.PI*2)*0.05, 0));
        exobotMesh.rotation.z = Math.sin(factor3 * Math.PI*2)*0.1;
        exobotMesh.scale.copy(exobotMesh.baseScale);
        exobotMesh.matrixWorldNeedsUpdate = true;
        exobotMesh.visible = true;
      }
      {
        const f = -factor5*10;

        sceneMesh.position.z = f;
        sceneMesh.matrixWorldNeedsUpdate = true;

        tabMeshes.position.z = f;
        tabMeshes.matrixWorldNeedsUpdate = true;
      }
      if (sceneMesh.boxMesh) {
        sceneMesh.boxMesh.visible = false;
      }
      {
        bg.scale.set(1, 1, 1);
        bg.visible = true;
      }
      {
        camera.position.set(0, 1.5, 2.5);
        camera.lookAt(0, 1.5, 0);
        // camera.rotation.x = Math.PI/20;
      }
    } else {
      {
        avatarMesh.position.y = 0.18;
        avatarMesh.rotation.x = 0;

        const rightArmQuaternion = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(-factor7*0.4 * Math.PI*2, factor7*0.1 * Math.PI*2, 0, 'YXZ')
        );
        avatarMesh.material.uniforms.rightArmRotation.value.x = rightArmQuaternion.x;
        avatarMesh.material.uniforms.rightArmRotation.value.y = rightArmQuaternion.y;
        avatarMesh.material.uniforms.rightArmRotation.value.z = rightArmQuaternion.z;
        avatarMesh.material.uniforms.rightArmRotation.value.w = rightArmQuaternion.w;

        const headQuaternion = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(-factor7/8 * Math.PI*2, 0, 0, 'YXZ')
        );
        avatarMesh.material.uniforms.headRotation.value.x = headQuaternion.x;
        avatarMesh.material.uniforms.headRotation.value.y = headQuaternion.y;
        avatarMesh.material.uniforms.headRotation.value.z = headQuaternion.z;
        avatarMesh.material.uniforms.headRotation.value.w = headQuaternion.w;

        avatarMesh.material.uniforms.theta.value = 0.05*Math.PI*2;
        avatarMesh.matrixWorldNeedsUpdate = true;
      }
      {
        avatarMesh2.position.y = 0.18;
        avatarMesh2.rotation.x = 0;
        avatarMesh2.material.uniforms.theta.value = -0.05*Math.PI*2;
        avatarMesh2.material.uniforms.headRotation.value.set(0, 0, 0, 1);
        avatarMesh2.matrixWorldNeedsUpdate = true;
        avatarMesh2.visible = factor7 < 0.5;
      }
      {
        const f = 1 - factor8;

        if (f > 0) {
          exobotMesh.position
            .copy(exobotMesh.basePosition)
            .add(new THREE.Vector3(-Math.pow(factor7, 0.3)*0.5, factor7*1.5, -factor7*0.8));
          exobotMesh.rotation.z = 0;
          exobotMesh.scale
            .copy(exobotMesh.baseScale)
            .multiplyScalar(f);
          exobotMesh.matrixWorldNeedsUpdate = true;
          exobotMesh.visible = true;
        } else {
          exobotMesh.visible = false;
        }
      }
      {
        sceneMesh.position.z = -2.5*10;
        sceneMesh.matrixWorldNeedsUpdate = true;

        tabMeshes.position.z = -2.5*10;
        tabMeshes.matrixWorldNeedsUpdate = true;
      }
      if (sceneMesh.boxMesh) {
        if (factor8 > 0) {
          // console.log(factor8);
          // sceneMesh.boxMesh.position.set(0, 1.5, 0.45);
          sceneMesh.boxMesh.scale.set(factor8, factor8, factor8);
          sceneMesh.boxMesh.matrixWorldNeedsUpdate = true;
          sceneMesh.boxMesh.visible = true;
        } else {
          sceneMesh.boxMesh.visible = false;
        }
      }
      {
        const f = 1 - Math.pow(factor7, 0.1);

        if (f > 0) {
          bg.scale.set(f, f, f);
          bg.visible = true;
        } else {
          bg.visible = false;
        }
      }
      {
        camera.position.set(0 - Math.sin(factor7*Math.PI)*0.7, 1.5, 2.5 + (-1 + Math.cos(factor7*Math.PI))*2.5);
        camera.lookAt(0, 1.5 + factor7*0.5, factor7);
        // camera.rotation.x = Math.PI/20;
        // console.log('camera', camera);
      }
    }
    {
      const index = Math.floor(factor6);
      const prevIndex = index - 1;

      for (let i = 0; i < sceneMesh.tabs.length; i++) {
        const tab = sceneMesh.tabs[i];
        tab.position
          .copy(tab.basePosition);
        const visible = i >= index-1;
        tab.visible = visible;

        if (i === 0) {
          tabMeshes.visible = visible;
        }
      }

      const fract = factor6 % 1;
      if (sceneMesh.tabs[prevIndex]) {
        const prevTab = sceneMesh.tabs[prevIndex];
        prevTab.position
          .copy(prevTab.basePosition)
          .add(
            localVector.set(0, -Math.pow(fract,2)*50, 0)
          );

        if (prevIndex === 0) {
          tabMeshes.position.y = -Math.pow(fract,2)*50;
        }
      }
      {
        bg.rotation.x = -factor5*0.5 * Math.PI*2;
        bg.material.uniforms.diffuse.value = factor4*2;
      }
    }
  });

  window.addEventListener('resize', e => {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
  });

  focused = true;
}

init();

let lastUpdateTime = Date.now();
let lastRattleTime = Date.now();
let lastRattleDirection = false;
function animate() {
  const now = Date.now();
  const timeDiff = now - lastUpdateTime;

  // const walkRate = 2000;
  // avatarMesh.material.uniforms.theta.value = Math.sin((now % walkRate) / walkRate * Math.PI*2);

  renderer.render(scene, camera);
  lastUpdateTime = now;
}

renderer.setAnimationLoop(animate);

})();
