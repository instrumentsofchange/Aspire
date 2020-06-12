import { connect } from 'react-redux';
import {
  fetchProgramOptions,
  searchSchedules,
  deleteSchedule
} from '../actions/search-schedule-data-actions';
import SearchSchedules from '../components/SearchSchedules';

const mapStateToProps = state => {
  return {
    ...state.schedules.search
  };
}

const mapDispatchToProps = {
  fetchProgramOptions,
  searchSchedules,
  deleteSchedule
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchSchedules);