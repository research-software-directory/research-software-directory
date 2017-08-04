import * as React from 'react';

import { connect } from 'react-redux';

import './AppMenu.css';

import 'semantic-ui-css/semantic.min.css';
import { Button, Icon, Image, Input, Menu } from 'semantic-ui-react';

import * as update from 'immutability-helper';

import { Link } from 'react-router-dom';

const mapStateToProps: (state: any, ownProps: {routeParams: any}) => any = (state: any) => ({
  changes: state.current.changes,
  data:   state.data,
  schema: state.schema,
  user:   state.auth.user
});

const connector = connect(mapStateToProps, { } );

interface IProps {
  data: any;
  schema: any;
  user: any;
  changes: string[];
  routeParams: any;
}

interface IMenuState {
  open: boolean;
  search: string;
}

interface IState {
  menu: {
    [index: string]: IMenuState;
  };
}

const resourceTypes = ['software', 'person', 'project'];

class AppMenuComponent extends React.Component<IProps, IState> {
  componentWillMount() {
    const initialState = {menu: Object.assign({}, ...resourceTypes.map((type) => ({[type]:
      {
        open: false,
        search: ''
      }
    }))) };
    this.setState(initialState);
  }

  menuItem = (item: any) => {
    return (
        <Menu.Item
          key={item.id}
          className={this.props.routeParams.location.pathname === item.id ? 'active' : ''}
        >
          <Link to={`${item.id}`} style={{display: 'block'}}>
            {item.name}
            {this.props.changes.indexOf(item.id) !== -1 && <Icon name="pencil" style={{float: 'right'}} />}
          </Link>

        </Menu.Item>
    );
  }

  toggleMenu = (type: string) => () => {
    this.setState(update(this.state, { menu: { [type]: { open: { $apply: (val: boolean) => !val }}}}));
  }

  resourceTypeHeader = (type: string) => {
    return (
      <Menu.Header
        style={{cursor: 'pointer', textTransform: 'capitalize'}}
        onClick={this.toggleMenu(type)}
      >
        {type}
        <Icon
          name={`chevron ${this.state.menu[type].open ? 'down' : 'up'}`}
          style={{float: 'right'}}
        />
      </Menu.Header>
    );
  }

  onSubmenuSearch = (type: string) => (e: any) => {
    this.setState(update(this.state, { menu: { [type]: { search: { $set: e.target.value }}}}));
  }

  searchFilter = (search: string) => (item: any) => {
    const lowerCase = search.toLowerCase();

    return (item.name.toLowerCase().indexOf(lowerCase) !== -1 ||
      item.description.toLowerCase().indexOf(lowerCase) !== -1);
  }

  resourceTypeMenu = (type: string) => {

    const subMenu = this.state.menu[type].open
    ? (
      <Menu className="submenu" inverted={true} vertical={true}>
        <Input
          className="submenu-search inverted"
          icon={<Icon name="search" inverted={true}/>}
          value={this.state.menu[type].search}
          onChange={this.onSubmenuSearch(type)}
        />
        <Button size="mini" inverted={true} >+ New</Button>
        {this.props.data[type].filter(this.searchFilter(this.state.menu[type].search)).map(this.menuItem)}
      </Menu>
    ) : null;

    return  (
      <Menu.Item
        key={type}
        className={`${this.state.menu[type].open ? 'active' : ''} resource_menu`}
      >
        {this.resourceTypeHeader(type)}
        {subMenu}
      </Menu.Item>
    );
  }

  render() {
      return (
        <Menu
          id="main_menu"
          vertical={true}
          inverted={true}
          className="main_menu"
        >
          <Menu.Item>
            <Image avatar={true} src={this.props.user.avatar_url} />&nbsp;
            {this.props.user.name}
            <Button
              floated="right"
              inverted={true}
              color="red"
              size="tiny"
              disabled={this.props.changes.length === 0}
            >
              Save
            </Button>
          </Menu.Item>
          <Menu.Item name="home" as={Link} to="/" >
            <Icon name="home" />
            Home
          </Menu.Item>
          {resourceTypes.map(this.resourceTypeMenu)}
        </Menu>
      );
    }
  }

export const AppMenu = connector(AppMenuComponent);
