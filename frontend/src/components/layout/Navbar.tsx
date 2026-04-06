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
  { code: 'EN', label: 'English', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'AR', label: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629', flag: '\u{1F1F8}\u{1F1E6}' },
  { code: 'FR', label: 'Fran\u00E7ais', flag: '\u{1F1EB}\u{1F1F7}' },
  { code: 'DE', label: 'Deutsch', flag: '\u{1F1E9}\u{1F1EA}' },
  { code: 'ES', label: 'Espa\u00F1ol', flag: '\u{1F1EA}\u{1F1F8}' },
  { code: 'PT', label: 'Portugu\u00EAs', flag: '\u{1F1E7}\u{1F1F7}' },
  { code: 'ZH', label: '\u4E2D\u6587', flag: '\u{1F1E8}\u{1F1F3}' },
  { code: 'JA', label: '\u65E5\u672C\u8A9E', flag: '\u{1F1EF}\u{1F1F5}' },
  { code: 'KO', label: '\uD55C\uAD6D\uC5B4', flag: '\u{1F1F0}\u{1F1F7}' },
  { code: 'HI', label: '\u0939\u093F\u0928\u094D\u0926\u0940', flag: '\u{1F1EE}\u{1F1F3}' },
  { code: 'UR', label: '\u0627\u0631\u062F\u0648', flag: '\u{1F1F5}\u{1F1F0}' },
  { code: 'TR', label: 'T\u00FCrk\u00E7e', flag: '\u{1F1F9}\u{1F1F7}' },
  { code: 'RU', label: '\u0420\u0443\u0441\u0441\u043A\u0438\u0439', flag: '\u{1F1F7}\u{1F1FA}' },
  { code: 'IT', label: 'Italiano', flag: '\u{1F1EE}\u{1F1F9}' },
  { code: 'NL', label: 'Nederlands', flag: '\u{1F1F3}\u{1F1F1}' },
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: 'text.primary',
                  letterSpacing: '-0.02em',
                }}
              >
                Nexus<span style={{ color: '#C8622A' }}>AI</span>
              </Typography>
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
                      color: isActive ? '#C8622A' : 'text.secondary',
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
                        bgcolor: '#C8622A',
                        borderRadius: '2px 2px 0 0',
                      } : {},
                      '&:hover': {
                        color: isActive ? '#C8622A' : 'text.primary',
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
                <Box sx={{ px: 2, py: 1, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    App Language
                  </Typography>
                </Box>
                {LANGUAGES.map((lang) => (
                  <MenuItem
                    key={lang.code}
                    onClick={() => handleLangSelect(lang.code)}
                    selected={selectedLang === lang.code}
                    sx={{
                      fontSize: '0.9375rem',
                      py: 1,
                      '&.Mui-selected': {
                        bgcolor: 'rgba(200, 98, 42, 0.08)',
                        '&:hover': {
                          bgcolor: 'rgba(200, 98, 42, 0.12)',
                        },
                      },
                    }}
                  >
                    <Box component="span" sx={{ mr: 1 }}>{lang.flag}</Box>
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
                          bgcolor: '#C8622A',
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
                        color: '#9B2042',
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
                    {'Get Started \u2192'}
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
                      color: isActive ? '#C8622A' : 'inherit',
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
                  color: '#9B2042',
                  borderColor: '#9B2042',
                  '&:hover': {
                    borderColor: '#9B2042',
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
                {'Get Started \u2192'}
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
