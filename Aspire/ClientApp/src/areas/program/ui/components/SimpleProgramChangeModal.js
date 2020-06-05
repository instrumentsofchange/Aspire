import React, { Component } from 'react'
import { Container, Row, Col, Label, Input } from 'reactstrap'
import { isNil } from 'lodash'
import AspireModal from '../../../shared/components/AspireModal'
import LoadingSpinner from '../../../shared/components/LoadingSpinner'
import ErrorRow from '../../../shared/components/ErrorRow'
import PrimaryButton from '../../../shared/components/PrimaryButton'

export default class SimpleProgramChangeModal extends Component {

  constructor(props) {
    super(props)

    this.state = {
      program: props.selectedProgram
    }
  }

  componentDidMount() {
    if(this.props.isOpen) {
      this.props.fetchProgramOptions()
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.isOpen !== this.props.isOpen && this.props.isOpen) {
      this.props.fetchProgramOptions()
    }
  }

  handleProgramChange = ({ target: { value }}) => {
    const selectedProgram = this.props.programOptions.find(program => program.value === value)

    this.setState({
      program: {
        name: selectedProgram.text,
        id: selectedProgram.value
      }
    })
  }

  render() {
    const {
      isOpen,
      onClose
    } = this.props

    const {
      loadingProgramOptions,
      loadingProgramOptionsError
    } = this.props

    let content

    if (loadingProgramOptions) {
      content = <LoadingSpinner />
    } else if (loadingProgramOptionsError) {
      content = <ErrorRow error={loadingProgramOptionsError} />
    } else {
      content = this.renderContent()
    }

    return(
      <AspireModal 
        isOpen={isOpen}
        onClose={onClose}
        title="Change Programs"
        content={content}
      />
    )
  }

  renderContent = () => {
    const {
      programOptions,
      changeProgramSelection
    } = this.props

    return isNil(programOptions) ? null : (
      <Container>
        <Row>
          <Col md={12}>
            <Label for="program">Program</Label>
            <Input
              name="program"
              type="select"
              onChange={this.handleProgramChange}
              value={this.state.program.id}
            >
              {
                programOptions.map(program => (
                  <option key={program.value} value={program.value} disabled={program.disabled}>{program.text}</option>
                ))
              }
            </Input>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={{ size: 'auto', offset: 9}}>
            <PrimaryButton
              text="Change"
              onClick={() => changeProgramSelection(this.state.program)}
            />
          </Col>
        </Row>
      </Container>
    )
  }
}