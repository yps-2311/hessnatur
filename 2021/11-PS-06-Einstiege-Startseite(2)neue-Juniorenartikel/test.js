
// elem erstaufruf
// document.querySelectorAll

/*
console.log("a");

// elem zweiter Versuch
setTimeout(() => {
    console.log("b");
}, 0);

console.log("c");

for(var i = 0; i < 100000; i++){
    console.log("d");
}
*/
// gibt es etwas im pending? 
// ja > Timeout
// timeout zeit erfüllt?
// console.log("b");

function showText(text){

    text="nicht lol"

    console.log(text);
}

a="lol";

console.log("a1",a);

showText(a);

console.log("a2",a);