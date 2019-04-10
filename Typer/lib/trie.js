"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TrieNode {
    constructor() {
        this.childNodes = {};
        this.value = null;
    }
    _addNode(str, k, v) {
        if (k == str.length) {
            this.value = v;
            return;
        }
        let c = str[k];
        if (this.childNodes[c] === undefined) {
            this.childNodes[c] = new TrieNode();
        }
        this.childNodes[c]._addNode(str, k + 1, v);
    }
    _removeNode(str, k) {
        if (k == str.length) {
            this.value = null;
            return (this.childNodes == {});
        }
        let c = str[k];
        if (this.childNodes[c] !== undefined) {
            let canPrune = this.childNodes[c]._removeNode(str, k + 1);
            if (canPrune) {
                delete this.childNodes[c];
            }
        }
        return (this.childNodes == {});
    }
}
exports.TrieNode = TrieNode;
class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    add(key, value = null) {
        this.root._addNode(key, 0, 1);
    }
    remove(key) {
        this.root._removeNode(key, 0);
    }
    contains(str) {
        let node = this.root;
        for (let c of str) {
            node = node.childNodes[c];
            if (node === undefined) {
                return false;
            }
        }
        return (node.value !== null);
    }
    isPrefix(str) {
        let node = this.root;
        for (let c of str) {
            node = node.childNodes[c];
            if (node === undefined) {
                return false;
            }
        }
        return true;
    }
    PrefixesOf(str) {
        let node = this.root;
        let label = "";
        let res = [];
        if (node.value !== null) {
            res.push(label);
        }
        for (let c of str) {
            node = node.childNodes[c];
            label += c;
            if (node === undefined) {
                break;
            }
            if (node.value !== null) {
                res.push(label);
            }
        }
        return res;
    }
}
exports.Trie = Trie;
//# sourceMappingURL=trie.js.map