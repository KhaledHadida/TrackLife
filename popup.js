//communicate from background.js 

var backgroundColor = []



//grabs reference of the html
var test = document.getElementById("status").innerHTML; 




  
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: [],

        datasets: [{
            label: 'Sites',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 159, 0, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 159, 0, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
    	responsive: true,
            legend: {
            	//legend
            	display:false,
                position: 'bottom',
                labels: {
                    fontColor: "black",
                    boxWidth: 20,
                    padding: 20
                }
            },
       // scales: {
         //   yAxes: [{
           //     ticks: {
            //        beginAtZero: true
              //  }
          //  }]
        //}
    }
});


 var port = chrome.extension.connect({
    name: "Sample Communication"
 });
 port.postMessage("Hi BackGround");



 port.onMessage.addListener(function(msg) {

     var i;




        // myChart.data.datasets[0].data[0] = Math.random() * 100;




 for (var i = 0; i < myChart.data.datasets[0].data.length; i++) {
console.log(myChart.data.datasets[0].data[i]);
myChart.data.datasets[0].data[i] = msg[i][1];
 }


         myChart.update();






   for (i = 0; i < msg.length; i++) {
  	      
      addData(myChart, msg[i][0], msg[i][1]);
    
    	
  }    
 });



//adds the data into the chart
function addData(chart, label, data) {
    chart.data.labels.push(label);
    //pushes the color
    chart.data.datasets[0].backgroundColor.push(getRandomColor());
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
     document.getElementById('js-legend').innerHTML = myChart.generateLegend();
    chart.update();
}


setInterval(function () {
chrome.storage.sync.get("myKey", function (obj) {
    console.log(obj);
});
}, 1000);


//colour randomizer function
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
