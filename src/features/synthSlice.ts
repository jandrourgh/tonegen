import { Action } from "redux"
import {Scale} from "@tonaljs/tonal"
import {RootState} from "../store"
import { ISynth } from "../interfaces/ISynth"

interface PayloadAction<T> {
    type: string,
    payload: T
}

interface SynthState {
    synths: ISynth[]
}

const initialState: SynthState = {
    synths:[{id:0, chebysev:1, delay: 0, playback: "random", reverb: 0, scale: 1, toMaster: false, volume: 0}]

}

export default function synthReducer (state = initialState, action: PayloadAction<ISynth>){
    switch(action.type) {
        case "ADD_SYNTH":
            return {
                ...state,
                synths: [...state.synths, action.payload]
            }
        case "TWEAK":
            console.log(action.payload)
            return {...state,
                synths: state.synths.map((synth, i) => {
                    if (i === action.payload.id) {
                        return action.payload
                    } else {
                        return synth
                    }
                })
            }
        default: 
            console.log("hola")
            return state
    }
}