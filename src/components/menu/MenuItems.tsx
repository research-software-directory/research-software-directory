import * as React from 'react';
import { Button, Icon, Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {undoChanges} from '../../shared/resource/actions';
import {IResource} from '../../interfaces/resource';
import {ISchema} from '../../interfaces/json-schema';
import {IData, IStoreState} from '../../store';

interface IOwnProps {
  type: string;
  search: string;
}

interface IMappedProps {
  data: IData;
  oldData: IData;
  schema: { [key: string]: ISchema };
  location: Location;
}

interface IDispatchProps {
  undoChanges: any;
}

type IProps = IMappedProps & IDispatchProps & IOwnProps;

const dispatchToProps = { undoChanges };

const mapStateToProps = (state: IStoreState) => ({
  data:    state.current.data,
  oldData: state.data,
  schema:  state.schema,
  location: state.route.location
});

interface IMenuItemProps {
  item: IResource;
  label: string;
  active: boolean;
  hasChanged: boolean;
  onUndo: any;
  type: string;
}

const label = (type: string) => (item: any) => {
  if (type === 'publication') {
    return `${item.DOI || ''} ${item.title}`;
  } else {
    return item.name;
  }
};

const MenuItem = (props: IMenuItemProps) => {
  const undoButton = props.hasChanged ? (
    <Button
      icon={true}
      inverted={true}
      style={{float: 'right', fontSize: '60%'}}
      size="mini"
      onClick={props.onUndo}
    >
      <Icon name="reply"  />
    </Button>
  ) : null;

  return (
    <Menu.Item
      className={props.active ? 'active' : ''}
    >
      <Link to={`/${props.type}/${props.item.id}`} style={{display: 'block'}}>
        {props.label}
        {undoButton}
      </Link>

    </Menu.Item>
  );
};

class MenuItemsComponent extends React.PureComponent<IProps, {}> {
  undoChanges = (id: string) => (e: React.FormEvent<HTMLButtonElement>) => {
    this.props.undoChanges(this.props.type, id, this.props.oldData);
    e.preventDefault();
  }

  searchFilter = (search: string) => (item: IResource) => {
    const lowerCase = search.toLowerCase();

    return (label(this.props.type)(item).toLowerCase().indexOf(lowerCase) !== -1 ||
      ('description' in item && (item as any).description.toLowerCase().indexOf(lowerCase) !== -1));
  }

  render() {
    const items = this.props.data[this.props.type]
      .filter(this.searchFilter(this.props.search))
      .map((item) => {
        const oldEntry = (this.props.oldData[this.props.type].find((oldItem) => item.id === oldItem.id));
        const hasChanged = oldEntry !== item;

        return (
          <MenuItem
            key={item.id}
            item={item}
            label={label(this.props.type)(item)}
            type={this.props.type}
            active={this.props.location.pathname === item.id}
            hasChanged={hasChanged}
            onUndo={this.undoChanges(item.id)}
          />
        );
      });

    return (
      <div>{items}</div>
    );
  }
}

const connector = connect<IMappedProps, IDispatchProps, IOwnProps> (mapStateToProps, dispatchToProps);
export const MenuItems = connector(MenuItemsComponent);
