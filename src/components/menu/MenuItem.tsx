import * as React from 'react';
import { Button, Icon, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IResource } from '../../interfaces/resource';
import * as classNames from 'classnames';
import { ISoftware } from '../../interfaces/resources/software';
import { IProject } from '../../interfaces/resources/project';

interface IProps {
  item: IResource;
  label: string;
  active: boolean;
  hasChanged: boolean;
  onUndo: any;
  type: string;
}

export const MenuItem = (props: IProps) => {
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
      className={classNames({active : props.active})}
    >
      <Link to={`/${props.type}/${props.item.id}`} style={{display: 'block'}}>
        {(props.type === 'software' && !(props.item as ISoftware).tagLine) && <Icon color="red" name="warning" />}
        {(props.type === 'project' && !(props.item as IProject).zoteroKey) && <Icon color="red" name="warning" />}
        {props.label}
        {undoButton}
      </Link>

    </Menu.Item>
  );
};
