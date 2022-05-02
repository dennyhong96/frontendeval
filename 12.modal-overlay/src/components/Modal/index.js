import {
  cloneElement,
  Fragment,
  isValidElement,
  useEffect,
  useRef,
  useState
} from "react";
import { FOCUSABLE_EL_SELECTORS } from "../../constants";

import styles from "./index.module.css";

export default function Modal({
  open: externalOpen,
  onOpen,
  onClose,
  initialOpen = false,
  trigger,
  returnFocusRef,
  children
}) {
  // states
  const [internalOpen, setInternalOpen] = useState(initialOpen);

  // derived states
  const isExternalControll = externalOpen !== undefined;
  const open = isExternalControll ? externalOpen : internalOpen;

  // refs
  const prevOpenRef = useRef(false);
  const modalRef = useRef(null);
  const triggerRef = useRef(null);

  // effect
  useEffect(() => {
    if (!prevOpenRef.current && open) {
      // changed from close to open
      modalRef.current.focus();
    } else if (prevOpenRef.current && !open) {
      // changed from open to close
      triggerRef.current?.focus();
      returnFocusRef?.current?.focus();
    }
    prevOpenRef.current = open;

    // eslint-disable-next-line
  }, [open]);

  // handlers
  const handleOpen = () => {
    if (!isExternalControll) setInternalOpen(true);
    onOpen?.();
  };

  const handleClose = () => {
    if (!isExternalControll) setInternalOpen(false);
    onClose?.();
  };

  if (trigger && isValidElement(trigger)) {
    trigger = cloneElement(trigger, {
      onClick() {
        open ? handleClose() : handleOpen();
      },
      ref: triggerRef
    });
  }

  const handleTrapFocus = (evt) => {
    const target = evt.target;
    const focusables = [
      ...modalRef.current.querySelectorAll(FOCUSABLE_EL_SELECTORS)
    ];
    const firstFocusable = focusables[0];
    const lastFocusable = focusables[focusables.length - 1];
    if (target === firstFocusable || !focusables.includes(target)) {
      if (evt.key === "Tab" && evt.shiftKey) {
        evt.preventDefault();
        lastFocusable.focus();
      }
    } else if (target === lastFocusable || !focusables.includes(target)) {
      if (evt.key === "Tab" && !evt.shiftKey) {
        evt.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  const handleKeyDown = (evt) => {
    if (evt.key === "Escape") {
      evt.preventDefault();
      handleClose();
      return;
    }
    handleTrapFocus(evt);
  };

  return (
    <Fragment>
      {trigger && isValidElement(trigger) && trigger}
      {open && (
        <div className={styles.modal}>
          <div className={styles.backdrop} onClick={handleClose} />
          <div
            aria-modal="true"
            role="dialog"
            ref={modalRef}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className={styles.content}
          >
            <button className={styles.close} onClick={handleClose}>
              x
            </button>
            {children}
          </div>
        </div>
      )}
    </Fragment>
  );
}
