import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';

const TooltipContext = createContext({
  activeTooltip: null,
  updateActiveTooltip: () => {},
});

export const TooltipProvider = ({ children }) => {
  const [activeTooltip, updateActiveTooltip] = useState(null);
  useLayoutEffect(() => {
    const removeOutsideClickHandler = () => {
      document.removeEventListener('click', outsideClickListener);
    };
    const outsideClickListener = ({ target }) => {
      if (target.attributes?.role?.nodeValue !== 'tooltip' && activeTooltip) {
        updateActiveTooltip(null);
      }
    };
    document.addEventListener('click', outsideClickListener);

    return () => {
      removeOutsideClickHandler();
    };
  }, [activeTooltip]);

  return (
    <TooltipContext.Provider value={{ activeTooltip, updateActiveTooltip }}>
      {children}
    </TooltipContext.Provider>
  );
};
export const TooltipConsumer = TooltipContext.Consumer;

const TooltipMarkerButton = styled.button`
  background: grey;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  color: white;
  font-weight: 900;
  width: 25px;
  height: 25px;
  text-align: center;
  display: inline-block;
  cursor: pointer;
  outline: 0;
  &:hover {
    background: white;
    color: grey;
  }
`;

export const TooltipMarker = forwardRef(({ id, ...props }, ref) => {
  return (
    <TooltipConsumer>
      {({ updateActiveTooltip }) => (
        <TooltipMarkerButton
          id={id}
          ref={ref}
          {...props}
          onClick={() => updateActiveTooltip(id)}
        >
          ?
        </TooltipMarkerButton>
      )}
    </TooltipConsumer>
  );
});

const TooltipPointer = styled.div`
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 15px solid #dedede;
  position: absolute;
  bottom: -13px;
  ${({ left }) => css`
    left: ${left};
  `}
`;

const Wrapper = styled(motion.div)`
  ${({ position }) => css`
    left: ${position[0]}px;
    top: ${position[1]}px;
  `}
  box-sizing: border-box;
  max-width: 20rem;
  padding: 1rem;
  border-radius: 1rem;
  background: #dedede;
  position: absolute;
  box-shadow: 3px -3px 3px 0 rgba(0, 0, 0, 0.3);
`;

const slideDownVariants = {
  active: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  inactive: {
    opacity: 0,
    y: -40,
    transition: {
      duration: 0.3,
    },
  },
};

const slideUpVariants = {
  active: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  inactive: {
    opacity: 0,
    y: 40,
    transition: {
      duration: 0.3,
    },
  },
};

const baseMotionProps = {
  variants: slideDownVariants,
  initial: 'inactive',
  animate: 'active',
  exit: 'inactive',
};

export const Tooltip = ({ target, children, ...props }) => {
  const { activeTooltip } = useContext(TooltipContext);
  const ref = useRef(null);
  const [position, setPosition] = useState([0, 0]);
  const [motionProps, setMotionProps] = useState(baseMotionProps);
  const [pointerPosition, setPointerPosition] = useState('4%');
  const active = activeTooltip === target;

  useEffect(() => {
    if (!active) return;

    const updatePosition = () => {
      const marker = document.getElementById(target).getBoundingClientRect();
      setPointerPosition(marker.left > window.innerWidth - 100 ? '89%' : '4%');
      setPosition([
        marker.left > window.innerWidth - 100
          ? marker.left +
            window.scrollX -
            ref.current.clientWidth +
            marker.width * 1.5
          : marker.left + window.scrollX - marker.width / 2,
        marker.top > ref.current.clientHeight
          ? marker.top +
            window.scrollY -
            ref.current.clientHeight -
            marker.height / 2
          : marker.top +
            window.scrollY +
            ref.current.clientHeight +
            marker.height / 2,
      ]);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [active, target]);

  const Component = (
    <AnimatePresence>
      {active && (
        <Wrapper
          key={`${target}-tooltip`}
          ref={ref}
          position={position}
          {...props}
          {...motionProps}
        >
          <TooltipPointer left={pointerPosition} />
          {children}
        </Wrapper>
      )}
    </AnimatePresence>
  );
  return createPortal(Component, document.getElementById('tooltips'));
};
