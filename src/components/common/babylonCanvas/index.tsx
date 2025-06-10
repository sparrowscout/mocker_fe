import { useEffect, useRef, useState } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import useCurrentMockerState from '../../../../stores/zustand/currentMockerState';
import useCurrentMaterialStore from '../../../../stores/zustand/currentMaterialState';
import { AbstractMesh } from '@babylonjs/core';

interface BabylonCanvasProps {
  zoomInitial?: number;
}

export default function BabylonCanvas({ zoomInitial = 4 }: BabylonCanvasProps) {
  const [scene, setScene] = useState<BABYLON.Scene | null>(null);
  const { mockerState, setMockerState } = useCurrentMockerState();
  const bablyonCanvasRef = useRef<HTMLCanvasElement>(null);
  const { material } = useCurrentMaterialStore();
  const meshRef = useRef<AbstractMesh>(null);
  const { Engine, Scene, Vector3, HemisphericLight, ArcRotateCamera, Color4 } = BABYLON;

  useEffect(() => {
    if (!meshRef.current || !scene) return;
    const texture = new BABYLON.Texture(
      material,
      scene,
      true,
      false,
      BABYLON.Texture.TRILINEAR_SAMPLINGMODE,
      null,
      null,
      material
    );
    meshRef.current.material = new BABYLON.StandardMaterial('mat', scene);
    meshRef.current.material.diffuseTexture = texture;
  }, [material]);

  useEffect(() => {
    if (window) {
      const resize = () => {
        if (scene) {
          scene.getEngine().resize();
        }
      };
      window.addEventListener('resize', resize);

      return () => {
        window.removeEventListener('resize', resize);
      };
    }
  }, [scene]);

  useEffect(() => {
    if (!bablyonCanvasRef.current) return;

    const engine = new Engine(bablyonCanvasRef.current);
    const scene = new Scene(engine);
    scene.clearColor = new Color4(255, 255, 255);

    // const cam = new FreeCamera("first camera", new Vector3(0, 1, -5), scene);
    const camera = new ArcRotateCamera(
      'camera',
      Math.PI / 4, // 초기 회전
      Math.PI / 3, // 초기 높이
      zoomInitial, // 줌 거리
      new BABYLON.Vector3(0, 0, 0), // Y 값을 낮춰서 화면 중앙 아래로 이동
      scene
    );
    camera.attachControl(bablyonCanvasRef.current, true);
    camera.wheelDeltaPercentage = 0.01; // 줌 속도
    camera.minZ = 0.01; // 줌 최소 거리
    camera.lowerRadiusLimit = 0.5; // 최소 줌 거리 (1보다 작게 줌 불가)

    // camera.panningSensibility = -camera.panningSensibility;
    // camera.angularSensibilityX *= -1; // X축 반전
    // camera.angularSensibilityY *= -1;
    const light = new HemisphericLight('light', new Vector3(3, 10, 0), scene);
    light.intensity = 3;
    const assetsManager = new BABYLON.AssetsManager(scene);
    const meshTask = assetsManager.addMeshTask(
      'loadModel',
      '',
      '/models/250609/',
      'package_2.glb'
      // 'package_1_250513_static_5.glb'
    );

    scene.onReadyObservable.add(() => {
      const animationGroup = scene.animationGroups[0]; // 보통 하나일 경우

      console.log(animationGroup);

      // 마지막 프레임으로 이동
      const lastFrame = animationGroup.to;
      console.log(lastFrame);
      animationGroup.goToFrame(lastFrame);

      animationGroup.stop(); // 자동 재생 방지
    });

    meshTask.onSuccess = (task) => {
      task.loadedMeshes.forEach((mesh) => {
        mesh.position = new BABYLON.Vector3(0, 0, 0);
        meshRef.current = mesh;
        if (mockerState === 'IDLE') {
          attachMeshAction(mesh as BABYLON.Mesh, scene);
        }
      });
    };

    // scene.onPointerObservable.add(onClickCanvas);

    setScene(scene);

    meshTask.onError = (task, message, exception) => {
      console.error('모델 로드 실패:', message, exception);
    };

    assetsManager.load(); // 모델 로드 시작

    engine.runRenderLoop(() => scene.render());

    return () => engine.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bablyonCanvasRef]);

  // function adjustCameraToObjects(scene, camera) {
  //   const meshes = scene.meshes.filter((mesh) => mesh.isVisible);

  //   if (meshes.length === 0) return;

  //   // 전체 오브젝트의 Bounding Box 계산
  //   const boundingBox = BABYLON.Mesh.MinMax(meshes);
  //   const min = boundingBox.min;
  //   const max = boundingBox.max;

  //   // 오브젝트 중앙 좌표 구하기
  //   const center = min.add(max).scale(0.5);
  //   camera.target = center; // 카메라 타겟을 중앙으로 이동

  //   // 오브젝트 크기에 맞게 줌 거리 조정
  //   const size = max.subtract(min).length();
  //   camera.radius = size * 1.5; // 거리 조정 (1.5배 정도 여유)
  // }

  // Babylon에서 pointer event 처리

  // const onClickCanvas = (pointerInfo: BABYLON.PointerInfo) => {
  //   if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
  //     const event = pointerInfo.event;
  //     if (event.button === 2) {
  //       console.log('우클릭 감지됨!');
  //       // 여기에 우클릭 시 실행할 코드 작성
  //       console.log(pointerInfo);
  //     }
  //   }
  // };

  const attachMeshAction = (mesh: BABYLON.Mesh, scene: BABYLON.Scene) => {
    mesh.actionManager = new BABYLON.ActionManager(scene);
    onHoverMesh(mesh, scene, mesh.actionManager);
    onPickMesh(mesh.actionManager);
  };

  const onHoverMesh = (
    mesh: BABYLON.Mesh,
    scene: BABYLON.Scene,
    actionManager: BABYLON.AbstractActionManager
  ) => {
    // mesh.actionManager = new BABYLON.ActionManager(scene);
    const highlightLayer = new BABYLON.HighlightLayer('hl', scene);
    highlightLayer.innerGlow = false;

    actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, () =>
        highlightLayer.addMesh(mesh, BABYLON.Color3.Yellow())
      )
    );

    actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, () =>
        highlightLayer.removeMesh(mesh)
      )
    );
  };

  const onPickMesh = (actionManager: BABYLON.AbstractActionManager) => {
    actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (evt) => {
        const pointerEvent = evt.sourceEvent;

        if (pointerEvent.button === 0) {
          console.log('👈 좌클릭!');
          setMockerState('EDIT_MESH');
        } else if (pointerEvent.button === 2) {
          console.log('👉 우클릭!');
        }
      })
    );
  };

  return <canvas className="w-full h-full bg-black focus:outline-none" ref={bablyonCanvasRef} />;
}
