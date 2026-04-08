'use client';

import { Box, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import HeroSearchCard from '@/components/hero/HeroSearchCard';
import SuggestedQuestionsPanel from '@/components/hero/SuggestedQuestionsPanel';
import AgentPanel from '@/components/hero/AgentPanel';
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
  const { t } = useTranslation();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          pt: 8,
          pb: 6,
          background: 'linear-gradient(180deg, #F4F2EE 0%, #ECEAE4 100%)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant="h1"
              sx={{
                mb: 2,
                color: 'text.primary',
              }}
            >
              {t('home.hero.title')}
              <br />
              <Box component="span" sx={{ color: 'primary.main' }}>
                {t('home.hero.subtitle')}
              </Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                color: 'text.secondary',
                mb: 4,
              }}
            >
              {t('home.hero.description')}
            </Typography>
          </Box>

          {/* Hero Search Card */}
          <Box sx={{ maxWidth: 820, mx: 'auto', mb: 4 }}>
            <HeroSearchCard />
          </Box>

          {/* Suggested Questions & Agent Panel */}
          <Box sx={{ maxWidth: 720, mx: 'auto', mb: 4 }}>
            <SuggestedQuestionsPanel />
            <AgentPanel />
          </Box>

          {/* Stats Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <StatsBar />
          </Box>
        </Container>
      </Box>

      {/* Full-width sections */}
      <Box sx={{ width: '100%' }}>
        <Container maxWidth="lg">
          <FeaturedModels />
        </Container>
      </Box>

      <Box sx={{ width: '100%', bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <BuiltForBuilders />
        </Container>
      </Box>

      <Box sx={{ width: '100%' }}>
        <Container maxWidth="lg">
          <BrowseByLab />
        </Container>
      </Box>

      <Box sx={{ width: '100%', bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <FlagshipComparison />
        </Container>
      </Box>

      <Box sx={{ width: '100%' }}>
        <Container maxWidth="lg">
          <TrendingModels />
        </Container>
      </Box>

      <Box sx={{ width: '100%', bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <BudgetTiers />
        </Container>
      </Box>

      <Box sx={{ width: '100%' }}>
        <Container maxWidth="lg">
          <UseCases />
        </Container>
      </Box>

      {/* Full-width newsletter CTA */}
      <NewsletterCTA />
    </Box>
  );
}
