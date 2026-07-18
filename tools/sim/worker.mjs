import { parentPort, workerData } from 'node:worker_threads';

import { playRun } from './play-run.mjs';
import { makePolicy as makeGreedyPolicy } from './policies/greedy.mjs';
import { makePolicy as makeRandomPolicy } from './policies/random.mjs';
import { newAggregate, reduceRecord } from './telemetry.mjs';

const POLICY_FACTORIES = Object.freeze({
  greedy: makeGreedyPolicy,
  random: makeRandomPolicy,
});

function runTask(task) {
  const makePolicy = POLICY_FACTORIES[task.policy];
  if (!makePolicy) throw new TypeError(`unknown policy: ${task.policy}`);

  const aggregate = newAggregate({ policy: task.policy });
  let pendingProgress = 0;
  for (let offset = 0; offset < task.runs; offset++) {
    reduceRecord(aggregate, playRun(task.startSeed + offset, makePolicy, { profile: task.profile }));
    pendingProgress++;
    if (pendingProgress === 250) {
      parentPort.postMessage({ type: 'progress', delta: pendingProgress });
      pendingProgress = 0;
    }
  }
  if (pendingProgress) parentPort.postMessage({ type: 'progress', delta: pendingProgress });
  return aggregate;
}

try {
  parentPort.postMessage({ type: 'result', partial: runTask(workerData) });
} catch (error) {
  parentPort.postMessage({
    type: 'worker-error',
    message: String(error?.message ?? error),
    stack: typeof error?.stack === 'string' ? error.stack : null,
  });
}
