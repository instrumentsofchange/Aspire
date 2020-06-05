import Request from '../../../../shared/request/aspire-request'
import FileSaver from 'file-saver'

const studentApiUrl = '/api/student'

export const FETCH_ATTENDANCE_REPORT_REQUEST = '@@aspire-app/FETCH_ATTENDANCE_REPORT_REQUEST'
export const FETCH_ATTENDANCE_REPORT_FAILURE = '@@aspire-app/FETCH_ATTENDANCE_REPORT_FAILURE'
export const fetchAttendanceReport = (programId, startDate, endDate) => dispatch => {

  dispatch({ type: FETCH_ATTENDANCE_REPORT_REQUEST })

  return Request.getFile(
    `${studentApiUrl}/attendance-report?ProgramId=${programId}&StartDate=${startDate}&EndDate=${endDate}`,
    response => {
      let filename = response.headers['content-disposition'].split(';')[1];

      const startIndex = filename.indexOf(' filename=') + 10
      const endIndex = filename.length

      filename = filename.substring(startIndex, endIndex)

      FileSaver.saveAs(response.blob, filename)
    },
    () => {
      const errorMessage = 'There was a problem trying to download the Attendance Report'

      dispatch({
        type: FETCH_ATTENDANCE_REPORT_FAILURE,
        error: errorMessage
      })
    
      throw errorMessage
    }
  )
}