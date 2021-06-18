
// elem erstaufruf
// document.querySelectorAll
console.log("a");

// elem zweiter Versuch
setTimeout(() => {
    console.log("b");
}, 0);

console.log("c");

for(var i = 0; i < 100000; i++){
    console.log("d");
}

// gibt es etwas im pending? 
// ja > Timeout
// timeout zeit erfüllt?
// console.log("b");