import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import _ from 'lodash'
import '../../../styles/table-options-header.scss'

export default class TableOptionsHeader extends Component {
  /* 
    {
      text: string,
      icon: component,
      className: string,
      onClick: function
    }

  */
  constructor() {
    super();
    this.optionMenuElements = []
    this.currentMouseX = 0
    this.currentMouseY = 0
    this.lastLeaveTimeoutId = null
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove)
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove)
  }

  handleMouseMove = ({ pageX, pageY }) => {
    this.currentMouseX = pageX
    this.currentMouseY = pageY
  }

  handleMouseEnter = () => ReactTooltip.show(this.menuExpand)

  handleMouseLeave = () => {

    if (!_.isNil(this.lastTimeoutId)) {
      clearTimeout(this.lastTimeoutId)
    }

    this.lastTimeoutId = setTimeout(() => {
      // if mouse is over any of the menu items, don't hide
      const currentElementHover = document.elementFromPoint(this.currentMouseX, this.currentMouseY)
      const hoveringMenuElement = _.includes(this.optionMenuElements, currentElementHover)
      if (!hoveringMenuElement) {
        ReactTooltip.hide(this.menuExpand)
      }
    }, 500)
  }

  addOptionElement = node => this.optionMenuElements.push(node)

  render() {

    const [firstOption, ...options] = [...this.props.options]

    return (
      <div className="options-header" ref={this.addOptionElement}>

        <div
          data-tip
          data-for="options-menu"
          className="first-option"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          ref={span => {
            this.menuExpand = span
            this.addOptionElement(span)
          }}
        >
          {this.renderOption(firstOption, options.length > 0)}
        </div>

        {options.length ?

          <ReactTooltip
            isCapture
            id="options-menu"
            place="bottom"
            type="light"
            effect="solid"
            event="click"
            eventOff="click"
            className="options-header-tooltip"
            offset={{ bottom: 3, left: 3 }}
          >
            <div
              className="option-menu"
              onMouseLeave={this.handleMouseLeave}
              ref={div => {
                this.optionMenu = div
                this.addOptionElement(div)
              }}
            >

              {_.map(options, option => this.renderOption(option, false))}

            </div>
          </ReactTooltip>

          : null}

      </div>
    )
  }

  renderOption = ({ text, icon, onClick, className = '' }, renderExpandIcon) => (
    <div
      key={text}
      className={`option d-block ${className}`}
      ref={this.addOptionElement}
      onClick={(e) => {

        ReactTooltip.hide(this.menuExpand)
        onClick(e)

      }}>
      <span className="option-icon d-inline-block" ref={this.addOptionElement}>
        {icon}
      </span>
      <span className="option-text d-inline-block" ref={this.addOptionElement}>
        {text}
      </span>
      {renderExpandIcon ?

        <span className="options-menu-expand" ref={this.addOptionElement}>
          {/* {expandSvg} */}
        </span>

        : null
      }
    </div>
  )
}