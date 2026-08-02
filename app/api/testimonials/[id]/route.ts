import Testimonial from '@/models/Testimonial';
import { createItemHandlers } from '@/lib/crud';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const { PUT, DELETE } = createItemHandlers(() => Testimonial);
