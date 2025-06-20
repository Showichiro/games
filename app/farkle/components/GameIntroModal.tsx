"use client";

import { Button, Modal } from "@/components/common";

interface GameIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GameIntroModal({
  isOpen,
  onClose,
}: GameIntroModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-center mb-6 text-neutral-900">
          ファークルへようこそ！
        </h2>

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

          <section>
            <h3 className="text-lg font-semibold mb-2 text-neutral-800">
              得点の組み合わせ
            </h3>
            <div className="text-sm space-y-1">
              <div className="grid grid-cols-2 gap-2">
                <div>• 1 = 100点</div>
                <div>• 5 = 50点</div>
                <div>• 1が3個 = 1,000点</div>
                <div>• 2が3個 = 200点</div>
                <div>• 3が3個 = 300点</div>
                <div>• 4が3個 = 400点</div>
                <div>• 5が3個 = 500点</div>
                <div>• 6が3個 = 600点</div>
              </div>
              <div className="pt-2">
                <div>• ストレート(1-2-3-4-5-6) = 1,500点</div>
                <div>• 3ペア = 1,500点</div>
                <div>• 4個以上の同じ数字は、3個の得点×2倍、3倍...</div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-neutral-800">
              特殊ルール
            </h3>
            <div className="text-sm space-y-1">
              <div>
                • <strong>ホットダイス</strong>:
                6個全てのサイコロで得点を作ると、再び6個でロールできます
              </div>
              <div>
                • <strong>ファークル</strong>:
                得点の組み合わせがない場合、そのターンの得点は0になります
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 flex justify-center">
          <Button variant="primary" onClick={onClose} className="px-8">
            ゲーム開始
          </Button>
        </div>
      </div>
    </Modal>
  );
}
