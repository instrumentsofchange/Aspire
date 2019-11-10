import React, { Component } from 'react';
import { Alert, Table, Button, Form, FormGroup, Input, Label, FormFeedback, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { Redirect, Link, Switch, Route } from 'react-router-dom';
import { Formik } from 'formik';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

export default class SearchInstruments extends Component {

    componentDidMount() {
        this.props.getSearchFormInitialValues();
    }

    handleEditClick = (instrumentId) => {
        console.log('edit: ', instrumentId);
    }

    handleDeleteClick = (instrumentId) => {
        console.log('delete: ', instrumentId);
    }

    handlePaginationClick = (element) => {
        console.log(element.currentTarget.value);
    }

    render() {
        const { 
            pageLoading,
            makeOptions,
            searchResults,
            error
        } = this.props;

        let content;

        if(pageLoading) {
            content = <LoadingSpinner />
        } else if(error) {
            content = (
                <Alert color="danger">
                    {error.message}
                    <pre>{error.stack}</pre>
                </Alert>
            );
        } else {
            content = (
                <div>
                    {this.renderSearchForm()}
                    {this.renderSearchResults()}
                    {/* {this.renderRouter()} */}
                </div>
            )
        }

        return content;
    }

    renderSearchForm = () => {
        const { makeOptions } = this.props;

        return (
            <div className="row mt-2 mb-5">
                <div className="col-md-6 offset-md-3 order-md-1">
                    <h1>Search Instruments</h1>

                    <Formik 
                        initialValues={{
                            serialNumber: '',
                            make: ''
                        }}
                        onSubmit={(values, actions) => {
                            this.props.searchInstruments(values);
                        }}
                        render={props => (
                            <Form onSubmit={props.handleSubmit}>
                                <FormGroup>
                                    <Label for="serialNumber">Serial Number</Label>
                                    <Input 
                                        type="text"
                                        name="serialNumber"
                                        value={props.values.serialNumber}
                                        onChange={props.handleChange}
                                        invalid={props.errors.serialNumber && props.touched.serialNumber }
                                    />
                                    {props.errors.serialNumber && props.touched.serialNumber 
                                        ? <FormFeedback>{props.errors.serialNumber}</FormFeedback>
                                        : null
                                    }
                                </FormGroup>
                                
                                <FormGroup>
                                    <Label for="make">Make</Label>
                                    <Input 
                                        type="select"
                                        name="make"
                                        onChange={props.handleChange}
                                        invalid={props.errors.make && props.touched.serialNumber}
                                    >
                                        {makeOptions.map(make => (
                                            <option key={make.value} value={make.value}>{make.text}</option>
                                        ))}
                                    </Input>
                                </FormGroup>

                                <Button className="btn-block" color="primary" type="submit">Search</Button>
                                <pre>{JSON.stringify(props.values, null, 2)}</pre>
                            </Form>
                        )}
                    />
                </div>
            </div>
        );
    }

    renderSearchResults = () => {
        const { 
            searchResults, 
            searchLoading
        } = this.props;

        return searchLoading ? <LoadingSpinner /> : (
            <div className="row">
                <div className="col-md-8 offset-md-2 order-md-2">
                    {searchResults && (
                        <Table
                            bordered={true}
                            hover={true}
                            responsive={true}
                        >
                            <thead>
                                <tr>
                                    <th>Serial Number</th>
                                    <th>Make</th>
                                    <th>Model</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderSearchResultRows()}
                            </tbody>
                        </Table>
                    )}
                </div>
            </div>
        );
    }

    renderSearchResultRows = () => {
        const content = this.props.searchResults.map(instrument => (
            <tr key={instrument.id}>
                <th scope="row">{instrument.serialNumber}</th>
                <th>{instrument.make}</th>
                <th>{instrument.model}</th>
                <th>
                    {/* <Button color="primary" className="mr-3" onClick={this.handleEditClick()}>Edit</Button> */}
                    <Link to={`/instruments/edit/${instrument.id}`}>
                        <Button color="primary" className="mr-3" >Edit</Button>
                    </Link>
                    <Button color="danger" onClick={() => this.handleDeleteClick(instrument.id)}>Delete</Button>
                </th>
            </tr>
        ));

        return content;
    }

    handleEditClick = () => {
        debugger;
        window.location.reload(true);
    }
}