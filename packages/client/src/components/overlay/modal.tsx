import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ModalProps } from './overlay.types';
import { Backdrop } from './backdrop';

export const Modal = ({
  className,
  isOpen,
  onClose,
  title,
  children,
  ...props
}: ModalProps) => {
  let classes = 'overlay-container';
  const modalSize = props.modalSize ? props.modalSize : 'md';
  const animation = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };

  if (className) {
    classes += ` ${className}`;
  }

  useEffect(() => {
    const handleControls = (ev: KeyboardEvent) => {
      switch (ev.code) {
        case 'Escape':
          onClose();
          break;
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleControls);
    } else {
      window.removeEventListener('keydown', handleControls);
    }

    return () => {
      window.removeEventListener('keydown', handleControls);
    };
  }, [isOpen]);

  return (
    <section>
      <AnimatePresence>
        {isOpen && (
          <div className={classes}>
            <Backdrop onClick={onClose}></Backdrop>
            <motion.div
              className="overlay-content support-high-contrast"
              style={{ display: 'block' }}
              variants={animation}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div
                className={`modal-dialog modal-dialog-centered modal-${modalSize}`}
              >
                <div className="modal-content">
                  {title && (
                    <header className="offcanvas-header">
                      <h1 className="offcanvas-title mb-0">
                        {typeof title === 'string' ? title : ''}
                      </h1>
                    </header>
                  )}
                  {children}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default {
  Modal,
};
