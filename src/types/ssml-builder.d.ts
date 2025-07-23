declare module 'ssml-builder' {
  export default class SSMLBuilder {
    constructor(options?: { root?: boolean });
    prosody(params: { rate?: string; pitch?: string; volume?: string }, text: string): SSMLBuilder;
    audio(url: string): SSMLBuilder;
    pause(time?: string): SSMLBuilder;
    break(time?: string): SSMLBuilder;
    mark(params: { name: string }): SSMLBuilder;
    emphasis(level: string, text: string): SSMLBuilder;
    voice(params: { name: string }): SSMLBuilder;
    say(text: string): SSMLBuilder;
    sayAs(params: { interpretAs: string; format?: string }, text: string): SSMLBuilder;
    phoneme(alphabet: string, ph: string, text: string): SSMLBuilder;
    sub(alias: string, text: string): SSMLBuilder;
    ssml(includeHeader?: boolean): string;
    toString(): string;
  }
}