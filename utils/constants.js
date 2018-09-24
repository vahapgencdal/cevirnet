function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("ACTIVE_RECORDS", 1);
define("PASSIVE_RECORDS", 2);
define("DELETED_RECORDS", 3);
//TODO :RAndom sayı getiren metod eklenecek
// let rsnd=Math.floor(Math.random() * (5 - 1 + 1)) + 1