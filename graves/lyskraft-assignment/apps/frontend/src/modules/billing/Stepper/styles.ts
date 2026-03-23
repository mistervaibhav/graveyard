import styled from 'styled-components';
import { Stepper } from '@mantine/core';

export const StyledStepper = styled(Stepper)`
  width: 240px;
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 20px 24px;
`;

export const StyledStep = styled(Stepper.Step)`
  width: 100%;
  flex: 1;
`;
