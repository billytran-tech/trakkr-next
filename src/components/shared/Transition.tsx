import { CSSTransition } from 'react-transition-group';
import { ReactNode } from 'react';

interface Props {
  show: boolean;
  enter: string;
  enterFrom: string;
  enterTo: string;
  leave: string;
  leaveFrom: string;
  leaveTo: string;
  children: ReactNode;
}

const Transition: React.FC<Props> = ({
  show,
  enter,
  enterFrom,
  enterTo,
  leave,
  leaveFrom,
  leaveTo,
  children,
}) => {
  const _enterClasses = enter?.split(' ');
  const _enterFromClasses = enterFrom?.split(' ');
  const _enterToClasses = enterTo?.split(' ');
  const _leaveClasses = leave?.split(' ');
  const _leaveFromClasses = leaveFrom?.split(' ');
  const _leaveToClasses = leaveTo?.split(' ');

  return (
    <CSSTransition
      in={show}
      timeout={300}
      classNames="alert"
      unmountOnExit
      onEnter={() => {
        console.log(_enterClasses);
      }}
      onExited={() => {
        console.log(
          _enterFromClasses,
          _enterToClasses,
          _leaveClasses,
          _leaveFromClasses,
          _leaveToClasses
        );
      }}
    >
      {children}
    </CSSTransition>
  );
};

export default Transition;
