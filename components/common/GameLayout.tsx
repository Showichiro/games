import React from "react";

interface GameLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode; // Optional sidebar prop
}

const GameLayout: React.FC<GameLayoutProps> = ({ children, sidebar }) => {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 text-white">
      {/* Header can be part of the children or added here if a common header is always needed */}
      {/* For now, assuming header control is within the page using this layout */}

      <div className="flex flex-1 container mx-auto p-4">
        {/* Main content area */}
        <main className="flex-1">{children}</main>

        {/* Sidebar */}
        {sidebar && (
          <aside className="hidden lg:block w-64 p-4 lg:ml-4 bg-neutral-800 rounded-lg">
            {sidebar}
          </aside>
        )}
      </div>

      {/* Footer can be part of the children or added here if a common footer is always needed */}
      {/* For now, assuming footer control is within the page using this layout */}
    </div>
  );
};

export default GameLayout;
