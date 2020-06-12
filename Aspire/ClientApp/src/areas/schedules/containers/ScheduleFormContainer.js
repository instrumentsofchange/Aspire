import { connect } from 'react-redux';
import { isNil } from 'lodash';
import { 
  fetchProgramOptions,
  saveSchedule,
  fetchSchedule
} from '../actions/schedules-form-data-actions';
import ScheduleForm from '../components/ScheduleForm';

const mapStateToProps = (state, props) => {
  const isEdit = !isNil(props.scheduleId);
  const editScheduleId = props.scheduleId;

  return {
    ...state.schedules.form,
    isEdit,
    editScheduleId    
  };
}

const mapDispatchToProps = {
  fetchProgramOptions,
  saveSchedule,
  fetchSchedule
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScheduleForm);