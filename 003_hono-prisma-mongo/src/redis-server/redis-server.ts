import { createClient, RedisArgument } from "redis";
import { logger } from "../lib/logger";

const client = createClient();

client.on("error", (err) => logger.error(`Redis Client Error: `, { err }));

await client.connect();

if (client.isReady) {
  console.log(`Connected to Redis Server successfully`);
}

export { client };

// await client.set('raam', 'siya');
// await client.set('siya', 'raam');

// let i = 0;
// while (1) {
//   console.log(`iteration #${i}`)
//   const value1 = await client.get('krishna');
//   const value2 = await client.get('jojo');

//   console.log(`key: krishna \t value: ${value1}`);
//   console.log(`key: jojo \t value: ${value2}`);

//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   ++i;
// }

// const result = await client.set("yahoo", "google", {
//   expiration: {
//     type: "EX",
//     value: 30, // expiry after 10s

//     /**
//      * possible expiration types
//      * type: "EX" | "PX" | "EXAT" | "PXAT"
//      *
//      * EX: expiration in seconds
//      * PX: expiration in milliseconds
//      * 
//      * EXAT: expiration on a specific Date & Time, need to pass an absolute UNIX timestamp in seconds
//      * PXAT: same as EXAT but timestamp is in milliseconds
//      *
//      */
//   },

//   condition: "NX", // set if not exists
//   // condition: "XX", // set even if exists // default

//   GET: true, // returns the previously stored value if the key already exists
// });

async function runInfiniteIterations(fn: (...props: any) => void) {
  let i = 0;
  while (1) {
    console.log(`------------------------------------`);
    console.log(`Iteration: #${i}`);
    fn();
    ++i;
    await new Promise((res) => setTimeout(res, 1000));
    console.log(`------------------------------------\n`);
  }
}

// console.log(`result: ${result}`);

async function fn(key: RedisArgument) {
  const val = await client.get(key);
  console.log(`key: ${key} \t value: ${val}`);
}

// fn("yahoo");
// await runInfiniteIterations(fn);


// await client.hSet("user:123", {
//   id: "123",
//   username: "user001",
//   email: "user001@mail.com",
//   passwordHash: "bq348rb7f4uydt3874", // not actual hash, any random value for example my mittar 🥸
//   age: 17
// })


// const user = await client.hGetAll("user:123");

// const typedUser = { ...user, age: Number(user.age) }

// console.log("user:123 : ", JSON.stringify(user), user);
// console.log("user:123 : ", typedUser);
