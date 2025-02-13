import "@babylonjs/loaders/glTF";
// import * as BABYLON from "babylonjs";
import Image from "next/image";
import { CardboardBoxThumbnail } from "../../public/images/thumbnails";

export default function Home() {
  return (
    <div>
      <div className="bg-gray-300 max-w-40 h-dvh">
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
    </div>
  );
}
