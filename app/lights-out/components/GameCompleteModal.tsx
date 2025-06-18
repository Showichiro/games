"use client";

import { Modal, Button } from "@/components/common"; // Updated import path for Modal

interface GameCompleteModalProps {
  gameComplete: boolean;
  moves: number;
  elapsedTime: number;
  formatTime: (seconds: number) => string;
  onClose: () => void;
  onNewGame: () => void;
}

export default function GameCompleteModal({
  gameComplete,
  moves,
  elapsedTime,
  formatTime,
  onClose,
  onNewGame,
}: GameCompleteModalProps) {
  return (
    <Modal
      isOpen={gameComplete}
      onClose={onClose}
      // The className from the old inner motion.div can be passed here if needed,
      // for example, to control max-width, padding, text-alignment etc.
      // className="bg-neutral-0 rounded-2xl p-6 text-center max-w-sm w-full"
      // For this specific case, the Modal default styling might be sufficient,
      // or some of these (like text-center, p-6) should be applied to an inner div.
      // Let's apply relevant classes to the Modal, assuming its content div can take them.
      // The Modal component applies `bg-neutral-0 rounded-2xl p-6 text-center max-w-sm w-full` by default
      // so no specific className is needed here unless we want to override those.
    >
      <h2 className="text-2xl font-bold text-default-font mb-2">
        🎉 クリア!
      </h2>
      <p className="text-subtext-color mb-4">
        {moves}手で {formatTime(elapsedTime)} でクリアしました!
      </p>
      <div className="flex gap-3 justify-center">
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            onClose(); // It's good practice for the modal's own close button to also call the onClose prop
            onNewGame();
          }}
        >
          新しいゲーム
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={onClose}
        >
          閉じる
        </Button>
      </div>
    </Modal>
  );
}
