const auth = require('../../../src/middleware/auth');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  it('should call next if token is valid', () => {
    const req = {
      header: jest.fn().mockReturnValue('Bearer validtoken')
    };
    const res = {};
    const next = jest.fn();

    jwt.verify.mockReturnValue({ userId: '123' });

    auth(req, res, next);

    expect(req.userId).toBe('123');
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    const req = {
      header: jest.fn().mockReturnValue('Bearer invalidtoken')
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Please authenticate' });
  });
});