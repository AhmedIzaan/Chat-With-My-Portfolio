/**
 * API Service for communicating with the FastAPI backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface StreamResponse {
    content?: string;
    done?: boolean;
    error?: string;
}

/**
 * Stream chat responses from the backend using Server-Sent Events
 */
export async function streamChat(
    question: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
): Promise<void> {
    try {
        const response = await fetch(`${API_URL}/api/chat/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
            throw new Error('No response body');
        }

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                onComplete();
                break;
            }

            // Decode the chunk
            const chunk = decoder.decode(value, { stream: true });

            // Split by newlines to handle multiple SSE events
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data: StreamResponse = JSON.parse(line.slice(6));

                        if (data.error) {
                            onError(data.error);
                            return;
                        }

                        if (data.done) {
                            onComplete();
                            return;
                        }

                        if (data.content) {
                            onChunk(data.content);
                        }
                    } catch (e) {
                        console.error('Failed to parse SSE data:', e);
                    }
                }
            }
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        onError(errorMessage);
    }
}

/**
 * Check backend health status
 */
export async function checkHealth(): Promise<{
    status: string;
    vector_db_count: number;
    resume_loaded: boolean;
}> {
    const response = await fetch(`${API_URL}/health`);

    if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
    }

    return response.json();
}
