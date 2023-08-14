import Link from 'next/link';
import styled from 'styled-components';
import { Button, TextField, Container, Typography, Grid } from '@mui/material';
import Image from "next/image"

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
      <div style={{backgroundColor: "white", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <img
          src="/img/mercado-pago.svg"
          alt="Logo Mercado Pago"
          style={{width: "70px", height: "auto", borderRadius: "10px", marginRight:"5px",marginTop:"1px" ,marginLeft:"3px"}}
        />
      </div>
      <div>
        <Link href="/login">
          <Button style={{height: "1px", color: "#333"}}>
            Login
          </Button>
        </Link>
      </div>
    </FooterContainer>
  );
}


export default Footer;
