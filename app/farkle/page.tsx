"use client";

import { GameLayout } from "@/components/common";

export default function FarklePage() {
    return (
        <GameLayout>
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">Farkle</h1>
                    <div className="text-lg text-neutral-300">
                        Player: 0 | Turn: 0
                    </div>
                </div>

                {/* Game Board Placeholder */}
                <div className="bg-neutral-700 p-6 rounded-2xl shadow-2xl mb-6">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="w-16 h-16 bg-white rounded-lg border-2 border-neutral-300 flex items-center justify-center text-2xl font-bold text-neutral-800"
                            >
                                {index + 1}
                            </div>
                        ))}
                    </div>
                    
                    {/* Score Display */}
                    <div className="text-center mb-4 text-neutral-200">
                        <div>Selected: None</div>
                        <div>Turn Score: 0</div>
                    </div>
                </div>

                {/* Controls Placeholder */}
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-semibold transition-colors">
                            Roll
                        </button>
                        <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md font-semibold transition-colors">
                            Bank
                        </button>
                    </div>
                    <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-md font-semibold transition-colors">
                        New Game
                    </button>
                </div>
            </div>
        </GameLayout>
    );
}