import { KonvaEventObject } from 'konva/lib/Node';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image, Transformer } from 'react-konva';
import { Image as KonvaImage } from 'konva/lib/shapes/Image';
import { Transformer as KonvaTransformer } from 'konva/lib/shapes/Transformer';

import ContextMenu, { Menu } from './common/ContextMenu';
import URLImage from './common/URLImage';
import useCurrentMaterialStore from '../../stores/zustand/currentMaterialState';
import { Layer as KonvaLayer } from 'konva/lib/Layer';

export default function EditingCanvas() {
  const [packageImage, setPackageImage] = useState<HTMLImageElement | null>();
  const [guideImage] = useState<string>('/models/250609/Plane.png');
  const [isClient, setIsClient] = useState(false);
  const [onContextMenu, setOnContextMenu] = useState<boolean>(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [mouseCoordinate, setMouseCoordinate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [size, setSize] = useState<{ width: number; height: number }>();
  const { setMaterial } = useCurrentMaterialStore();
  const [scale, setScale] = useState<number>(1);
  const transformerRef = useRef<KonvaTransformer>(null);
  const imageRef = useRef<KonvaImage>(null);
  const userLayerRef = useRef<KonvaLayer>(null);
  useEffect(() => setIsClient(true), []);

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const direction = e.evt.deltaY > 0 ? 1 : -1;
    const newScale = direction > 0 ? scale * scaleBy : scale / scaleBy;
    setScale(newScale);
  };

  const onRightClickonGuide = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();
    setOnContextMenu(true);
    setMouseCoordinate({ x: e.evt.x, y: e.evt.y });
  };

  const uploadImage = () => {
    if (!imageInputRef.current) return;
    imageInputRef.current.click();
  };

  const onUploadPackaging = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) return;

    const file = files[0];

    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      setPackageImage(img);
    };
  };

  const stageContextMenu: Menu[] = [
    {
      title: '이미지 업로드하기',
      action: uploadImage,
      hasChild: false,
    },
  ];

  useEffect(() => {
    if (packageImage && imageRef.current && transformerRef.current) {
      transformerRef.current.nodes([imageRef.current]);
    }
  }, [packageImage]);

  const handleTransform = () => {
    const node = imageRef.current;

    if (!imageRef.current || !node) return;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);
    setSize({
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
    });

    applyEditing();
  };

  const onImageDragEnd = () => {
    applyEditing();
  };

  const applyEditing = () => {
    if (!userLayerRef.current) return;

    const layer = userLayerRef.current;

    // ✅ 현재 스케일 저장
    const prevScaleX = layer.scaleX();
    const prevScaleY = layer.scaleY();

    // ✅ scale = 1로 임시 조정 (UV 맵 원본 기준으로 export하기 위해)
    layer.scale({ x: 1, y: 1 });

    const uri = layer.toDataURL({ pixelRatio: 2, mimeType: 'image/png' });

    // ✅ 다시 원래대로 되돌림
    layer.scale({ x: prevScaleX, y: prevScaleY });

    setMaterial(uri);
  };

  useEffect(() => {
    if (!imageRef.current) return;
    setSize({ width: Number(imageRef.current.width), height: Number(imageRef.current.height) });
  }, [imageRef]);

  if (isClient)
    return (
      <>
        {onContextMenu ? (
          <ContextMenu menus={stageContextMenu} coordinate={mouseCoordinate} />
        ) : null}
        <Stage
          width={1024}
          height={1024}
          onWheel={handleWheel}
          onContextMenu={onRightClickonGuide}
          onLostPointerCapture={() => {
            console.log('111');
          }}
          onPointerCancel={() => {
            console.log('onpointercancel');
          }}
        >
          {packageImage ? (
            <Layer ref={userLayerRef} scaleX={scale} scaleY={scale}>
              <Image
                image={packageImage}
                alt="package"
                draggable
                id="1"
                ref={imageRef}
                onTransform={handleTransform}
                width={size?.width}
                height={size?.height}
                onDragEnd={onImageDragEnd}
                onTransformEnd={() => {
                  console.log('alksjdaklsjdlkajsd');
                }}
              />
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            </Layer>
          ) : null}

          <Layer scaleX={scale} scaleY={scale}>
            <URLImage src={guideImage} alt="전개도 이미지" listening={false} />
          </Layer>
        </Stage>
        <input type="file" accept="image/*" ref={imageInputRef} onChange={onUploadPackaging} />
      </>
    );
}
