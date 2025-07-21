import React from 'react';
import { motion } from 'framer-motion';
import aiCharacter from '@/assets/ai-character.png';
import userCharacter from '@/assets/user-character.png';

interface ChatCharacterProps {
  type: 'ai' | 'user';
  isTyping?: boolean;
  isSpeaking?: boolean;
}

const ChatCharacter: React.FC<ChatCharacterProps> = ({ type, isTyping = false, isSpeaking = false }) => {
  const characterImage = type === 'ai' ? aiCharacter : userCharacter;
  
  const bounceAnimation = isSpeaking ? {
    y: [0, -10, 0],
    scale: [1, 1.05, 1],
  } : {
    y: 0,
    scale: 1,
  };

  const bounceTransition = {
    duration: 0.6,
    repeat: Infinity,
    ease: "easeInOut" as const
  };

  const blinkAnimation = {
    animate: {
      scaleY: [1, 0.1, 1],
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        className="relative w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-white to-executive-pearl shadow-luxury"
        animate={bounceAnimation}
        transition={isSpeaking ? bounceTransition : { type: "spring", stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.1 }}
      >
        <img 
          src={characterImage} 
          alt={`${type} character`}
          className="w-full h-full object-cover"
        />
        
        {/* Eyes overlay for blinking */}
        <motion.div
          className="absolute inset-0 bg-executive-navy/10"
          {...blinkAnimation}
          style={{ display: isSpeaking ? 'none' : 'block' }}
        />
        
        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            className="absolute -bottom-2 -right-2 w-6 h-6 bg-executive-navy rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="flex space-x-0.5">
              <motion.div
                className="w-1 h-1 bg-white rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-1 h-1 bg-white rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-1 h-1 bg-white rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
      
      <motion.div
        className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
          type === 'ai' 
            ? 'bg-executive-navy/10 text-executive-navy' 
            : 'bg-executive-gold/10 text-executive-gold'
        }`}
        animate={{ opacity: isSpeaking ? 1 : 0.7 }}
      >
        {type === 'ai' ? 'مشاور هوشمند' : 'شما'}
      </motion.div>
    </div>
  );
};

export default ChatCharacter;