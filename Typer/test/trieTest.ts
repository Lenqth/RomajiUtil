import test = require("tape");

import { Trie, TrieNode  } from "../lib/trie"

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

function set<T>(...args:T[]) {
    return new Set<T>(args)
}


test("Trie Add", function (t) {
    let trie = new Trie();
    trie.add("cat")
    trie.add("cats")
    trie.add("case")
    // [cat,cats,case]

    //contains
    t.ok(trie.contains("cat"), "contains cat")
    t.ok(trie.contains("cats"), "contains cats")
    t.ok(trie.contains("case"), "contains case")
    t.notOk(trie.contains(""), "not contains ''")
    t.notOk(trie.contains("c"), "not contains c")

    // prefix 
    t.ok(trie.isPrefix(""))
    t.ok(trie.isPrefix("ca"))
    t.ok(trie.isPrefix("cat"))
    t.ok(trie.isPrefix("cats"))
    t.ok(trie.isPrefix("case"))

    t.notOk(trie.isPrefix("cast"))
    t.notOk(trie.isPrefix("cases"))
    t.notOk(trie.isPrefix("nyan"))

    // prefixesOf
    t.deepEqual(trie.prefixesOf("catseye"), set("cat", "cats"))
    t.deepEqual(trie.prefixesOf("case"), set("case"))
    t.deepEqual(trie.prefixesOf("category"), set("cat"))
    t.deepEqual(trie.prefixesOf("ca"), set())
    t.deepEqual(trie.prefixesOf("cast"), set())


    // blank
    trie.add("")
    t.ok(trie.contains(""))
    t.deepEqual(trie.prefixesOf(""), set(""))

    t.end();
});

test("Empty Trie", function (t) {
    // empty trie
    let trie = new Trie();
    t.notOk(trie.contains(""),"not contain anything")
    t.notOk(trie.isPrefix(""), "no strings can be prefix")
    t.deepEqual(trie.prefixesOf(""), set(), "no words")
    t.deepEqual(trie.prefixesOf("cast"), set(), "no words")

    // trie become empty
    trie.add("cat")
    trie.add("dog")
    trie.remove("dog")
    trie.remove("cat")

    t.notOk(trie.contains(""), "not contain anything")
    t.notOk(trie.isPrefix(""), "no strings can be prefix")
    t.deepEqual(trie.prefixesOf(""), set(), "no words")
    t.deepEqual(trie.prefixesOf("cast"), set(), "no words")

    t.end();
});

test("Trie Remove", function (t) {
    let trie = new Trie();
    trie.add("cat")
    trie.add("cats")
    trie.add("case")
    trie.remove("cat")
    trie.remove("ca")
    trie.remove("nyan")
    // [cats,case]

    t.ok(trie.contains("cats"), "contains cats")
    t.ok(trie.contains("case"), "contains case")
    t.notOk(trie.contains("cat"), "NOT contains cat")
    t.notOk(trie.contains(""), "not contains ''")
    t.notOk(trie.contains("c"), "not contains c")
    t.notOk(trie.contains("nyan"), "not contains nyan")
    t.notOk(trie.contains("ca"), "not contains ca")

    t.end();
});

test("Trie Add After Remove", function (t) {
    let trie = new Trie();
    trie.add("cat")
    trie.add("cats")
    trie.add("case")
    trie.remove("case")
    trie.remove("cat")
    trie.remove("ca")
    trie.remove("nyan")
    trie.add("nyan")
    trie.add("cat")
    // [cat,cats,nyan]

    t.ok(trie.contains("cat"), "contains cat")
    t.ok(trie.contains("cats"), "contains cats")
    t.notOk(trie.contains("case"), "NOT contains case")
    t.notOk(trie.contains(""), "not contains ''")
    t.ok(trie.contains("nyan"), "contains nyan")
    t.notOk(trie.contains("ca"), "not contains ca")

    t.end();
});

