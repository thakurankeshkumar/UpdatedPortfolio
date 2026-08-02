import Service from '@/models/Service';
import { createCollectionHandlers } from '@/lib/crud';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const { GET, POST } = createCollectionHandlers(() => Service, { order: 1 });
