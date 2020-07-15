import { SysAuthGuard } from './sys-auth.guard';

describe('SysAuthGuard', () => {
  it('should be defined', () => {
    expect(new SysAuthGuard()).toBeDefined();
  });
});
