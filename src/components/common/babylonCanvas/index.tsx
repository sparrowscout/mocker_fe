import { useEffect, useRef, useState } from "react";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

export default function BabylonCanvas() {
  const [scene, setScene] = useState<BABYLON.Scene | null>(null);
  const bablyonCanvasRef = useRef<HTMLCanvasElement>(null);

  const { Engine, Scene, Vector3, HemisphericLight, ArcRotateCamera, Color4 } =
    BABYLON;

  useEffect(() => {
    if (window) {
      const resize = () => {
        if (scene) {
          scene.getEngine().resize();
        }
      };
      window.addEventListener("resize", resize);

      return () => {
        window.removeEventListener("resize", resize);
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
      "camera",
      Math.PI / 1.5, // 초기 회전
      Math.PI / 3, // 초기 높이
      2, // 줌 거리
      new BABYLON.Vector3(0, 0.1, 0), // Y 값을 낮춰서 화면 중앙 아래로 이동
      scene
    );
    camera.attachControl(bablyonCanvasRef.current, true);
    camera.wheelDeltaPercentage = 0.01; // 줌 속도
    camera.minZ = 0.01; // 줌 최소 거리
    camera.lowerRadiusLimit = 0.5; // 최소 줌 거리 (1보다 작게 줌 불가)

    // camera.panningSensibility = -camera.panningSensibility;
    // camera.angularSensibilityX *= -1; // X축 반전
    // camera.angularSensibilityY *= -1;
    const light = new HemisphericLight("light", new Vector3(3, 10, 0), scene);
    light.intensity = 3;
    const assetsManager = new BABYLON.AssetsManager(scene);
    const meshTask = assetsManager.addMeshTask(
      "loadModel",
      "",
      "/models/",
      "box.glb"
    );

    meshTask.onSuccess = (task) => {
      task.loadedMeshes.forEach((mesh) => {
        mesh.position = new BABYLON.Vector3(0, 0, 0);
      });
    };

    setScene(scene);

    meshTask.onError = (task, message, exception) => {
      console.error("모델 로드 실패:", message, exception);
    };

    assetsManager.load(); // 모델 로드 시작

    engine.runRenderLoop(() => scene.render());

    return () => engine.dispose();
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

  return (
    <canvas
      className="w-full h-full bg-black focus:outline-none"
      ref={bablyonCanvasRef}
    />
  );
}
