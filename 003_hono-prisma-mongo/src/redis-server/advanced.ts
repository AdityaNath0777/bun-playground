import { client } from "./redis-server";

// Hashes Example with user data
const user = {
  id: "user001",
  name: "user001",
  email: "user001@mail.com",

  // nested data will throw error
  /**
   * options?
   * - either normalize into two different objects
   * - JSON.stringify() to store & JSON.parse()
   * - fallten the object
   *
   */
  // stats: {
  // followers: 123,
  // following: 11,
  // posts: 230
  // }

  /**
   * flattend example:
   * stats_followerse: 123,
   * stats_following: 11,
   * ...
   */
};

await client.hSet(`user:set:${user.id}`, user);
await client.hSet(`user:set:${user.id}:stats`, {
  followers: 123,
  following: 11,
  posts: 230,
});

// can't use hash set with it
await client.set(`user:${user.id}`, JSON.stringify(user));
const userJson = await client.get(`user:${user.id}`);
if (userJson) {
  console.log(`User with id: ${user.id}: `, JSON.parse(userJson));
}

/**
 * Pipelining
 * It allows to send multiple commands to the server in one go 
 * without waiting for the reply to each command.
 * 
 * Redis processes these commands sequentially 
 * and then sends all the replies back to the client 
 * in a single response.
 * 
 * similar to how Promise.all works not exact as this pipeline is atomic
 * 
 * Either all commands will success or all will fail
 * No in-between unlike Promise.all
 * plus redis proccess them one by one, not asyncly
 */

const pipe = client.multi();

pipe.hGetAll(`user:set:${user.id}`);
pipe.hGetAll(`user:set:${user.id}:stats`);

const [userR, statsR] = await pipe.exec() as any;

userR.stats = statsR;
console.log(userR);
