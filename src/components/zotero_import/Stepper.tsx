import * as React from 'react';
import { connect } from 'react-redux';
import { Segment, Button } from 'semantic-ui-react';
import {getNewPublications} from './actions';
import {transform} from './transform';
import {createNewItem} from '../../shared/resource/actions';
import {IPublication} from '../../interfaces/resources/publication';
import {Publication} from '../publications/Publication';

interface IMappedProps {
  zoteroPublications: any;
  publications: IPublication[];
}

interface IState {
  currentID: number;
}

const dispatchToProps = { getNewPublications, createNewItem };

type IDispatchProps = typeof dispatchToProps;

const mapStateToProps = (state: any) => ({
    zoteroPublications: state.zotero.publications.items,
    publications: state.current.data.publication
});

const connector = connect<IMappedProps, IDispatchProps>(mapStateToProps, dispatchToProps);

class StepperComponent extends React.PureComponent<IMappedProps&IDispatchProps, IState> {
  constructor() {
    super();
    this.state = {currentID: 0};
  }

  componentWillMount() {
    if (this.props.zoteroPublications.length === 0) {
      this.props.getNewPublications();
    } else {
      this.importPublication(0);
    }
  }

  componentWillReceiveProps(nextProps: IMappedProps&IDispatchProps) {
    if (this.props.zoteroPublications !== nextProps.zoteroPublications) {
      this.importPublication(0, nextProps);
    }
  }

  importPublication = (id: number, props = this.props) => {
    this.setState({currentID: id});
    const item = props.zoteroPublications[id];
    if (!this.findPublication(id)) {
      this.props.createNewItem('publication', item.key, transform(item), false);
    }
  }

  processPublication = (id: number) => () => this.importPublication(id);

  findPublication = (id: number) => {
    const zoteroItem = this.props.zoteroPublications[id];

    return zoteroItem && this.props.publications.find((pub) => pub.zotero_key === zoteroItem.key);
  }

  renderPublication = () => {
    const publication = this.findPublication(this.state.currentID);
    if (publication) {
      return <Publication id={publication.id} />
    } else {
      return null;
    }
  }

  render() {
    return (
      <div>
        {this.state.currentID + 1} / {this.props.zoteroPublications.length}
        <Button
          disabled={this.state.currentID === 0}
          onClick={this.processPublication(this.state.currentID - 1)}
        >
          Previous
        </Button>
        <Button
          disabled={this.state.currentID + 1 >= this.props.zoteroPublications.length}
          onClick={this.processPublication(this.state.currentID + 1)}
        >
          Next
        </Button>

        <Segment>
          {this.renderPublication()}
        </Segment>
      </div>
    );
  }
}

export const Stepper = connector(StepperComponent);
