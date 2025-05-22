import { Pool, PoolConfig, PoolClient, QueryResult } from "pg";

// database configuration
const dbConfig: PoolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
  // connection pool settings
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // how long to wait for a connection
};

// create a new pool instance
const pool = new Pool(dbConfig);

// test the connection
pool.on("connect", () => {
  console.log("connected to postgres database");
});

pool.on("error", (err: Error) => {
  console.error("unexpected error on idle client", err);
  process.exit(-1);
});

// helper function to execute queries
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("error executing query", { text, error });
    throw error;
  }
}

// helper function to get a client from the pool
export async function getClient() {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;

  // set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error("a client has been checked out for more than 5 seconds!");
    console.error(
      `the last executed query on this client was: ${(client as any).lastQuery}`
    );
  }, 5000);

  // monkey patch the query method to keep track of the last query executed
  (client as any).query = (...args: any[]) => {
    (client as any).lastQuery = args;
    return query.apply(client, args);
  };

  client.release = () => {
    clearTimeout(timeout);
    (client as any).query = query;
    client.release = release;
    return release.apply(client);
  };

  return client;
}

// export the pool for direct access if needed
export { pool };
