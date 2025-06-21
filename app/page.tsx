"use client";

import { motion } from "motion/react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700">
      <div className="flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Hero Section */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            パズルゲーム
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              コレクション
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-neutral-300 mb-12 leading-relaxed"
          >
            頭脳を刺激する様々なパズルゲームで
            <br />
            あなたの論理的思考力を鍛えよう
          </motion.p>

          {/* Game Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {/* Lights Out Game */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group"
            >
              <Link href="/lights-out">
                <div className="bg-neutral-0/10 backdrop-blur-sm rounded-2xl p-6 border border-neutral-0/20 hover:border-neutral-0/40 transition-all duration-300 cursor-pointer h-full flex flex-col">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    💡
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    ライツアウト
                  </h3>
                  <p className="text-neutral-300 mb-4 leading-relaxed">
                    5×5のグリッドで全てのライトを消すパズルゲーム。十字パターンの連鎖反応を使って戦略的に攻略しよう。
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full text-sm">
                      論理思考
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                      パターン認識
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                      戦略
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-yellow-400 font-semibold">
                      🎮 今すぐプレイ
                    </span>
                    <motion.div
                      className="text-white group-hover:translate-x-1 transition-transform duration-300"
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                    >
                      →
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Farkle Game */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group"
            >
              <Link href="/farkle">
                <div className="bg-neutral-0/10 backdrop-blur-sm rounded-2xl p-6 border border-neutral-0/20 hover:border-neutral-0/40 transition-all duration-300 cursor-pointer h-full flex flex-col">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    🎲
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    ファークル
                  </h3>
                  <p className="text-neutral-300 mb-4 leading-relaxed">
                    6つのサイコロで10,000点を目指すリスクとリターンのダイスゲーム。得点の組み合わせを作り、運と戦略のバランスが鍵となる。
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm">
                      リスク管理
                    </span>
                    <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
                      確率計算
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      戦略
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-yellow-400 font-semibold">
                      🎮 今すぐプレイ
                    </span>
                    <motion.div
                      className="text-white group-hover:translate-x-1 transition-transform duration-300"
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                    >
                      →
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Coming Soon Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-neutral-0/5 backdrop-blur-sm rounded-2xl p-6 border border-neutral-0/10 opacity-60"
            >
              <div className="text-4xl mb-4 opacity-50">🧩</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                スライドパズル
              </h3>
              <p className="text-neutral-400 mb-4">
                数字を正しい順序に並べるクラシックなパズルゲーム
              </p>
              <span className="text-neutral-500 font-semibold">近日公開</span>
            </motion.div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
          >
            <div className="text-white">
              <div className="text-3xl mb-2">🏆</div>
              <h4 className="font-semibold mb-1">スコア記録</h4>
              <p className="text-neutral-400 text-sm">
                あなたのベストタイムと手数を記録
              </p>
            </div>
            <div className="text-white">
              <div className="text-3xl mb-2">📱</div>
              <h4 className="font-semibold mb-1">レスポンシブ対応</h4>
              <p className="text-neutral-400 text-sm">
                PC・タブレット・スマホで快適プレイ
              </p>
            </div>
            <div className="text-white">
              <div className="text-3xl mb-2">🎨</div>
              <h4 className="font-semibold mb-1">美しいアニメーション</h4>
              <p className="text-neutral-400 text-sm">
                滑らかな動きと視覚効果でゲーム体験を向上
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
