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
  
  // Speaking animation - more dramatic bounce
  const speakingAnimation = {
    y: [0, -15, 0],
    scale: [1, 1.1, 1],
    rotateZ: [0, 2, -2, 0],
  };

  // Idle breathing animation
  const breathingAnimation = {
    scale: [1, 1.02, 1],
    y: [0, -2, 0],
  };

  // Eye blinking animation
  const blinkVariants = {
    open: { scaleY: 1 },
    blink: { scaleY: 0.1 },
  };

  // Mouth movement for speaking
  const mouthVariants = {
    closed: { scaleY: 1 },
    speaking: { scaleY: [1, 1.3, 0.8, 1.2, 1] },
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Character Container */}
      <motion.div
        className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-white to-executive-pearl shadow-2xl border-4 border-white"
        animate={isSpeaking ? speakingAnimation : breathingAnimation}
        transition={
          isSpeaking 
            ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
            : { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
        whileHover={{ scale: 1.15, rotateZ: 5 }}
        style={{ 
          filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.2))',
        }}
      >
        {/* Character Image */}
        <motion.img 
          src={characterImage} 
          alt={`${type} character`}
          className="w-full h-full object-cover"
          animate={isSpeaking ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
        
        {/* Eyes Overlay for Blinking */}
        <motion.div
          className="absolute top-[30%] left-[25%] w-[50%] h-[15%] bg-executive-charcoal/20 rounded-full"
          variants={blinkVariants}
          animate={isSpeaking ? "open" : "blink"}
          transition={{
            duration: 0.15,
            repeat: isSpeaking ? 0 : Infinity,
            repeatDelay: isSpeaking ? 0 : 4,
            ease: "easeInOut"
          }}
        />
        
        {/* Mouth Animation Overlay */}
        {isSpeaking && (
          <motion.div
            className="absolute bottom-[25%] left-[35%] w-[30%] h-[15%] bg-executive-charcoal/10 rounded-full"
            variants={mouthVariants}
            animate="speaking"
            transition={{
              duration: 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
        
        {/* Glow Effect when Speaking */}
        {isSpeaking && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-executive-gold/30 to-executive-navy/30 rounded-full"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
        
        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            className="absolute -bottom-3 -right-3 w-8 h-8 bg-executive-navy rounded-full flex items-center justify-center shadow-lg"
            animate={{ 
              scale: [1, 1.3, 1],
              rotateZ: [0, 10, -10, 0]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="flex space-x-0.5">
              <motion.div
                className="w-1.5 h-1.5 bg-white rounded-full"
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-1.5 h-1.5 bg-white rounded-full"
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-1.5 h-1.5 bg-white rounded-full"
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </motion.div>
        )}

        {/* Particle Effects when Speaking */}
        {isSpeaking && (
          <>
            <motion.div
              className="absolute top-2 right-2 w-2 h-2 bg-executive-gold rounded-full"
              animate={{
                x: [0, 10, -5, 0],
                y: [0, -10, 5, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              className="absolute top-4 left-3 w-1.5 h-1.5 bg-executive-navy rounded-full"
              animate={{
                x: [0, -8, 3, 0],
                y: [0, -8, 2, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
            />
          </>
        )}
      </motion.div>
      
      {/* Character Label with Animation */}
      <motion.div
        className={`mt-4 px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
          type === 'ai' 
            ? 'bg-gradient-to-r from-executive-navy to-executive-navy-light text-white' 
            : 'bg-gradient-to-r from-executive-gold to-executive-gold-light text-executive-charcoal'
        }`}
        animate={isSpeaking ? { 
          scale: [1, 1.05, 1],
          boxShadow: [
            '0 4px 15px rgba(0,0,0,0.2)',
            '0 8px 25px rgba(0,0,0,0.3)',
            '0 4px 15px rgba(0,0,0,0.2)'
          ]
        } : { opacity: 0.8 }}
        transition={{ duration: 0.8, repeat: isSpeaking ? Infinity : 0 }}
      >
        {type === 'ai' ? '🤖 مشاور هوشمند' : '👤 شما'}
      </motion.div>

      {/* Sound Waves when Speaking */}
      {isSpeaking && (
        <div className="absolute -z-10">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 border-2 border-executive-gold/30 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                marginLeft: '-4rem',
                marginTop: '-4rem',
              }}
              animate={{
                scale: [1, 2.5],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.7,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatCharacter;