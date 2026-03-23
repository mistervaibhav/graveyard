import styled from 'styled-components';

export const Wrapper = styled.header`
  height: 60px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 20px 24px;
  /* justify-content: flex-end; */
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
