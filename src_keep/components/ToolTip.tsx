// Simple overlay, gets props injected by react-overlays

import * as React from 'react';

const TooltipStyle = {
  position: 'absolute',
  padding: '0 5px'
};

const TooltipInnerStyle = {
  padding: '3px 8px',
  backgroundColor: 'white',
  border: '1px solid #ccc'
};

const PlacementStyles = {
  left: {
    tooltip: { marginLeft: -3, padding: '0 5px' }
  },
  right: {
    tooltip: { marginRight: 3, padding: '0 5px' }
  },
  top: {
    tooltip: { marginTop: -3, padding: '5px 0' }
  },
  bottom: {
    tooltip: { marginBottom: 3, padding: '5px 0' }
  }
};

export interface IToolTipProps {
  placement?: 'left' | 'right' | 'top' | 'bottom';
  arrowOffsetLeft?: any;
  arrowOffsetTop?: any;
  positionLeft?: any;
  positionTop?: any;
  children?: any;
  style?: any;
}

export const ToolTip = ( props: IToolTipProps ) => {
  const placementStyle = PlacementStyles[props.placement || 'top'];

  const {
    style,
    children
  } = props;

  return (
    <div style={{...TooltipStyle, ...placementStyle.tooltip, ...style}}>
      <div style={TooltipInnerStyle}>
        {children}
      </div>
    </div>
  );
};
