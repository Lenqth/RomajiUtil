"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("tape");
const romaji_1 = require("../lib/romaji");
test("Kana -> Romaji", function (t) {
    let romaji = new romaji_1.Romaji();
    romaji.table.addEntry("a", "[a]", "");
    romaji.table.addEntry("sa", "[sa]", "");
    romaji.table.addEntry("ha", "[ha]", "");
    romaji.table.addEntry("sha", "[sha]", "");
    t.equal(romaji.toKana("ashasasaha"), "[a][sha][sa][sa][ha]");
    t.end();
});
test("Romaji -> Kana", function (t) {
    let romaji = new romaji_1.Romaji();
    romaji.table.addEntry("a", "[a]", "");
    romaji.table.addEntry("sa", "[sa]", "");
    romaji.table.addEntry("ha", "[ha]", "");
    romaji.table.addEntry("sha", "[sha]", "");
    t.equal(romaji.fromKana("[a][sha][sa][sa][ha]"), "ashasasaha");
    t.end();
});
//# sourceMappingURL=romajiTest.js.map