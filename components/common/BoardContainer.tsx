import React from "react";

interface BoardContainerProps {
  children: React.ReactNode;
}

const BoardContainer: React.FC<BoardContainerProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
      {children}
    </div>
  );
};

export default BoardContainer;
