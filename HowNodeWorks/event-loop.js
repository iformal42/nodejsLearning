const fs = require("fs");
const crypto = require("crypto");
process.env.UV_THREADPOOL_SIZE = 8;
console.log(process.env.UV_THREADPOOL_SIZE);
const date = Date.now();
setTimeout(() => console.log("Timer 1 sec finish"), 1);
setTimeout(() => console.log(Date.now() - date, "Timer 1 finish"), 0);
setImmediate(() => console.log("Immdiate 1 finish"));

fs.readFile("test-file.txt", () => {
  console.log("I/O finish");
  setTimeout(() => console.log("Timer 1 sec finish"), 1);
  setTimeout(() => console.log("Timer 2 finish"), 0);
  //   setTimeout(() => console.log("Timer 3 finish"), 3000);
  setImmediate(() => console.log("Immdiate 2 finish"));
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - date, "pass done");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - date, "pass done");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - date, "pass done");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - date, "pass done");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - date, "pass done");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - date, "pass done");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - date, "pass done");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - date, "pass done");
  });
});

console.log("hellow");
