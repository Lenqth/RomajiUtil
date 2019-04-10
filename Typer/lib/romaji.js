"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const csv_parse = require("csv-parse");
const fs = require("fs");
const trie_1 = require("./trie");
const fastpriorityqueue_ts_1 = require("fastpriorityqueue.ts");
function str_reverse(s) {
    return s.split("").reverse().join("");
}
class RomajiEntry {
    constructor(roma, kana, remain) {
        this.roma = "";
        this.kana = "";
        this.remain = "";
        this.roma = roma;
        this.kana = kana;
        this.remain = remain;
    }
}
exports.RomajiEntry = RomajiEntry;
class RomajiTable {
    constructor() {
        this.table = [];
        this.roma_to_kana = {};
        this.kana_to_roma = {};
        this.kana_trie = new trie_1.Trie();
        this.roma_trie = new trie_1.Trie();
        this.roma_rev_trie = new trie_1.Trie();
    }
    reset() {
        this.table = [];
        this.roma_to_kana = {};
        this.kana_to_roma = {};
        this.kana_trie = new trie_1.Trie();
        this.roma_trie = new trie_1.Trie();
        this.roma_rev_trie = new trie_1.Trie();
    }
    addEntry(roma, kana, remain) {
        this.table.push(new RomajiEntry(roma, kana, remain));
        if (this.roma_to_kana[roma]) {
            let [prev_k, prev_r] = this.roma_to_kana[roma];
            if (kana !== prev_k || remain !== prev_r) {
                throw ("Duplicate entry for Roma:" + roma);
            }
        }
        else {
            this.roma_to_kana[roma] = [kana, remain];
            this.roma_trie.add(roma);
            this.roma_rev_trie.add(str_reverse(roma));
        }
        if (this.kana_to_roma[kana]) {
            this.kana_to_roma[kana].push([roma, remain]);
        }
        else {
            this.kana_to_roma[kana] = [[roma, remain]];
            this.kana_trie.add(kana);
        }
    }
    removeEntry(roma) {
        if (this.roma_to_kana[roma] == undefined) {
            return null;
        }
        let kana = this.roma_to_kana[roma];
        delete this.roma_to_kana[roma];
        this.roma_trie.remove(roma);
        this.roma_rev_trie.remove(str_reverse(roma));
        let idx = this.kana_to_roma[kana].findIndex(x => x[0] == roma);
        if (idx >= 0) {
            this.kana_to_roma[kana].splice(idx, 1);
            if (this.kana_to_roma[kana].length == 0) { // remove entry if kana doesn't have corresponding roma 
                delete this.kana_to_roma[kana];
                this.kana_trie.remove(kana);
            }
        }
    }
    static LoadFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const parse = csv_parse({
                columns: ["roma", "kana", "remain"],
                relax_column_count: true, delimiter: ",",
                skip_empty_lines: true,
                skip_lines_with_empty_values: true,
                record_delimiter: '\n', quote: '"', ltrim: true, rtrim: true, trim: true
            });
            const stream = fs.createReadStream(path, { encoding: 'utf-8' });
            stream.pipe(parse);
            const p = new Promise((resolve, reject) => {
                let obj = new RomajiTable();
                parse.on("readable", () => {
                    let dat;
                    while (dat = parse.read()) {
                        obj.addEntry(dat.roma, dat.kana, dat.remain);
                    }
                });
                parse.on("end", () => resolve(obj));
                parse.on("error", reject);
            });
            try {
                return yield p;
            }
            catch (e) {
                throw e;
            }
        });
    }
}
exports.RomajiTable = RomajiTable;
class Romaji {
    constructor(table = null) {
        this._states = [];
        this.__queue = new fastpriorityqueue_ts_1.FastPriorityQueue();
        if (table === null) {
            table = new RomajiTable();
        }
        this.table = table;
    }
    toKana(str) {
        let res = "";
        let pos = 0;
        let trie = this.table.roma_trie;
        let conv = this.table.roma_to_kana;
        let buff = "";
        for (let c of str) {
            buff += c;
            if (trie.isPrefix(buff)) {
                if (trie.isStrictlyPrefix(buff)) {
                    continue;
                }
                else {
                    // 変換を確定
                    let [kana, remain] = conv[buff];
                    res += kana;
                    buff = remain;
                }
            }
            else {
                res += buff.substr(0, buff.length - 1);
                buff = c;
            }
        }
        res += buff;
        return res;
    }
    fromKana(str) {
        this._states = [{}];
        this.__queue = new fastpriorityqueue_ts_1.FastPriorityQueue();
        this.__queue.add([0, "", ""], 0);
        let l_str = str.length;
        var q = 1;
        while (!this.__queue.isEmpty()) {
            let item = this.__queue.poll();
            let v = item.priority;
            let [k, rem, stroke] = item.object;
            if (this._states[k] !== undefined && this._states[k][rem] !== undefined) {
                continue;
            }
            if (k == l_str && rem == "") {
                return stroke;
            }
            this._states[k][rem] = v;
            let prefix = this.table.kana_trie.prefixesOf(str.substr(k));
            let l_rem = rem.length;
            for (let s of prefix) {
                let entries = this.table.kana_to_roma[s];
                for (let entry of entries) {
                    let [roma, next_rem] = entry;
                    if (roma.substr(0, l_rem) == rem) {
                        let next_k = k + s.length;
                        let next_v = Math.floor(v) + roma.length - l_rem + (1.0 - 1.0 / (q++));
                        let next_stroke = stroke + roma.substr(l_rem);
                        if (this._states[next_k] === undefined) {
                            this._states[next_k] = {};
                        }
                        if (this._states[next_k][next_rem] === undefined) {
                            this.__queue.add([next_k, next_rem, next_stroke], next_v);
                        }
                    }
                }
            }
        }
        throw "NYAN";
    }
}
exports.Romaji = Romaji;
//# sourceMappingURL=romaji.js.map