import React, { Component } from 'react'
import { Nav, NavItem, NavLink, TabContent, TabPane, Table, Card, CardBody, CardTitle, Row, Col, Button } from 'reactstrap'
import LoadingSpinner from '../../../../shared/components/LoadingSpinner'

export default class StudentInfo extends Component {

  constructor(props) {
    super(props)

    this.state = {
      activeTab: 1
    }
  }

  componentDidMount() {
    const {
      studentId,
      fetchStudentInfo
    } = this.props

    fetchStudentInfo(studentId)
  }

  handleTabClick = tabId => {
    this.setState({
      activeTab: tabId
    })
  }

  render() {
    const { 
      loadingStudentInfo,
      studentInfo,
      loadingStudentInfoError
    } = this.props

    let content 

    if(loadingStudentInfo) {
      content = <LoadingSpinner />
    } else if(loadingStudentInfoError) {
      content = <h2>Error: {loadingStudentInfoError}</h2>
    } else if(studentInfo) {
      content = (
        <div>
          {this.renderTabs()}
          {this.renderTabContent()}
          {this.renderFooter()}
        </div>
      )
    }

    return content
  }

  renderTabs = () => {
    const { activeTab } = this.state

    return (
      <Nav tabs>
        <NavItem>
          <NavLink
            onClick={() => this.handleTabClick(1)}
            className={activeTab === 1 ? 'active' : ''}
          >
            Main Info
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            onClick={() => this.handleTabClick(2)}
            className={activeTab === 2 ? 'active' : ''}
          >
            Parent/Guardian(s)
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            onClick={() => this.handleTabClick(3)}
            className={activeTab === 3 ? 'active' : ''}
          >
            Emergency Contact(s)
          </NavLink>
        </NavItem>
      </Nav>
    )
  }

  renderTabContent = () => {
    const { studentInfo } = this.props
    const { activeTab } = this.state

    return (
      <TabContent>
        <TabPane 
          tabId="1"
          className={activeTab === 1 ? 'active' : ''}
        >
          {this.renderStudentInfo()}
        </TabPane>
        <TabPane 
          tabId="2"
          className={activeTab === 2 ? 'active' : ''}
        >
          {this.renderParentGuardianInfo()}
        </TabPane>
        <TabPane
          tabId="3"
          className={activeTab === 3 ? 'active' : ''}
        >
          {this.renderEmergencyContactInfo()}
        </TabPane>
      </TabContent>
    )
  }

  renderStudentInfo = () => {
    const {
      studentInfo: {
        firstName,
        middleInitial,
        lastName,
        studentNumber,
        homeroomTeacher,
        dateOfBirth,
        shirtSize,
        allergies
      }
    } = this.props

    return (
      <Table bordered>
        <tbody>
          <tr>
            <td scope="row" className="text-right">Name</td>
            <td>{firstName} {middleInitial} {lastName}</td>
          </tr>
          <tr>
            <td scope="row" className="text-right">Date of Birth</td>
            <td>{new Date(dateOfBirth).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td scope="row" className="text-right">Student Number</td>
            <td>{studentNumber}</td>
          </tr>
          <tr>
            <td scope="row" className="text-right">Homeroom Teacher</td>
            <td>{homeroomTeacher}</td>
          </tr>
          <tr>
            <td scope="row" className="text-right">Allergies</td>
            <td>{allergies}</td>
          </tr>
          <tr>
            <td scope="row" className="text-right">Shirt Size</td>
            <td>{shirtSize}</td>
          </tr>
        </tbody>
      </Table>
    )
  }

  renderParentGuardianInfo = () => {
    const {
      studentInfo: {
        parentGuardianOne,
        parentGuardianTwo
      }
    } = this.props

    const renderParentTwoCard = () => 
      parentGuardianTwo.firstName.length > 0 || parentGuardianTwo.phoneNumber.length > 0

    const renderCard = (parentInfo, number) => (
      <Card>
        <CardBody>
          <CardTitle>Parent/Guardian {number}</CardTitle>
          <Table bordered>
            <tbody>
              <tr>
                <td scope="row" className="text-right">Name</td>
                <td>{parentInfo.firstName} {parentInfo.lastName}</td>
              </tr>
              <tr>
                <td scope="row" className="text-right">Phone Number</td>
                <td>{parentInfo.phoneNumber}</td>
              </tr>
              <tr>
                <td scope="row" className="text-right">Email</td>
                <td>{parentInfo.email}</td>
              </tr>
              <tr>
                <td scope="row" className="text-right">Can Contact?</td>
                <td>{parentInfo.canContact ? 'Yes' : 'No'}</td>
              </tr>
            </tbody>
          </Table>
        </CardBody>
      </Card>
    )

    return (
      <div>
        {renderCard(parentGuardianOne, 1)}
        {renderParentTwoCard() ? renderCard(parentGuardianTwo, 2) : null}
      </div>
    )
  }

  renderEmergencyContactInfo = () => {
    const {
      studentInfo: {
        emergencyContactOne,
        emergencyContactTwo
      }
    } = this.props

    const shouldRenderEmergencyContact2 = () => 
      emergencyContactTwo.name.length > 0 || emergencyContactTwo.phoneNumber.length > 0

    const renderCard = (contactInfo, number) => (
      <Card>
        <CardBody>
          <CardTitle>Emergency Contact {number}</CardTitle>
          <Table bordered>
            <tbody>
              <tr>
                <td scope="row" className="text-right">Name</td>
                <td>{contactInfo.name}</td>
              </tr>
              <tr>
                <td scope="row" className="text-right">Phone Number</td>
                <td>{contactInfo.phoneNumber}</td>
              </tr>
              <tr>
                <td scope="row" className="text-right">RelationShip</td>
                <td>{contactInfo.relationship}</td>
              </tr>
            </tbody>
          </Table>
        </CardBody>
      </Card>
    )

    return (
      <div>
        {renderCard(emergencyContactOne, 1)}
        {shouldRenderEmergencyContact2() ? renderCard(emergencyContactTwo, 2): null}
      </div>
    )
  }

  renderFooter = () => {
    const { hideContactInfoModal } = this.props

    return (
      <Row>
        <Col md={{ size: 3, offset: 9}}>
          <Button className="mt-2" color="secondary" onClick={hideContactInfoModal}>Close</Button>
        </Col>
      </Row>
    )
  }
}
