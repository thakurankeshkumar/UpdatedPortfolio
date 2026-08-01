import Service from '@/models/Service';
import { createCollectionHandlers } from '@/lib/crud';

export const { GET, POST } = createCollectionHandlers(() => Service, { order: 1 });
