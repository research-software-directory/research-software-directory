// import * as React from 'react';
// import {ControlLabel, FormControl} from 'react-bootstrap';
// import { Option } from 'react-select';
// import { AddableReactSelect } from './components/AddableReactSelect';

// import 'react-select/dist/react-select.css';

// import { connect, Dispatch } from 'react-redux';
// import { Action } from 'redux';
// import { addToSchemaEnum } from './actions';

// const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
//   addToSchemaEnum: (resourceType: string, field: string, value: string) =>
//     dispatch(addToSchemaEnum(resourceType, field, value))
// });

// const mapStateToProps = (state: any) => ({
//     schema: state.schema
// });

// interface IProps {
//     schema: any;
//     addToSchemaEnum: any;
// }

// const connector = connect(mapStateToProps, mapDispatchToProps);

// class SoftwareFormComponent extends React.Component<IProps, any> {
//   componentWillMount() {
//     this.setState({id: '', programmingLanguage: []});
//   }

//   updateFormValue = (field: string) => (value: any) => {
//     this.setState({...this.state, [field]: value});
//   }

//   updateFormOptionsValue = (field: string) => (options: Option[]) => {
//     this.updateFormValue(field)(options.map((val) => val.value));
//   }

//   onNewOption = (resourceType: string, field: string) => (option: Option) => {
//     this.props.addToSchemaEnum(resourceType, field, option.value);
//   }

//   onInputChange(field: string): React.FormEventHandler<React.Component<any>> {
//     return (e: React.ChangeEvent<any>) => {
//       this.updateFormValue(field)(e.target.value);
//     };
//   }

//   schemaEnum(type: string, fieldName: string): string[] {
//     const field = this.props.schema[type].properties[fieldName];

//     return (field.type === 'array') ? (field.items.enum || []) : (field.enum || []);
//   }

//   render() {
//     return (
//       <div style={{maxWidth: '400px'}}>

//         <ControlLabel>ID</ControlLabel>
//         <FormControl
//           value={this.state.id}
//           onChange={this.onInputChange('id')}
//         />

//         <ControlLabel>Human-readable name</ControlLabel>
//         <FormControl value={this.state.name}/>

//         <ControlLabel>Description</ControlLabel>
//         <FormControl value={this.state.description}/>

//         <ControlLabel>tagLine</ControlLabel>
//         <FormControl value={this.state.tagLine}/>

//         <ControlLabel>codeRepository</ControlLabel>
//         <FormControl value={this.state.codeRepository}/>

//         <ControlLabel>nlescWebsite</ControlLabel>
//         <FormControl value={this.state.nlescWebsite}/>

//         <ControlLabel>documentationUrl</ControlLabel>
//         <FormControl value={this.state.website}/>

//         <ControlLabel>downloadUrl</ControlLabel>
//         <FormControl value={this.state.downloadUrl}/>

//         <ControlLabel>logo</ControlLabel>
//         <FormControl value={this.state.logo}/>

//         <ControlLabel>website</ControlLabel>
//         <FormControl value={this.state.website}/>

//         <ControlLabel>website</ControlLabel>
//         <FormControl value={this.state.website}/>

//         <ControlLabel>programmingLanguages</ControlLabel>
//         <AddableReactSelect
//           options={this.schemaEnum('software', 'programmingLanguage').map((lang) => ({ label: lang, value: lang}))}
//           multi={true}
//           value={this.state.programmingLanguage.map((val: string) => ({value: val, label: val}))}
//           onChange={this.updateFormOptionsValue('programmingLanguage')}
//           onNewOption={this.onNewOption('software', 'programmingLanguage')}
//         />
//       </div>
//     );
//   }
// }

// export const SoftwareForm = connector(SoftwareFormComponent);
