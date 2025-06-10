import '@babylonjs/loaders/glTF';
// import * as BABYLON from "babylonjs";
import Image from 'next/image';
import { BoxOpenedThumbnail } from '../../public/images/thumbnails';
import BabylonCanvas from '@/components/common/babylonCanvas';
import useCurrentModelStore from '../../stores/zustand/currentModelState';
import useCurrentMockerState from '../../stores/zustand/currentMockerState';
import EditingMesh from '@/components/common/EditingMesh';
export default function Home() {
  const { model, setModel } = useCurrentModelStore();
  const { mockerState } = useCurrentMockerState();
  const onClickModel = (value: string) => {
    setModel(value);
  };
  return (
    <>
      {mockerState === 'EDIT_MESH' ? (
        <EditingMesh />
      ) : (
        <div className="flex w-full h-full">
          <div className="bg-gray-300 min-w-40 h-dvh">
            tool bar
            <div>
              <Image
                alt="cardboard box thumbnail"
                src={BoxOpenedThumbnail}
                className="cursor-pointer"
                width={100}
                height={100}
                onClick={() => onClickModel('cardboardBox')}
              />
            </div>
          </div>
          {model ? <BabylonCanvas /> : null}
        </div>
      )}
    </>
  );
}
