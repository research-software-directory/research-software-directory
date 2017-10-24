import * as React from 'react';
import { Table } from 'semantic-ui-react';

interface IProps {
  data: {
    [key: string]: any;
  };
}

export const PropsTable = ({data}: IProps) => {
  const propTableRow = (key: string, value: string) => (
    <Table.Row key={key}>
      <Table.Cell>{key}</Table.Cell>
      <Table.Cell>{value}</Table.Cell>
    </Table.Row>
  );

  const propTableRows = Object.keys(data).map((key: string) =>
    propTableRow(key, JSON.stringify(data[key])));

  return (
    <Table celled={true} striped={true}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan={2}>Raw Data</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {propTableRows}
      </Table.Body>
    </Table>
  );
};