'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { Close, Add, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface NewAgentModalProps {
  open: boolean;
  onClose: () => void;
}

interface ToolConfig {
  id: string;
  name: string;
  enabled: boolean;
}

const AVAILABLE_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'gpt-4.1', name: 'GPT-4.1', provider: 'OpenAI' },
  { id: 'claude-opus-4-6', name: 'Claude Opus 4.6', provider: 'Anthropic' },
  { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', provider: 'Anthropic' },
  { id: 'gemini-2-5-pro', name: 'Gemini 2.5 Pro', provider: 'Google' },
];

const AVAILABLE_TOOLS = [
  { id: 'web-search', nameKey: 'agents.toolWebSearch', descKey: 'agents.toolWebSearchDesc' },
  { id: 'code-exec', nameKey: 'agents.toolCodeExec', descKey: 'agents.toolCodeExecDesc' },
  { id: 'file-ops', nameKey: 'agents.toolFileOps', descKey: 'agents.toolFileOpsDesc' },
  { id: 'api-call', nameKey: 'agents.toolApiCalls', descKey: 'agents.toolApiCallsDesc' },
];

export default function NewAgentModal({ open, onClose }: NewAgentModalProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    modelId: '',
    systemPrompt: '',
    temperature: 0.7,
    maxTokens: 2000,
    topP: 1.0,
    tools: [] as ToolConfig[],
    tags: [] as string[],
    isPublic: false,
  });
  const [tagInput, setTagInput] = useState('');

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    handleChange('tags', formData.tags.filter((t) => t !== tag));
  };

  const handleToggleTool = (toolId: string) => {
    const exists = formData.tools.find((t) => t.id === toolId);
    if (exists) {
      handleChange('tools', formData.tools.filter((t) => t.id !== toolId));
    } else {
      const tool = AVAILABLE_TOOLS.find((t) => t.id === toolId);
      if (tool) {
        handleChange('tools', [...formData.tools, { id: tool.id, name: tool.nameKey, enabled: true }]);
      }
    }
  };

  const handleSubmit = () => {
    console.log('Creating agent:', formData);
    onClose();
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return formData.name.trim() !== '' && formData.description.trim() !== '';
      case 1:
        return formData.modelId !== '' && formData.systemPrompt.trim() !== '';
      case 2:
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          bgcolor: 'var(--card)',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2.5,
            borderBottom: '1px solid var(--border)',
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: '1.25rem',
              color: 'var(--text)',
            }}
          >
            {t('agents.createNew')}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: '1px solid var(--border)' }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{
              px: 2.5,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'var(--text2)',
                minHeight: 48,
                '&.Mui-selected': {
                  color: 'var(--accent)',
                },
              },
              '& .MuiTabs-indicator': {
                bgcolor: 'var(--accent)',
                height: 3,
              },
            }}
          >
            <Tab label={t('agents.step1')} />
            <Tab label={t('agents.step2')} disabled={!isStepValid(0)} />
            <Tab label={t('agents.step3')} disabled={!isStepValid(1)} />
            <Tab label={t('agents.step4')} disabled={!isStepValid(2)} />
          </Tabs>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, minHeight: 400, maxHeight: 500, overflowY: 'auto' }}>
          {/* Step 1: Basic Info */}
          {activeTab === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', mb: 1 }}>
                  {t('agents.name')} *
                </Typography>
                <TextField
                  fullWidth
                  placeholder={t('agents.namePlaceholder')}
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      '& fieldset': { borderColor: 'var(--border)' },
                      '&:hover fieldset': { borderColor: 'var(--border2)' },
                      '&.Mui-focused fieldset': { borderColor: 'var(--accent)', borderWidth: 1.5 },
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', mb: 1 }}>
                  {t('agents.description')} *
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder={t('agents.descriptionPlaceholder')}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      '& fieldset': { borderColor: 'var(--border)' },
                      '&:hover fieldset': { borderColor: 'var(--border2)' },
                      '&.Mui-focused fieldset': { borderColor: 'var(--accent)', borderWidth: 1.5 },
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', mb: 1 }}>
                  {t('agents.tags')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={t('agents.tagsPlaceholder')}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        '& fieldset': { borderColor: 'var(--border)' },
                      },
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddTag}
                    sx={{
                      textTransform: 'none',
                      borderRadius: '8px',
                      borderColor: 'var(--border)',
                      color: 'var(--text2)',
                    }}
                  >
                    {t('agents.addTag')}
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                  {formData.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      onDelete={() => handleRemoveTag(tag)}
                      sx={{
                        bgcolor: 'var(--accent-lt)',
                        color: 'var(--accent)',
                        fontSize: '0.75rem',
                        '& .MuiChip-deleteIcon': { color: 'var(--accent)', fontSize: 16 },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          )}

          {/* Step 2: Model & Prompt */}
          {activeTab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', mb: 1 }}>
                  {t('agents.selectModel')} *
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={formData.modelId}
                    onChange={(e) => handleChange('modelId', e.target.value)}
                    displayEmpty
                    sx={{
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border2)' },
                    }}
                  >
                    <MenuItem value="" disabled>
                      {t('agents.selectModelPlaceholder')}
                    </MenuItem>
                    {AVAILABLE_MODELS.map((model) => (
                      <MenuItem key={model.id} value={model.id} sx={{ fontSize: '0.875rem' }}>
                        {model.name} ({model.provider})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', mb: 1 }}>
                  {t('agents.systemPrompt')} *
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  placeholder={t('agents.systemPromptPlaceholder')}
                  value={formData.systemPrompt}
                  onChange={(e) => handleChange('systemPrompt', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontFamily: 'monospace',
                      '& fieldset': { borderColor: 'var(--border)' },
                      '&:hover fieldset': { borderColor: 'var(--border2)' },
                      '&.Mui-focused fieldset': { borderColor: 'var(--accent)', borderWidth: 1.5 },
                    },
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Step 3: Tools */}
          {activeTab === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', mb: 1 }}>
                {t('agents.enableTools')}
              </Typography>
              {AVAILABLE_TOOLS.map((tool) => {
                const isEnabled = formData.tools.some((t) => t.id === tool.id);
                return (
                  <Box
                    key={tool.id}
                    onClick={() => handleToggleTool(tool.id)}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: isEnabled ? 'var(--accent)' : 'var(--border)',
                      borderRadius: '10px',
                      bgcolor: isEnabled ? 'var(--accent-lt)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        borderColor: 'var(--accent)',
                        bgcolor: 'var(--accent-lt)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)', mb: 0.25 }}>
                          {t(tool.nameKey)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text2)' }}>
                          {t(tool.descKey)}
                        </Typography>
                      </Box>
                      <Switch checked={isEnabled} />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}

          {/* Step 4: Settings */}
          {activeTab === 3 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', mb: 1.5 }}>
                  {t('agents.temperature', { value: formData.temperature })}
                </Typography>
                <Slider
                  value={formData.temperature}
                  onChange={(_, v) => handleChange('temperature', v)}
                  min={0}
                  max={2}
                  step={0.1}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                  ]}
                  sx={{
                    color: 'var(--accent)',
                    '& .MuiSlider-markLabel': { fontSize: '0.75rem', color: 'var(--text3)' },
                  }}
                />
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--text3)', mt: 0.5 }}>
                  {t('agents.temperatureHint')}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', mb: 1 }}>
                  {t('agents.maxTokens')}
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={formData.maxTokens}
                  onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      '& fieldset': { borderColor: 'var(--border)' },
                    },
                  }}
                />
              </Box>

              <Divider />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPublic}
                    onChange={(e) => handleChange('isPublic', e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>
                      {t('agents.makePublic')}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
                      {t('agents.makePublicDesc')}
                    </Typography>
                  </Box>
                }
              />
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2.5,
            borderTop: '1px solid var(--border)',
          }}
        >
          <Button
            onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
            disabled={activeTab === 0}
            sx={{
              textTransform: 'none',
              fontSize: '0.875rem',
              color: 'var(--text2)',
              '&:disabled': { color: 'var(--text3)' },
            }}
          >
            {t('common.back')}
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                textTransform: 'none',
                fontSize: '0.875rem',
                borderRadius: '8px',
                borderColor: 'var(--border)',
                color: 'var(--text2)',
              }}
            >
              {t('common.cancel')}
            </Button>
            {activeTab < 3 ? (
              <Button
                onClick={() => setActiveTab(activeTab + 1)}
                disabled={!isStepValid(activeTab)}
                variant="contained"
                disableElevation
                sx={{
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  bgcolor: 'var(--accent)',
                  '&:hover': { bgcolor: 'var(--accent2)' },
                }}
              >
                {t('common.next')}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                variant="contained"
                disableElevation
                sx={{
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  bgcolor: 'var(--accent)',
                  '&:hover': { bgcolor: 'var(--accent2)' },
                }}
              >
                {t('agents.createNew')}
              </Button>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
