export interface AIProviderRequest {
  question: string;
  productId?: string;
  version?: string;
  locale?: string;
  context?: string;
}

export interface AIProviderResponse {
  answer: string;
  citations: string[];
}

export interface AIProvider {
  ask(input: AIProviderRequest): Promise<AIProviderResponse>;
}

export interface AnalyticsEvent {
  name: string;
  tenantId?: string;
  properties?: Record<string, unknown>;
}

export interface AnalyticsAdapter {
  track(event: AnalyticsEvent): Promise<void>;
}

export const createNoopAIProvider = (): AIProvider => ({
  async ask() {
    return {
      answer: '(stub) See manual.',
      citations: []
    };
  }
});

export const createNoopAnalyticsAdapter = (): AnalyticsAdapter => ({
  async track() {
    return Promise.resolve();
  }
});
