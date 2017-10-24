import * as React from 'react';
import { Segment, Button } from 'semantic-ui-react';
import { transform } from './transform';
import { IPublication } from '../../interfaces/resources/publication';
import { PublicationContainer } from '../../containers/publications/PublicationContainer';

interface IProps {
  zoteroPublications: any;
  publications: IPublication[];
  getNewPublications(): any;
  createNewItem(resourceType: string,
                id: string,
                fields?: object,
                navigateTo?: boolean): any;
}

interface IState {
  currentID: number;
}

export class Stepper extends React.PureComponent<IProps, IState> {
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

  componentWillReceiveProps(nextProps: IProps) {
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
      return <PublicationContainer id={publication.id} />;
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
