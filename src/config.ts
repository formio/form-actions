export interface Config {
  port: number,
  maxBodySize: string,
}

export default {
  port: parseInt(process.env.PORT) || 3100,
  maxBodySize: process.env.MAX_BODY_SIZE || '1mb'
}
