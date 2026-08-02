import Project from '@/models/Project';
import { createCollectionHandlers } from '@/lib/crud';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const { GET, POST } = createCollectionHandlers(() => Project, { order: 1, createdAt: -1 });
