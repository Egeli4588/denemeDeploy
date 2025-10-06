
import React, { useState } from 'react';
import { SendIcon } from './Icons';
import LoadingSpinner from './LoadingSpinner';

interface ChatInputProps {
  onSendMessage: (input: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Sorunuzu yazınız..."
        disabled={disabled}
        className="flex-1 w-full bg-gray-700 text-gray-200 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 transition duration-200"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="bg-cyan-600 text-white rounded-full p-3 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200 flex-shrink-0"
      >
        {disabled ? (
          <LoadingSpinner className="w-6 h-6" />
        ) : (
          <SendIcon className="w-6 h-6" />
        )}
      </button>
    </form>
  );
};

export default ChatInput;
