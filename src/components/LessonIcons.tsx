// Custom SVG Icons for each lesson type
import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Binary Tree: one root splitting into two
export const BinaryTreeIcon = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} strokeWidth="2">
    <circle cx="12" cy="5" r="2.5" stroke="currentColor" fill="currentColor" />
    <line x1="12" y1="7.5" x2="7" y2="13" stroke="currentColor" strokeLinecap="round" />
    <line x1="12" y1="7.5" x2="17" y2="13" stroke="currentColor" strokeLinecap="round" />
    <circle cx="7" cy="15" r="2.5" stroke="currentColor" fill="currentColor" />
    <circle cx="17" cy="15" r="2.5" stroke="currentColor" fill="currentColor" />
    <line x1="7" y1="17.5" x2="5" y2="20" stroke="currentColor" strokeLinecap="round" />
    <line x1="7" y1="17.5" x2="9" y2="20" stroke="currentColor" strokeLinecap="round" />
    <circle cx="5" cy="21" r="1.2" fill="currentColor" />
    <circle cx="9" cy="21" r="1.2" fill="currentColor" />
  </svg>
);

// Binary Search Tree: binary tree with search arrows
export const BinarySearchTreeIcon = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="5" r="2.5" stroke="currentColor" strokeWidth="2" fill="currentColor" />
    <line x1="12" y1="7.5" x2="7" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="7.5" x2="17" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="7" cy="15" r="2.5" stroke="currentColor" strokeWidth="2" fill="currentColor" />
    <circle cx="17" cy="15" r="2.5" stroke="currentColor" strokeWidth="2" fill="currentColor" />
    {/* Search magnifying glass overlay */}
    <circle cx="19" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <line x1="17.5" y1="5.5" x2="16" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// M Way Tree: one parent with multiple children (3+ branches)
export const MWayTreeIcon = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="4" r="2.5" stroke="currentColor" strokeWidth="2" fill="currentColor" />
    <line x1="12" y1="6.5" x2="5" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="6.5" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="6.5" x2="19" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="5" cy="15.5" r="2" stroke="currentColor" strokeWidth="2" fill="currentColor" />
    <circle cx="12" cy="15.5" r="2" stroke="currentColor" strokeWidth="2" fill="currentColor" />
    <circle cx="19" cy="15.5" r="2" stroke="currentColor" strokeWidth="2" fill="currentColor" />
    {/* Additional child to show "M-way" */}
    <line x1="12" y1="6.5" x2="8" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    <circle cx="8" cy="20" r="1.5" fill="currentColor" opacity="0.6" />
  </svg>
);

// M Way Search Tree: multiple keys per node
export const MWaySearchTreeIcon = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="8" y="2" width="8" height="5" rx="1.5" stroke="currentColor" strokeWidth="2" fill="currentColor" />
    <line x1="8.5" y1="7" x2="6" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="7" x2="12" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="15.5" y1="7" x2="18" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <rect x="3.5" y="16" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" />
    <rect x="10" y="16" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" />
    <rect x="15.5" y="16" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" />
  </svg>
);

// Bubble Sort: bubbles arranged small to big
export const BubbleSortIcon = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="5" cy="18" r="2.5" fill="currentColor" opacity="0.7" />
    <circle cx="12" cy="14" r="3.5" fill="currentColor" opacity="0.8" />
    <circle cx="19" cy="8" r="4.5" fill="currentColor" />
  </svg>
);

// Selection Sort: list with highlighted box
export const SelectionSortIcon = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="4" width="4" height="4" rx="1" fill="currentColor" opacity="0.3" />
    <rect x="10" y="4" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="2" />
    <rect x="16" y="4" width="4" height="4" rx="1" fill="currentColor" opacity="0.3" />
    <rect x="4" y="10" width="4" height="4" rx="1" fill="currentColor" opacity="0.3" />
    <rect x="10" y="10" width="4" height="4" rx="1" fill="currentColor" opacity="0.3" />
    <rect x="16" y="10" width="4" height="4" rx="1" fill="currentColor" opacity="0.3" />
  </svg>
);

// Insertion Sort: a box being inserted
export const InsertionSortIcon = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="10" width="4" height="4" rx="1" fill="currentColor" />
    <rect x="10" y="10" width="4" height="4" rx="1" fill="currentColor" />
    <rect x="16" y="4" width="4" height="4" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="2" />
    <path d="M 18 8 L 18 10" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)" />
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
        <polygon points="0 0, 6 3, 0 6" fill="currentColor" />
      </marker>
    </defs>
  </svg>
);

// Heap Sort: pyramid heap
export const HeapSortIcon = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="5" r="2.5" fill="currentColor" />
    <circle cx="8" cy="11" r="2" fill="currentColor" />
    <circle cx="16" cy="11" r="2" fill="currentColor" />
    <circle cx="6" cy="17" r="1.5" fill="currentColor" />
    <circle cx="10" cy="17" r="1.5" fill="currentColor" />
    <circle cx="14" cy="17" r="1.5" fill="currentColor" />
    <circle cx="18" cy="17" r="1.5" fill="currentColor" />
  </svg>
);

// Radix Sort: digit columns
export const RadixSortIcon = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="8" width="3" height="12" rx="0.5" fill="currentColor" opacity="0.9" />
    <rect x="8" y="12" width="3" height="8" rx="0.5" fill="currentColor" opacity="0.7" />
    <rect x="12" y="6" width="3" height="14" rx="0.5" fill="currentColor" />
    <rect x="16" y="10" width="3" height="10" rx="0.5" fill="currentColor" opacity="0.8" />
  </svg>
);

// Shell Sort: concentric rings
export const ShellSortIcon = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

// Bucket Sort: buckets with items
export const BucketSortIcon = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M 4 8 L 4 18 L 8 20 L 8 10 Z" fill="currentColor" opacity="0.7" />
    <path d="M 10 6 L 10 18 L 14 20 L 14 8 Z" fill="currentColor" />
    <path d="M 16 10 L 16 18 L 20 20 L 20 12 Z" fill="currentColor" opacity="0.8" />
    <circle cx="6" cy="7" r="1" fill="currentColor" />
    <circle cx="12" cy="5" r="1" fill="currentColor" />
    <circle cx="18" cy="9" r="1" fill="currentColor" />
  </svg>
);

// Merge Sort: two branches merging
export const MergeSortIcon = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="4" width="4" height="4" rx="1" fill="currentColor" />
    <rect x="16" y="4" width="4" height="4" rx="1" fill="currentColor" />
    <path d="M 6 8 L 6 12 L 12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M 18 8 L 18 12 L 12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <rect x="10" y="16" width="4" height="4" rx="1" fill="currentColor" />
  </svg>
);

// Quick Sort: pivot with split arrows
export const QuickSortIcon = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <path d="M 6 8 L 9 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M 18 8 L 15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M 6 16 L 9 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M 18 16 L 15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="6" cy="8" r="1.5" fill="currentColor" />
    <circle cx="18" cy="8" r="1.5" fill="currentColor" />
    <circle cx="6" cy="16" r="1.5" fill="currentColor" />
    <circle cx="18" cy="16" r="1.5" fill="currentColor" />
  </svg>
);

// Binary Search: list with magnifier on middle
export const BinarySearchIcon = ({ className = '', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="10" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
    <rect x="8" y="10" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
    <rect x="12" y="10" width="3" height="4" rx="0.5" fill="currentColor" />
    <rect x="16" y="10" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
    <circle cx="13.5" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
    <line x1="16" y1="15" x2="19" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);