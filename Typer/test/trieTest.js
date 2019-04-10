"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("tape");
const trie_1 = require("../lib/trie");
/*
declare module "tape" {
    interface Test {
        deepEqualSet(actual: any, expected: any, msg?: string): void
        notDeepEqualSet(actual: any, expected: any, msg?: string): void
    }
    test.Test.prototype.deepEqualSet = function (actual: any, expected: any, msg?: string): void {

    }
}
*/
test("Trie Add", function (t) {
    let trie = new trie_1.Trie();
    trie.add("cat");
    trie.add("cats");
    trie.add("case");
    // [cat,cats,case]
    //contains
    t.ok(trie.contains("cat"), "contains cat");
    t.ok(trie.contains("cats"), "contains cats");
    t.ok(trie.contains("case"), "contains case");
    t.notOk(trie.contains(""), "not contains ''");
    t.notOk(trie.contains("c"), "not contains c");
    // prefix 
    t.ok(trie.isPrefix(""));
    t.ok(trie.isPrefix("ca"));
    t.ok(trie.isPrefix("cat"));
    t.ok(trie.isPrefix("cats"));
    t.ok(trie.isPrefix("case"));
    t.notOk(trie.isPrefix("cast"));
    t.notOk(trie.isPrefix("cases"));
    t.notOk(trie.isPrefix("nyan"));
    // prefixesOf
    t.deepEqual(trie.PrefixesOf("catseye"), ["cat", "cats"]);
    t.deepEqual(trie.PrefixesOf("case"), ["case"]);
    t.deepEqual(trie.PrefixesOf("category"), ["cat"]);
    t.deepEqual(trie.PrefixesOf("ca"), []);
    t.deepEqual(trie.PrefixesOf("cast"), []);
    // blank
    trie.add("");
    t.ok(trie.contains(""));
    t.deepEqual(trie.PrefixesOf(""), [""]);
    t.end();
});
test("Empty Trie", function (t) {
    // empty trie
    let trie = new trie_1.Trie();
    t.notOk(trie.contains(""), "not contain anything");
    t.notOk(trie.isPrefix(""), "no strings can be prefix");
    t.deepEqual(trie.PrefixesOf(""), [], "no words");
    t.deepEqual(trie.PrefixesOf("cast"), [], "no words");
    // trie become empty
    trie.add("cat");
    trie.add("dog");
    trie.remove("dog");
    trie.remove("cat");
    t.notOk(trie.contains(""), "not contain anything");
    t.notOk(trie.isPrefix(""), "no strings can be prefix");
    t.deepEqual(trie.PrefixesOf(""), [], "no words");
    t.deepEqual(trie.PrefixesOf("cast"), [], "no words");
    t.end();
});
test("Trie Remove", function (t) {
    let trie = new trie_1.Trie();
    trie.add("cat");
    trie.add("cats");
    trie.add("case");
    trie.remove("cat");
    trie.remove("ca");
    trie.remove("nyan");
    // [cats,case]
    t.ok(trie.contains("cats"), "contains cats");
    t.ok(trie.contains("case"), "contains case");
    t.notOk(trie.contains("cat"), "NOT contains cat");
    t.notOk(trie.contains(""), "not contains ''");
    t.notOk(trie.contains("c"), "not contains c");
    t.notOk(trie.contains("nyan"), "not contains nyan");
    t.notOk(trie.contains("ca"), "not contains ca");
    t.end();
});
test("Trie Add After Remove", function (t) {
    let trie = new trie_1.Trie();
    trie.add("cat");
    trie.add("cats");
    trie.add("case");
    trie.remove("case");
    trie.remove("cat");
    trie.remove("ca");
    trie.remove("nyan");
    trie.add("nyan");
    trie.add("cat");
    // [cat,cats,nyan]
    t.ok(trie.contains("cat"), "contains cat");
    t.ok(trie.contains("cats"), "contains cats");
    t.notOk(trie.contains("case"), "NOT contains case");
    t.notOk(trie.contains(""), "not contains ''");
    t.ok(trie.contains("nyan"), "contains nyan");
    t.notOk(trie.contains("ca"), "not contains ca");
    t.end();
});
//# sourceMappingURL=trieTest.js.map