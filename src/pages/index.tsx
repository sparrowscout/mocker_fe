import "@babylonjs/loaders/glTF";
// import * as BABYLON from "babylonjs";
import Image from "next/image";
import { CardboardBoxThumbnail } from "../../public/images/thumbnails";
import BabylonCanvas from "@/components/common/babylonCanvas";

export default function Home() {
  return (
    <div className="flex w-full h-full">
      <div className="bg-gray-300 min-w-40 h-dvh">
        tool bar
        <div>
          <Image
            alt="cardboard box thumbnail"
            src={CardboardBoxThumbnail}
            width={100}
            height={100}
          />
        </div>
      </div>
      <BabylonCanvas />
    </div>
  );
}
