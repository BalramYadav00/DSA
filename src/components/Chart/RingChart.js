import React from 'react';
import Chart from 'react-apexcharts';

function RingChart() {
	const series = [70]; //70 percent
	const options = {
        labels: [''], //label of this diagram
        tooltip: {
            enabled: true
        }
	};

    return <Chart type='radialBar' series={series} options={options} />;
}

export default RingChart;
