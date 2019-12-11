import React, { Component } from "react";
import {
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryLine,
  VictoryLabel
} from "victory";
import "./css/HourlyStats.css";

class HourlyStats extends Component {
  constructor() {
    super();
    this.state = {
      num_hours: 24,
      hourly_stats: [],
      processed_stats: [
        { x: 1, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 5 },
        { x: 4, y: 4 },
        { x: 5, y: 7 }
      ] // Scrappy bugfix
    };
  }

  componentDidMount() {
    fetch("/stats/hourly")
      .then(res => res.json())
      .then(stats =>
        this.setState({ hourly_stats: stats }, () =>
          console.log("Stats fetched...", this.state.hourly_stats)
        )
      )
      .then(() =>
        this.setState({ processed_stats: this.parse_stats() }, () =>
          console.log("State set... ", this.state.processed_stats)
        )
      );
  }

  // Map all dates to their number of events
  parse_stats() {
    let i, j;
    var new_stats = [];
    // keep track of totals for each hour
    let totals = [];
    // increments number of samples per each hour
    let samples = [];
    for (let x = 0; x < this.state.num_hours; x++) {
      totals.push(0);
      samples.push(0);
    }

    for (i = 0; i < this.state.hourly_stats.length; i++) {
      let temp = this.state.hourly_stats[i];
      totals[temp.hour] += temp.clicks;
      samples[temp.hour] += 1;
    }
    for (j = 0; j < totals.length; j++) {
      let avg = totals[j] / samples[j];
      new_stats.push({ x: j, y: avg });
    }
    return new_stats;
  }

  render() {
    return (
      <div id="HourlyStats" className="component">
        <h2>Hourly Statistics</h2>
        <p>
          Time of day in hours (x-axis) against average number of clicks
          (y-axis)
        </p>
        <VictoryChart
          theme={VictoryTheme.material}
          animate={{
            duration: 1200,
            onLoad: { duration: 600 }
          }}
        >
          <VictoryAxis
            fixLabelOverlap={true}
            tickFormat={x => (x < 12 ? `${x}am` : `${x - 12}pm`)}
          />
          <VictoryAxis
            dependentAxis
            domain={{ y: [0, 100] }}
            fixLabelOverlap={true}
          />
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" }
            }}
            data={this.state.processed_stats}
          />
        </VictoryChart>
      </div>
    );
  }
}

export default HourlyStats;
