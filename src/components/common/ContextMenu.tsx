import { useState } from 'react';
import tw, { css, styled } from 'twin.macro';
// import tw, { styled } from 'twin.macro';

interface ContextMenuProps {
  menus: Menu[];
  coordinate: Coordinate;
}

export interface Coordinate {
  x: number;
  y: number;
}
export interface Menu {
  title: string;
  action: () => void;
  hasChild: boolean;
  child?: Menu[];
}

export default function ContextMenu({ menus, coordinate }: ContextMenuProps) {
  const [onHover, setOnHover] = useState<boolean>(false);

  const onClickMenu = (action: () => void) => {
    action();
  };

  const onMouseEnterMenu = () => {
    setOnHover(true);
  };

  const onMouseLeaveMenu = () => {
    setOnHover(false);
  };

  return (
    <>
      {menus.map((item) => {
        return (
          <>
            <ContextMenuContainer
              $x={coordinate.x}
              $y={coordinate.y}
              key={item.title}
              onClick={() => onClickMenu(item.action)}
              onMouseEnter={item.hasChild ? onMouseEnterMenu : undefined}
              onMouseLeave={item.hasChild ? onMouseLeaveMenu : undefined}
            >
              <div className="cursor-pointer p-4 rounded-md hover:bg-slate-100">{item.title}</div>
            </ContextMenuContainer>
            {item.hasChild && onHover && (
              <div>
                {item.child?.map((item) => {
                  return <div key={item.title}>{item.title}</div>;
                })}
              </div>
            )}
          </>
        );
      })}
    </>
  );
}

interface ContainerProps {
  $x: number;
  $y: number;
}

const ContextMenuContainer = styled.div<ContainerProps>(({ $x, $y }) => [
  tw`absolute z-10 bg-white shadow-md rounded-md p-2 min-w-10`,
  css`
    left: ${$x}px;
    top: ${$y}px;
  `,
]);
