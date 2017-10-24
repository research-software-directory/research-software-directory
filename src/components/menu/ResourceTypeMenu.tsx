import * as React from 'react';
import { Divider, Icon, Input, Menu } from 'semantic-ui-react';
import { NewItemContainer } from '../../containers/menu/NewItemContainer';
import { MenuItemsContainer } from '../../containers/menu/MenuItemsContainer';
import  * as classNames from 'classnames';

// tslint:disable-next-line:no-require-imports no-var-requires
const AnimateHeight = require('react-animate-height').default;

interface IState {
  open: boolean;
  search: string;
}

interface IProps {
  type: string;
}

export class ResourceTypeMenu extends React.PureComponent<IProps, IState> {
  constructor() {
    super();
    this.state = {open: false, search: ''};
  }

  onSubmenuSearch = (e: any) => {
    this.setState({search: e.target.value});
  }

  toggleMenu = () => {
    this.setState({open: !this.state.open});
  }

  header = () => (
    <Menu.Header
      style={{cursor: 'pointer', textTransform: 'capitalize'}}
      onClick={this.toggleMenu}
    >
      {this.props.type}
      <Icon
        name={this.state.open ? 'chevron down' : 'chevron up'}
        style={{float: 'right'}}
      />
    </Menu.Header>
  )

  render() {
    let subMenu = null;
    if (true || this.state.open) {
      subMenu = (
          <Menu className="submenu" inverted={true} vertical={true} >
            <Input
              className="submenu-search inverted"
              icon={<Icon name="search" inverted={true}/>}
              value={this.state.search}
              onChange={this.onSubmenuSearch}
            />
            <Divider/>
            {this.props.type !== 'publication' && <NewItemContainer resourceType={this.props.type}/>}
            <MenuItemsContainer type={this.props.type} search={this.state.search} />
          </Menu>
      );
    }

    return (
      <Menu.Item
        key={this.props.type}
        className={classNames('resource_menu', {active: this.state.open})}
      >
        {this.header()}
        <AnimateHeight
          duration={1000}
          height={this.state.open ? 'auto' : 0}
        >
          {subMenu}
        </AnimateHeight>
      </Menu.Item>
    );
  }
}
