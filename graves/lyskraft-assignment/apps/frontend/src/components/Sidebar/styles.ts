import styled from 'styled-components';

export const Wrapper = styled.nav`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f7f7f5;
  width: 240px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
`;

export const SidebarBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px 24px;
  gap: 8px;

  a {
    text-decoration: none;
  }
`;

export const SidebarFooter = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 20px 24px;
`;
