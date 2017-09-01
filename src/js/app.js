jQuery(document).ready(function ($) {
	var data = [];
	var returnPercentsPerYear = [];
	var balanceGraphColors = [];
	var returnGraphColors = [];
	var curYearIndex = 1;

	var xAxisCategories = [];

	var balanceChart;
	var returnChart;

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

			var chartData = [];
			var navigatorData = returnPercentsPerYear.slice(1, returnPercentsPerYear.length);
			for (var i = 1; i < returnPercentsPerYear.length; i++) {
				chartData.push(data[i]['Year ' + curYearIndex]);
				xAxisCategories.push('Year ' + i);
			}

			balanceChart = Highcharts.chart('balance-chart', {
		        chart: {
		            type: 'column'
		        },

		        rangeSelector: {
		            selected: 2
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
		        	categories: xAxisCategories
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
		        },
		    });


			returnChart = Highcharts.chart('return-chart', {
		        chart: {
		            type: 'column'
		        },

		        rangeSelector: {
		            selected: 2
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
		        	categories: xAxisCategories
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
		    });
		}
	});

	$(".go-prev-year").click(function() {
		balanceChart.series[0].addPoint(['Year 31', Math.random() % 10 * 10000], true, true);
		returnChart.series[0].addPoint(['Year 31', Math.random() % 100], true, true);
	});
}); 