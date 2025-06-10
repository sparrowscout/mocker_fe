import { Image } from 'react-konva';
import { Image as KonvaImage } from 'konva/lib/shapes/Image';
import useImage from 'use-image';

export interface URLImageProps {
  src: string;
  alt: string;
}

export default function URLImage({
  src,
  alt,
  ...rest
}: URLImageProps & Omit<KonvaImage['attrs'], 'image'>) {
  const [image] = useImage(src, 'anonymous');

  return <Image image={image} {...rest} alt={alt} />;
}
