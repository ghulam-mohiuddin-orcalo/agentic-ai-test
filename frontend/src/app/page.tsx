import { Box, Container, Typography } from '@mui/material';
import WelcomeOverlay from '@/components/hero/WelcomeOverlay';
import HeroSearchCard from '@/components/hero/HeroSearchCard';
import StatsBar from '@/components/hero/StatsBar';
import FeaturedModels from '@/components/landing/FeaturedModels';
import BuiltForBuilders from '@/components/landing/BuiltForBuilders';
import BrowseByLab from '@/components/landing/BrowseByLab';
import FlagshipComparison from '@/components/landing/FlagshipComparison';
import TrendingModels from '@/components/landing/TrendingModels';
import BudgetTiers from '@/components/landing/BudgetTiers';
import UseCases from '@/components/landing/UseCases';
import NewsletterCTA from '@/components/landing/NewsletterCTA';

export default function HomePage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <WelcomeOverlay />

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: '3rem', md: '4rem' },
          pb: { xs: '2rem', md: '3rem' },
          background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(200,98,42,0.08) 0%, transparent 60%)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dot pattern overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.25,
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Live models badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              background: 'white',
              border: '1px solid rgba(0,0,0,0.10)',
              borderRadius: '2rem',
              padding: '0.375rem 1.125rem',
              fontSize: '0.8rem',
              color: '#5A5750',
              mb: { xs: 2.5, md: 3 },
              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.03)',
              animation: 'fadeUp 0.6s ease both',
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                bgcolor: '#2E9E5B',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, letterSpacing: '-0.01em' }}>
              347 models live &middot; Updated daily
            </Typography>
          </Box>

          {/* Main heading */}
          <Typography
            variant="h1"
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontSize: { xs: 'clamp(2.25rem, 6vw, 3.5rem)', md: 'clamp(3rem, 6.5vw, 5.5rem)' },
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              maxWidth: 800,
              mx: 'auto',
              mb: 1.5,
              animation: 'fadeUp 0.6s ease 0.1s both',
            }}
          >
            Find your perfect{' '}
            <Box component="span" sx={{ color: '#C8622A' }}>
              AI model
            </Box>
            <br />
            with guided discovery
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              color: '#5A5750',
              maxWidth: 520,
              mx: 'auto',
              mb: { xs: 2.5, md: 3.5 },
              fontWeight: 400,
              lineHeight: 1.6,
              animation: 'fadeUp 0.6s ease 0.2s both',
            }}
          >
            You don&apos;t need to know anything about AI to get started. Just click the box below — we&apos;ll do the rest together.
          </Typography>

          {/* Hero Search Card */}
          <Box sx={{ maxWidth: 900, mx: 'auto', mb: 1, animation: 'fadeUp 0.6s ease 0.3s both' }}>
            <HeroSearchCard />
          </Box>

          {/* Stats Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'center', animation: 'fadeUp 0.6s ease 0.4s both' }}>
            <StatsBar />
          </Box>
        </Container>
      </Box>

      {/* Featured Models */}
      <Box sx={{ width: '100%', bgcolor: 'background.paper', py: '4rem' }}>
        <Container maxWidth="lg">
          <FeaturedModels />
        </Container>
      </Box>

      {/* Built for Builders */}
      <Box sx={{ width: '100%', py: '4rem' }}>
        <Container maxWidth="lg">
          <BuiltForBuilders />
        </Container>
      </Box>

      {/* Browse by Lab */}
      <Box sx={{ width: '100%', bgcolor: 'background.paper', py: '4rem' }}>
        <Container maxWidth="lg">
          <BrowseByLab />
        </Container>
      </Box>

      {/* Flagship Comparison */}
      <Box sx={{ width: '100%', py: '4rem' }}>
        <Container maxWidth="lg">
          <FlagshipComparison />
        </Container>
      </Box>

      {/* Trending */}
      <Box sx={{ width: '100%', bgcolor: 'background.paper', py: '4rem' }}>
        <Container maxWidth="lg">
          <TrendingModels />
        </Container>
      </Box>

      {/* Budget Tiers */}
      <Box sx={{ width: '100%', py: '4rem' }}>
        <Container maxWidth="lg">
          <BudgetTiers />
        </Container>
      </Box>

      {/* Use Cases */}
      <Box sx={{ width: '100%', bgcolor: 'background.paper', py: '4rem' }}>
        <Container maxWidth="lg">
          <UseCases />
        </Container>
      </Box>

      {/* Newsletter CTA */}
      <NewsletterCTA />
    </Box>
  );
}
