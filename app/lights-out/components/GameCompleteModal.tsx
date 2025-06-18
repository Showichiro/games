"use client";

import { Button, Modal } from "@/components/common"; // Updated import path for Modal

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
    <Modal isOpen={gameComplete} onClose={onClose}>
      <h2 className="text-2xl font-bold text-default-font mb-2">🎉 クリア!</h2>
      <p className="text-subtext-color mb-4">
        {moves}手で {formatTime(elapsedTime)} でクリアしました!
      </p>
      <div className="flex gap-3 justify-center">
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            onClose();
            onNewGame();
          }}
        >
          新しいゲーム
        </Button>
        <Button variant="secondary" size="md" onClick={onClose}>
          閉じる
        </Button>
      </div>
    </Modal>
  );
}
