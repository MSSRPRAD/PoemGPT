import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface PoemDisplayProps {
  poemDetails: any;
  isDarkMode: boolean;
}

const PoemDisplay: React.FC<PoemDisplayProps> = ({ poemDetails, isDarkMode }) => {
  const emotionData = poemDetails.overall_emotions.map((emotion: any) => ({
    name: emotion.emotion,
    intensity: emotion.intensity,
  }));

  const getEmotionColor = (emotion: string) => {
    const colors = {
      Joy: '#FCD34D',
      Sadness: '#60A5FA',
      Anger: '#EF4444',
      Fear: '#818CF8',
      Surprise: '#34D399',
      Disgust: '#F472B6',
      Anticipation: '#FFA500',
      Trust: '#10B981',
      Love: '#EC4899'
    };
    return colors[emotion as keyof typeof colors] || '#A78BFA';
  };

  const getLineEmotionColor = (emotion: string) => {
    const colors = {
      Positive: 'text-green-500',
      Negative: 'text-red-500',
      Neutral: 'text-blue-500'
    };
    return colors[emotion as keyof typeof colors] || 'text-purple-500';
  };

  return (
    <div className={`mt-6 p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      {!poemDetails.line_emotions && (
        <>
          <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Poem Details:</h3>
          <p className={`whitespace-pre-line text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{poemDetails.text}</p>
        </>
      )}
      
      <h4 className={`text-2xl font-bold mt-6 mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Line Emotions:</h4>
      
      {/* New Legend */}
      <div className="flex justify-start items-center space-x-4 mb-4">
        <span className={`text-green-500 ${isDarkMode ? 'text-opacity-90' : 'text-opacity-100'}`}>● Positive</span>
        <span className={`text-red-500 ${isDarkMode ? 'text-opacity-90' : 'text-opacity-100'}`}>● Negative</span>
        <span className={`text-blue-500 ${isDarkMode ? 'text-opacity-90' : 'text-opacity-100'}`}>● Neutral</span>
      </div>
      
      <div className="space-y-2">
        {poemDetails.line_emotions.map((line: any, index: number) => (
          <p key={index} className={`${getLineEmotionColor(line.emotion)} text-lg ${isDarkMode ? 'text-opacity-90' : 'text-opacity-100'}`}>
            {line.line_no}. {line.text}
          </p>
        ))}
      </div>
      
      {poemDetails.overall_emotions && (
        <>
          <h4 className={`text-2xl font-bold my-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Overall Emotions</h4>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={emotionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="name" stroke={isDarkMode ? '#cbd5e1' : '#4b5563'} angle={-45} textAnchor="end" height={70} tick={{ fontSize: 14 }} />
              <YAxis stroke={isDarkMode ? '#cbd5e1' : '#4b5563'} tick={{ fontSize: 14 }} />
              <Tooltip
                contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', border: 'none', borderRadius: '8px', fontSize: '14px' }}
                labelStyle={{ color: isDarkMode ? '#cbd5e1' : '#4b5563', fontSize: '16px' }}
              />
              <Bar dataKey="intensity" fill="#8884d8">
                {emotionData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={getEmotionColor(entry.name)} />
                ))}
                <LabelList dataKey="intensity" position="top" fill={isDarkMode ? '#cbd5e1' : '#4b5563'} fontSize={14} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
      
      {poemDetails.analysis && (
        <>
          <h4 className={`text-2xl font-bold mt-6 mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Analysis:</h4>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{poemDetails.analysis}</p>
        </>
      )}
    </div>
  );
};

export default PoemDisplay;