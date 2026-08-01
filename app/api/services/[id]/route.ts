import Service from '@/models/Service';
import { createItemHandlers } from '@/lib/crud';

export const { PUT, DELETE } = createItemHandlers(() => Service);
