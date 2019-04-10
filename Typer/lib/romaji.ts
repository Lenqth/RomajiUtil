import * as csv_parse from "csv-parse";
import * as fs from "fs";

import { Trie } from "./trie"
import { FastPriorityQueue as PriorityQueue } from "fastpriorityqueue.ts"

function str_reverse(s: string): string {
    return s.split("").reverse().join("");
}

export class RomajiEntry {
    roma: string = "";
    kana: string = "";
    remain: string = "";
    constructor(roma, kana, remain) {
        this.roma = roma
        this.kana = kana
        this.remain = remain
    }
}


export class RomajiTable {

    table: Array<RomajiEntry> = []

    roma_to_kana: Object = {}

    kana_to_roma: Object = {}
    kana_trie: Trie = new Trie()
    roma_trie: Trie = new Trie()
    roma_rev_trie: Trie = new Trie()

    public reset() {

        this.table = []

        this.roma_to_kana = {}

        this.kana_to_roma = {}
        this.kana_trie = new Trie()
        this.roma_trie = new Trie()
        this.roma_rev_trie = new Trie()

    }

    public addEntry(roma: string, kana: string, remain: string) {
        this.table.push(new RomajiEntry(roma, kana, remain))
        if (this.roma_to_kana[roma]) {
            let [prev_k, prev_r] = this.roma_to_kana[roma]
            if (kana !== prev_k || remain !== prev_r) {
                throw ("Duplicate entry for Roma:" + roma);
            }
        } else {
            this.roma_to_kana[roma] = [kana, remain]
            this.roma_trie.add(roma);
            this.roma_rev_trie.add(str_reverse(roma));
        }
        if (this.kana_to_roma[kana]) {
            this.kana_to_roma[kana].push([roma, remain])
        } else {
            this.kana_to_roma[kana] = [[roma, remain]]
            this.kana_trie.add(kana)
        }
    }

    public removeEntry(roma: string) {
        if (this.roma_to_kana[roma] == undefined) {
            return null;
        }
        let kana = this.roma_to_kana[roma]
        delete this.roma_to_kana[roma]
        this.roma_trie.remove(roma);
        this.roma_rev_trie.remove(str_reverse(roma));
        let idx = this.kana_to_roma[kana].findIndex(x => x[0] == roma)
        if (idx >= 0) {
            this.kana_to_roma[kana].splice(idx, 1)
            if (this.kana_to_roma[kana].length == 0) { // remove entry if kana doesn't have corresponding roma 
                delete this.kana_to_roma[kana]
                this.kana_trie.remove(kana)
            }
        }
    }

    public static async LoadFile(path: string) {
        const parse = csv_parse({
            columns: ["roma", "kana", "remain"],
            relax_column_count: true, delimiter: ",",
            skip_empty_lines: true,
            skip_lines_with_empty_values: true,
            record_delimiter: '\n', quote: '"', ltrim: true, rtrim: true, trim: true
        });
        const stream = fs.createReadStream(path, { encoding: 'utf-8' })
        stream.pipe(parse)
        const p = new Promise<RomajiTable>((resolve, reject) => {
            let obj = new RomajiTable();
            parse.on("readable", () => {
                let dat;
                while (dat = parse.read()) {
                    obj.addEntry(dat.roma, dat.kana, dat.remain)
                }
            })
            parse.on("end", () => resolve(obj))
            parse.on("error", reject)
        })
        try {
            return await p;
        } catch (e) {
            throw e;
        }
    }

    constructor() {

    }

}

export class Romaji {

    table: RomajiTable;

    _states: Array<Object> = [];
    __queue: PriorityQueue<[number, string, string]> = new PriorityQueue();

    public toKana(str: string) {
        let res = "";
        let pos = 0;
        let trie = this.table.roma_trie;
        let conv = this.table.roma_to_kana;
        let buff = ""; 
        for (let c of str) {
            buff += c;
            if (trie.isPrefix( buff )) {
                if (trie.isStrictlyPrefix(buff)) {
                    continue;
                } else {
                    // 変換を確定
                    let [kana, remain] = conv[buff];
                    res += kana
                    buff = remain;
                }
            } else {
                res += buff.substr(0,buff.length-1);
                buff = c
            }
        }
        res += buff;
        return res;
    }

    public fromKana(str: string) {
        this._states = [{}];
        this.__queue = new PriorityQueue();
        this.__queue.add([0, "", ""], 0)
        let l_str = str.length
        var q = 1;
        while (!this.__queue.isEmpty()) {
            let item = this.__queue.poll()
            let v: number = item.priority
            let [k, rem, stroke] = item.object
            if (this._states[k] !== undefined && this._states[k][rem] !== undefined) {
                continue
            }
            if (k == l_str && rem == "") {
                return stroke;
            }
            this._states[k][rem] = v
            let prefix = this.table.kana_trie.prefixesOf(str.substr(k))
            let l_rem = rem.length;
            for (let s of prefix) {
                let entries = this.table.kana_to_roma[s];
                for (let entry of entries) {
                    let [roma, next_rem] = entry
                    if (roma.substr(0, l_rem) == rem) {
                        let next_k = k + s.length
                        let next_v = Math.floor(v) + roma.length - l_rem + (1.0 - 1.0 / (q++))
                        let next_stroke = stroke + roma.substr(l_rem)
                        if (this._states[next_k] === undefined) {
                            this._states[next_k] = {};
                        }
                        if (this._states[next_k][next_rem] === undefined) {
                            this.__queue.add([next_k, next_rem, next_stroke], next_v)
                        }
                    }
                }
            }
        }
        throw "NYAN"
    }

    constructor(table: RomajiTable | null = null) {
        if (table === null) {
            table = new RomajiTable();
        }
        this.table = table;
    }
}
