import * as React from 'react';
import { Button, Divider, Icon, Input, Menu } from 'semantic-ui-react';
import { NewItem } from './NewItem';
import { undoChanges } from './actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

interface IOwnProps {
  type: string;
  routeParams: any;
}

interface IState {
  open: boolean;
  search: string;
}

interface IMappedProps {
  data: any;
  oldData: any;
  schema: any;
}

interface IDispatchProps {
  undoChanges: any;
}

type IProps = IOwnProps & IMappedProps & IDispatchProps;

const dispatchToProps = { undoChanges };

const mapStateToProps = (state: any) => ({
  data:    state.current.data,
  oldData: state.data,
  schema:  state.schema
});

const connector = connect<IMappedProps, IDispatchProps, IOwnProps>(mapStateToProps, dispatchToProps);

class ResourceTypeMenuComponent extends React.PureComponent<IProps, IState> {
  constructor() {
    super();
    this.state = {open: false, search: ''};
  }

  undoChanges = (id: string) => (e: React.FormEvent<HTMLButtonElement>) => {
    this.props.undoChanges(this.props.type, id, this.props.oldData);
    e.preventDefault();
  }

  onSubmenuSearch = (e: any) => {
    this.setState({search: e.target.value});
  }

  menuField = (item: any) => {
    if (this.props.type === 'publication') {
      return `${item.DOI || ''} ${item.title}`;
    } else {
      return item.name;
    }
  }

  searchFilter = (search: string) => (item: any) => {
    const lowerCase = search.toLowerCase();

    return (this.menuField(item).toLowerCase().indexOf(lowerCase) !== -1 ||
      (item.description && item.description.toLowerCase().indexOf(lowerCase) !== -1));
  }

  toggleMenu = () => {
    this.setState({open: !this.state.open});
  }

  menuItem = (item: any) => {
    const oldEntry = (this.props.oldData[this.props.type].find((oldItem: any) => item.id === oldItem.id));
    const hasChanged = oldEntry !== item;
    const undoButton = hasChanged ? (
      <Button
        icon={true}
        inverted={true}
        style={{float: 'right', fontSize: '60%'}}
        size="mini"
        onClick={this.undoChanges(item.id)}
      >
        <Icon name="reply"  />
      </Button>
    ) : null;

    return (
      <Menu.Item
        key={item.id}
        className={this.props.routeParams.location.pathname === item.id ? 'active' : ''}
      >
        <Link to={`${item.id}`} style={{display: 'block'}}>
          {this.menuField(item)}
          {undoButton}
        </Link>

      </Menu.Item>
    );
  }

  header = () => (
    <Menu.Header
      style={{cursor: 'pointer', textTransform: 'capitalize'}}
      onClick={this.toggleMenu}
    >
      {this.props.type}
      <Icon
        name={`chevron ${this.state.open ? 'down' : 'up'}`}
        style={{float: 'right'}}
      />
    </Menu.Header>
  )

  render() {
    let subMenu = null;
    if (this.state.open) {
      const menuItems = this.props.data[this.props.type]
        .filter(this.searchFilter(this.state.search))
        .map(this.menuItem);

      subMenu = (
        <Menu className="submenu" inverted={true} vertical={true}>
          <Input
            className="submenu-search inverted"
            icon={<Icon name="search" inverted={true}/>}
            value={this.state.search}
            onChange={this.onSubmenuSearch}
          />
          <Divider/>
          {this.props.type !== 'publication' && <NewItem resourceType={this.props.type}/>}
          {menuItems}
        </Menu>
      );
    }

    return (
      <Menu.Item
        key={this.props.type}
        className={`${this.state.open ? 'active' : ''} resource_menu`}
      >
        {this.header()}
        {subMenu}
      </Menu.Item>
    );
  }
}

export const ResourceTypeMenu = connector(ResourceTypeMenuComponent);
