const moment = require('moment');

// let date = new Date();
// console.log(date.getMonth());

// let date = moment();
// date.add(1, 'years');
// console.log(date.format('MMM YYYY'));


let someTimestamp = moment().valueOf(); // new Date().getTime();
console.log(someTimestamp);

let date = moment(someTimestamp);
console.log(date.format('h:mm a'));
