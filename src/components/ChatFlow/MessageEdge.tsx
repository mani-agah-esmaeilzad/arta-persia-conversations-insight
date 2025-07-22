import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  Edge,
  EdgeProps,
} from '@xyflow/react';

interface MessageEdgeData extends Record<string, unknown> {
  label?: string;
  animated?: boolean;
  messageType?: 'sending' | 'received' | 'processing';
}

interface MessageEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: any;
  targetPosition: any;
  data?: MessageEdgeData;
}

const MessageEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data = {},
}: MessageEdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const getEdgeStyle = () => {
    switch (data.messageType) {
      case 'sending':
        return { stroke: '#F59E0B', strokeWidth: 3, strokeDasharray: '5,5' };
      case 'received':
        return { stroke: '#10B981', strokeWidth: 2 };
      case 'processing':
        return { stroke: '#8B5CF6', strokeWidth: 2, strokeDasharray: '10,5' };
      default:
        return { stroke: '#6B7280', strokeWidth: 2 };
    }
  };

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        style={getEdgeStyle()}
        className={data.animated ? 'animate-pulse' : ''}
      />
      {data.label && (
        <EdgeLabelRenderer>
          <div
            className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-1 shadow-lg text-xs font-medium text-gray-700">
              {data.label}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default MessageEdge;