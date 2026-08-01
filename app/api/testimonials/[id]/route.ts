import Testimonial from '@/models/Testimonial';
import { createItemHandlers } from '@/lib/crud';

export const { PUT, DELETE } = createItemHandlers(() => Testimonial);
