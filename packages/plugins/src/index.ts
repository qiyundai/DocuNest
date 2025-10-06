export interface AIProviderRequest {
  tenantId: string;
  manualId?: string;
  productId?: string;
  version?: string;
  locale?: string;
  question: string;
}

export interface AIProviderResponse {
  answer: string;
  citations: Array<{ manualId: string; sectionId: string; snippet: string }>;
}

export interface AIProvider {
  ask(input: AIProviderRequest): Promise<AIProviderResponse>;
}

export interface AnalyticsEvent {
  name: string;
  tenantId: string;
  properties?: Record<string, unknown>;
}

export interface AnalyticsAdapter {
  track(event: AnalyticsEvent): Promise<void>;
}

class NoopAIProvider implements AIProvider {
  async ask(input: AIProviderRequest): Promise<AIProviderResponse> {
    return {
      answer: `(noop) No AI provider configured for question: ${input.question}`,
      citations: [],
    };
  }
}

class NoopAnalyticsAdapter implements AnalyticsAdapter {
  async track(): Promise<void> {
    return Promise.resolve();
  }
}

export const createNoopAIProvider = (): AIProvider => new NoopAIProvider();
export const createNoopAnalyticsAdapter = (): AnalyticsAdapter => new NoopAnalyticsAdapter();
