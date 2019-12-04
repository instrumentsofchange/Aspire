import React, { Component } from 'react';
import { Formik } from 'formik';
import { FormGroup, Label, Input, Table, Button, Row, Col, Alert } from 'reactstrap';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

const defaultSearchFormValues = {
  program: ''
};

export default class SearchSchedule extends Component {

  componentDidMount() {
    this.props.fetchProgramOptions();
    this.props.searchSchedules(defaultSearchFormValues);
  }

  componentDidUpdate() {
    debugger;
    if(this.props.scheduleDeleted) {
      this.props.searchSchedules(defaultSearchFormValues);
    }
  }

  handleEditClick = scheduleId => {
    window.location = `/schedules/edit/${scheduleId}`;
  }

  handleDeleteClick = scheduleId => {
    const confirmed = window.confirm('Are you sure you want to delete schedule?');

    if(confirmed) {
      this.props.deleteSchedule(scheduleId);
    }
  }

  render() {
    const {
      programOptionsLoading,
      deletingSchedule,
      fetchProgramOptionsError,
      deletingScheduleError
    } = this.props;

    let content;

    if(programOptionsLoading) {
      content = <LoadingSpinner />;
    } else if(deletingSchedule) {
      content = <LoadingSpinner text="Deleting Schedule" />;
    } else if(fetchProgramOptionsError) {
      content = (
        <Alert color="danger">
          There was a problem loading the search page
          <br />
          Details:
          <pre>{fetchProgramOptionsError}</pre>
        </Alert>
      );
    } else if(deletingScheduleError) {
      content = (
        <Alert color="danger">
          There was a problem deleting the schedule
          <br />
          Details:
          <pre>{deletingScheduleError}</pre>
        </Alert>
      );
    } else {
      content = (
        <div>
          {this.renderSearchForm()}
          {this.renderSearchResults()}
        </div>
      )
    }

    return content;
  }

  renderSearchForm = () => {
    const {
      searchSchedules,
      programOptions
    } = this.props;

    return (
      <div className="row mt-2 mb-5">
        <div className="col-md-6 offset-md-3 order-md-1">
          <h1>Search Schedules</h1>

          <Formik
            initialValues={defaultSearchFormValues}
            onSubmit={values => searchSchedules(values)}
          >
            {({ values, handleSubmit, handleChange }) => (
              <div>
                <FormGroup>
                  <Label for="program">Program</Label>
                  <Input
                    type="select"
                    name="program"
                    value={values.program}
                    onChange={handleChange}
                  >
                    {
                      programOptions.map(program => (
                        <option key={program.value} value={program.value}>{program.text}</option>
                      ))
                    }
                  </Input>
                </FormGroup>

                <Row>
                  <Col md={{ size: 6, offset: 3 }}>
                    <Button className="btn-block" color="primary" onClick={handleSubmit}>Search</Button>
                  </Col>
                </Row>
              </div>
            )}
          </Formik>
        </div>
      </div>
    )
  }

  renderSearchResults = () => {
    const {
      searchResultsLoading,
      searchSchedulesError,
      searchResults
    } = this.props;

    let content;

    if(searchResultsLoading) {
      content = <LoadingSpinner text="Searching Schedules..." />;
    } else if(searchSchedulesError) {
      content = (
        <Alert 
          color="danger"
        >
          There was an error searching schedules
          <br />
          Details:
          <pre>{searchSchedulesError}</pre>
        </Alert>
      );
    } else if(searchResults) {
      content = (
        <Row>
          <Col md={{ size: 8, offset: 2 }}>
            <Table
              bordered
              hover
              responsive
            >
              <thead>
                <tr>
                  <th>Program</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map(schedule => (
                    <tr key={schedule.id}>
                      <th scope="row">{schedule.program}</th>
                      <th>{schedule.startDate}</th>
                      <th>{schedule.endDate}</th>
                      <th>
                        <Button
                          className="mr-3"
                          color="primary"
                          onClick={() => this.handleEditClick(schedule.id)}
                        >
                          Edit
                        </Button>

                        <Button
                          color="danger"
                          onClick={() => this.handleDeleteClick(schedule.id)}
                        >
                          Delete
                        </Button>
                      </th>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </Col> 
        </Row>
      )
    } else {
      content = <h4 className="text-center">No Results</h4>;
    }

    return content;
  }
}