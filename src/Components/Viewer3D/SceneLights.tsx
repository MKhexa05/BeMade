const SceneLights = () => {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 0.1, 0]} intensity={1.6} />
      <directionalLight position={[-3, 0.1, 0]} intensity={1.6} />
      {/* <spotLight
        position={[0, 5, 1]}
        intensity={1.2}
        // angle={0.4}
        // penumbra={0.5}
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-radius={14}
        shadow-bias={-0.0001}
        castShadow
      >
        <object3D attach="target" position={[0, 1, 0]} />
      </spotLight> */}

      <directionalLight position={[-8, 1.5, 2]} intensity={1.6} />
    </>
  );
};

export default SceneLights;
