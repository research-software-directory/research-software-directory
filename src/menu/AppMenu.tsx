import { saveChanges } from './actions';

import * as React from 'react';

import { connect } from 'react-redux';

import './AppMenu.css';

import 'semantic-ui-css/semantic.min.css';
import { Button, Divider, Icon, Image, Input, Loader, Menu } from 'semantic-ui-react';

import * as update from 'immutability-helper';

import { Link } from 'react-router-dom';

import { resourceTypes } from '../constants';

import { NewItem } from './NewItem';

const mapStateToProps: (state: any, ownProps: {routeParams: any}) => any = (state: any) => ({
  data:    state.current.data,
  numAsyncs: state.async.filter((asyncAction: any) => asyncAction.status !== 'DONE').length,
  oldData: state.data,
  schema:  state.schema,
  user:    state.auth.user,
});

const dispatchToProps = {
  saveChanges: () => saveChanges
};

const connector = connect(mapStateToProps, dispatchToProps );

interface IProps {
  data: any;
  numAsyncs: number;
  oldData: any;
  schema: any;
  user: any;
  routeParams: any;
  saveChanges(): void;
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

  menuItem = (type: string) => (item: any) => {
    const oldEntry = (this.props.oldData[type].find((oldItem: any) => item.id === oldItem.id));
    const hasChanged = oldEntry !== item;

    return (
        <Menu.Item
          key={item.id}
          className={this.props.routeParams.location.pathname === item.id ? 'active' : ''}
        >
          <Link to={`${item.id}`} style={{display: 'block'}}>
            {item.name}
            {hasChanged && <Icon name="pencil" style={{float: 'right'}} />}
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
    let subMenu = null;
    if (this.state.menu[type].open) {
      const menuItems = this.props.data[type]
        .filter((item: any) => item.id !== '_new')
        .filter(this.searchFilter(this.state.menu[type].search))
        .map(this.menuItem(type));

      subMenu = (
        <Menu className="submenu" inverted={true} vertical={true}>
          <Input
            className="submenu-search inverted"
            icon={<Icon name="search" inverted={true}/>}
            value={this.state.menu[type].search}
            onChange={this.onSubmenuSearch(type)}
          />
          <Divider />
          <NewItem resourceType={type} />
          {menuItems}
        </Menu>
      );
    }

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

  save = () => {
    // console.log(this.props.data, this.props.oldData);
    this.props.saveChanges();
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
            <Loader inline={true} active={this.props.numAsyncs>0} />
            <Button
              floated="right"
              inverted={true}
              color="red"
              size="tiny"
              disabled={this.props.data === this.props.oldData}
              onClick={this.save}
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
