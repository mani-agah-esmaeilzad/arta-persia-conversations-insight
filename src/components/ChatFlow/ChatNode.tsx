import React, { memo, useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { User, Bot, MessageCircle, Zap } from 'lucide-react';

interface ChatNodeProps {
  data: {
    type: 'user' | 'ai1' | 'ai2';
    name: string;
    avatar?: string;
    isActive?: boolean;
    isSpeaking?: boolean;
    messages?: string[];
    onSendMessage?: (message: string) => void;
  };
}

const ChatNode = ({ data }: ChatNodeProps) => {
  const [message, setMessage] = useState('');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (data.isSpeaking && data.messages && data.messages.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setCurrentMessageIndex(prev => (prev + 1) % data.messages!.length);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [data.isSpeaking, data.messages]);

  const getNodeStyle = () => {
    switch (data.type) {
      case 'user':
        return 'bg-gradient-to-br from-executive-gold/20 to-executive-gold-light/30 border-executive-gold/40';
      case 'ai1':
        return 'bg-gradient-to-br from-blue-100 to-blue-200/50 border-blue-300/60';
      case 'ai2':
        return 'bg-gradient-to-br from-green-100 to-green-200/50 border-green-300/60';
      default:
        return 'bg-white border-gray-300';
    }
  };

  const getIcon = () => {
    switch (data.type) {
      case 'user':
        return <User className="w-6 h-6 text-executive-gold" />;
      case 'ai1':
        return <Bot className="w-6 h-6 text-blue-600" />;
      case 'ai2':
        return <MessageCircle className="w-6 h-6 text-green-600" />;
    }
  };

  const getCurrentMessage = () => {
    if (!data.messages || data.messages.length === 0) return '';
    return data.messages[currentMessageIndex] || '';
  };

  return (
    <div 
      className={`
        relative min-w-[280px] max-w-[350px] rounded-3xl border-2 backdrop-blur-sm
        ${getNodeStyle()}
        ${data.isActive ? 'shadow-luxury scale-105' : 'shadow-subtle'}
        transition-all duration-500 ease-in-out
      `}
    >
      {/* Connection Points */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-executive-navy border-2 border-white shadow-lg"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-executive-navy border-2 border-white shadow-lg"
      />

      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/30">
        <div className={`
          relative w-12 h-12 rounded-2xl flex items-center justify-center
          ${data.isSpeaking ? 'animate-pulse' : ''}
        `}>
          {getIcon()}
          {data.isSpeaking && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-bounce">
              <Zap className="w-3 h-3 text-white m-0.5" />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-bold text-executive-charcoal text-lg">{data.name}</h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              data.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm text-executive-ash">
              {data.isActive ? 'آنلاین' : 'آفلاین'}
            </span>
          </div>
        </div>
      </div>

      {/* Message Area */}
      <div className="p-4 min-h-[120px] max-h-[200px] overflow-y-auto">
        {data.type === 'user' ? (
          <div className="space-y-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="پیام خود را بنویسید..."
              className="w-full p-3 rounded-xl border border-executive-ash-light/30 bg-white/80 resize-none text-sm"
              rows={3}
            />
            <button
              onClick={() => {
                if (message.trim() && data.onSendMessage) {
                  data.onSendMessage(message);
                  setMessage('');
                }
              }}
              disabled={!message.trim()}
              className="w-full py-2 px-4 bg-gradient-to-r from-executive-navy to-executive-navy-light text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              ارسال پیام
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {isTyping ? (
              <div className="flex space-x-1 justify-center">
                <div className="w-2 h-2 bg-executive-navy rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-executive-navy rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-executive-navy rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            ) : (
              <div className="bg-white/60 rounded-xl p-3">
                <p className="text-executive-charcoal text-sm leading-relaxed">
                  {getCurrentMessage()}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Activity Indicator */}
      {data.isSpeaking && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ChatNode);