import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { createClient } from 'redis';

import { AppError } from '@shared/errors/AppErrors';

/**
 * keyPrefix: mesmo nome do middleware ("rateLimiter")
 * points: número de requisições (10)
 * duration: tempo (1 seg)
 * exemplo:  10 requisições / segundo
 * teste4
 */

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const redisClient = createClient({
    legacyMode: true,
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  });

  await redisClient.connect();

  const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rateLimiter',
    points: 5, // 10 requests
    duration: 2, // per 1 second by IP
  });

  try {
    await limiter.consume(request.ip);

    return next();
  } catch (err) {
    throw new AppError('Too many requests', 429);
  }
}
