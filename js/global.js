(() => {

  const boxGeometry = (() => {
    const BAG_SIZE = 1;
    const BAG_Y_OFFSET = -0.5;
    const BAG_Z_OFFSET = -0.05;

    const _decomposeObjectMatrixWorld = object => _decomposeMatrix(object.matrixWorld);
    const _decomposeMatrix = matrix => {
      const position = new THREE.Vector3();
      const rotation = new THREE.Quaternion();
      const scale = new THREE.Vector3();
      matrix.decompose(position, rotation, scale);
      return {position, rotation, scale};
    };

    const zeroVector = new THREE.Vector3(0, 0, 0);
    const zeroQuaternion = new THREE.Quaternion();
    const oneVector = new THREE.Vector3(1, 1, 1);
    const localVector = new THREE.Vector3();
    const localVector2 = new THREE.Vector3();
    const localQuaternion = new THREE.Quaternion();
    const localMatrix = new THREE.Matrix4();

    const lineGeometry = new THREE.CylinderBufferGeometry(BAG_SIZE/100, BAG_SIZE/100, BAG_SIZE, 3, 1);
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(lineGeometry.attributes.position.array.length * 12);
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    // axis
    positions.set(
      lineGeometry.clone().applyMatrix(
        localMatrix.makeTranslation(-BAG_SIZE/2, 0, -BAG_SIZE/2)
      ).attributes.position.array,
      lineGeometry.attributes.position.array.length * 0
    );
    positions.set(
      lineGeometry.clone().applyMatrix(
        localMatrix.makeTranslation(BAG_SIZE/2, 0, -BAG_SIZE/2)
      ).attributes.position.array,
      lineGeometry.attributes.position.array.length * 1
    );
    positions.set(
      lineGeometry.clone().applyMatrix(
        localMatrix.makeTranslation(-BAG_SIZE/2, 0, BAG_SIZE/2)
      ).attributes.position.array,
      lineGeometry.attributes.position.array.length * 2
    );
    positions.set(
      lineGeometry.clone().applyMatrix(
        localMatrix.makeTranslation(BAG_SIZE/2, 0, BAG_SIZE/2)
      ).attributes.position.array,
      lineGeometry.attributes.position.array.length * 3
    );
    // axis
    positions.set(
      lineGeometry.clone()
        .applyMatrix(
          localMatrix.makeRotationFromQuaternion(localQuaternion.setFromAxisAngle(localVector.set(0, 0, 1), Math.PI/2))
        )
        .applyMatrix(
          localMatrix.makeTranslation(0, -BAG_SIZE/2, -BAG_SIZE/2)
        ).attributes.position.array,
      lineGeometry.attributes.position.array.length * 4
    );
    positions.set(
      lineGeometry.clone()
        .applyMatrix(
          localMatrix.makeRotationFromQuaternion(localQuaternion.setFromAxisAngle(localVector.set(0, 0, 1), Math.PI/2))
        )
        .applyMatrix(
          localMatrix.makeTranslation(0, -BAG_SIZE/2, BAG_SIZE/2)
        ).attributes.position.array,
      lineGeometry.attributes.position.array.length * 5
    );
    positions.set(
      lineGeometry.clone()
        .applyMatrix(
          localMatrix.makeRotationFromQuaternion(localQuaternion.setFromAxisAngle(localVector.set(0, 0, 1), Math.PI/2))
        )
        .applyMatrix(
          localMatrix.makeTranslation(0, BAG_SIZE/2, -BAG_SIZE/2)
        ).attributes.position.array,
      lineGeometry.attributes.position.array.length * 6
    );
    positions.set(
      lineGeometry.clone()
        .applyMatrix(
          localMatrix.makeRotationFromQuaternion(localQuaternion.setFromAxisAngle(localVector.set(0, 0, 1), Math.PI/2))
        )
        .applyMatrix(
          localMatrix.makeTranslation(0, BAG_SIZE/2, BAG_SIZE/2)
        ).attributes.position.array,
      lineGeometry.attributes.position.array.length * 7
    );
    // axis
    positions.set(
      lineGeometry.clone()
        .applyMatrix(
          localMatrix.makeRotationFromQuaternion(localQuaternion.setFromAxisAngle(localVector.set(1, 0, 0), Math.PI/2))
        )
        .applyMatrix(
          localMatrix.makeTranslation(-BAG_SIZE/2, -BAG_SIZE/2, 0)
        ).attributes.position.array,
      lineGeometry.attributes.position.array.length * 8
    );
    positions.set(
      lineGeometry.clone()
        .applyMatrix(
          localMatrix.makeRotationFromQuaternion(localQuaternion.setFromAxisAngle(localVector.set(1, 0, 0), Math.PI/2))
        )
        .applyMatrix(
          localMatrix.makeTranslation(-BAG_SIZE/2, BAG_SIZE/2, 0)
        ).attributes.position.array,
      lineGeometry.attributes.position.array.length * 9
    );
    positions.set(
      lineGeometry.clone()
        .applyMatrix(
          localMatrix.makeRotationFromQuaternion(localQuaternion.setFromAxisAngle(localVector.set(1, 0, 0), Math.PI/2))
        )
        .applyMatrix(
          localMatrix.makeTranslation(BAG_SIZE/2, -BAG_SIZE/2, 0)
        ).attributes.position.array,
      lineGeometry.attributes.position.array.length * 10
    );
    positions.set(
      lineGeometry.clone()
        .applyMatrix(
          localMatrix.makeRotationFromQuaternion(localQuaternion.setFromAxisAngle(localVector.set(1, 0, 0), Math.PI/2))
        )
        .applyMatrix(
          localMatrix.makeTranslation(BAG_SIZE/2, BAG_SIZE/2, 0)
        ).attributes.position.array,
      lineGeometry.attributes.position.array.length * 11
    );
    const numLinePositions = lineGeometry.attributes.position.array.length / 3;
    const indices = new Uint16Array(lineGeometry.index.array.length * 12);
    for (let i = 0; i < 12; i++) {
      indices.set(
        lineGeometry.index.array,
        lineGeometry.index.array.length * i
      );

      for (let j = 0; j < lineGeometry.index.array.length; j++) {
        lineGeometry.index.array[j] += numLinePositions;
      }
    }
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    return geometry;

    /* const material = new THREE.MeshBasicMaterial({
      color: 0x101010,
      // wireframe: true,
      // transparent: true,
    });
    // material.polygonOffsetFactor = -1;
    material.polygonOffsetUnits = -10;

    return () => new THREE.Mesh(geometry, material); */
  })();
  window.boxGeometry = boxGeometry;
})();
