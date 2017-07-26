import * as React from 'react';
import * as ReactSelect from 'react-select';

interface IProps extends ReactSelect.ReactCreatableSelectProps {
  onNewOption(option: ReactSelect.Option): void;
}

const onReactSelectChange = (
  onNewOption: (option: ReactSelect.Option) => void,
  original?: (newValue: ReactSelect.Option | ReactSelect.Option[] | null) => void
) => (value: any[]) => {
  if (value.length > 0) {
    const lastElm = value.slice(-1)[0];
    if (lastElm.className && lastElm.className === 'Select-create-option-placeholder') {
      const newOption = { ...value.splice(-1)[0] };
      delete newOption.className;
      if (original) { original([...value, newOption]); }
      onNewOption(newOption);

      return;
    }
  }
  if (original) { original(value); }
};

export const AddableReactSelect = (props: IProps) => {
  const { onChange, onNewOption, ...otherProps } = props;

  return <ReactSelect.Creatable onChange={onReactSelectChange(onNewOption, onChange)} multi={true} {...otherProps} />;
};
