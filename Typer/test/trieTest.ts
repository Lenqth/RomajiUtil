import test = require("tape");

import { Trie, TrieNode  } from "../lib/trie"

test("Trie Add", function (t) {
    let trie = new Trie();
    trie.add("cat")
    trie.add("cats")
    trie.add("case")
    // [cat,cats,case]

    t.ok(trie.contains("cat"), "contains cat")
    t.ok(trie.contains("cats"), "contains cats")
    t.ok(trie.contains("case"), "contains case")
    t.notOk(trie.contains(""), "not contains ''")
    t.notOk(trie.contains("c"), "not contains c")

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

