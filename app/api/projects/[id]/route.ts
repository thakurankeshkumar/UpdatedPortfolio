import Project from '@/models/Project';
import { createItemHandlers } from '@/lib/crud';

export const { PUT, DELETE } = createItemHandlers(() => Project);
