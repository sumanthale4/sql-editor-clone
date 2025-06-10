export interface Connection {
  id: string;
  type: 'PostgreSQL' | 'MySQL' | 'Oracle';
  connectionName: string;
  databaseName: string;
  host: string;
  port: number;
  username: string;
  password: string;
  environment: 'dev' | 'qa' | 'staging' | 'uat' | 'prod';
  order: number;
  createdAt?: string;
  lastUsed?: string;
}

export type DatabaseType = 'PostgreSQL' | 'MySQL' | 'Oracle';
export type EnvironmentType = 'dev' | 'qa' | 'staging' | 'uat' | 'prod';