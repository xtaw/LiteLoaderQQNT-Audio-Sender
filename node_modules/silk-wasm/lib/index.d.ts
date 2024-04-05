export interface encodeResult {
    /** silk */
    data: Uint8Array;
    /** unit: milliseconds */
    duration: number;
}
export interface decodeResult {
    /** pcm_s16le */
    data: Uint8Array;
    /** unit: milliseconds */
    duration: number;
}
export interface WavFileInfo {
    chunkInfo: {
        chunkId: string;
        dataOffset: number;
        dataLength: number;
    }[];
    fmt: {
        formatCode: number;
        numberOfChannels: number;
        sampleRate: number;
        bytesPerSec: number;
        bytesPerFrame: number;
        bitsPerSample: number;
    };
}
export declare function encode(input: ArrayBufferView | ArrayBuffer, sampleRate: number): Promise<encodeResult>;
export declare function decode(input: ArrayBufferView | ArrayBuffer, sampleRate: number): Promise<decodeResult>;
export declare function getDuration(silk: ArrayBufferView | ArrayBuffer, frameMs?: number): number;
export declare function isWav(fileData: ArrayBufferView | ArrayBuffer): boolean;
export declare function getWavFileInfo(fileData: ArrayBufferView | ArrayBuffer): WavFileInfo;
