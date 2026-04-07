import { baseApi } from './baseApi';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  preferences: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  preferences?: Record<string, any>;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ApiKey {
  id: string;
  name: string;
  lastUsed: string | null;
  createdAt: string;
}

export interface CreateApiKeyResponse {
  id: string;
  name: string;
  createdAt: string;
  key: string;
}

export interface CreateApiKeyRequest {
  name: string;
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
      query: (body) => ({
        url: '/users/me',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation<{ message: string }, ChangePasswordRequest>({
      query: (body) => ({
        url: '/users/me/password',
        method: 'PUT',
        body,
      }),
    }),
    deleteAccount: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/users/me',
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getApiKeys: builder.query<ApiKey[], void>({
      query: () => '/users/me/api-keys',
      providesTags: ['User'],
    }),
    createApiKey: builder.mutation<CreateApiKeyResponse, CreateApiKeyRequest>({
      query: (body) => ({
        url: '/users/me/api-keys',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    deleteApiKey: builder.mutation<{ message: string }, string>({
      query: (keyId) => ({
        url: `/users/me/api-keys/${keyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useGetApiKeysQuery,
  useCreateApiKeyMutation,
  useDeleteApiKeyMutation,
} = usersApi;
