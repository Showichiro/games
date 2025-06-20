"use client";

import { useState } from "react";
import { Button, Modal } from "@/components/common";

interface GameRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const rulesPages = [
  {
    title: "得点の組み合わせ",
    content: (
      <div className="space-y-4 text-neutral-700">
        <section>
          <h3 className="text-lg font-semibold mb-2 text-neutral-800">
            基本得点
          </h3>
          <div className="text-sm space-y-1">
            <div className="grid grid-cols-2 gap-2">
              <div>• 1 = 100点</div>
              <div>• 5 = 50点</div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2 text-neutral-800">
            3個以上の組み合わせ
          </h3>
          <div className="text-sm space-y-1">
            <div className="grid grid-cols-2 gap-2">
              <div>• 1が3個 = 1,000点</div>
              <div>• 2が3個 = 200点</div>
              <div>• 3が3個 = 300点</div>
              <div>• 4が3個 = 400点</div>
              <div>• 5が3個 = 500点</div>
              <div>• 6が3個 = 600点</div>
            </div>
            <div className="pt-2">
              <div>• 4個以上の同じ数字は、3個の得点×2倍、3倍...</div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2 text-neutral-800">
            特別な組み合わせ
          </h3>
          <div className="text-sm space-y-1">
            <div>• ストレート(1-2-3-4-5-6) = 1,500点</div>
            <div>• 3ペア = 1,500点</div>
          </div>
        </section>
      </div>
    ),
  },
  {
    title: "特殊ルール",
    content: (
      <div className="space-y-4 text-neutral-700">
        <section>
          <div className="text-sm space-y-3">
            <div>
              <strong className="text-neutral-800">ホットダイス</strong>
              <p className="mt-1">
                6個全てのサイコロで得点を作ると、再び6個でロールできます。
                チャンスを活かして更なる高得点を狙いましょう！
              </p>
            </div>
            <div>
              <strong className="text-neutral-800">ファークル</strong>
              <p className="mt-1">
                得点の組み合わせがない場合、「ファークル」となり、
                そのターンの得点は全て0になります。リスク管理が重要です。
              </p>
            </div>
            <div>
              <strong className="text-neutral-800">最低得点</strong>
              <p className="mt-1">
                最初のゲームでは500点以上獲得してからバンクできます。
              </p>
            </div>
            <div>
              <strong className="text-neutral-800">勝利条件</strong>
              <p className="mt-1">10,000点に到達すると勝利です！</p>
            </div>
          </div>
        </section>
      </div>
    ),
  },
  {
    title: "基本的な遊び方",
    content: (
      <div className="space-y-4 text-neutral-700">
        <section>
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>サイコロを振って、得点となる組み合わせを見つけます</li>
            <li>得点となるサイコロを選択して確保します</li>
            <li>
              「バンク」で得点を確定するか、「ロール」で更に得点を狙います
            </li>
            <li>
              ファークル（得点なし）になると、そのターンの得点は0になります
            </li>
            <li>リスクとリターンを考えながら高得点を狙いましょう</li>
          </ol>
        </section>

        <section className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-neutral-800">
            戦略のコツ
          </h3>
          <div className="text-sm space-y-1">
            <div>• 確実な得点を取るか、リスクを取って高得点を狙うかを判断</div>
            <div>• ホットダイスの機会を逃さずに活用</div>
            <div>• ファークルのリスクを常に意識</div>
          </div>
        </section>
      </div>
    ),
  },
];

export default function GameRulesModal({
  isOpen,
  onClose,
}: GameRulesModalProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => {
    if (currentPage < rulesPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleClose = () => {
    setCurrentPage(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-lg">
      <div className="text-left">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-neutral-900">
            {rulesPages[currentPage].title}
          </h2>
          <div className="text-sm text-neutral-500">
            {currentPage + 1} / {rulesPages.length}
          </div>
        </div>

        <div className="min-h-80">{rulesPages[currentPage].content}</div>

        <div className="mt-6 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="px-4"
          >
            前へ
          </Button>

          <div className="flex space-x-1">
            {rulesPages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentPage ? "bg-blue-500" : "bg-neutral-300"
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            onClick={
              currentPage === rulesPages.length - 1 ? handleClose : handleNext
            }
            className="px-4"
          >
            {currentPage === rulesPages.length - 1 ? "閉じる" : "次へ"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
