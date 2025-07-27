declare module 'wav' {
  interface WavWriterOptions {
    channels?: number;
    sampleRate?: number;
    bitDepth?: number;
  }
  
  export class Writer extends NodeJS.EventEmitter {
    constructor(options?: WavWriterOptions);
    write(buffer: Buffer): void;
    end(): void;
    pipe<T extends NodeJS.WritableStream>(destination: T): T;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'data', listener: (data: any) => void): this;
    on(event: 'end', listener: () => void): this;
  }
}