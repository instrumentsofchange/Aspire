import React from 'react'
import '../../../styles/single-panel-layout.scss'

export default props => {
  const { title, content, tabs } = props

  return (
    <div className="row pt-3">
      <div className="col-12">
        <div className="single-panel-container rounded">
      
          {title &&

            <div className="row panel-header">
              <div className="col-12">
                <span className="icon-title">
                  {title && <h2>{title}</h2>}
                </span>
              </div>
            </div>

          }

          {tabs &&

            <div className="row panel-tabs py-4">
              <div className="col-12">
                {tabs}
              </div>
            </div>

          }

          <div className="row panel-content">
            <div className="col-12">
              {content}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}