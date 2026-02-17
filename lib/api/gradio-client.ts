/**
 * Gradio API Client for ACE-STEP
 * Handles Gradio's POST + GET event-based API pattern
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://ace-step-ace-step-v1-5.hf.space";

interface GradioResponse {
  event_id?: string;
  msg?: string;
  output?: {
    data: any[];
  };
  success?: boolean;
}

export class GradioAPIClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  /**
   * Call Gradio endpoint with POST + GET pattern
   */
  async call(endpoint: string, data: any[] = [], onProgress?: (data: any) => void): Promise<any> {
    // Step 1: POST to initiate
    const postResponse = await fetch(`${this.baseUrl}/gradio_api/call/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    if (!postResponse.ok) {
      throw new Error(`API call failed: ${postResponse.statusText}`);
    }

    const postData: GradioResponse = await postResponse.json();
    const eventId = postData.event_id;

    if (!eventId) {
      throw new Error("No event ID received from API");
    }

    // Step 2: GET with event ID to fetch results
    return this.getEventData(endpoint, eventId, onProgress);
  }

  /**
   * Stream event data from Gradio
   */
  private async getEventData(
    endpoint: string,
    eventId: string,
    onProgress?: (data: any) => void
  ): Promise<any> {
    const url = `${this.baseUrl}/gradio_api/call/${endpoint}/${eventId}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch event data: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let finalResult: any = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            
            if (data.msg === "process_completed") {
              finalResult = data.output?.data;
            } else if (data.msg === "progress" && onProgress) {
              onProgress(data);
            }
          } catch (e) {
            console.warn("Failed to parse event data:", e);
          }
        }
      }
    }

    return finalResult;
  }

  /**
   * Upload file to Gradio
   */
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("files", file);

    const response = await fetch(`${this.baseUrl}/gradio_api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`File upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data[0]; // Returns file path
  }
}

export const gradioAPI = new GradioAPIClient();
