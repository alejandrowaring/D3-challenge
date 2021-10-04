//Define the size of our SVG drawing area
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margin
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

//Create svg container
var svg = d3.select("#scatter").append("svg").attr("height", svgHeight).attr("width", svgWidth);
// shift by margins
var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

//List for each of the categories
var xChoices = ["obesity","smokes","healthcare"];
var yChoices = ["poverty","age","income"]
//Init the axis choices
var chosenXAxis = xChoices[0];
var chosenYAxis = yChoices[0];

console.log(chosenXAxis)
console.log(chosenYAxis)

function xScale(stateData, chosenXAxis) {
    //create scales
    var xLinearScale = d3.scaleLinear().domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8, d3.max(stateData, d => d[chosenXAxis]) * 1.2]).range([0, width]);
    return xLinearScale;
}

function yScale(stateData, chosenYAxis) {
    //create scales
    var yLinearScale = d3.scaleLinear().domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8, d3.max(stateData, d => d[chosenYAxis]) * 1.2]).range([0, width]);
    return yLinearScale;
} 



//Function for updating x axis on clicking label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition().duration(1000).call(bottomAxis);
    return xAxis;
}

//Function for updating y axis on clicking label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition().duration(1000).call(leftAxis);
    return yAxis;
}
//Function to update circles on X axis
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition().duration(1000).attr("cx", d => newXScale(d[chosenXAxis]));
    return circlesGroup;
}

//Function to update cirles on Y axis
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
    circlesGroup.transition().duration(1000).attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}
//Function to capitalize first letter of string 
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

//Function for updating the tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var label;
    //Formatting:
    //State:
    //XAxis
    //YAxis
    var xName = capitalizeFirstLetter(chosenXAxis);
    var yName = capitalizeFirstLetter(chosenYAxis);
    var toolTip = d3.tip().attr("class","tooltip").offset([80,-60]).html(function(d) {
        return(`${d.state}<br>${xName}:${chosenXAxis}<br>${yName}:${chosenYAxis}`)
    });
    circlesGroup.call(toolTip);
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data)})
    .on("mouseout", function(data, index){
        toolTip.hide(data);
    })
    return circlesGroup;
}

//retrieve the data

var csvPath = "./assets/data/data.csv";

d3.csv(csvPath).then(function(stateData, err) {
    if (err) throw err;

    console.log(stateData);
//parse data
    stateData.forEach(function(data){
        data.state = +data.state;
        data.abbr = +data.abbr;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = + data.age;
        data.income = +data.income;
    });
    var xLinearScale = xScale(stateData, chosenXAxis);
    var yLinearScale = yScale(stateData, chosenYAxis);
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g").classed("x-axis", true).attr("transform", `translate(0, ${height})`).call(bottomAxis);
    chartGroup.append("g").call(leftAxis)
    //Append the initial circles
      // append initial circles
  var circlesGroup = chartGroup.selectAll("circle").data(stateData).enter().append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d[chosenYAxis]))
  .attr("r", 20)
  .attr("fill", "blue")
  .attr("opacity", ".5");

  var labelsGroup = chartGroup.append("g").attr("transform", `translate(${width / 2}, ${height + 20})`);

  //All the X Labels
//Obesity Title Label
  var obeseLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty (%)");

 //Smoking Title Label
  var smokeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");
    //Healthcare Title Label
    var healthcareLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // All the y Labels
   var obeseLabel = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("value", "obese") // value to grab for event listener
    .classed("active", true)
    .text("Obese (%)");

    var smokeLabel = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("value", "smoke") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

    var healthcareLabel = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Lacks Healthcare (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(stateData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "num_albums") {
          albumsLabel
            .classed("active", true)
            .classed("inactive", false);
          hairLengthLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          albumsLabel
            .classed("active", false)
            .classed("inactive", true);
          hairLengthLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
}).catch(function(error) {
  console.log(error);

});