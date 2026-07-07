export interface AIConfig {
    provider: 'none' | 'openai' | 'anthropic' | 'gemini' | 'ollama' | 'openrouter';
    apiKey: string;
    apiUrl: string;
    model: string;
    systemPrompt: string;
}
export declare function fetchAIReview(config: AIConfig, jiraDescription: string, prFiles: {
    path: string;
    patch?: string;
    additions: number;
    deletions: number;
    status: string;
}[]): Promise<string>;
//# sourceMappingURL=review.d.ts.map