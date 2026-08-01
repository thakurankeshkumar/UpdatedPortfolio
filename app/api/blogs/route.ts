import Blog from '@/models/Blog';
import { createCollectionHandlers } from '@/lib/crud';

export const { GET, POST } = createCollectionHandlers(() => Blog, { createdAt: -1 });
