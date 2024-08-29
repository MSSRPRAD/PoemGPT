import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import { io, Socket } from 'socket.io-client';
import { api, BASE_URL } from '../api';
import Sidebar from './Sidebar';
import PoemDisplay from './PoemDisplay';
import PoemGenerator from './PoemGenerator';

const socket: Socket = io(BASE_URL, { withCredentials: true });

export const Dashboard: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { user, setUser } = useAuth();
  const [prompt, setPrompt] = useState<string>('');
  const [poem, setPoem] = useState<string>('');
  const [poemDetails, setPoemDetails] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [userPoems, setUserPoems] = useState<Array<{ id: number; prompt: string; timestamp: string }>>([]);
  const [selectedPoemId, setSelectedPoemId] = useState<number | null>(null);
  const [isAnalysisAvailable, setIsAnalysisAvailable] = useState<boolean>(false);

  const fetchUserPoems = useCallback(async () => {
    console.log("Fetching user poems");
    console.log(user?.id);
    JSON.parse(localStorage.getItem('user') ?? '{}')
    if (user === undefined) {
      setUser(JSON.parse(localStorage.getItem('user') ?? '{}'));
    }
    
    try {
      const response = await api.getUserPoems(user?.id ?? 1);
      setUserPoems(response.data);
    } catch (error) {
      console.error('Error fetching user poems:', error);
    }
  }, []);

  const fetchPoemDetails = useCallback(async (poemId: number) => {
    try {
      const response = await api.getPoemDetails(poemId);
      setPoemDetails(response.data);
      setIsAnalysisAvailable(true);
      setPoem(''); // Clear the generated poem text
    } catch (error) {
      console.error('Error fetching poem details:', error);
    }
  }, []);

  const handlePoemGeneration = useCallback(() => {
    socket.on('poem_chunk', (data: { chunk: string }) => {
      setPoem(prev => prev + data.chunk);
    });

    socket.on('poem_complete', (data: { message: string; poem_id: number }) => {
      setIsGenerating(false);
      setIsAnalysisAvailable(false);
      if (user) {
        setUser(prevUser => ({
          ...prevUser!,
          credits_left: prevUser!.credits_left - 1
        }));
      }
      fetchUserPoems();
      fetchPoemDetails(data.poem_id);
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
  }, [user, setUser, fetchUserPoems, fetchPoemDetails]);

  useEffect(() => {
    const cleanup = handlePoemGeneration();
    fetchUserPoems();

    return () => {
      cleanup();
      socket.off('connect_error');
    };
  }, [handlePoemGeneration, fetchUserPoems]);

  const handleGeneratePoem = () => {
    if ((user?.credits_left ?? 0) > 0) {
      setPoem('');
      setIsGenerating(true);
      setIsAnalysisAvailable(false);
      setPoemDetails(null); // Clear poem details when generating a new poem
      setSelectedPoemId(null); // Clear selected poem when generating a new poem
      socket.emit('generate_poem', { 'prompt': prompt, 'user_id': user?.id ?? 1 });
    } else {
      alert("You don't have enough credits to generate a poem.");
    }
  };

  const handlePoemSelect = (poemId: number) => {
    setSelectedPoemId(poemId);
    setPoem(''); // Clear the generated poem text
    setPoemDetails(null); // Clear poem details before fetching new ones
    fetchPoemDetails(poemId);
  };

  return (
    <div className="flex">
      <Sidebar
        userPoems={userPoems}
        selectedPoemId={selectedPoemId}
        onPoemSelect={handlePoemSelect}
        isDarkMode={isDarkMode}
      />
      <div className={`w-3/4 p-6 rounded-lg shadow-xl transition-shadow duration-300 ease-in-out ${isDarkMode ? 'shadow-gray-800' : 'shadow-gray-300'}`}>
        <div className='flex flex-row items-center justify-between'>
          <h2 className={`text-3xl font-bold text-center ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Welcome {user?.name}!</h2>
          <p className={`italic text-center ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Credits Remaining {user?.credits_left}</p>
        </div>
        {!selectedPoemId && !isAnalysisAvailable && (
          <PoemGenerator
            prompt={prompt}
            setPrompt={setPrompt}
            isGenerating={isGenerating}
            handleGeneratePoem={handleGeneratePoem}
            isDarkMode={isDarkMode}
            disabled={false}
          />
        )}
        <div className='flex flex-col items-center justify-center mt-4'>
          {!isAnalysisAvailable && poem && (
            <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Generating Poem:</h3>
              <p className={`whitespace-pre-line ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{poem}</p>
            </div>
          )}
          {poemDetails && (
            <PoemDisplay poemDetails={poemDetails} isDarkMode={isDarkMode} />
          )}
        </div>
      </div>
    </div>
  );
};
