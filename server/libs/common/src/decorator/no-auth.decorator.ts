import { SetMetadata } from '@nestjs/common';

export const NoAuth = (auth: string) => SetMetadata('no-auth', auth);
