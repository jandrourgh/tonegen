import React, { useState, useEffect, useCallback, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Scale, Note, Tonal } from "@tonaljs/tonal"
import { RootState } from "../store"
import { useAppSelector, useAppDispatch } from "../hooks"
import { ISynth } from "../interfaces/ISynth"
import * as Tone from "tone"



interface SynthProps {
    id: number
}

export const Synth = ({ id }: SynthProps) => {

    const dispatch = useAppDispatch()
    const scales = useMemo(() => Scale.names(), [])

    const selectSynth = (state: RootState) => state.synths.synths[id]
    const synthState: ISynth = useAppSelector(selectSynth)

    const volume = useMemo(() => { return new Tone.Volume(0) }, [])
    const delay = useMemo(() => { return new Tone.FeedbackDelay("8n", 0) }, [])
    const reverb = useMemo(() => { return new Tone.Reverb(0.1) }, [])
    const chebysev = useMemo(() => { return new Tone.Chebyshev(1) }, [])
    const synth = useMemo(() => { return new Tone.Synth() }, [])

    const mySynth = useMemo(() => {
        console.log("chaining")
        const effects = [chebysev, reverb, delay, volume]
        return synth.chain(...effects, Tone.Destination)
    }, [synth, delay, reverb, chebysev]);

    useEffect(() => {
        console.log("usestate synthstate")
        delay.set({ feedback: synthState.delay / 100 })
        chebysev.set({ order: synthState.chebysev })
        reverb.set({ decay: synthState.reverb / 100 + 0.1 })
        volume.set({ volume: synthState.volume })
    }, [synthState, delay, chebysev, reverb, volume])

    const setSynthState = useCallback((
        evt: React.FormEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
        type: "volume" | "reverb" | "delay" | "scale" | "chebysev") => {
        //console.log(evt)
        //console.log(evt.currentTarget.value)
        //synthState[type] = parseInt(evt.currentTarget.value)
        let newState = { ...synthState }
        newState[type] = parseInt(evt.currentTarget.value)

        dispatch({ type: "TWEAK", payload: newState })
    }, [synthState, dispatch])



    const handleSubmit = useCallback((evt: React.SyntheticEvent) => {
        const randomNote = (scale: number) => {
            let root = "C4"
            let notes = Scale.get(`${root} ${scales[scale]}`).notes
            return notes[Math.floor(Math.random() * notes.length)]
        }

        evt.preventDefault()
        console.log("play", synthState)
        mySynth.triggerAttackRelease(randomNote(synthState.scale), "8n")
    }, [synthState, mySynth, scales])


    return (
        <div className="synth">
            <h2>react synth</h2>
            <form action="" className="controls" onSubmit={handleSubmit}>
                <div>
                    <div>
                        <label htmlFor="volume">volume</label>
                        <input onChange={evt => setSynthState(evt, "volume")} min={-12} max={12} value={synthState.volume} type="range" name="volume" id="volume" />
                    </div>
                    <div>
                        <label htmlFor="delay">texture</label>
                        <input onChange={evt => setSynthState(evt, "chebysev")} min={1} max={50} value={synthState.chebysev} type="range" name="delay" id="delay" />
                    </div>
                    <div>
                        <label htmlFor="reverb">reverb</label>
                        <input onChange={evt => setSynthState(evt, "reverb")} value={synthState.reverb} type="range" name="reverb" id="reverb" />
                    </div>
                    <div>
                        <label htmlFor="delay">delay</label>
                        <input onChange={evt => setSynthState(evt, "delay")} value={synthState.delay} type="range" name="delay" id="delay" />
                    </div>
                </div>
                <div>
                    <div>
                        <label htmlFor="scale">Scale</label>
                        <select onChange={evt => setSynthState(evt, "scale")} defaultValue={synthState.scale}>
                            {scales.map((scale, i) => <option key={i} value={i}>{scale}</option>)}
                        </select>
                    </div>
                    <div>
                        <button>PLAY</button>
                    </div>
                </div>
            </form>
            <div className="secuenciador">
                <table>
                    <tbody>
                    {Scale.get(`C4 ${scales[synthState.scale]}`).notes.reverse().map((note, i) => {
                        console.log(note)
                        return (
                        <tr key={i}>
                            {Array(16).fill(note).map((el, j)=>{
                                return(<td key={j}>{el}</td>)
                            })}
                        </tr>)
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )

}

