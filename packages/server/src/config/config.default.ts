export const orm = {
  type: 'mysql',
  host: 'host',
  port: 3306,
  username: 'name',
  password: '123456',
  database: 'kkdy_test',
  synchronize: true,
  logging: false,
}

export const redis = {
  port: 6379,
  host: '0.0.0.0',
  family: 4,
  keyPrefix: 'kkdy:',
  db: 2,
}
