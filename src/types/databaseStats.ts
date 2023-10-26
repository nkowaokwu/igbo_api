export interface ProjectStats extends DatabaseStats, GitHubStats {}

export interface DatabaseStats {
  totalWords: number;
  totalExamples: number;
  totalAudioPronunciations: number;
  totalIgboDefinitions: number;
  totalProverbs: number;
  totalBibleVerses: number;
  totalNsibidiWords: number;
  totalDevelopers: number;
}

export interface GitHubStats {
  contributors: { login: string; avatar_url: string; html_url: string }[];
  stars: number;
}
