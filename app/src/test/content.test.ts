import { describe, it, expect } from 'vitest';
import { shuffleArray, getRandomWithoutRepeat, resetSessionTracker, pickRandom } from '@/utils/shuffleUtils';
import { clasicoExtra3, yoNuncaExtra3, picanteExtra3, masProbableExtra3, pacoversExtra3 } from '@/data/gameContentExtra3';
import { cultureQuestionsNew2025 } from '@/data/cultureQuestionsNew2025';
import { duelos } from '@/data/duelosContent';
import { mimicaChallenges } from '@/data/mimicaContent';

// ─── Content Integrity Tests ─────────────────────────────────────────────────

describe('Game Content: Extra3 (New 2024-2025)', () => {
  it('clasicoExtra3 has at least 50 entries', () => {
    expect(clasicoExtra3.length).toBeGreaterThanOrEqual(50);
  });

  it('yoNuncaExtra3 has at least 30 entries', () => {
    expect(yoNuncaExtra3.length).toBeGreaterThanOrEqual(30);
  });

  it('picanteExtra3 has at least 20 entries', () => {
    expect(picanteExtra3.length).toBeGreaterThanOrEqual(20);
  });

  it('masProbableExtra3 has at least 20 entries', () => {
    expect(masProbableExtra3.length).toBeGreaterThanOrEqual(20);
  });

  it('pacoversExtra3 has at least 15 entries', () => {
    expect(pacoversExtra3.length).toBeGreaterThanOrEqual(15);
  });

  it('clasicoExtra3 contains no empty strings', () => {
    clasicoExtra3.forEach((entry, i) => {
      expect(entry.trim().length, `Entry ${i} is empty`).toBeGreaterThan(0);
    });
  });

  it('yoNuncaExtra3 entries all start with "Yo nunca"', () => {
    yoNuncaExtra3.forEach((entry, i) => {
      expect(entry.startsWith('Yo nunca'), `Entry ${i}: "${entry.substring(0, 30)}" doesn't start with "Yo nunca"`).toBe(true);
    });
  });
});

describe('Culture Questions 2025', () => {
  it('has at least 80 questions', () => {
    expect(cultureQuestionsNew2025.length).toBeGreaterThanOrEqual(80);
  });

  it('all questions have 4 options', () => {
    cultureQuestionsNew2025.forEach((q, i) => {
      expect(q.options.length, `Question ${i}: "${q.question.substring(0, 40)}" has ${q.options.length} options`).toBe(4);
    });
  });

  it('all correct answers are in the options list', () => {
    cultureQuestionsNew2025.forEach((q, i) => {
      expect(
        q.options.includes(q.correct_answer),
        `Question ${i}: "${q.question.substring(0, 40)}" correct answer "${q.correct_answer}" not in options`
      ).toBe(true);
    });
  });

  it('no duplicate questions', () => {
    const questions = cultureQuestionsNew2025.map(q => q.question);
    const uniqueQuestions = new Set(questions);
    expect(uniqueQuestions.size).toBe(questions.length);
  });

  it('covers multiple categories', () => {
    const categories = new Set(cultureQuestionsNew2025.map(q => q.category));
    expect(categories.size).toBeGreaterThanOrEqual(5);
  });
});

describe('Existing Content: Duelos', () => {
  it('has duelos array with entries', () => {
    expect(duelos.length).toBeGreaterThan(10);
  });

  it('each duelo has name, description, and type', () => {
    duelos.forEach((d, i) => {
      expect(d.name, `Duelo ${i} missing name`).toBeTruthy();
      expect(d.description, `Duelo ${i} missing description`).toBeTruthy();
      expect(d.type, `Duelo ${i} missing type`).toBeTruthy();
    });
  });
});

describe('Existing Content: Mímica', () => {
  it('has mimicaChallenges array with entries', () => {
    expect(mimicaChallenges.length).toBeGreaterThan(20);
  });

  it('each challenge has text and category', () => {
    mimicaChallenges.forEach((m, i) => {
      expect(m.text, `Mímica ${i} missing text`).toBeTruthy();
      expect(m.category, `Mímica ${i} missing category`).toBeTruthy();
    });
  });
});

// ─── Shuffle & Randomization Tests ───────────────────────────────────────────

describe('Shuffle Utils', () => {
  it('shuffleArray produces a different order (statistical)', () => {
    const input = Array.from({ length: 100 }, (_, i) => i);
    const shuffled = shuffleArray(input);
    
    // Should have same length
    expect(shuffled.length).toBe(input.length);
    
    // Should contain same elements
    expect(shuffled.sort((a, b) => a - b)).toEqual(input);
    
    // Should differ from original (extremely unlikely to be identical)
    const reshuffled = shuffleArray(input);
    let diffCount = 0;
    for (let i = 0; i < input.length; i++) {
      if (reshuffled[i] !== input[i]) diffCount++;
    }
    expect(diffCount).toBeGreaterThan(10); // At least 10% should be different
  });

  it('getRandomWithoutRepeat prevents repeats within a session', () => {
    resetSessionTracker('test_key');
    const items = ['a', 'b', 'c', 'd', 'e'];
    const seen = new Set<string>();
    
    // Draw all 5 items
    for (let i = 0; i < 5; i++) {
      const item = getRandomWithoutRepeat('test_key', items);
      expect(seen.has(item), `Item "${item}" was repeated before all items shown`).toBe(false);
      seen.add(item);
    }
    
    // All items should have been seen
    expect(seen.size).toBe(5);
    
    // After all shown, tracker should reset — drawing again should work
    const nextItem = getRandomWithoutRepeat('test_key', items);
    expect(items.includes(nextItem)).toBe(true);
  });

  it('pickRandom returns correct count', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const picked = pickRandom(items, 3);
    expect(picked.length).toBe(3);
    
    // All picked items should be from the original array
    picked.forEach(p => {
      expect(items.includes(p)).toBe(true);
    });
    
    // Should be unique
    expect(new Set(picked).size).toBe(3);
  });

  it('pickRandom handles count larger than array', () => {
    const items = [1, 2, 3];
    const picked = pickRandom(items, 10);
    expect(picked.length).toBe(3); // Can't pick more than available
  });
});
