import Project from '@/models/Project';
import { createCollectionHandlers } from '@/lib/crud';

export const { GET, POST } = createCollectionHandlers(() => Project, { order: 1, createdAt: -1 });
