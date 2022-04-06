import { Tonal, Scale } from "@tonaljs/tonal"

const scales = Scale.names()
console.log(scales)

export interface ISynth {
    id?: number,
    toMaster: boolean,
    reverb: number,
    delay: number,
    volume: number,
    chebysev: number,
    scale: number,
    playback: 'random'
}
