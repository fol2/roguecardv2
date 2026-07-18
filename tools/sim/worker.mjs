import { parentPort, workerData } from 'node:worker_threads';

import { playCycle } from './play-cycle.mjs';
import { playRun } from './play-run.mjs';
import { newCycleAggregate, reduceCycle } from './cycle-telemetry.mjs';
import { makeWalkerPolicyFactory } from './policy-adapter.mjs';
import { getPolicyDefinition } from './policies/registry.mjs';
import { newAggregate, reduceRecord } from './telemetry.mjs';

function flushProgress(progress) {
  if (progress.completed) parentPort.postMessage({ type: 'progress', delta: progress });
}

function runCycleTask(task) {
  const definition = getPolicyDefinition(task.policy);
  if (!definition) throw new TypeError(`unknown policy: ${task.policy}`);
  if (!definition.modes.includes('cycle')) throw new TypeError(`policy ${task.policy} does not support cycle mode`);
  if (!Number.isSafeInteger(task.cycles) || task.cycles < 1) throw new RangeError('cycles must be a positive integer');
  if (!Number.isSafeInteger(task.startSeed) || task.startSeed < 0) {
    throw new RangeError('startSeed must be a non-negative integer');
  }

  const aggregate = newCycleAggregate({
    mode: 'cycle', policyId: task.policy, policyVersion: definition.version,
    knowledgeClass: definition.knowledgeClass,
    interpretation: definition.reportInterpretation,
    targetId: task.targetId ?? null,
    targetSelection: task.targetId ? 'explicit' : definition.targetSelection.default ?? null,
    maxRounds: task.maxRounds,
  });
  let progress = { completed: 0, rounds: 0, promisesStaged: 0, censored: 0, failed: 0, currentTarget: null };
  for (let offset = 0; offset < task.cycles; offset += 1) {
    const cycle = playCycle(task.startSeed + offset, task.policy, {
      maxRounds: task.maxRounds,
      targetId: task.targetId ?? task.target ?? null,
    });
    reduceCycle(aggregate, cycle);
    progress.completed += 1;
    progress.rounds += cycle.rounds.length;
    progress.promisesStaged += cycle.terminal.status === 'completed' ? 1 : 0;
    progress.censored += cycle.terminal.status === 'censored' ? 1 : 0;
    progress.failed += cycle.terminal.status === 'failed' ? 1 : 0;
    progress.currentTarget = cycle.targetId;
    if (progress.completed === 25) {
      flushProgress(progress);
      progress = { completed: 0, rounds: 0, promisesStaged: 0, censored: 0, failed: 0, currentTarget: null };
    }
  }
  flushProgress(progress);
  return aggregate;
}

function runRoundTask(task) {
  const definition = getPolicyDefinition(task.policy);
  if (!definition) throw new TypeError(`unknown policy: ${task.policy}`);
  if (!definition.modes.includes('round')) throw new TypeError(`policy ${task.policy} does not support round mode`);
  const makePolicy = makeWalkerPolicyFactory(definition);

  const aggregate = newAggregate({ policy: task.policy });
  let pendingProgress = 0;
  for (let offset = 0; offset < task.runs; offset++) {
    reduceRecord(aggregate, playRun(task.startSeed + offset, makePolicy, { profile: task.profile }));
    pendingProgress++;
    if (pendingProgress === 250) {
      parentPort.postMessage({ type: 'progress', delta: { completed: pendingProgress } });
      pendingProgress = 0;
    }
  }
  flushProgress({ completed: pendingProgress });
  return aggregate;
}

function runTask(task) {
  return task.mode === 'cycle' ? runCycleTask(task) : runRoundTask(task);
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
