import * as React from 'react';
import { Segment, Dimmer, Loader, Header, List, Icon } from 'semantic-ui-react';
import { getNewProjects, getNewPublications, getNewSoftware } from './actions';
import { connect } from 'react-redux';
import { Project } from './Project';
import { createNewItem } from '../../containers/shared/resource/actions';
import { transform } from './transform';
import { Link } from 'react-router-dom';

const dispatchToProps = ({
  getNewProjects,
  getNewPublications,
  getNewSoftware,
  createNewItem
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

  createPublication = (item: any) => () => {
    this.props.createNewItem('publication', item.key, transform(item) );
  }

  renderPublication = (item: any) => {
    const meta = item.meta.creatorSummary ? <b>{item.meta.creatorSummary}</b> : null;

    return (
      <List.Item key={item.key} style={{cursor: 'pointer'}} onClick={this.createPublication(item)}>
        <span>
          <Icon name="book" />
          <i>{item.data.itemType}</i>: {meta} {item.data.title}
        </span>
      </List.Item>
    );
  }

  renderSoftware = (item: any) => (
    <List.Item key={item.key}>
      {item.data.title}
    </List.Item>
  )

  renderItem = (type: string, item: any) => {
    switch (type) {
      case 'projects': return <Project key={item.zotero_key} item={item} />;
      case 'publications': return this.renderPublication(item);
      case 'software': return this.renderSoftware(item);
      default: return null;
    }
  }

  listItems = (type: string) => this.props[type].items.map((item: any) => this.renderItem(type, item));

  buttonPublicationStepper = () => this.props.publications.items.length > 0 && (
      <Link to="/publication_stepper">
        Step through publications
      </Link>
  )

  listContainer = (type: string) => (
    <Segment key={type}>
      <Header>new {type}</Header>
        <Dimmer active={this.props[type].status === 1}>
          <Loader />
        </Dimmer>
        {type === 'publications' && this.buttonPublicationStepper()}
        <List animated={true} divided={true}>{this.listItems(type)}</List>
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
