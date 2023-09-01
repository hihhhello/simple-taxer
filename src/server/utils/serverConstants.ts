import { z } from 'zod';

export const ZOD_SORTING_ENUM = z.enum(['asc', 'desc']).optional();
