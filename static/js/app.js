
// Fetch data from the URL and create the bar chart
d3.json(
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
)
  .then((data) => {
    const dropdown = d3.select("#selDataset");

    // Add options to the dropdown menu
    data.names.forEach((name) => {
      dropdown.append("option").text(name).attr("value", name);
    });

    // Initial chart creation with the first name
    //console.log(data.samples[0])
    updateBarChart(data.samples[0]);
  })
  .catch((error) => console.error("Error loading data:", error));

  // Function to create/update the gauge chart
function updateGaugeChart(washingFrequency) {
  var data = [
    {
      type: "indicator",
      mode: "gauge+number",
      value: washingFrequency,
      title: { text: "Weekly Washing Frequency", font: { size: 20 } },
      gauge: {
        axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 1], color: "lightgray" },
          { range: [1, 2], color: "lightblue" },
          // Define other ranges and colors as needed for your chart
          // ...
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 9,
        },
      },
    },
  ];

  var layout = { width: 300, height: 250, margin: { t: 0, b: 0 } };
  Plotly.newPlot("gauge", data, layout);
}

// Event listener for the dropdown menu
d3.select("#selDataset").on("change", function () {
  const selectedName = d3.select(this).property("value");
  d3.json(
    "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
  )
    .then((data) => {
      const selectedData = data.samples.find((sample) => sample.id === selectedName);
      const metaData = data.metadata.find((item) => item.id === Number(selectedName)); 
      updateBarChart(selectedData);
      updatePanelData(metaData); // Pass the sample data here, not metadata
      updatePlotlyBubbleChart(selectedData);
    })
    .catch((error) => console.error("Error loading data:", error));
});

// Define the optionChanged function
function optionChanged(selectedValue) {
  // Your code to handle the change event goes here
  //console.log("Selected value:", selectedValue);
  // ... Add more code to update charts or perform actions based on the selected value
}

// Function to create the horizontal bar chart
function updateBarChart(sampleData) {
  
  // Get the top 10 OTUs
  const topOTUs = sampleData.sample_values.slice(0, 10);
  const topOTULabels = sampleData.otu_ids.slice(0, 10);
  const topOTUHoverText = sampleData.otu_labels.slice(0, 10);
  // Create the bar chart using D3
  const chartDiv = d3.select("#bar");
  chartDiv.html(""); // Clear previous content

  const margin = { top: 20, right: 20, bottom: 30, left: 150 };
  const width = chartDiv.node().getBoundingClientRect().width - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = chartDiv
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const y = d3
    .scaleBand()
    .range([height, 0])
    .padding(0.1)
    .domain(topOTULabels.map((id) => `OTU ${id}`));

  // Create the y-axis generator
  const yAxis = d3.axisLeft(y);

  // Add the y-axis to the SVG
  svg.append("g")
    .call(yAxis);

  const x = d3.scaleLinear().range([0, width]).domain([0, d3.max(topOTUs)]);

  // Create the x-axis generator
  const xAxis = d3.axisBottom(x);

  // Add the x-axis to the SVG
  svg.append("g")
    .attr("transform", "translate(0," + height + ")") // Adjust the height to position the x-axis
    .call(xAxis);

  const bars = svg
    .selectAll(".bar")
    .data(topOTUs)
    .enter()
    .append("g")
    .attr("class", "bar")

  bars
    .append("rect")
    .attr("width", (d) => x(d))
    .attr("height", y.bandwidth())
    .attr("y", (d, i) => y(`OTU ${topOTULabels[i]}`))
    .attr("fill", "steelblue");
  
}

// Fetch data from the URL and create the charts
d3.json(
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
)
  .then((data) => {
    const dropdown = d3.select("#selDataset");

    // Add options to the dropdown menu
    data.names.forEach((name) => {
      dropdown.append("option").text(name).attr("value", name);
    });

    // Initial chart creation with the first name
    updateCharts(data.samples[0]);
  })
  // .catch((error) => console.error("Error loading data:", error));

// Function to create/update both the bar chart and bubble chart
function updateCharts(sampleData) {
  updateBarChart(sampleData);
  //updateBubbleChart(sampleData);
  updatePlotlyBubbleChart(sampleData)
}

function updatePanelData(sampleData){
  //console.log(sampleData)
  // Select the container div
  const dataPanel = d3.select("#sample-metadata");
  dataPanel.html(""); // Clear previous content

  // Loop through the data object and create consecutive lines (divs) for each key-value pair
  Object.entries(sampleData).forEach(([key, value]) => {
    // Create a line (div) element for the key-value pair
    const line = dataPanel.append("div").attr("class", "line");

    // Create a span element for the key
    line.append("span").text(key).attr("class", "key");
    line.append("span").text(" ")
    line.append("span").text(":")
    // Create a span element for the value
    line.append("span").text(" ")
    line.append("span").text(value).attr("class", "value");
  });
}

// Function to create the bubble chart
function updateBubbleChart(sampleData) {
  const otuIds = sampleData.otu_ids;
  const sampleValues = sampleData.sample_values;
  const markerSize = sampleData.sample_values;
  const markerColors = sampleData.otu_ids;
  const textValues = sampleData.otu_labels;

  const chartDiv = d3.select("#bubble");
  chartDiv.html(""); // Clear previous content

  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = chartDiv.node().getBoundingClientRect().width - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = chartDiv
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const x = d3.scaleLinear().domain([0, d3.max(otuIds)]).range([0, width]);
  const y = d3.scaleLinear().domain([0, d3.max(sampleValues)]).range([height, 0]);
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  const bubbles = svg.selectAll(".bubble").data(otuIds).enter().append("circle");

  bubbles
    .attr("class", "bubble")
    .attr("cx", (d) => x(d))
    .attr("cy", (d, i) => y(sampleValues[i]))
    .attr("r", (d, i) => markerSize[i] * 0.75)
    .style("fill", (d) => colorScale(d));

  bubbles.append("title").text((d, i) => `${textValues[i]}\nOTU ID: ${d}`);

  svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));

  svg.append("g").call(d3.axisLeft(y));
}
// Define bubbleChartExists outside the function
let bubbleChartExists = false;
// Function to create the plotly bubble chart
function updatePlotlyBubbleChart(sampleData) {
  const otuIds = sampleData.otu_ids;
  const sampleValues = sampleData.sample_values;
  const markerSize = sampleData.sample_values;
  const markerColors = sampleData.otu_ids;
  const textValues = sampleData.otu_labels;
  const width = document.getElementById("bubble").getBoundingClientRect().width;
  const height = 400;

  const trace = {
    x: otuIds,
    y: sampleValues,
    text: textValues.map((label, i) => `${label}<br>OTU ID: ${otuIds[i]}`),
    mode: "markers",
    marker: {
      size: markerSize.map((size) => size * 0.75),
      color: markerColors,
      colorscale: "Category10",
    },
    type: "scatter",
  };

  const layout = {
    margin: { t: 20, r: 20, b: 30, l: 50 },
    width: width,
    height: height,
    xaxis: {
      title: "OTU IDs",
    },
    yaxis: {
      title: "Sample Values",
    },
  };

  if (bubbleChartExists) {
    // If the chart exists, use Plotly.react to update the data and layout
    Plotly.react("bubble", [trace], layout);
  } else {
    // If the chart does not exist, use Plotly.newPlot to create it
    Plotly.newPlot("bubble", [trace], layout);
    bubbleChartExists = true; // Set the flag to true to track the existence of the chart
  }
}




