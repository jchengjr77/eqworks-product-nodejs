// Table Pagination code taken from:
// https://github.com/Semantic-Org/Semantic-UI-React/blob/master/docs/src/examples/collections/Table/Types/TableExamplePagination.js

import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import "./css/Locations.css";

class Locations extends Component {
  constructor() {
    super();
    this.state = {
      locations: []
    };
  }

  componentDidMount() {
    fetch("/poi")
      .then(res => res.json())
      .then(points =>
        this.setState({ locations: points }, () =>
          console.log("Locations fetched...", points)
        )
      );
  }

  render() {
    return (
      <div id="Locations" className="component">
        <h2>Locations</h2>
        <Table celled className="table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>P.O.I. ID</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Coordinates</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.locations.map(place => (
              <Table.Row key={place.name}>
                <Table.Cell className="table-cell">{place.poi_id}</Table.Cell>
                <Table.Cell className="table-cell">{place.name}</Table.Cell>
                <Table.Cell className="table-cell">
                  {place.lat}, {place.lon}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default Locations;
