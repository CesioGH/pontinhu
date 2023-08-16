// HeaderAdm.js

import { AppBar, Toolbar, Typography, IconButton, Badge, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MailIcon from '@mui/icons-material/Mail';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { styled } from '@mui/system';
import Image from 'next/image';
import Link from 'next/link';


const HeaderAdm = ({unreadCount}) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const StyledLink = styled(Link)`
  img {
      width: 200px;
      height: auto;
  }

  @media (max-width: 768px) {
      img {
          width: 150px;
          height: auto;
      }
  }
`;

  return (
    <AppBar position="static">
      <Toolbar>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { handleMenuClose(); router.push('/verCompras'); }}>Ver compras</MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); router.push('/resumos'); }}>Cadastrar Resumos</MenuItem>
        </Menu>
        <div style={{display:"flex",width:"100vw", flexDirection:"row", justifyContent:"space-between" }} >

         <StyledLink href="/" passHref>
          <Image
                src="/img/logo1-removebg-preview.png"
                width={270}
                height={150}
                alt="Pontinhos"
            />
         </StyledLink>

        <div style={{display:"flex", flexDirection:"row" ,justifyContent:"flex-end" }} >
            <IconButton style={{marginRight:"20px"}} color="inherit" onClick={() => router.push('/adminDashboard')}>
               <Badge badgeContent={unreadCount} color="secondary">
                  <MailIcon />
                     </Badge>
            </IconButton >
            <IconButton style={{marginRight:"20px"}} edge="start" color="inherit" aria-label="menu" onClick={handleMenuClick}>
                  <MenuIcon />
            </IconButton>
        
         </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderAdm;
