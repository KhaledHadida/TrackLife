// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/////////////////////////////////////////////////////////
// Variables //
var urls = [];
var times = [];
var timeSpentOnPage;
var pagesName1;

var previousUrl;

var temp = [];


var combinedTime = [
  [,],
];
/////////////////////////////////////////////////////////

//Initialize the time
 TimeMe.initialize({
  currentPageName: "my-home-page", // current page
    });


//suppose to iterate when a user leaves a tab (but doesnt work well..)
//TimeMe.callWhenUserLeaves(function(){
  //console.log("The user is not currently viewing the page!");
   //pageName1 = temp[temp.length-1];
   //TimeMe.stopTimer(pageName1);

//}, 10);

//TimeMe.callWhenUserReturns(function(){
 // console.log("The user has come back!");
  
//});





//whenever we switch to new tabs, existing tabs or make new tabs.
chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {

doTheProcess(tabs[0].url)

    }); 
});



//interval every 1 second
setInterval(function () {
 timeSpentOnPage = TimeMe.getTimeOnPageInMilliseconds(pagesName1);
}, 1000);



//checks for tab changes
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  //it is fully refreshed
 chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
  //site is fully loaded
if (changeInfo.status == 'complete') {

doTheProcess(tabs[0].url)
     
     }
}); 
   
});

//thanks to lewdev I can extract URLs for only their domain (i.e youtube.com/watch?dg%#df32 -> youtube.com)
function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname
    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}


//this will be cleaning up and merging my data.
//so it will have an array of unique 
function cleanData(time, urls, url){

var currentTime = time[time.length-1];
 var tmp = [];

if(urls.includes(url)){

     times.push(timeSpentOnPage/1000);


}


    for(var i = 0; i < urls.length; i++){
        if(tmp.indexOf(urls[i]) == -1){
        tmp.push(urls[i]);
        
        console.log("new link!");
        }
        //if(url == urls[i]){
        //  time[i] = time[i] + time[time.length-1];
          
       // }

    }
    return tmp;
    
}

function doTheProcess(url){

   var link = extractHostname(url);
    console.log(link);
    TimeMe.stopTimer(previousUrl);


    urls.push(link);

    pagesName1 = link;
     
     
 
    temp = cleanData(times,urls,link);
    console.log(temp);
    console.log(times);

previousUrl = urls[urls.length-1];
console.log("Previous URL " + previousUrl);
TimeMe.startTimer(pagesName1);
}



 chrome.extension.onConnect.addListener(function(port) {
      console.log("Connected .....");
      port.onMessage.addListener(function(msg) {
           console.log("message recieved" + msg);
           var answer = doThis();




      combinedTime = temp.map(function(item,i) { 
   return [item,[answer[i]]]; 
 });
  

           port.postMessage(combinedTime);
           chrome.storage.sync.set({"myKey": combinedTime});


        
      });

     //saves the info.
    // chrome.storage.sync.set(combinedTime, function() {
    // console.log('Settings saved');
   //});
   




 })

 chrome.windows.onRemoved.addListener(function(windowid) {
 alert("window closed")
})



//function that pushes the time into an array.
function doThis(){
  var tmp =[];
 for(var i = 0; i < temp.length; i++){
  timeSpentOnPage = TimeMe.getTimeOnPageInMilliseconds(temp[i]);
    tmp.push(timeSpentOnPage/1000)
 }
  return tmp; 
}

