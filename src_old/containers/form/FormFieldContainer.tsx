import { connect } from 'react-redux';
import { IData, IStoreState } from '../../interfaces/misc';
import { FormField } from '../../components/form/FormField';

const mapStateToProps = (state: IStoreState) => {
  return ({
    data: state.current.data
  });
};

interface IMappedProps {
  data: IData;
}

const connector = connect<IMappedProps, {}>(mapStateToProps, {});

export const FormFieldContainer = connector(FormField);
