import * as React from 'react';
import { Table } from 'semantic-ui-react';

interface IProps {
  data: {
    [key: string]: any;
  };
  title: string | undefined;
}

export const PropsTable = ({data, title}: IProps) => {
  const propTableRow = (key: string, value: string) => (
    <Table.Row key={key}>
      <Table.Cell>{key}</Table.Cell>
      <Table.Cell>{value}</Table.Cell>
    </Table.Row>
  );

  const propsTableRows = Object.keys(data).map(key =>
    propTableRow(key, JSON.stringify(data[key]))
  );

  return (
    <Table celled={true} striped={true}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan={2}>{title || ''}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {propsTableRows}
      </Table.Body>
    </Table>
  );
};