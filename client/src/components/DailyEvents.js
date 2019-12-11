import React, { Component } from "react";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory";
import "./css/DailyEvents.css";

class DailyEvents extends Component {
  constructor() {
    super();
    this.state = {
      daily_events: [],
      processed: [{ day: 0, events: 0 }] // This is a scrappy bugfix
    };
  }

  componentDidMount() {
    fetch("/events/daily")
      .then(res => res.json())
      .then(events =>
        this.setState({ daily_events: events }, () =>
          console.log("Events fetched...", events)
        )
      )
      .then(() =>
        this.setState({ processed: this.parse_events() }, () =>
          console.log("State set... ", this.state.processed)
        )
      );
  }

  // Map all dates to their number of events
  parse_events() {
    let i;
    var new_events = [];
    for (i = 0; i < this.state.daily_events.length; i++) {
      let temp = this.state.daily_events[i];
      new_events.push({ day: i + 1, events: parseInt(temp.events, 10) });
    }
    return new_events;
  }

  render() {
    return (
      <div id="DailyEvents" className="component">
        <h2>Daily Events</h2>
        <p>Days (x-axis) against number of events per day (y-axis)</p>
        <VictoryChart
          domainPadding={20}
          theme={VictoryTheme.material}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 }
          }}
        >
          <VictoryAxis tickFormat={x => `Day ${x}`} />
          <VictoryAxis dependentAxis />
          <VictoryBar data={this.state.processed} x="day" y="events" />
        </VictoryChart>
      </div>
    );
  }
}

export default DailyEvents;
