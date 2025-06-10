import URLImage, { URLImageProps } from './common/URLImage';

interface CustomImageProps {
  handleTransform: () => void;
}

export default function CustomImage({
  handleTransform,
  src,
  alt,
}: CustomImageProps & URLImageProps) {
  return <URLImage src={src} alt={alt} onTransform={handleTransform} />;
}
