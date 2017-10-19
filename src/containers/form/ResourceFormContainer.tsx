import { connect } from 'react-redux';
import { updateField } from './actions';

import '../../components/form/style.css';
import {IResourceType} from '../../interfaces/resource';
import {ResourceForm} from '../../components/form/ResourceForm';

interface IOwnProps {
  resourceType: IResourceType;
  id: string;
}

const mapDispatchToProps = {
  updateField
};

const mapStateToProps  = (state: any, props: IOwnProps) => {
  return ({
    data: state.current.data[props.resourceType].find(
      (resource: any) => resource.id === `${props.id}`
    ),
    oldData: state.data[props.resourceType].find(
      (resource: any) => resource.id === `${props.id}`
    ),
    schema: state.current.schema
  });
};

export const ResourceFormContainer = connect(mapStateToProps, mapDispatchToProps)(ResourceForm);
