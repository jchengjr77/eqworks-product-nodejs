## Work Sample for Product Aspect, Node.js Variant

[What is this for?](https://github.com/EQWorks/work-samples#what-is-this)

### Setup and Run

The following are the recommended options, but you're free to use any means to get started.

#### Remote Option: Glitch.com

1. [![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/EQWorks/ws-product-nodejs)
2. Populate `.env` file with the environment variables given in the problem set we send to you through email
3. Click on `Show Live` and you should see `Welcome to EQ Works 😎`

#### Local Option 1: Node.js 6.10+

1. Clone this repository
2. Install Node.js dependencies `$ npm install`
3. Set environment variables given in the problem set we send to you through email and run `$ npm run dev`
4. Open your browser and point to `localhost:5555` and you should see `Welcome to EQ Works 😎`

#### Local Option 2: Docker (`docker-compose` needed)

1. Clone this repository
2. Create and populate `.env` file with the environment variables given in the problem set we send to you through email
3. `$ docker-compose up` (or `$ docker-compose up -d` to run as a daemon)
4. Open your browser and point to `localhost:5555` and you should see `Welcome to EQ Works 😎`

### Notes on working through the problems

Make sure any additional Node.js level dependencies are properly added in `package.json`. We encourage a healthy mixture of your own implementations, and good choices of existing open-source libraries/tools. We will comment in the problems to indicate which ones cannot be solved purely through an off-the-shelf solution.

---

#### API rate limiting notes

Token bucket algorithm is implemented for rate limiting.

- Bucket object can be configured for different rates (not sure what kind of volume this API will handle)
- Refill bucket at set intervals, with a set amount (all defined by the bucket object).
- If no tokens left, request is met with an error message.

PROS: simple, easy to maintain, works like a charm, somewhat scalable.

CONS: No memory of overflow request (the user has to re-request), limit is strict (no dynamic adjustments).

IMPROVEMENTS:

- Implement a queueing system for the requests that were denied. Once there are more tokens in the bucket, then
  the queued requests can be slowly released.
- Create dynamic rate limits, such as allowing short surges in requests to pass. This can be done by monitoring
  an averaged request rate instead of a strict number of tokens. This can lead to a less halting experience for
  requesters, while still maintaining a limited API request rate.
