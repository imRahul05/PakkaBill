"use client";

import { useState, useCallback } from "react";

export function useCollapsibleList(itemCount: number) {
  const [expandedIndices, setExpandedIndices] = useState<Record<number, boolean>>({});

  const toggleItem = useCallback(
    (index: number, currentExpanded?: boolean) => {
      setExpandedIndices((prev) => {
        const isCurrentlyExpanded =
          currentExpanded !== undefined
            ? currentExpanded
            : prev[index] !== undefined
            ? prev[index]
            : index === itemCount - 1;
        return {
          ...prev,
          [index]: !isCurrentlyExpanded,
        };
      });
    },
    [itemCount]
  );

  const toggleAll = useCallback(
    (expand: boolean) => {
      const next: Record<number, boolean> = {};
      for (let i = 0; i < itemCount; i++) {
        next[i] = expand;
      }
      setExpandedIndices(next);
    },
    [itemCount]
  );

  const isExpanded = useCallback(
    (index: number): boolean => {
      if (expandedIndices[index] !== undefined) {
        return expandedIndices[index];
      }
      return index === itemCount - 1;
    },
    [expandedIndices, itemCount]
  );

  const allExpanded =
    itemCount > 0 && Array.from({ length: itemCount }).every((_, i) => isExpanded(i));

  return {
    isExpanded,
    toggleItem,
    toggleAll,
    allExpanded,
  };
}
