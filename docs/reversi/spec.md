# リバーシゲーム 要件定義・設計書

## 1. ゲーム概要

**ゲーム名**: リバーシ (Reversi)
**ゲームタイプ**: ボードゲーム（オセロ）
**プレイ方式**: プレイヤー vs CPU
**ターゲット**: 既存のライツアウトゲームユーザー

## 2. 機能要件

### 2.1 基本機能

#### ゲームボード
- **8×8のグリッド表示**
- モバイルファーストで最適化
- レスポンシブ対応（PC・タブレット・スマホ）
- アニメーション重視の派手な視覚効果

#### ゲームルール
- 標準リバーシルール（オセロ）
- 黒（プレイヤー）が先手
- 白（CPU）が後手
- 置ける場所がない場合はパス
- 両者ともパスでゲーム終了

#### CPU機能
- **難易度選択**: 初級・中級・上級・専門家
- **思考アルゴリズム**: ミニマックス法 + アルファベータ剪定
- **思考時間表示**: CPUが考えている様子を演出
- **適応的難易度**: プレイヤーの勝率に応じて自動調整（オプション）

### 2.2 UI/UX機能

#### ゲーム支援機能
- **置ける場所のヒント表示**（ON/OFF切り替え可能）
- **手番表示**: 現在どちらのターンかを明確に表示
- **スコア表示**: リアルタイムでの石数カウント
- **最後の手の強調表示**: 前回置かれた石をハイライト
- **取得石数の表示**: 1手で何個取ったかを表示

#### 操作履歴・戦績
- **操作履歴**: 全手順の記録と再生機能
- **棋譜表示**: アルファベット座標（A1-H8）での記録
- **戦績管理**: 勝敗記録、勝率統計
- **ベストゲーム保存**: 高得点ゲームの記録

### 2.3 視覚効果・アニメーション

#### 派手なエフェクト仕様
```javascript
// 石の配置アニメーション
- 石がボードに落下するアニメーション（重力効果）
- 配置時の光るリングエフェクト
- 石の表面に光沢・反射効果

// 石の反転アニメーション
- 3D回転アニメーション（Y軸回転180度）
- 反転時のパーティクルエフェクト
- チェーン反転時の連鎖エフェクト（波紋状）
- 音響効果と同期したタイミング

// 勝利・敗北演出
- 勝利時: 金色のオーラエフェクト + 花火
- 敗北時: 石が崩れ落ちるアニメーション
- 引き分け時: 虹色のエフェクト

// インタラクティブ効果
- ホバー時の光るハイライト
- 置ける場所のパルスエフェクト
- CPU思考中のローディングアニメーション
```

## 3. 技術仕様

### 3.1 使用技術スタック
- **フレームワーク**: Next.js 15 + React 19
- **アニメーション**: Framer Motion
- **スタイリング**: Tailwind CSS v4
- **状態管理**: React Hooks (useState, useReducer, useContext)
- **TypeScript**: 型安全な実装

### 3.2 パフォーマンス要件
- **初回読み込み**: 3秒以内
- **アニメーション**: 60fps維持
- **CPU思考時間**: 
  - 初級: 500ms-1秒
  - 中級: 1-2秒
  - 上級: 2-3秒
  - 専門家: 3-5秒

### 3.3 レスポンシブ設計

```css
/* ブレークポイント */
- モバイル: < 768px (縦向き最適化)
- タブレット: 768px - 1024px
- PC: > 1024px

/* ボードサイズ */
- モバイル: 280px × 280px (セル: 35px)
- タブレット: 400px × 400px (セル: 50px)  
- PC: 480px × 480px (セル: 60px)
```

## 4. コンポーネント設計

### 4.1 ページ構成
```
/reversi
├── page.tsx (メインページ)
├── components/
│   ├── GameBoard.tsx (ゲームボード)
│   ├── GameCell.tsx (個別セル)
│   ├── GamePiece.tsx (石コンポーネント)
│   ├── GameHeader.tsx (スコア・ターン表示)
│   ├── GameControls.tsx (操作ボタン群)
│   ├── CpuThinking.tsx (CPU思考中表示)
│   ├── GameCompleteModal.tsx (ゲーム終了モーダル)
│   ├── HistoryPanel.tsx (履歴パネル)
│   ├── SettingsModal.tsx (設定モーダル)
│   └── TutorialModal.tsx (チュートリアル)
├── hooks/
│   ├── useGameLogic.ts (ゲームロジック)
│   ├── useCpuPlayer.ts (CPU AI)
│   ├── useGameHistory.ts (履歴管理)
│   └── useGameStats.ts (統計管理)
├── utils/
│   ├── gameLogic.ts (リバーシルール実装)
│   ├── cpuAI.ts (CPU思考エンジン)
│   └── boardUtils.ts (ボード操作ユーティリティ)
└── types.ts (型定義)
```

### 4.2 状態管理設計

```typescript
// ゲーム状態
interface GameState {
  board: Board;                    // 8x8ボード状態
  currentPlayer: Player;           // 現在のプレイヤー
  validMoves: Position[];          // 置ける場所
  gameStatus: GameStatus;          // ゲーム状況
  scores: { black: number; white: number };
  lastMove: Position | null;       // 最後の手
  capturedPieces: Position[];      // 取った石の位置
  isThinking: boolean;             // CPU思考中フラグ
}

// CPU設定
interface CpuConfig {
  difficulty: Difficulty;          // 難易度
  thinkingTime: number;           // 思考時間
  showThinking: boolean;          // 思考過程表示
  adaptiveDifficulty: boolean;    // 適応的難易度
}
```

## 5. アニメーション仕様

### 5.1 Framer Motion実装

```javascript
// 石の配置アニメーション
const PieceAnimation = {
  initial: { 
    scale: 0, 
    y: -50, 
    rotateY: 0,
    boxShadow: "0 0 0px rgba(255,255,255,0)"
  },
  animate: { 
    scale: 1, 
    y: 0, 
    rotateY: 0,
    boxShadow: "0 0 20px rgba(255,255,255,0.8)"
  },
  transition: { 
    type: "spring", 
    stiffness: 300, 
    damping: 25,
    duration: 0.6
  }
};

// 反転アニメーション
const FlipAnimation = {
  animate: { rotateY: 180 },
  transition: { 
    duration: 0.8, 
    ease: "easeInOut",
    delay: (index) => index * 0.1  // 連鎖ディレイ
  }
};

// パーティクルエフェクト
const ParticleEffect = {
  initial: { scale: 0, opacity: 1 },
  animate: { 
    scale: [0, 1.5, 0], 
    opacity: [1, 0.7, 0] 
  },
  transition: { duration: 1.2 }
};
```

### 5.2 視覚効果の詳細

#### グラデーション・光沢効果
```css
/* 黒石 */
.black-piece {
  background: radial-gradient(circle at 30% 30%, 
    #4a4a4a 0%, #1a1a1a 60%, #000000 100%);
  box-shadow: 
    inset 0 0 20px rgba(255,255,255,0.3),
    0 5px 15px rgba(0,0,0,0.5);
}

/* 白石 */
.white-piece {
  background: radial-gradient(circle at 30% 30%, 
    #ffffff 0%, #f0f0f0 60%, #e0e0e0 100%);
  box-shadow: 
    inset 0 0 20px rgba(0,0,0,0.1),
    0 5px 15px rgba(0,0,0,0.3);
}

/* ホバー効果 */
.piece-hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255,255,255,0.4);
}
```

## 6. CPU AI設計

### 6.1 難易度別アルゴリズム

```typescript
interface DifficultyConfig {
  beginner: {
    depth: 2,
    randomness: 0.3,     // 30%の確率でランダム選択
    evaluation: 'basic'   // 基本評価関数
  },
  intermediate: {
    depth: 4,
    randomness: 0.1,
    evaluation: 'weighted'
  },
  advanced: {
    depth: 6,
    randomness: 0,
    evaluation: 'strategic'
  },
  expert: {
    depth: 8,
    randomness: 0,
    evaluation: 'expert',
    openingBook: true     // 定石使用
  }
}
```

### 6.2 評価関数

```typescript
// 位置価値マップ
const POSITION_VALUES = [
  [100, -20,  10,   5,   5,  10, -20, 100],
  [-20, -50,  -2,  -2,  -2,  -2, -50, -20],
  [ 10,  -2,  -1,  -1,  -1,  -1,  -2,  10],
  [  5,  -2,  -1,  -1,  -1,  -1,  -2,   5],
  [  5,  -2,  -1,  -1,  -1,  -1,  -2,   5],
  [ 10,  -2,  -1,  -1,  -1,  -1,  -2,  10],
  [-20, -50,  -2,  -2,  -2,  -2, -50, -20],
  [100, -20,  10,   5,   5,  10, -20, 100]
];

// 評価要素
function evaluateBoard(board, player) {
  return (
    positionValue(board, player) * 1.0 +
    mobility(board, player) * 0.8 +
    stability(board, player) * 1.2 +
    cornerControl(board, player) * 2.0
  );
}
```

## 7. レイアウト設計

### 7.1 PC版レイアウト
```
+--------------------------------------------------+
|                  リバーシ                         |
|              黒: 2  白: 2  ターン: 黒              |
+------------------+------------------+------------+
|                  |                  |   操作履歴  |
|                  |   ゲームボード    |   --------  |
|    サイドパネル   |     8x8グリッド   |  1. e6      |
|   - 新しいゲーム  |                  |  2. f4      |
|   - 設定         |                  |  3. ...     |
|   - ヒント       |                  |            |
|   - 戦績         |                  |  [戦績表示]  |
+------------------+------------------+------------+
```

### 7.2 モバイル版レイアウト
```
+------------------+
|    ☰  リバーシ    |
+------------------+
| 黒: 2   白: 2     |
| ターン: あなた     |
+------------------+
|                  |
|   ゲームボード    |
|     8x8グリッド   |
|                  |
|                  |
+------------------+
| [新規] [設定] [?] |
+------------------+
```

## 8. 実装優先順位

### Phase 1: 基本実装 (MVP)
1. ゲームボード・石の表示
2. 基本ゲームロジック
3. 簡単なCPU AI (初級レベル)
4. 基本的なアニメーション

### Phase 2: エフェクト強化
1. 派手な石の反転アニメーション
2. パーティクルエフェクト
3. 勝利・敗北演出
4. 音響効果

### Phase 3: 機能拡張
1. 難易度選択・高度なAI
2. 履歴・戦績機能
3. チュートリアル
4. 設定画面

### Phase 4: 最適化・仕上げ
1. パフォーマンス最適化
2. アクセシビリティ対応
3. エラーハンドリング
4. 最終調整

## 9. ファイル構成

### 9.1 新規追加ファイル
```
app/reversi/
├── page.tsx
├── components/
│   ├── GameBoard.tsx
│   ├── GameCell.tsx
│   ├── GamePiece.tsx
│   ├── GameHeader.tsx
│   ├── GameControls.tsx
│   ├── CpuThinking.tsx
│   ├── GameCompleteModal.tsx
│   ├── HistoryPanel.tsx
│   ├── SettingsModal.tsx
│   ├── TutorialModal.tsx
│   └── ParticleEffect.tsx
├── hooks/
│   ├── useGameLogic.ts
│   ├── useCpuPlayer.ts
│   ├── useGameHistory.ts
│   └── useGameStats.ts
├── utils/
│   ├── gameLogic.ts
│   ├── cpuAI.ts
│   ├── boardUtils.ts
│   └── animations.ts
├── constants/
│   ├── gameConstants.ts
│   └── aiConstants.ts
└── types.ts
```

### 9.2 ホームページ更新
```typescript
// app/page.tsx に追加
{/* Reversi Game */}
<motion.div whileHover={{ scale: 1.05, y: -5 }}>
  <Link href="/reversi">
    <div className="bg-neutral-0/10 backdrop-blur-sm rounded-2xl p-6">
      <div className="text-4xl mb-4">⚫⚪</div>
      <h3 className="text-2xl font-bold text-white mb-3">リバーシ</h3>
      <p className="text-neutral-300 mb-4">
        CPU対戦型の本格リバーシゲーム。派手なエフェクトで
        石が反転する様子を楽しもう。
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
          戦略思考
        </span>
        <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
          CPU対戦
        </span>
        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
          派手エフェクト
        </span>
      </div>
    </div>
  </Link>
</motion.div>
```

