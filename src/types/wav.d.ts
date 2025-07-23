declare module 'wav' {
  interface WavWriterOptions {
    channels?: number;
    sampleRate?: number;
    bitDepth?: number;
  }
  
  export class Writer {
    constructor(options?: WavWriterOptions);
    write(buffer: Buffer): void;
    end(): void;
    pipe<T extends NodeJS.WritableStream>(destination: T): T;
  }
}