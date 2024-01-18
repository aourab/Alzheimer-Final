
function generateEEGData(durationInSeconds, sampleRate, updateInterval) {
    const data = [];
    let time = 0;

    function generatePoint() {
        const amplitude = 2 * Math.sin(20 * Math.PI * time) + Math.random() - 0.5;
        return { x: time, y: amplitude };
    }

    return setInterval(() => {
        const point = generatePoint();
        data.push(point);
        time += 1 / sampleRate;

        // Remove old data to keep the chart clean
        if (data.length > durationInSeconds * sampleRate) {
            data.shift();
        }

        // Update the chart with the new data
        updateEEGChart(data);
    }, updateInterval);
}

// Function to update the EEG chart
function updateEEGChart(data) {
    const chart = eegChart;
    chart.data.datasets[0].data = data;
    chart.options.scales.x.max = data[data.length - 1].x; // Adjust the x-axis max value
    chart.update();
}

// Function to initialize and render the EEG chart
function renderEEGChart() {
    const durationInSeconds = 10;
    const sampleRate = 100; // samples per second
    const updateInterval = 100; // milliseconds

    const ctx = document.getElementById('eegChart').getContext('2d');
    
    const eegData = generateEEGData(durationInSeconds, sampleRate, updateInterval);

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'EEG Beta Waves',
                data: [],
                borderColor: 'blue',
                borderWidth: 1,
                fill: false,
            }],
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    scaleLabel: {
                        display: true,
                        labelString: 'Time (seconds)',
                    },
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    scaleLabel: {
                        display: true,
                        labelString: 'Amplitude (mV)',
                    },
                },
            },
        },
    });

    // Store the chart instance for later updates
    eegChart = chart;
}

// Call the function to render the EEG chart
renderEEGChart();
