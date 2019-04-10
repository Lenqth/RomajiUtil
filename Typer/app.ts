
import * as romaji from "./lib/romaji"
//import * as romaji from "romaji"

import { FastPriorityQueue as PriorityQueue } from "fastpriorityqueue.ts"




async function main() {
    let rom = new romaji.Romaji(await romaji.RomajiTable.LoadFile("./dvorak-keymap.csv"))
    console.log(rom.fromKana("おはようございます")) // afxhjc;
    console.log(rom.toKana("lqlqlqlq,ciminooniitn;da")) 
}


setTimeout(main,0)
