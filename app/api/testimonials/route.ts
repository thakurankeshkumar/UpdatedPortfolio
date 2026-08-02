import Testimonial from '@/models/Testimonial';
import { createCollectionHandlers } from '@/lib/crud';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const { GET, POST } = createCollectionHandlers(() => Testimonial, { order: 1 });
