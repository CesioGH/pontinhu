import Link from 'next/link';
import styled from 'styled-components';

const FooterContainer = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #333;
  color: white;
  text-align: center;
  display: flex;
  justify-content: space-between;
  padding: 10px;

  @media (max-width: 600px) {
    padding: 5px;
    font-size: 0.8em;
  }
`;

const FooterLink = styled.p`
  color: #333;

  &:hover {
    color: #555;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <div>@Pontinho´s</div>
      <div>
        <Link href="/login">
          Login
        </Link>
      </div>
    </FooterContainer>
  );
}

export default Footer;
