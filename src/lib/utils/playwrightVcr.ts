import { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface RequestData {
  url: string;
  method: string;
  headers: Record<string, string>;
  postData?: string;
}

interface ResponseData {
  status: number;
  headers: Record<string, string>;
  body: string;
}

interface CassetteEntry {
  request: RequestData;
  response: ResponseData;
}

interface Cassette {
  entries: CassetteEntry[];
}

/**
 * VCR-style recording and playback for Playwright tests
 */
export class PlaywrightVcr {
  private readonly page: Page;
  private readonly cassettePath: string;
  private cassette: Cassette | null = null;
  private isRecording: boolean = false;
  private readonly cassettesDir: string;

  constructor(page: Page, cassetteName: string) {
    this.page = page;
    this.cassettesDir = path.resolve(process.cwd(), 'src/lib/cassettes');
    this.cassettePath = path.resolve(this.cassettesDir, `${cassetteName}.json`);
    
    // Ensure cassettes directory exists
    if (!fs.existsSync(this.cassettesDir)) {
      fs.mkdirSync(this.cassettesDir, { recursive: true });
    }
  }

  /**
   * Start recording or playback
   */
  async start(): Promise<void> {
    // Check if cassette exists
    if (fs.existsSync(this.cassettePath)) {
      console.log(`Using cassette: ${this.cassettePath}`);
      this.cassette = JSON.parse(fs.readFileSync(this.cassettePath, 'utf8'));
      this.isRecording = false;
    } else {
      console.log(`Recording new cassette: ${this.cassettePath}`);
      this.cassette = { entries: [] };
      this.isRecording = true;
    }

    // Setup request interception
    await this.page.route('**/*', async (route) => {
      const request = route.request();
      
      // Skip non-HTTP requests (e.g., data URLs)
      if (!request.url().startsWith('http')) {
        return route.continue();
      }
      
      const requestData: RequestData = {
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        postData: request.postData() || undefined,
      };
      
      // Generate a hash of the request to use as a key
      const requestHash = this.hashRequest(requestData);
      
      if (!this.isRecording) {
        // Playback mode - find matching request in cassette
        const entry = this.cassette!.entries.find(e => 
          this.hashRequest(e.request) === requestHash
        );
        
        if (entry) {
          console.log(`Replaying request: ${request.method()} ${request.url()}`);
          await route.fulfill({
            status: entry.response.status,
            headers: entry.response.headers,
            body: entry.response.body,
          });
          return;
        } else {
          console.warn(`No recording found for: ${request.method()} ${request.url()}`);
        }
      }
      
      // Either recording mode or no matching request found
      console.log(`${this.isRecording ? 'Recording' : 'Passing through'} request: ${request.method()} ${request.url()}`);
      
      const response = await route.fetch();
      
      if (this.isRecording) {
        // Record the response
        const responseBody = await response.text();
        
        this.cassette?.entries.push({
          request: requestData,
          response: {
            status: response.status(),
            headers: response.headers(),
            body: responseBody,
          },
        });
        
        // Write to disk after each response to ensure we don't lose data
        this.saveCassette();
        
        await route.fulfill({
          status: response.status(),
          headers: response.headers(),
          body: responseBody,
        });
      } else {
        await route.continue();
      }
    });
  }

  /**
   * Stop recording or playback
   */
  async stop(): Promise<void> {
    if (this.isRecording) {
      this.saveCassette();
    }
    await this.page.unrouteAll();
  }

  /**
   * Save cassette to disk
   */
  private saveCassette(): void {
    fs.writeFileSync(
      this.cassettePath, 
      JSON.stringify(this.cassette, null, 2), 
      'utf8'
    );
    console.log(`Saved cassette to: ${this.cassettePath}`);
  }

  /**
   * Create a unique hash for a request to use for matching
   */
  private hashRequest(request: RequestData): string {
    const data = `${request.method}:${request.url}:${request.postData || ''}`;
    return crypto.createHash('md5').update(data).digest('hex');
  }
}

/**
 * Use VCR recording/playback for a test
 * 
 * @param page Playwright page
 * @param cassetteName Name of the cassette file (without extension)
 * @param callback The test function to run with VCR
 */
export async function withVcr(
  page: Page, 
  cassetteName: string, 
  callback: () => Promise<void>
): Promise<void> {
  const vcr = new PlaywrightVcr(page, cassetteName);
  await vcr.start();
  
  try {
    await callback();
  } finally {
    await vcr.stop();
  }
} 