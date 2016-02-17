// app/script/urlcheck.js

var urlCheck = function(str) {
    var checker = ['http://www.', 'https://www.'];
    var checker2 = ['.com', '.org', '.net', '.io'];
    var strSlice = str.slice(0, 11);
    var strSlice2 = str.slice(0, 12);
    var strSlice3 = str.slice(-3);
    var strSlice4 = str.slice(-4);
    
    // get index of final period
    var perIndex;
    var index = function(string) {
        for(var i = 0; i < string.length ; i++) {
            if(string.charAt(i) === '.') {
                perIndex = i;
            }
        }
    }
    
    index(str);
    
    // CHECK IF ENDS IN URL
    var finalIndex = str.length - perIndex;
    var endCheck = function(string) {
        var end = string.slice(finalIndex * -1);
        for(var i = 0; i < checker2.length; i++) {
            if(end === checker2[i]) {
                return true
            }
        }
    }
    
    //check for more than two periods
    var periodCount = function(string) {
        var perCount = 0;
        for(var i = 0; i < string.length; i++) {
            if(string.charAt(i) === '.') {
                perCount++;
            }
        }
        if(perCount <= 2) {
            return true;
        }
        else {
            return false;
        }
    }
        
    if(!periodCount(str)) {
        return false;
    }
    else if(strSlice === checker[0] || strSlice2 === checker[1] && endCheck(str)) {
        return true;
    }
    else {
        return false;
    }
}

module.exports = urlCheck;