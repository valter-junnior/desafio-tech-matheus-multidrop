import { useState } from "react";

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [resolveCallback, setResolveCallback] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = (): Promise<boolean> => {
    setIsOpen(true);
    return new Promise((resolve) => {
      setResolveCallback(() => resolve);
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolveCallback) resolveCallback(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolveCallback) resolveCallback(false);
  };

  return {
    isOpen,
    confirm,
    handleConfirm,
    handleCancel,
  };
}
