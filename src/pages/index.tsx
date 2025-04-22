import '@babylonjs/loaders/glTF';
// import * as BABYLON from "babylonjs";
import Image from 'next/image';
import { CardboardBoxThumbnail } from '../../public/images/thumbnails';
import BabylonCanvas from '@/components/common/babylonCanvas';
import useCurrentModelStore from '../../stores/zustand/currentModelState';

export default function Home() {
  const { model, setModel } = useCurrentModelStore();
  const onClickModel = (value: string) => {
    setModel(value);
  };
  return (
    <div className="flex w-full h-full">
      <div className="bg-gray-300 min-w-40 h-dvh">
        tool bar
        <div>
          <Image
            alt="cardboard box thumbnail"
            src={CardboardBoxThumbnail}
            className="cursor-pointer"
            width={100}
            height={100}
            onClick={() => onClickModel('cardboardBox')}
          />
        </div>
      </div>
      {model ? <BabylonCanvas /> : null}
    </div>
  );
}
