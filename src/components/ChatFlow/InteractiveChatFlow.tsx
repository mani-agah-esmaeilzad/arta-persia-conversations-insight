import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import ChatNode from './ChatNode';
import MessageEdge from './MessageEdge';
import { ArrowLeft, Sparkles, Users, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const nodeTypes = {
  chatNode: ChatNode,
};

const edgeTypes = {
  messageEdge: MessageEdge,
};

const initialNodes: Node[] = [
  {
    id: 'user',
    type: 'chatNode',
    position: { x: 50, y: 200 },
    data: {
      type: 'user',
      name: 'شما',
      isActive: true,
      onSendMessage: () => {},
    },
  },
  {
    id: 'ai1',
    type: 'chatNode',
    position: { x: 450, y: 100 },
    data: {
      type: 'ai1',
      name: 'سارا - مربی',
      isActive: true,
      isSpeaking: false,
      messages: [
        'سلام! من سارا هستم، مربی شما در این جلسه. خوشحالم که اینجا هستید! 😊',
        'بسیار عالی! این نشان‌دهنده تفکر تحلیلی قوی شماست.',
        'احساس می‌کنم شما در تصمیم‌گیری مهارت خوبی دارید.',
        'از پاسخ‌تان متوجه شدم که در کار تیمی موثر هستید.'
      ],
    },
  },
  {
    id: 'ai2',
    type: 'chatNode',
    position: { x: 450, y: 350 },
    data: {
      type: 'ai2',
      name: 'علی - تحلیلگر',
      isActive: true,
      isSpeaking: false,
      messages: [
        'سلام! من علی هستم، متخصص تحلیل رفتار. آماده همکاری با شما هستیم!',
        'کاملاً موافقم با سارا. این رفتار نشان‌دهنده بلوغ عاطفی بالایی است.',
        'بر اساس آنچه گفتید، به نظر می‌رسد در مدیریت تعارض مهارت دارید.',
        'درست می‌گوید سارا. حالا بگویید در شرایط بحرانی چگونه رفتار می‌کنید؟'
      ],
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'user-ai1',
    source: 'user',
    target: 'ai1',
    type: 'messageEdge',
    animated: false,
    data: { messageType: 'received' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'user-ai2',
    source: 'user',
    target: 'ai2',
    type: 'messageEdge',
    animated: false,
    data: { messageType: 'received' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'ai1-ai2',
    source: 'ai1',
    target: 'ai2',
    type: 'messageEdge',
    animated: false,
    data: { messageType: 'processing' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];

const InteractiveChatFlow = () => {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [currentSpeaker, setCurrentSpeaker] = useState<'ai1' | 'ai2' | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    messagesExchanged: 0,
    duration: 0,
    insights: 0,
  });

  // Timer for session duration
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionStats(prev => ({ ...prev, duration: prev.duration + 1 }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const simulateAIResponse = useCallback((speaker: 'ai1' | 'ai2') => {
    setCurrentSpeaker(speaker);
    
    // Update speaking status
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isSpeaking: node.id === speaker,
        },
      }))
    );

    // Update edge animation
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        animated: edge.target === speaker || edge.source === speaker,
        data: {
          ...edge.data,
          messageType: edge.target === speaker ? 'sending' : 'processing',
        },
      }))
    );

    // Stop speaking after 3 seconds
    setTimeout(() => {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            isSpeaking: false,
          },
        }))
      );
      
      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          animated: false,
          data: {
            ...edge.data,
            messageType: 'received',
          },
        }))
      );
      
      setCurrentSpeaker(null);
      setSessionStats(prev => ({ 
        ...prev, 
        messagesExchanged: prev.messagesExchanged + 1,
        insights: prev.insights + Math.floor(Math.random() * 2)
      }));
    }, 3000);
  }, [setNodes, setEdges]);

  const handleUserMessage = useCallback((message: string) => {
    setMessageCount(prev => prev + 1);
    
    // Determine which AI should respond (alternating)
    const nextSpeaker = messageCount % 2 === 0 ? 'ai1' : 'ai2';
    
    setTimeout(() => {
      simulateAIResponse(nextSpeaker);
    }, 1000);
  }, [messageCount, simulateAIResponse]);

  // Update user node with message handler
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === 'user') {
          return {
            ...node,
            data: {
              ...node.data,
              onSendMessage: handleUserMessage,
            },
          };
        }
        return node;
      })
    );
  }, [handleUserMessage, setNodes]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-executive-pearl via-white to-executive-silver/20 relative">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-executive-ash-light/30 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="w-12 h-12 bg-executive-ash-light/50 rounded-xl flex items-center justify-center hover:bg-executive-navy/10 transition-all duration-300 group"
            >
              <ArrowLeft className="w-6 h-6 text-executive-ash group-hover:text-executive-navy" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-executive-navy to-executive-navy-light rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-executive-charcoal">شبکه تعاملی چت</h1>
                <p className="text-sm text-executive-ash">تجربه گفتگوی سه‌بعدی با AI</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">{formatTime(sessionStats.duration)}</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
              <Users className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">{sessionStats.messagesExchanged} پیام</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">{sessionStats.insights} بینش</span>
            </div>
          </div>
        </div>
      </header>

      {/* Flow Container */}
      <div className="pt-20 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          className="react-flow-container"
          style={{ backgroundColor: 'transparent' }}
        >
          <Controls className="bg-white/90 border border-executive-ash-light/30 rounded-xl shadow-subtle" />
          <MiniMap 
            className="bg-white/90 border border-executive-ash-light/30 rounded-xl shadow-subtle overflow-hidden"
            nodeColor={(node) => {
              switch (node.data.type) {
                case 'user': return '#F59E0B';
                case 'ai1': return '#3B82F6';
                case 'ai2': return '#10B981';
                default: return '#6B7280';
              }
            }}
          />
          <Background 
            variant={"dots" as any}
            gap={20} 
            size={1} 
            color="#E5E7EB"
          />
        </ReactFlow>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-xl rounded-2xl p-4 border border-executive-ash-light/30 shadow-luxury max-w-md">
        <h3 className="font-bold text-executive-charcoal mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-executive-gold" />
          راهنمای استفاده
        </h3>
        <ul className="text-sm text-executive-ash space-y-1">
          <li>• پیام خود را در node کاربر تایپ کنید</li>
          <li>• دو AI به نوبت پاسخ خواهند داد</li>
          <li>• خطوط اتصال نشان‌دهنده جریان گفتگو هستند</li>
          <li>• برای بزرگ‌نمایی از کنترل‌ها استفاده کنید</li>
        </ul>
      </div>
    </div>
  );
};

export default InteractiveChatFlow;