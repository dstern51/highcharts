jQuery(document).ready(function ($) {
	var data = [];
	var originalData = [];
	var returnPercentsPerYear = [];
	var balanceGraphColors = [];
	var returnGraphColors = [];
	var curYearIndex = 1;

	var xAxisCategories = [];
	for (var i = 0; i < 60; i++) {
		xAxisCategories.push(i);
	}

	var balanceChart;
	var returnChart;
	var curStep = 30;

	var chartData, navigatorData;

	var dragStart = false;
	var draggingStartPosition;
	var draggingPoint;

	var currentReturnTooltip = 1;

	function updateBalanceChart() {
		chartData = [];
		for (var i = 1; i < returnPercentsPerYear.length; i++) {
			chartData.push(data[i]['Year ' + curYearIndex]);
		}
		balanceChart.update({
			title: {
	            text: "<h2>Financial Analysis (Year " + curYearIndex + ")</h2>",
	            useHTML: true
	        }
		});
		balanceChart.series[0].options.color = balanceGraphColors[curYearIndex];
		balanceChart.series[0].setData(chartData);
	}


	function chartMoveRight() {
		curYearIndex = draggingPoint + 1;
		returnChart.update({
			xAxis: {
				min: draggingPoint - 29,
				max: draggingPoint
			}
		});
		updateBalanceChart();
	}

	function chartMoveLeft() {
		curYearIndex = draggingPoint + 1;
		returnChart.update({
			xAxis: {
				min: draggingPoint,
				max: draggingPoint + 29
			}
		});
		updateBalanceChart();
	}

	$.ajax({
		url: 'data/exampledata.json',
		type: 'GET',
		success: function(res) {
			var keys = res[0];
			originalData = res;

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
				chartData.push({y: data[i]['Year ' + curYearIndex], color: balanceGraphColors[i]});
				navigatorData[i - 1] = {y: navigatorData[i - 1], color: returnGraphColors[i]};
			}

			balanceChart = Highcharts.chart('balance-chart', {
		        chart: {
		            type: 'column'
		        },

		        title: {
		            text: "<h2>Financial Analysis (Year 1)</h2>",
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
		        	max: 29,
		        	labels: {
		        		formatter: function() {
		        			return 'Year ' + (this.value + 1);
		        		}
		        	}
		        },

		        tooltip: {
		        	formatter: function() {
		        		currentReturnTooltip = this.x;
		        		return 'Return: ' + this.y + '%';
		        	},
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
		        }
		    });

			$(returnChart.container).mousedown(function(e) {
				dragStart = true;
				draggingStartPosition = e.offsetX;
				draggingPoint = currentReturnTooltip;
			});

			$(returnChart.container).mouseup(function(e) {
				if (dragStart) {
					if (draggingStartPosition < e.offsetX) {
						chartMoveRight();
					} else if (draggingStartPosition > e.offsetX) {
						chartMoveLeft();
					}
					dragStart = false;
				}
			});
		}
	});
});
