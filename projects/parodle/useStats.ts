import {useCallback, useEffect, useState} from "react";

export interface Stats {
  totalPlays: number,
  totalSuccess: number,
  successAttempts: number[],
  wordFrequency: Map<string, number>
}

const STATS_KEY = "parodle-stats";

export function useStats() {
  // stats registered
  // - total times played
  // - times of success at n-th time
  // - most frequent words used
  // so there should be:
  // - a callback to call when the game ends
  // - one when the word is inserted
  // and also an object with all the stats that can be displayed

  const [stats, setStats] = useState<Stats>({
    totalPlays: 0,
    totalSuccess: 0,
    successAttempts: Array.from({length: 6}).map((_) => 0),
    wordFrequency: new Map()
  });

  useEffect(() => {
    const statsAsString = window.localStorage.getItem(STATS_KEY);
    if (statsAsString) {
      const stats: Stats = JSON.parse(statsAsString) as Stats;
      stats.wordFrequency = new Map(Object.entries(stats.wordFrequency));
      setStats(stats);
    }
  }, []);

  useEffect(() => {
    setStats(prev => {
      const savable = {
        ...prev,
        wordFrequency: Object.fromEntries(prev.wordFrequency.entries())
      }
      window.localStorage.setItem(STATS_KEY, JSON.stringify(savable));
      return prev;
    });
  }, [stats]);

  const onGameEnd = useCallback((isSuccess: boolean, guessesCount: number) => {
    setStats(prev => {
      const successAttempts = [...prev.successAttempts];
      if (isSuccess) {
        successAttempts[guessesCount - 1]++;
      }
      return {
        ...prev,
        successAttempts,
        totalSuccess: prev.totalSuccess + (isSuccess ? 1 : 0),
        totalPlays: prev.totalPlays + 1
      }
    });
  }, []);

  const onWord = useCallback((word: string) => {
    setStats(prev => {
      const wordFrequency = new Map(prev.wordFrequency);
      wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
      return {
        ...prev,
        wordFrequency
      }
    });
  }, []);

  return {
    stats, onWord, onGameEnd
  }
}