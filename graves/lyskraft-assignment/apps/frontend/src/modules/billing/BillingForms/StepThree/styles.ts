import styled, { css } from 'styled-components';

interface IStaffSelectButtonWrapperProps {
  $isSelected: boolean;
}

export const StaffSelectButtonWrapper = styled.div<IStaffSelectButtonWrapperProps>`
  width: 100%;
  border-radius: 8px;
  padding: var(--mantine-spacing-md);
  color: var(--mantine-color-black);
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: transform 200ms ease-in-out;
  cursor: pointer;

  & :hover {
    background: var(--mantine-color-gray-0);
  }

  & :active {
    transform: scale(0.98);
  }

  ${(props) =>
    props.$isSelected &&
    css`
      border: 1px solid #333333;
    `}
`;
