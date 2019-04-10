


export class TrieNode<T> {
    childNodes: { [key: string]: TrieNode<T> } = {}
    value : T|null = null

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
            return (this.childNodes == {})
        }
        let c = str[k]
        if (this.childNodes[c] !== undefined) {
            let canPrune = this.childNodes[c]._removeNode(str, k + 1)
            if (canPrune) {
                delete this.childNodes[c]
            }
        }
        return (this.childNodes == {})
    }
    constructor() {

    }

}

export class Trie {

    root: TrieNode<number>;
    constructor() {
        this.root = new TrieNode<number>();
    }

    public add(key:string,value:number|null=null) {
        this.root._addNode(key,0,1)
    }
    public remove(key: string) {
        this.root._removeNode(key,0)
    }

    public contains(str: string) {
        let node = this.root
        for (let c of str) {
            node = node.childNodes[c];
            if (node === undefined) {
                return false
            }
        }
        return (node.value !== null)
    }

    public isPrefix(str: string) {
        let node = this.root
        for (let c of str) {
            node = node.childNodes[c];
            if (node === undefined) {
                return false
            }
        }
        return true
    }

    public PrefixesOf(str: string) {
        let node = this.root
        let label = "";
        let res = [];
        if (node.value !== null) {
            res.push(label)
        }
        for (let c of str) {
            node = node.childNodes[c];
            label += c
            if (node === undefined) {
                break
            }
            if (node.value !== null) {
                res.push(label)
            }
        }
        return res
    }
}