import { get, isNil } from 'lodash'
 
const transformFormattedDate = date => date.replace(/(..).(..).(....)/, '$3-$1-$2')

const transformDateFromServer = date => date.split('T')[0]

export const tryGetErrorFromApiResponse = (errorResponse, defaultMessage) => {
  /* 
    The usual error response will have this shape:
    {
      body: {
        error: {
          message: "Error message here",
          exception: "Exception"
        }
      },
      header: { ... },
      headers: { ... },
      status: 500,
      etc
    }
  */


  let errorMessage = get(errorResponse, 'body.error.message', null)

  if (errorMessage === null) {
    errorMessage = get(errorResponse, 'text', null)
  }

  return !isNil(errorMessage) && typeof (errorMessage) === 'string' ? errorMessage : defaultMessage
}

export default ({
  transformFormattedDate,
  transformDateFromServer
})

