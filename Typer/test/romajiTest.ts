import test = require("tape");

import { Romaji  } from "../lib/romaji"

test("Kana -> Romaji", function (t) {

    let romaji = new Romaji();
    romaji.table.addEntry("a", "[a]", "")
    romaji.table.addEntry("sa", "[sa]", "")
    romaji.table.addEntry("ha", "[ha]", "")
    romaji.table.addEntry("sha", "[sha]", "")

    t.equal(romaji.toKana("ashasasaha"), "[a][sha][sa][sa][ha]")

    t.end();
});


test("Romaji -> Kana", function (t) {

    let romaji = new Romaji();
    romaji.table.addEntry("a", "[a]", "")
    romaji.table.addEntry("sa", "[sa]", "")
    romaji.table.addEntry("ha", "[ha]", "")
    romaji.table.addEntry("sha", "[sha]", "")

    t.equal(romaji.fromKana("[a][sha][sa][sa][ha]"), "ashasasaha" )

    t.end();
});

