import * as React from 'react';
import { ISchema } from '../../interfaces/json-schema';
import { IResource } from '../../interfaces/resource';
import { IData } from '../../interfaces/misc';
import { MenuItem } from './MenuItem';

interface IProps {
  type: string;
  search: string;
  data: IData;
  oldData: IData;
  schema: { [key: string]: ISchema };
  location: Location;
  undoChanges(resourceType: string, id: string): any;
}

const label = (type: string) => (item: any) => {
  if (type === 'publication') {
    return `${item.DOI || ''} ${item.title}`;
  } else {
    return item.name;
  }
};

const sortByLabel = (type: string) => (a: any, b: any) => {
  return label(type)(a).localeCompare(label(type)(b));
};

export class MenuItems extends React.PureComponent<IProps, {}> {
  undoChanges = (id: string) => (e: React.FormEvent<HTMLButtonElement>) => {
    this.props.undoChanges(this.props.type, id);
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
      .sort(sortByLabel(this.props.type))
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
