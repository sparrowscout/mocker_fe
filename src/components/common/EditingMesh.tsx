import BabylonCanvas from './babylonCanvas';
import CloseIcon from '@mui/icons-material/Close';
import useCurrentMockerState from '../../../stores/zustand/currentMockerState';
import EditingCanvas from '../EditingCanvas';
export default function EditingMesh() {
  const { setMockerState } = useCurrentMockerState();

  const onClickClose = () => {
    setMockerState('IDLE');
  };

  return (
    <div className="w-dvw h-dvh z-10 absolute bg-white">
      <div className="w-full flex justify-end py-4 px-3">
        <CloseIcon sx={{ fontSize: '2rem' }} className="cursor-pointer" onClick={onClickClose} />
      </div>

      <div>
        <div className="h-48 w-48 [&>canvas]:rounded-md absolute right-3 shadow-lg z-10">
          <BabylonCanvas zoomInitial={3} />
        </div>
      </div>

      <EditingCanvas />
    </div>
  );
}
