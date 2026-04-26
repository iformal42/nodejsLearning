import { EventEmitter } from "events";

// const EventEmitter = require("events");
const myEmitter = new EventEmitter();
myEmitter.on("newSale", () => {
  console.log("wow new Sale!");
});
myEmitter.on("newSale", () => {
  console.log("there was a new sale!");
});

console.log("saj");
myEmitter.emit("newSale");
export const newWord = "dd";
export function dd() {
  console.log("d");
}

// exports.newss = "asa"
// export { newWord };
