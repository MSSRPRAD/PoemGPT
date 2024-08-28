import React from 'react';

interface SidebarProps {
  userPoems: Array<{ id: number; prompt: string; timestamp: string }>;
  selectedPoemId: number | null;
  onPoemSelect: (poemId: number) => void;
  isDarkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ userPoems, selectedPoemId, onPoemSelect, isDarkMode }) => {
  const textColorClass = isDarkMode ? 'text-gray-300' : 'text-gray-800';

  return (
    <div className={`w-1/4 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Your Poems</h3>
      <ul>
        {userPoems.map((poem) => (
          <li
            key={poem.id}
            className={`cursor-pointer mb-2 p-2 rounded ${
              selectedPoemId === poem.id
                ? isDarkMode
                  ? 'bg-blue-600'
                  : 'bg-blue-200'
                : isDarkMode
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-200'
            }`}
            onClick={() => onPoemSelect(poem.id)}
          >
            <p className={`font-semibold ${textColorClass}`}>{poem.prompt}</p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{poem.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
