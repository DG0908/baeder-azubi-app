import { CsrfMiddleware } from './csrf.middleware';
import { ForbiddenException } from '@nestjs/common';

describe('CsrfMiddleware', () => {
  let middleware: CsrfMiddleware;

  beforeEach(() => {
    middleware = new CsrfMiddleware();
  });

  const createMockRequest = (method: string, headers: Record<string, string> = {}) => {
    return { method, headers } as any;
  };

  const createMockNext = () => {
    return jest.fn();
  };

  const createMockResponse = () => {
    return {} as any;
  };

  describe('GET requests', () => {
    it('should allow GET requests without X-Requested-With header', () => {
      const req = createMockRequest('GET');
      const next = createMockNext();

      expect(() => middleware.use(req, createMockResponse(), next)).not.toThrow();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('POST requests', () => {
    it('should allow POST requests with X-Requested-With header', () => {
      const req = createMockRequest('POST', { 'x-requested-with': 'XMLHttpRequest' });
      const next = createMockNext();

      expect(() => middleware.use(req, createMockResponse(), next)).not.toThrow();
      expect(next).toHaveBeenCalled();
    });

    it('should block POST requests without X-Requested-With header', () => {
      const req = createMockRequest('POST');
      const next = createMockNext();

      expect(() => middleware.use(req, createMockResponse(), next)).toThrow(ForbiddenException);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('PUT requests', () => {
    it('should allow PUT requests with X-Requested-With header', () => {
      const req = createMockRequest('PUT', { 'x-requested-with': 'XMLHttpRequest' });
      const next = createMockNext();

      expect(() => middleware.use(req, createMockResponse(), next)).not.toThrow();
      expect(next).toHaveBeenCalled();
    });

    it('should block PUT requests without X-Requested-With header', () => {
      const req = createMockRequest('PUT');
      const next = createMockNext();

      expect(() => middleware.use(req, createMockResponse(), next)).toThrow(ForbiddenException);
    });
  });

  describe('DELETE requests', () => {
    it('should block DELETE requests without X-Requested-With header', () => {
      const req = createMockRequest('DELETE');
      const next = createMockNext();

      expect(() => middleware.use(req, createMockResponse(), next)).toThrow(ForbiddenException);
    });
  });
});
