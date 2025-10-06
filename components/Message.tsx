
import React from 'react';
import { ChatMessage, Role } from '../types';
import { UserIcon, BotIcon } from './Icons';
import LoadingSpinner from './LoadingSpinner';

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isModel = message.role === Role.MODEL;

  const containerClasses = isModel
    ? 'flex justify-start items-start space-x-3'
    : 'flex justify-end items-start space-x-3';

  const bubbleClasses = isModel
    ? 'bg-gray-700/80 text-gray-200 rounded-b-lg rounded-tr-lg'
    : 'bg-cyan-600/90 text-white rounded-b-lg rounded-tl-lg';

  const Icon = isModel ? BotIcon : UserIcon;
  const iconClasses = isModel ? 'text-cyan-400' : 'text-gray-400';

  const formattedContent = message.content.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <div className={containerClasses}>
      {isModel && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
            <Icon className={iconClasses + " w-5 h-5"} />
        </div>
      )}
      <div className={`max-w-2xl px-4 py-3 ${bubbleClasses}`}>
        {message.content ? (
            <p className="text-base whitespace-pre-wrap">{formattedContent}</p>
        ) : (
            <LoadingSpinner className="w-5 h-5 text-gray-400" />
        )}
      </div>
       {!isModel && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <Icon className={iconClasses + " w-5 h-5"} />
        </div>
      )}
    </div>
  );
};

export default Message;
