import Blog from '@/models/Blog';
import { createItemHandlers } from '@/lib/crud';

export const { PUT, DELETE } = createItemHandlers(() => Blog);
