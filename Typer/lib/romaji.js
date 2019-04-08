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
const trie = require("trie-prefix-tree");
const fastpriorityqueue_ts_1 = require("fastpriorityqueue.ts");
function str_reverse(s) {
    return s.split("").reverse().join("");
}
function prefixesOf(trie, str) {
    let prefixNode = trie.tree(); //root
    let res = [];
    var input = str.toLowerCase().split('');
    var prefix = "";
    for (let c of input) {
        if (prefixNode["$"]) {
            res.push(prefix);
        }
        if (!prefixNode[c]) {
            break;
        }
        prefixNode = prefixNode[c];
        prefix = prefix + c;
    }
    if (prefixNode["$"]) {
        res.push(prefix);
    }
    return res;
}
;
class RomajiEntry {
    constructor() {
        this.roma = "";
        this.kana = "";
        this.remain = "";
    }
}
exports.RomajiEntry = RomajiEntry;
class RomajiTable {
    constructor() {
        this.table = [];
        this.roma_to_kana = {};
        this.kana_to_roma = {};
        this.kana_trie = trie([]);
        this.roma_rev_trie = trie([]);
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
                        obj.table.push(dat);
                        if (obj.roma_to_kana[dat.roma]) {
                            let [prev_k, prev_r] = obj.roma_to_kana[dat.roma];
                            if (dat.kana !== prev_k || dat.remain !== prev_r) {
                                reject("Duplicate entry for Roma:" + dat.roma);
                                return;
                            }
                        }
                        else {
                            obj.roma_to_kana[dat.roma] = [dat.kana, dat.remain];
                            obj.roma_rev_trie.addWord(str_reverse(dat.roma));
                        }
                        if (obj.kana_to_roma[dat.kana]) {
                            obj.kana_to_roma[dat.kana].push([dat.roma, dat.remain]);
                        }
                        else {
                            obj.kana_to_roma[dat.kana] = [[dat.roma, dat.remain]];
                            obj.kana_trie.addWord(dat.kana);
                        }
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
    constructor(table) {
        this._states = [];
        this.__queue = new fastpriorityqueue_ts_1.FastPriorityQueue();
        this.table = table;
    }
    toKana(str) {
        let res = "";
        let pos = 0;
        let trie = this.table.roma_rev_trie;
        let buff = "";
        for (let c of str) {
            buff = c + buff;
            let pref = prefixesOf(trie, buff);
            if (pref.length > 0) {
                let max_s = "";
                let max_v = 0;
                for (let p of pref) {
                    if (max_v < p.length) {
                        max_v = p.length;
                        max_s = p;
                    }
                }
                let buff2 = str_reverse(buff);
                let [completed_part, remain_part] = this.table.roma_to_kana[str_reverse(max_s)];
                let head_part = buff2.substr(-max_v);
                console.log(buff2, " : ", head_part, " : ", completed_part, " : ", remain_part);
                res += remain_part + completed_part;
                buff = str_reverse(remain_part);
            }
        }
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
            let prefix = prefixesOf(this.table.kana_trie, str.substr(k));
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