import { jsonPlaceholderAxiosInstance } from '@/shared/api/jsonPlaceholder/apiJsonPlaceholderBase';
import { ApiJsonPlaceholderUser } from '@/shared/api/jsonPlaceholder/utils/apiJsonPlaceholderTypes';

export const getUsers = () =>
  jsonPlaceholderAxiosInstance
    .get<ApiJsonPlaceholderUser[]>('/users')
    .then(({ data }) => data);
