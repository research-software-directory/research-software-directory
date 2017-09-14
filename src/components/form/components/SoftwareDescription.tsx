import * as React from 'react';
import { MarkDownInput} from './MarkDownInput';

interface IProps {
  value: any;
  label: string;
  className?: string;
  onChange?(value: any): void;
}

export class SoftwareDescription extends React.PureComponent<IProps> {
  render() {
    return (
      <div>
        <MarkDownInput {...this.props} />
      </div>
    );
  }
}
