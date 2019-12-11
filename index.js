const express = require("express");
const pg = require("pg");

const app = express();
// configs come from standard PostgreSQL env vars
// https://www.postgresql.org/docs/9.6/static/libpq-envars.html
const pool = new pg.Pool();

// For timing the bucket refills
const date = new Date();

/**
 * * Token bucket API rate limiting (simple)
 * Create a new bucket object
 */
var bucket = {
  capacity: 100 /** Max number of tokens in bucket */,
  amount: 100 /** Current number of tokens in bucket */,
  interval: 1000 /** Number of ms between token refills */,
  last_fill: date.getTime() /** Time of last bucket refill */,
  refill_amt: 10 /** Amount of tokens added per refill */
};

// For testing purposes
function print_bucket() {
  console.log(`
  Bucket status:
  - capacity : ${bucket.capacity}
  - amount : ${bucket.amount}
  - interval : ${bucket.interval}
  - last_fill : ${bucket.last_fill}
  - refill_amt : ${bucket.refill_amt}
  `);
  return;
}

function fill_bucket() {
  let curr_time = new Date().getTime();
  let num_refills = Math.floor(
    (curr_time - bucket.last_fill) / bucket.interval
  );
  if (num_refills > 0) {
    bucket.amount += bucket.refill_amt * num_refills;
    /** If tokens are at capacity, don't fill anymore */
    bucket.amount = Math.min(bucket.amount, bucket.capacity);
    bucket.last_fill = curr_time;
    return true;
  }
  return false;
}

const queryHandler = (req, res, next) => {
  let filled = fill_bucket(); // checks for refill interval
  if (bucket.amount > 0) {
    pool
      .query(req.sqlQuery)
      .then(r => {
        return res.json(r.rows || []);
      })
      .catch(next);
    bucket.amount -= 1;
  } else {
    console.log(`
      ERROR: Too many requests. Please try again later.
    `);
  }
};

app.get("/", (req, res) => {
  res.send("Welcome to EQ Works 😎");
});

app.get(
  "/events/hourly",
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date, hour, events
    FROM public.hourly_events
    ORDER BY date, hour
    LIMIT 168;
  `;
    return next();
  },
  queryHandler
);

app.get(
  "/events/daily",
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date, SUM(events) AS events
    FROM public.hourly_events
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `;
    return next();
  },
  queryHandler
);

app.get(
  "/stats/hourly",
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date, hour, impressions, clicks, revenue
    FROM public.hourly_stats
    ORDER BY date, hour
    LIMIT 168;
  `;
    return next();
  },
  queryHandler
);

app.get(
  "/stats/daily",
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date,
        SUM(impressions) AS impressions,
        SUM(clicks) AS clicks,
        SUM(revenue) AS revenue
    FROM public.hourly_stats
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `;
    return next();
  },
  queryHandler
);

app.get(
  "/poi",
  (req, res, next) => {
    req.sqlQuery = `
    SELECT *
    FROM public.poi;
  `;
    return next();
  },
  queryHandler
);

app.listen(process.env.PORT || 5555, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log(`Running on ${process.env.PORT || 5555}`);
  }
});

// last resorts
process.on("uncaughtException", err => {
  console.log(`Caught exception: ${err}`);
  process.exit(1);
});
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  process.exit(1);
});
