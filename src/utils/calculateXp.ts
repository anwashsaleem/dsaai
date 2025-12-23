// XP Calculation Utility
// Single source of truth for XP calculation across the entire app
// Each lesson = 110 XP

interface CompletedLessons {
  stack: boolean;
  queue: boolean;
  circular: boolean;
  priority: boolean;
  linkedList: boolean;
}

const XP_PER_LESSON = 110;

export function calculateXp(completedLessons: CompletedLessons): number {
  return (
    (completedLessons.stack ? XP_PER_LESSON : 0) +
    (completedLessons.queue ? XP_PER_LESSON : 0) +
    (completedLessons.circular ? XP_PER_LESSON : 0) +
    (completedLessons.priority ? XP_PER_LESSON : 0) +
    (completedLessons.linkedList ? XP_PER_LESSON : 0)
  );
}

export function calculateLessonsCompleted(completedLessons: CompletedLessons): number {
  return (
    (completedLessons.stack ? 1 : 0) +
    (completedLessons.queue ? 1 : 0) +
    (completedLessons.circular ? 1 : 0) +
    (completedLessons.priority ? 1 : 0) +
    (completedLessons.linkedList ? 1 : 0)
  );
}

export { XP_PER_LESSON };