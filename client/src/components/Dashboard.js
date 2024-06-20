 // src/components/Layout.js
import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import { styled } from '@mui/system';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link, Outlet } from 'react-router-dom';

const Root = styled('div')`
  display: flex;
`;

const AppBarStyled = styled(AppBar)`
  z-index: 1300;
`;

const DrawerStyled = styled(Drawer)`
  width: 240px;
  flex-shrink: 0;

  & .MuiDrawer-paper {
    width: 240px;
  }
`;

const ToolbarStyled = styled(Toolbar)`
  justify-content: space-between;
`;

const DashBoard = ({ children, onLogout, user }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Root>
      <AppBarStyled position="fixed">
        <ToolbarStyled>
          <Typography variant="h6" noWrap>
            Email Dashboard
          </Typography>
          <div>
            {user && (
              <>
                <IconButton color="inherit">
                  <AccountCircle />
                </IconButton>
                <Button color="inherit" onClick={onLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </ToolbarStyled>
      </AppBarStyled>
      <DrawerStyled variant="permanent" open={drawerOpen} onClose={toggleDrawer}>
        <Toolbar />
        <List>
          <ListItem button component={Link} to="/profile">
            <ListItemIcon><InboxIcon /></ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItem>
          <ListItem button component={Link} to="/profile/sent">
            <ListItemIcon><MailIcon /></ListItemIcon>
            <ListItemText primary="Sent Mail" />
          </ListItem>
        </List>
      </DrawerStyled>
      <main style={{ flexGrow: 1, padding: '16px', marginTop: '64px' }}>
        {children}
        <Outlet/>
      </main>
    </Root>
  );
};

export default DashBoard;
