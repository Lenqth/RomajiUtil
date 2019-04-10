


export class TrieNode<T> {
    childNodes: { [key: string]: TrieNode<T> } = {}
    value : T|null = null

    hasChild(): boolean {
        return Object.keys(this.childNodes).length > 0
    }

    _addNode(str: string, k: number , v:any ) {
        if (k == str.length) {
            this.value = v
            return
        }
        let c = str[k]
        if (this.childNodes[c] === undefined) {
            this.childNodes[c] = new TrieNode()
        }
        this.childNodes[c]._addNode(str, k + 1,v) 
    }
    _removeNode(str: string, k: number) {
        if (k == str.length) {
            this.value = null
            return !this.hasChild()
        }
        let c = str[k]
        if (this.childNodes[c] !== undefined) {
            let canPrune = this.childNodes[c]._removeNode(str, k + 1)
            if (canPrune) {
                delete this.childNodes[c]
            }
        }
        return !this.hasChild()
    }
    constructor() {

    }

}

export class Trie {

    root: TrieNode<number>;
    constructor() {
        this.root = new TrieNode<number>();
    }

    public add(key: string, value: number | null = null): void{
        this.root._addNode(key,0,1)
    }
    public remove(key: string): void {
        this.root._removeNode(key,0)
    }

    public contains(str: string): boolean {
        let node = this.root
        for (let c of str) {
            node = node.childNodes[c];
            if (node === undefined) {
                return false
            }
        }
        return (node.value !== null)
    }

    public isPrefix(str: string): boolean {
        let node = this.root
        for (let c of str) {
            node = node.childNodes[c];
            if (node === undefined) {
                return false
            }
        }
        return (node.value !== null || node.hasChild())
    }

    public isStrictlyPrefix(str: string): boolean {
        let node = this.root
        for (let c of str) {
            node = node.childNodes[c];
            if (node === undefined) {
                return false
            }
        }
        return (node.hasChild())
    }

    public prefixesOf(str: string): Set<string>{
        let node = this.root
        let label = "";
        let res = new Set<string>();
        if (node.value !== null) {
            res.add(label)
        }
        for (let c of str) {
            node = node.childNodes[c];
            label += c
            if (node === undefined) {
                break
            }
            if (node.value !== null) {
                res.add(label)
            }
        }
        return res
    }
}