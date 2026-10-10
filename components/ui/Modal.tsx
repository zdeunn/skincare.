'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

type Props = { open: boolean; onClose: () => void; title: string; children: ReactNode };

/**
 * Modal on the native <dialog> element: built-in focus trap, Escape handling and inertness
 * of the page behind it. We only sync the `open` prop and restore focus on close.
 */
export function Modal({ open, onClose, title, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="modal-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="w-[min(92vw,28rem)] rounded-nb-lg border-3 border-ink bg-surface p-6 shadow-nb-lg backdrop:bg-ink/60"
    >
      <h2 id="modal-title" className="mb-3 text-2xl">
        {title}
      </h2>
      {children}
    </dialog>
  );
}
