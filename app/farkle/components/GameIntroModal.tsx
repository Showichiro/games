"use client";

import { useState } from "react";
import { Button, Modal } from "@/components/common";

interface GameIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const introPages = [
  {
    title: "ファークルへようこそ！",
    content: (
      <div className="space-y-4 text-neutral-700">
        <section>
          <h3 className="text-lg font-semibold mb-2 text-neutral-800">
            ゲームの目的
          </h3>
          <p className="text-sm leading-relaxed">
            6個のサイコロを振って、10,000点を目指すゲームです。
            得点の組み合わせを作って、リスクとリターンを考えながら高得点を狙いましょう！
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2 text-neutral-800">
            基本的な遊び方
          </h3>
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>サイコロを振って、得点となる組み合わせを見つけます</li>
            <li>得点となるサイコロを選択して確保します</li>
            <li>
              「バンク」で得点を確定するか、「ロール」で更に得点を狙います
            </li>
            <li>
              ファークル（得点なし）になると、そのターンの得点は0になります
            </li>
            <li>最初のゲームでは500点以上でバンクできます</li>
          </ol>
        </section>
      </div>
    ),
  },
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
          <h3 className="text-lg font-semibold mb-2 text-neutral-800">
            重要なルール
          </h3>
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
          </div>
        </section>
      </div>
    ),
  },
];

export default function GameIntroModal({
  isOpen,
  onClose,
}: GameIntroModalProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => {
    if (currentPage < introPages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onClose();
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
            {introPages[currentPage].title}
          </h2>
          <div className="text-sm text-neutral-500">
            {currentPage + 1} / {introPages.length}
          </div>
        </div>

        <div className="min-h-80">{introPages[currentPage].content}</div>

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
            {introPages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentPage ? "bg-blue-500" : "bg-neutral-300"
                }`}
              />
            ))}
          </div>

          <Button variant="primary" onClick={handleNext} className="px-4">
            {currentPage === introPages.length - 1 ? "ゲーム開始" : "次へ"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
