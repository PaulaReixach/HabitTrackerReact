import { useState } from "react";

function useConfirm() {
  const [confirmState, setConfirmState] = useState(null);

  function confirm(message) {
    return new Promise((resolve) => {
      setConfirmState({ message, resolve });
    });
  }

  function close(result) {
    if (!confirmState) return;
    confirmState.resolve(result);
    setConfirmState(null);
  }

  return {
    confirm,
    isOpen: !!confirmState,
    message: confirmState?.message ?? "",
    onCancel: () => close(false),
    onConfirm: () => close(true),
  };
}

export default useConfirm;