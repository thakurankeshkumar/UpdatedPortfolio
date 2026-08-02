import Blog from '@/models/Blog';
import { createCollectionHandlers } from '@/lib/crud';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const { GET, POST } = createCollectionHandlers(() => Blog, { createdAt: -1 });
