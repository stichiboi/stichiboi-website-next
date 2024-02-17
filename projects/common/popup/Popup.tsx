import {CSSProperties, ReactNode, useEffect, useState} from "react";
import {
  autoUpdate,
  Middleware,
  offset,
  Placement,
  useFloating,
  shift,
  useClick,
  useDismiss, useTransitionStyles, useInteractions, FloatingPortal
} from "@floating-ui/react";
import buttonStyles from "../button/ButtonCTA.module.css";

interface PopupProps {
  label?: ReactNode,
  labelClassName?: string,
  labelStyle?: CSSProperties,
  labelTooltip?: string,
  children?: ReactNode,
  containerClassName?: string,
  onToggle?: (toggled: boolean) => unknown,
  triggerClose?: unknown,
  triggerOpen?: unknown,
  placement?: Placement,
  floatingPortalParent?: HTMLElement | null,
  middleware?: Middleware[],
  useAutoUpdate?: boolean,
  offsetOptions?: number | { mainAxis?: number, crossAxis?: number }
}

export function Popup({
  label,
  labelClassName,
  labelStyle,
  labelTooltip,
  children,
  containerClassName,
  onToggle,
  triggerClose,
  triggerOpen,
  placement,
  floatingPortalParent,
  middleware,
  useAutoUpdate,
  offsetOptions,
}: PopupProps): JSX.Element {

  const [open, setOpen] = useState(false);
  const {x, y, strategy, refs, context} = useFloating({
    whileElementsMounted: useAutoUpdate ? autoUpdate : undefined,
    strategy: "absolute",
    open, onOpenChange: setOpen,
    placement: placement || "bottom-start",
    middleware: middleware ?? [
      offset(offsetOptions === undefined ? 30 : offsetOptions),
      shift({
        crossAxis: true,
      }),
    ],
  });
  const click = useClick(context, {
    toggle: true,
  });
  const dismiss = useDismiss(context, {outsidePress: true});

  const {isMounted, styles} = useTransitionStyles(context, {
    duration: 200,
    initial: {
      opacity: 0,
      transform: "translateY(-15px)",
    },
    open: {
      opacity: 1,
      transform: "translateY(0)",
    },
  });

  const {getReferenceProps, getFloatingProps} = useInteractions([
    click, dismiss,
  ]);

  useEffect(() => {
    if (onToggle) {
      onToggle(open);
    }
  }, [onToggle, open]);

  useEffect(() => {
    setOpen(true);
  }, [triggerOpen]);

  useEffect(() => {
    setOpen(false);
  }, [triggerClose]);

  return (
    <>
      <button
        ref={refs.setReference}
        className={labelClassName || buttonStyles.buttonCta}
        style={labelStyle}
        {...getReferenceProps()}
        title={labelTooltip}
      >
        {label}
      </button>
      <FloatingPortal root={floatingPortalParent}>
        {isMounted &&
          <div
            ref={refs.setFloating}
            className={containerClassName}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: "max-content",
              ...styles,
            }}
            {...getFloatingProps()}
          >
            {children}
          </div>
        }
      </FloatingPortal>
    </>
  );
}