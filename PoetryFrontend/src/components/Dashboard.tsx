import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { io } from 'socket.io-client';
import { User } from '../types'; // Import User type

const socket = io('http://localhost:5000', {
  withCredentials: true,
}); // Ensure the URL matches your backend

export const Dashboard: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { user, setUser } = useAuth(); // Make sure setUser is available
  const [prompt, setPrompt] = useState<string>('');
  const [poem, setPoem] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false); // Track generation status

  useEffect(() => {
    socket.on('poem_chunk', (data: { chunk: string }) => {
      setPoem((prev) => prev + data.chunk); // Append new chunk
    });

    socket.on('poem_complete', () => {
      setIsGenerating(false);
      simplifyPoem(); // Simplify after full poem is generated

      // Update the user's credits only after the poem is complete
      if (user) {
        const updatedUser: User = {
          ...user,
          credits_left: user.credits_left - 1,
        };
        setUser(updatedUser);
      }
    });

    socket.on('error', (data: { error: string }) => {
      alert(data.error); // Display error if any
      setIsGenerating(false);
    });

    return () => {
      socket.off('poem_chunk');
      socket.off('poem_complete');
      socket.off('error');
    };
  }, [user, setUser]);

  const handleGeneratePoem = () => {
    if (user && user.credits_left > 0) {
      setPoem(''); // Clear the previous poem only when generating a new one
      setIsGenerating(true);
      socket.emit('generate_poem', { prompt });
    } else {
      alert("You don't have enough credits to generate a poem.");
    }
  };

  const simplifyPoem = () => {
    // Add simplification logic here if needed
  };

  return (
    <div className={`p-6 rounded-lg shadow-xl transition-shadow duration-300 ease-in-out ${isDarkMode ? 'shadow-gray-800' : 'shadow-gray-300'}`}>
      {user ? (
        <>
          <h2 className={`text-3xl font-bold text-center ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Welcome {user?.name}!</h2>

          <div className="flex justify-between items-center mb-4">
            <div className={`text-md ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              Credits Remaining: <span className="font-semibold">{user?.credits_left}</span>
            </div>
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
              className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${isDarkMode ? 'hover:bg-blue-600' : 'hover:bg-blue-700'}`}
              onClick={handleGeneratePoem}
              disabled={isGenerating} // Disable button while generating
            >
              Generate Poem
            </button>
          </div>
          <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Generated Poem:</h3>
            <p className={`whitespace-pre-line ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{poem}</p>
          </div>
        </>
      ) : (
        <p className={`text-gray-800 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
          Please login to view your information.
        </p>
      )}
    </div>
  );
};