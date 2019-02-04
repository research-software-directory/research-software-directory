import * as React from "react";
import styled from "styled-components";

interface IProps {
  message: string;
}

export const Help = ({ message }: IProps) => (
  <StyledDiv dangerouslySetInnerHTML={{ __html: message }} />
);

const StyledDiv = styled.div`
  color: gray;
`;
