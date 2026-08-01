import Testimonial from '@/models/Testimonial';
import { createCollectionHandlers } from '@/lib/crud';

export const { GET, POST } = createCollectionHandlers(() => Testimonial, { order: 1 });
