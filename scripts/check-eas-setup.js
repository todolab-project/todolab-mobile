const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function exists(path) {
  return fs.existsSync(path);
}

const appConfig = readJson('app.json').expo;
const easConfig = readJson('eas.json');
const checks = [];

function addCheck(name, passed, details) {
  checks.push({ name, passed, details });
}

const easVersion = spawnSync('eas', ['--version'], {
  encoding: 'utf8',
  shell: false,
});

addCheck(
  'EAS CLI installed',
  easVersion.status === 0,
  easVersion.status === 0
    ? easVersion.stdout.trim()
    : 'Install with `npm install --global eas-cli` or use `npx eas-cli` when network is available.',
);

addCheck(
  'Android package configured',
  appConfig.android?.package === 'com.todolab.mobile',
  appConfig.android?.package ?? 'missing',
);

addCheck(
  'iOS bundle identifier configured',
  appConfig.ios?.bundleIdentifier === 'com.todolab.mobile',
  appConfig.ios?.bundleIdentifier ?? 'missing',
);

addCheck(
  'EAS profiles configured',
  Boolean(easConfig.build?.development && easConfig.build?.preview && easConfig.build?.production),
  Object.keys(easConfig.build ?? {}).join(', ') || 'missing',
);

addCheck(
  'Expo project id linked',
  Boolean(appConfig.extra?.eas?.projectId),
  appConfig.extra?.eas?.projectId ?? 'missing; run `eas init` after logging in.',
);

addCheck(
  'Local Expo state ignored',
  exists('.expo'),
  exists('.expo')
    ? '.expo exists locally and is ignored by Git.'
    : '.expo does not exist yet; it may be created by Expo/EAS commands.',
);

for (const check of checks) {
  const mark = check.passed ? '✓' : '!';
  console.log(`${mark} ${check.name}: ${check.details}`);
}

const blockingFailures = checks.filter(
  (check) => !check.passed && ['EAS CLI installed', 'Expo project id linked'].includes(check.name),
);

if (blockingFailures.length > 0) {
  console.log('\nEAS setup is not complete yet. This is expected before Expo login/init.');
  process.exitCode = 1;
}
