import * as React from 'react';
import { Segment, Dimmer, Loader, Header, List, Button} from 'semantic-ui-react';
import { getNewProjects, getNewPublications, getNewSoftware } from './actions';
import {connect} from 'react-redux';

const dispatchToProps = ({
  getNewProjects,
  getNewPublications,
  getNewSoftware
});

const mapStateToProps = (state: any) => ({
  projects: state.zotero.projects,
  publications: state.zotero.publications,
  software: state.zotero.software
});

interface IStateProps {
  projects: any;
  publications: any;
  software: any;
}

type IDispatchProps = typeof dispatchToProps;

const connector = connect(mapStateToProps, dispatchToProps);

export const ZoteroImporter = connector(class extends React.PureComponent<IDispatchProps & IStateProps> {
  componentWillMount() {
    this.props.getNewProjects();
    this.props.getNewSoftware();
    this.props.getNewPublications();
  }

  renderProject = (item: any) => (
    <List.Item icon="lab">
      {item.name}
      <Button floated="right" size="tiny">Import</Button>
    </List.Item>
  )

  renderPublication = (item: any) => {
    const meta = item.meta.creatorSummary ? <b>{item.meta.creatorSummary}</b> : null;

    return (
      <List.Item>
        <i>{item.data.itemType}</i>: {meta} {item.data.title}
      </List.Item>
    );
  }

  renderSoftware = (item: any) => (
    <List.Item>
      {item.data.title}
    </List.Item>
  )

  renderItem = (type: string, item: any) => {
    switch (type) {
      case 'projects': return this.renderProject(item);
      case 'publications': return this.renderPublication(item);
      case 'software': return this.renderSoftware(item);
      default: return null;
    }
  }

  listItems = (type: string) => this.props[type].items.map((item: any) => this.renderItem(type, item));

  listContainer = (type: string) => (
    <Segment>
      <Header>new {type}</Header>
        <Dimmer active={this.props[type].status === 1}>
          <Loader />
        </Dimmer>
        <List>{this.listItems(type)}</List>
    </Segment>
  )

  render() {
    return (
      <Segment.Group>
        {['projects', 'publications', 'software'].map((type: string) => this.listContainer(type))}
      </Segment.Group>
    );
  }
});
