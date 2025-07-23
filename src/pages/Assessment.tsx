import React, { useEffect, useRef, useReducer } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, Bot, MessageCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ChatCharacter from '@/components/ChatCharacter';

// 1. تعریف انواع پیام و ساختار State
interface LocalChatMessage {
  type: 'user' | 'ai1' | 'ai2';
  content: string;
  timestamp: Date;
  character?: string;
  id: string;
}

interface ChatState {
  messages: LocalChatMessage[];
  isTyping: boolean;
  loading: boolean;
  isConnected: boolean;
  currentMessage: string;
}

// 2. تعریف Action هایی که می‌توانند State را تغییر دهند
type ChatAction =
  | { type: 'START_LOADING' }
  | { type: 'CONNECTION_COMPLETE' }
  | { type: 'START_TYPING' }
  | { type: 'STOP_TYPING' }
  | { type: 'ADD_MESSAGE'; payload: LocalChatMessage }
  | { type: 'UPDATE_INPUT'; payload: string };

// 3. Reducer: قلب تپنده مدیریت State
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'START_LOADING':
      return { ...state, loading: true };
    case 'CONNECTION_COMPLETE':
      return { ...state, loading: false, isConnected: true };
    case 'START_TYPING':
      return { ...state, isTyping: true };
    case 'STOP_TYPING':
      return { ...state, isTyping: false };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'UPDATE_INPUT':
      return { ...state, currentMessage: action.payload };
    default:
      return state;
  }
};

// State اولیه
const initialState: ChatState = {
  messages: [],
  isTyping: false,
  loading: true,
  isConnected: false,
  currentMessage: '',
};

const Assessment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { messages, isTyping, loading, isConnected, currentMessage } = state;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // شروع ارزیابی
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    dispatch({ type: 'START_LOADING' });
    toast.success('در حال شروع سناریو...');

    fetch('https://cofe-code.com/webhook/moshaver', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'شروع کنیم' }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.text();
      })
      .then(text => {
        dispatch({ type: 'CONNECTION_COMPLETE' });
        if (!text.trim()) return;

        const data = JSON.parse(text);
        if (data.type === 'ai_turn' && Array.isArray(data.messages)) {
          processAiMessages(data.messages);
        }
      })
      .catch(error => {
        console.error('Error starting assessment:', error);
        toast.error('خطا در شروع ارزیابی.');
        navigate('/');
      });
  }, [user, navigate]);

  // تابع برای پردازش پیام‌های AI
  const processAiMessages = async (aiMessages: any[]) => {
    for (const msg of aiMessages) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      let messageType: 'ai1' | 'ai2' = 'ai1';
      if (msg.character.includes('رضا')) {
        messageType = 'ai2';
      }
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          type: messageType,
          content: msg.content,
          timestamp: new Date(),
          character: msg.character,
          id: `ai-${Date.now()}-${Math.random()}`,
        },
      });
    }
  };

  // ارسال پیام کاربر
  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isTyping || !isConnected) return;

    // افزودن پیام کاربر
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        type: 'user',
        content: currentMessage,
        timestamp: new Date(),
        id: `user-${Date.now()}`,
      },
    });

    const messageToSend = currentMessage;
    dispatch({ type: 'UPDATE_INPUT', payload: '' });
    dispatch({ type: 'START_TYPING' });

    try {
      const response = await fetch('https://cofe-code.com/webhook/moshaver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend }),
      });
      if (!response.ok) throw new Error('Network response was not ok');

      const responseText = await response.text();
      dispatch({ type: 'STOP_TYPING' });

      if (!responseText.trim()) return;
      const data = JSON.parse(responseText);

      if (data.analysis) {
        toast.info('ارزیابی تکمیل شد!');
        navigate('/results', { state: { analysis: data.analysis } });
        return;
      }
      
      if (data.type === 'ai_turn' && Array.isArray(data.messages)) {
        await processAiMessages(data.messages);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('خطا در ارسال پیام.');
      dispatch({ type: 'STOP_TYPING' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // ... بقیه JSX شما بدون تغییر باقی می‌ماند ...
  // ... فقط onChange مربوط به Textarea باید تغییر کند ...
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-executive-pearl via-white to-executive-silver/20 flex flex-col">
       <header> 
        {/* ... JSX هدر شما بدون تغییر ... */}
       </header>
       <div className="flex-1 overflow-y-auto p-6">
         <div className="max-w-4xl mx-auto space-y-6">
           {messages.map((message) => (
             <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} items-end gap-6 mb-8`}>
                {/* ... بقیه JSX پیام‌ها ... */}
             </div>
           ))}
           {isTyping && (
            // ... JSX انیمیشن تایپینگ ...
           )}
           <div ref={messagesEndRef} />
         </div>
       </div>
       <div className="bg-white/95 backdrop-blur-xl border-t border-executive-ash-light/30 p-6 shadow-subtle">
         <div className="max-w-4xl mx-auto flex gap-4 items-end">
           <div className="flex-1">
             <Textarea
               value={currentMessage}
               onChange={(e) => dispatch({ type: 'UPDATE_INPUT', payload: e.target.value })} // ✅ تغییر کلیدی
               onKeyDown={handleKeyPress}
               placeholder="پاسخ خود را اینجا بنویسید..."
               className="min-h-[60px] max-h-[150px] text-base p-6 rounded-2xl border-2 border-executive-ash-light/50 focus:border-executive-navy resize-none bg-white/80 backdrop-blur-sm shadow-subtle transition-all duration-300"
               disabled={isTyping || !isConnected}
             />
           </div>
           <Button onClick={handleSendMessage} disabled={!currentMessage.trim() || isTyping || !isConnected} >
             {/* ... */}
           </Button>
         </div>
         {/* ... */}
       </div>
    </div>
  );
};

export default Assessment;
