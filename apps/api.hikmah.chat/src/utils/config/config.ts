import { config } from 'dotenv';
import { resolve } from 'path';
import { z } from 'zod';

class Config {
  private static instance: Config;
  private static schema = z.object({
    PORT: z.coerce
      .number()
      .positive({ message: 'PORT must be a positive number' })
      .min(1000, { message: 'PORT must be greater than 1000' })
      .max(9999, { message: 'PORT must be less than 9999' })
      .default(3003),
    NODE_ENV: z
      .union([
        z.literal('development'),
        z.literal('test'),
        z.literal('production'),
      ])
      .default('development'),
    MONGO_HOST: z.string({ required_error: 'MongoDB host is required' }),
    MONGO_PORT: z.coerce
      .number({ required_error: 'MongoDB port is required' })
      .positive({ message: 'MongoDB port must be a positive number' })
      .min(1000, { message: 'MongoDB port must be greater than 1000' }),
    MONGO_USERNAME: z.string().default('admin'),
    MONGO_PASSWORD: z.string({
      required_error: 'MongoDB password is required',
    }),
    MONGO_DATABASE: z.string().default('hikmah-dev'),
  });
  public env: z.infer<typeof Config.schema>;

  private constructor() {
    const envPath = resolve(__dirname, '..', '..', '..', '..', '..', '.env');
    config({
      path: envPath,
    });
    const result = Config.schema.safeParse(process.env);
    if (!result.success) {
      throw result.error;
    }
    this.env = result.data;
  }

  public static CetInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

export { Config };
