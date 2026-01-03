// XP Calculation Utility
// Single source of truth for XP calculation across the entire app
// Each lesson has different XP values

interface CompletedLessons {
  stack: boolean;
  queue: boolean;
  circular: boolean;
  priority: boolean;
  linkedList: boolean;
}

const LESSON_XP_MAP = {
  stack: 110,
  queue: 120,
  circular: 135,
  priority: 145,
  linkedList: 170
};

export function calculateXp(completedLessons: CompletedLessons): number {
  return (
    (completedLessons.stack ? LESSON_XP_MAP.stack : 0) +
    (completedLessons.queue ? LESSON_XP_MAP.queue : 0) +
    (completedLessons.circular ? LESSON_XP_MAP.circular : 0) +
    (completedLessons.priority ? LESSON_XP_MAP.priority : 0) +
    (completedLessons.linkedList ? LESSON_XP_MAP.linkedList : 0)
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

export { LESSON_XP_MAP };