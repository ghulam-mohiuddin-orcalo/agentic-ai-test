import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  currentModal: string | null;
  modalData: any;
  language: string;
  theme: 'light' | 'dark';
}

const initialState: UIState = {
  sidebarOpen: true,
  rightPanelOpen: true,
  currentModal: null,
  modalData: null,
  language: 'en',
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleRightPanel: (state) => {
      state.rightPanelOpen = !state.rightPanelOpen;
    },
    setRightPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.rightPanelOpen = action.payload;
    },
    openModal: (state, action: PayloadAction<{ modalId: string; data?: any }>) => {
      state.currentModal = action.payload.modalId;
      state.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.currentModal = null;
      state.modalData = null;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleRightPanel,
  setRightPanelOpen,
  openModal,
  closeModal,
  setLanguage,
  setTheme,
} = uiSlice.actions;
export default uiSlice.reducer;
