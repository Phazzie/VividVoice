declare module 'ssml-builder' {
  export default class SSMLBuilder {
    constructor();
    prosody(params: { rate?: string; pitch?: string; volume?: string }, text: string): SSMLBuilder;
    audio(url: string): SSMLBuilder;
    break(time?: string): SSMLBuilder;
    emphasis(level: string, text: string): SSMLBuilder;
    say(text: string): SSMLBuilder;
    sayAs(params: { interpretAs: string; format?: string }, text: string): SSMLBuilder;
    phoneme(alphabet: string, ph: string, text: string): SSMLBuilder;
    sub(alias: string, text: string): SSMLBuilder;
    ssml(includeHeader?: boolean): string;
    toString(): string;
  }
}