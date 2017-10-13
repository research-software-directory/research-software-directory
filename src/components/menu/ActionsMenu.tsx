import * as React from 'react';
import { Divider, Icon, Menu } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

interface IState {
  open: boolean;
}

export class ActionsMenu extends React.PureComponent<{}, IState> {
  constructor() {
    super();
    this.state = {open: false};
  }

  toggleMenu = () => {
    this.setState({open: !this.state.open});
  }

  header = () => (
    <Menu.Header
      style={{cursor: 'pointer', textTransform: 'capitalize'}}
      onClick={this.toggleMenu}
    >
      Actions
      <Icon
        name={`chevron ${this.state.open ? 'down' : 'up'}`}
        style={{float: 'right'}}
      />
    </Menu.Header>
  )

  render() {
    let subMenu = null;
    if (this.state.open) {
      subMenu = (
        <Menu className="submenu" inverted={true} vertical={true}>
          <Divider/>
          <Menu.Item as={Link}><Icon name="image" /> asd</Menu.Item>
        </Menu>
      );
    }

    return (
      <Menu.Item
        className={`${this.state.open ? 'active' : ''} resource_menu`}
      >
        {this.header()}
        {subMenu}
      </Menu.Item>
    );
  }
}
