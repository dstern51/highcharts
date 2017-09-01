jQuery(document).ready(function ($) {
	var data = [];
	var returnPercentsPerYear = [];
	var balanceGraphColors = [];
	var returnGraphColors = [];
	var curYearIndex = 1;

	var xAxisCategories = [];

	var balanceChart;
	var returnChart;
	var curStep = 30;

	var chartData, navigatorData;

	$.ajax({
		url: 'data/exampledata.json',
		type: 'GET',
		success: function(res) {
			var keys = res[0];

			for (var i = 1; i < res.length; i++) {
				var dataItem = [];
				for (var j = 1; j < res[i].length; j++) {
					for (var k = 4; k < keys.length; k++) {
						var price = res[i][k].replace('$', '');
						price = price.replace(',', '');
						dataItem[keys[k]] = Number.parseInt(price);
					}
				}

				var percent = res[i][3].replace('%', '');
				returnPercentsPerYear[res[i][0]] = Number.parseFloat(percent);
				balanceGraphColors[res[i][0]] = res[i][1];
				returnGraphColors[res[i][0]] = res[i][2];
				data[res[i][0]] = dataItem;
			}

			chartData = [];
			navigatorData = returnPercentsPerYear.slice(1, returnPercentsPerYear.length);
			for (var i = 1; i < returnPercentsPerYear.length; i++) {
				chartData.push(data[i]['Year ' + curYearIndex]);
				xAxisCategories.push(i - 1);
			}

			balanceChart = Highcharts.chart('balance-chart', {
		        chart: {
		            type: 'column'
		        },

		        title: {
		            text: "<h2>Financial Analysis</h2>",
		            useHTML: true
		        },

		        subtitle: {
		            text: "<h3>This graph updates values based on user action on returns graph</h3>",
		            useHTML: true		        	
		        },

		        series: [
			        {
			            name: 'Balance',
			            data: chartData
			        }
		        ],

		        xAxis: {
		        	categories: xAxisCategories,
		        	crosshair: true,
		        	labels: {
		        		formatter: function() {
		        			return 'Year ' + (this.value + 1);
		        		}
		        	}
		        },

		        tooltip: {
		        	pointFormat: 'Balance: $ {point.y}',
		        	shared: true
		        },

		        legend: {
		        	enabled: false
		        },

		        credits: {
		        	enabled: false
		        },

		        yAxis: {
		        	title: {
		        		enabled: false
		        	}
		        },

		        plotOptions: {
		        	column: {
		        		color: balanceGraphColors[curYearIndex]
		        	}
		        }
		    });

			returnChart = Highcharts.chart('return-chart', {
		        chart: {
		            type: 'column'
		        },

		        title: {
		            text: ""
		        },

		        series: [
			        {
			            name: 'Return',
			            data: navigatorData
			        }
		        ],

		        xAxis: {
		        	categories: xAxisCategories,
		        	crosshair: true,
		        	min: 0,
		        	max: 15,
		        	labels: {
		        		formatter: function() {
		        			return 'Year ' + (this.value + 1);
		        		}
		        	}
		        },

		        tooltip: {
		        	pointFormat: 'Return:  {point.y}%',
		        	shared: true
		        },

		        legend: {
		        	enabled: false
		        },

		        credits: {
		        	enabled: false
		        },

		        yAxis: {
		        	title: {
		        		enabled: false
		        	}
		        },

		        plotOptions: {
		        	column: {
		        		color: returnGraphColors[curYearIndex]
		        	}
		        },

		        scrollbar: {
		        	enabled: true
		        }
		    });
		}
	});

	$(".go-next-year").click(function() {
		
	});

	$(".go-prev-year").click(function() {
	});
});
