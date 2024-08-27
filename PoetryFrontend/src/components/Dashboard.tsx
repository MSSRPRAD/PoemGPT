import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:5000', { withCredentials: true });

export const Dashboard: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { user, setUser } = useAuth();
  const [prompt, setPrompt] = useState<string>('');
  const [poem, setPoem] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handlePoemGeneration = useCallback(() => {
    socket.on('poem_chunk', (data: { chunk: string }) => {
      setPoem(prev => prev + data.chunk);
    });

    socket.on('poem_complete', () => {
      setIsGenerating(false);
      if (user) {
        setUser(prevUser => ({
          ...prevUser!,
          credits_left: prevUser!.credits_left - 1
        }));
      }
    });

    socket.on('error', (data: { error: string }) => {
      alert(data.error);
      setIsGenerating(false);
    });

    return () => {
      socket.off('poem_chunk');
      socket.off('poem_complete');
      socket.off('error');
    };
  }, [user, setUser]);

  useEffect(() => {
    const cleanup = handlePoemGeneration();
    return () => {
      cleanup();
      socket.off('connect_error');
    };
  }, [handlePoemGeneration]);

  const handleGeneratePoem = () => {
    if ((user?.credits_left ?? 0) > 0) {
      setPoem('');
      setIsGenerating(true);
      socket.emit('generate_poem', { prompt });
    } else {
      alert("You don't have enough credits to generate a poem.");
    }
  };

  const textColorClass = isDarkMode ? 'text-gray-300' : 'text-gray-800';

  if (!user) {
    return <p className={textColorClass}>Please login to view your information.</p>;
  }

  return (
    <div className={`p-6 rounded-lg shadow-xl transition-shadow duration-300 ease-in-out ${isDarkMode ? 'shadow-gray-800' : 'shadow-gray-300'}`}>
      <h2 className={`text-3xl font-bold text-center ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Welcome {user.name}!</h2>
      <div className={`text-md ${textColorClass} mb-4`}>
        Credits Remaining: <span className="font-semibold">{user.credits_left}</span>
      </div>
      <div className="flex flex-col items-center justify-center mt-4">
        <textarea
          className={`border rounded-lg p-2 w-full mb-4 ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}
          rows={3}
          placeholder="Enter your poem prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${isDarkMode ? 'hover:bg-blue-600' : 'hover:bg-blue-700'} ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
          onClick={handleGeneratePoem}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Poem'}
        </button>
      </div>
      <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Generated Poem:</h3>
        <p className={`whitespace-pre-line ${textColorClass}`}>{poem}</p>
      </div>
    </div>
  );
};