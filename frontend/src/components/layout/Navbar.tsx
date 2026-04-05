'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from '@mui/material';
import { Menu as MenuIcon, Close, Language as LanguageIcon, KeyboardArrowDown, Person, Settings, Logout } from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

const NAV_LINKS = [
  { label: 'Chat Hub', href: '/chat' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Discover New', href: '/discover' },
  { label: 'Agents', href: '/agents' },
];

const LANGUAGES = [
  { code: 'EN', label: 'English' },
  { code: 'ES', label: 'Español' },
  { code: 'FR', label: 'Français' },
  { code: 'DE', label: 'Deutsch' },
  { code: 'IT', label: 'Italiano' },
  { code: 'PT', label: 'Português' },
  { code: 'JA', label: '日本語' },
  { code: 'KO', label: '한국어' },
  { code: 'ZH', label: '中文' },
  { code: 'AR', label: 'العربية' },
  { code: 'HI', label: 'हिन्दी' },
  { code: 'RU', label: 'Русский' },
  { code: 'NL', label: 'Nederlands' },
  { code: 'TR', label: 'Türkçe' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
  const [selectedLang, setSelectedLang] = useState('EN');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAuth();

  const handleLangClick = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchor(event.currentTarget);
  };

  const handleLangClose = () => {
    setLangAnchor(null);
  };

  const handleLangSelect = (code: string) => {
    setSelectedLang(code);
    handleLangClose();
  };

  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchor(event.currentTarget);
  };

  const handleUserClose = () => {
    setUserAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleUserClose();
    router.push('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid',
          borderColor: 'rgba(0,0,0,0.08)',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 }, justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box
                component="span"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #C8622A 0%, #E8854A 100%)',
                  flexShrink: 0,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <path
                    d="M12 8L8 10.5V15.5L12 18L16 15.5V10.5L12 8Z"
                    fill="white"
                    fillOpacity="0.9"
                  />
                  <circle cx="12" cy="12" r="2" fill="white" />
                </svg>
              </Box>
              <Box
                component="span"
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.4rem',
                  letterSpacing: '-0.03em',
                  color: 'text.primary',
                }}
              >
                Nexus<span style={{ color: '#C8622A' }}>AI</span>
              </Box>
            </Link>
          </Box>

          {/* Desktop Nav - Center */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Button
                    key={link.href}
                    component={Link}
                    href={link.href}
                    sx={{
                      color: isActive ? 'primary.main' : 'text.secondary',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.9375rem',
                      px: 2,
                      py: 1,
                      textTransform: 'none',
                      position: 'relative',
                      '&::after': isActive ? {
                        content: '""',
                        position: 'absolute',
                        bottom: -1,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60%',
                        height: 2,
                        bgcolor: 'primary.main',
                        borderRadius: '2px 2px 0 0',
                      } : {},
                      '&:hover': {
                        color: isActive ? 'primary.main' : 'text.primary',
                        bgcolor: isActive ? 'rgba(200,98,42,0.06)' : 'rgba(0,0,0,0.04)',
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* Right side - Language + Auth Buttons */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={handleLangClick}
                startIcon={<LanguageIcon />}
                endIcon={<KeyboardArrowDown />}
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: '0.9375rem',
                  textTransform: 'none',
                  px: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                {selectedLang}
              </Button>
              <Menu
                anchorEl={langAnchor}
                open={Boolean(langAnchor)}
                onClose={handleLangClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 150,
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  },
                }}
              >
                {LANGUAGES.map((lang) => (
                  <MenuItem
                    key={lang.code}
                    onClick={() => handleLangSelect(lang.code)}
                    selected={selectedLang === lang.code}
                    sx={{
                      fontSize: '0.9375rem',
                      py: 1.5,
                      '&.Mui-selected': {
                        bgcolor: 'rgba(200, 98, 42, 0.08)',
                        '&:hover': {
                          bgcolor: 'rgba(200, 98, 42, 0.12)',
                        },
                      },
                    }}
                  >
                    {lang.label}
                  </MenuItem>
                ))}
              </Menu>

              {isAuthenticated ? (
                <>
                  <Button
                    onClick={handleUserClick}
                    startIcon={
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: 'primary.main',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {user ? getInitials(user.name) : 'U'}
                      </Avatar>
                    }
                    endIcon={<KeyboardArrowDown />}
                    sx={{
                      color: 'text.primary',
                      fontWeight: 500,
                      fontSize: '0.9375rem',
                      textTransform: 'none',
                      px: 1.5,
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.04)',
                      },
                    }}
                  >
                    {user?.name}
                  </Button>
                  <Menu
                    anchorEl={userAnchor}
                    open={Boolean(userAnchor)}
                    onClose={handleUserClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 200,
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>
                        {user?.name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        {user?.email}
                      </Typography>
                    </Box>
                    <MenuItem
                      component={Link}
                      href="/profile"
                      onClick={handleUserClose}
                      sx={{ fontSize: '0.9375rem', py: 1.5 }}
                    >
                      <Person sx={{ mr: 1.5, fontSize: 20 }} />
                      Profile
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      href="/settings"
                      onClick={handleUserClose}
                      sx={{ fontSize: '0.9375rem', py: 1.5 }}
                    >
                      <Settings sx={{ mr: 1.5, fontSize: 20 }} />
                      Settings
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        fontSize: '0.9375rem',
                        py: 1.5,
                        color: 'error.main',
                        '&:hover': {
                          bgcolor: 'rgba(155, 32, 66, 0.08)',
                        },
                      }}
                    >
                      <Logout sx={{ mr: 1.5, fontSize: 20 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    href="/login"
                    sx={{
                      color: 'text.primary',
                      fontWeight: 500,
                      fontSize: '0.9375rem',
                      textTransform: 'none',
                      px: 2,
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.04)',
                      },
                    }}
                  >
                    Sign in
                  </Button>
                  <Button
                    component={Link}
                    href="/register"
                    variant="contained"
                    disableElevation
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      px: 2.5,
                      py: 1,
                      borderRadius: '8px',
                    }}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </Box>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.default',
            p: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton onClick={() => setMobileOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <List>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <ListItem key={link.href} disablePadding>
                <ListItemButton
                  component={Link}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive ? 'rgba(200,98,42,0.08)' : 'transparent',
                    '&:hover': { bgcolor: isActive ? 'rgba(200,98,42,0.12)' : 'rgba(0,0,0,0.04)' },
                  }}
                >
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'primary.main' : 'inherit',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {isAuthenticated ? (
            <>
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>
                  {user?.name}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                  {user?.email}
                </Typography>
              </Box>
              <Button
                component={Link}
                href="/profile"
                variant="outlined"
                fullWidth
                onClick={() => setMobileOpen(false)}
                startIcon={<Person />}
                sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
              >
                Profile
              </Button>
              <Button
                component={Link}
                href="/settings"
                variant="outlined"
                fullWidth
                onClick={() => setMobileOpen(false)}
                startIcon={<Settings />}
                sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
              >
                Settings
              </Button>
              <Button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                variant="outlined"
                fullWidth
                startIcon={<Logout />}
                sx={{
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  color: 'error.main',
                  borderColor: 'error.main',
                  '&:hover': {
                    borderColor: 'error.main',
                    bgcolor: 'rgba(155, 32, 66, 0.08)',
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                href="/login"
                variant="outlined"
                fullWidth
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Button>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                fullWidth
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Button>
            </>
          )}
        </Box>
      </Drawer>

      {/* Toolbar spacer */}
      <Toolbar />
    </>
  );
}
