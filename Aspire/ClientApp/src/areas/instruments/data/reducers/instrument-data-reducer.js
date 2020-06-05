import {
  FETCH_INSTRUMENT_LIST_CONSTANTS_REQUEST,
  FETCH_INSTRUMENT_LIST_CONSTANTS_SUCCESS,
  FETCH_INSTRUMENT_LIST_CONSTANTS_FAILURE,
  FETCH_INSTRUMENT_LIST_REQUEST,
  FETCH_INSTRUMENT_LIST_SUCCESS,
  FETCH_INSTRUMENT_LIST_FAILURE,
  DELETE_INSTRUMENT_REQUEST,
  DELETE_INSTRUMENT_SUCCESS,
  DELETE_INSTRUMENT_FAILURE
} from '../actions/instrument-data-actions'

import { HIDE_DELETE_MODAL } from '../../ui/actions/instruments-ui-actions'

const defaultState = {
  loadingConstants: false,
  constants: { },
  loadingConstantsError: null,
  loadingInstruments: false,
  instruments: [],
  loadingInstrumentsError: null,
  deletingInstrument: false,
  deletingInstrumentError: null
}

export default (state = defaultState, { type, payload, error }) => {
  let reducedState = { ...state }

  const reduceAction = changes => ({
    ...state,
    ...changes
  })

  switch(type) {
    case FETCH_INSTRUMENT_LIST_CONSTANTS_REQUEST:
      reducedState = reduceAction({
        loadingConstants: true,
        constants: null,
        loadingConstantsError: null
      })
      break

    case FETCH_INSTRUMENT_LIST_CONSTANTS_SUCCESS:
      reducedState = reduceAction({
        loadingConstants: false,
        constants: payload
      })
      break

    case FETCH_INSTRUMENT_LIST_CONSTANTS_FAILURE:
      reducedState = reduceAction({
        loadingConstants: false,
        loadingConstantsError: error
      })
      break

    case FETCH_INSTRUMENT_LIST_REQUEST:
      reducedState = reduceAction({
        loadingInstruments: true,
        instruments: [],
        loadingInstrumentsError: null
      })
      break

    case FETCH_INSTRUMENT_LIST_SUCCESS:
      reducedState = reduceAction({
        loadingInstruments: false,
        instruments: payload
      })
      break

    case FETCH_INSTRUMENT_LIST_FAILURE:
      reducedState = reduceAction({
        loadingInstruments: false,
        loadingInstrumentsError: error
      })
      break

    case DELETE_INSTRUMENT_REQUEST:
      reducedState = reduceAction({
        deletingInstrument: true,
        deletingInstrumentError: null
      })
      break

    case DELETE_INSTRUMENT_SUCCESS:
      reducedState = reduceAction({
        deletingInstrument: false
      })
      break

    case DELETE_INSTRUMENT_FAILURE:
      reducedState = reduceAction({
        deletingInstrument: false,
        deletingInstrumentError: error
      })
      break

    case HIDE_DELETE_MODAL:
      reducedState = reduceAction({
        deletingInstrument: false,
        deletingInstrumentError: null
      })
  }

  return reducedState
}