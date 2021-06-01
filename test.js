var os = require('os');
var test = require('ava').serial;
var requireUncached = require('require-uncached');

test.beforeEach(function () {
	Object.defineProperty(process, 'platform', {
		value: 'linux'
	});
	process.stdout.isTTY = true;
	process.argv = [];
	process.env = {};
});

test('return true if `FORCE_COLOR` is in env', function (t) {
	process.stdout.isTTY = false;
	process.env.FORCE_COLOR = true;

	var result = requireUncached('./');
	t.truthy(result.stdout);
	t.is(result.stdout.level, 1);
});

test('return true if `FORCE_COLOR` is in env, but honor 256', function (t) {
	process.argv = ['--color=256'];
	process.env.FORCE_COLOR = true;

	var result = requireUncached('./');
	t.truthy(result.stdout);
	t.is(result.stdout.level, 2);
});

test('return true if `FORCE_COLOR` is in env, but honor 256 1', function (t) {
	process.argv = ['--color=256'];
	process.env.FORCE_COLOR = '1';

	var result = requireUncached('./');
	t.truthy(result.stdout);
	t.is(result.stdout.level, 2);
});

test('return false if `FORCE_COLOR` is in env and is 0', function (t) {
	process.env.FORCE_COLOR = '0';

	var result = requireUncached('./');
	t.false(result.stdout);
});

test('return false if not TTY', function (t) {
	process.stdout.isTTY = false;

	var result = requireUncached('./');
	t.false(result.stdout);
});

test('return false if --no-color flag is used', function (t) {
	process.env = {TERM: 'xterm-256color'};
	process.argv = ['--no-color'];

	var result = requireUncached('./');
	t.false(result.stdout);
});

test('return false if --no-colors flag is used', function (t) {
	process.env = {TERM: 'xterm-256color'};
	process.argv = ['--no-colors'];

	var result = requireUncached('./');
	t.false(result.stdout);
});

test('return true if --color flag is used', function (t) {
	process.argv = ['--color'];

	var result = requireUncached('./');
	t.truthy(result.stdout);
});

test('return true if --colors flag is used', function (t) {
	process.argv = ['--colors'];

	var result = requireUncached('./');
	t.truthy(result.stdout);
});

test('return true if `COLORTERM` is in env', function (t) {
	process.env.COLORTERM = true;

	var result = requireUncached('./');
	t.truthy(result.stdout);
});

test('support `--color=true` flag', function (t) {
	process.argv = ['--color=true'];

	var result = requireUncached('./');
	t.truthy(result.stdout);
});

test('support `--color=always` flag', function (t) {
	process.argv = ['--color=always'];

	var result = requireUncached('./');
	t.truthy(result.stdout);
});

test('support `--color=false` flag', function (t) {
	process.env = {TERM: 'xterm-256color'};
	process.argv = ['--color=false'];

	var result = requireUncached('./');
	t.false(result.stdout);
});

test('support `--color=256` flag', function (t) {
	process.argv = ['--color=256'];

	var result = requireUncached('./');
	t.truthy(result.stdout);
});

test('level should be 2 if `--color=256` flag is used', function (t) {
	process.argv = ['--color=256'];

	var result = requireUncached('./');
	t.is(result.stdout.level, 2);
	t.true(result.stdout.has256);
});

test('support `--color=16m` flag', function (t) {
	process.argv = ['--color=16m'];

	var result = requireUncached('./');
	t.truthy(result.stdout);
});

test('support `--color=full` flag', function (t) {
	process.argv = ['--color=full'];

	var result = requireUncached('./');
	t.truthy(result.stdout);
});

test('support `--color=truecolor` flag', function (t) {
	process.argv = ['--color=truecolor'];

	var result = requireUncached('./');
	t.truthy(result.stdout);
});

test('level should be 3 if `--color=16m` flag is used', function (t) {
	process.argv = ['--color=16m'];

	var result = requireUncached('./');
	t.is(result.stdout.level, 3);
	t.true(result.stdout.has256);
	t.true(result.stdout.has16m);
});

test('ignore post-terminator flags', function (t) {
	process.argv = ['--color', '--', '--no-color'];

	var result = requireUncached('./');
	t.truthy(result.stdout);
});

test('allow tests of the properties on false', function (t) {
	process.env = {TERM: 'xterm-256color'};
	process.argv = ['--no-color'];

	var result = requireUncached('./');
	t.is(result.stdout.hasBasic, undefined);
	t.is(result.stdout.has256, undefined);
	t.is(result.stdout.has16m, undefined);
	t.false(result.stdout.level > 0);
});

test('return false if `CI` is in env', function (t) {
	process.env.CI = 'AppVeyor';

	var result = requireUncached('./');
	t.false(result.stdout);
});

test('return true if `TRAVIS` is in env', function (t) {
	process.env = {CI: 'Travis', TRAVIS: '1'};

	var result = requireUncached('./');
	t.truthy(result.stdout);
});

test('return true if `CIRCLECI` is in env', function (t) {
	process.env = {CI: true, CIRCLECI: true};

	var result = requireUncached('./');
	t.truthy(result.stdout);
});

test('return true if `APPVEYOR` is in env', function (t) {
	process.env = {CI: true, APPVEYOR: true};

	var result = requireUncached('./');
	t.truthy(result.stdout);
});

test('return true if `GITLAB_CI` is in env', function (t) {
	process.env = {CI: true, GITLAB_CI: true};

	var result = requireUncached('./');
	t.truthy(result.stdout);
});

test('return true if Codeship is in env', function (t) {
	process.env = {CI: true, CI_NAME: 'codeship'};

	var result = requireUncached('./');
	t.truthy(result);
});

test('return false if `TEAMCITY_VERSION` is in env and is < 9.1', function (t) {
	process.env.TEAMCITY_VERSION = '9.0.5 (build 32523)';

	var result = requireUncached('./');
	t.false(result.stdout);
});

test('return level 1 if `TEAMCITY_VERSION` is in env and is >= 9.1', function (t) {
	process.env.TEAMCITY_VERSION = '9.1.0 (build 32523)';

	var result = requireUncached('./');
	t.is(result.stdout.level, 1);
});

test('support rxvt', function (t) {
	process.env = {TERM: 'rxvt'};

	var result = requireUncached('./');
	t.is(result.stdout.level, 1);
});

test('prefer level 2/xterm over COLORTERM', function (t) {
	process.env = {COLORTERM: '1', TERM: 'xterm-256color'};

	var result = requireUncached('./');
	t.is(result.stdout.level, 2);
});

test('support screen-256color', function (t) {
	process.env = {TERM: 'screen-256color'};

	var result = requireUncached('./');
	t.is(result.stdout.level, 2);
});

test('support putty-256color', function (t) {
	process.env = {TERM: 'putty-256color'};

	var result = requireUncached('./');
	t.is(result.stdout.level, 2);
});

test('level should be 3 when using iTerm 3.0', function (t) {
	Object.defineProperty(process, 'platform', {
		value: 'darwin'
	});
	process.env = {
		TERM_PROGRAM: 'iTerm.app',
		TERM_PROGRAM_VERSION: '3.0.10'
	};

	var result = requireUncached('./');
	t.is(result.stdout.level, 3);
});

test('level should be 2 when using iTerm 2.9', function (t) {
	Object.defineProperty(process, 'platform', {
		value: 'darwin'
	});
	process.env = {
		TERM_PROGRAM: 'iTerm.app',
		TERM_PROGRAM_VERSION: '2.9.3'
	};

	var result = requireUncached('./');
	t.is(result.stdout.level, 2);
});

test('return level 1 if on Windows earlier than 10 build 10586 and Node version is < 8.0.0', function (t) {
	Object.defineProperty(process, 'platform', {
		value: 'win32'
	});
	Object.defineProperty(process.versions, 'node', {
		value: '7.5.0'
	});
	os.release = function () {
		return '10.0.10240';
	};

	var result = requireUncached('./');
	t.is(result.stdout.level, 1);
});

test('return level 1 if on Windows 10 build 10586 or later and Node version is < 8.0.0', function (t) {
	Object.defineProperty(process, 'platform', {
		value: 'win32'
	});
	Object.defineProperty(process.versions, 'node', {
		value: '7.5.0'
	});
	os.release = function () {
		return '10.0.10586';
	};

	var result = requireUncached('./');
	t.is(result.stdout.level, 1);
});

test('return level 1 if on Windows earlier than 10 build 10586 and Node version is >= 8.0.0', function (t) {
	Object.defineProperty(process, 'platform', {
		value: 'win32'
	});
	Object.defineProperty(process.versions, 'node', {
		value: '8.0.0'
	});
	os.release = function () {
		return '10.0.10240';
	};

	var result = requireUncached('./');
	t.is(result.stdout.level, 1);
});

test('return level 2 if on Windows 10 build 10586 or later and Node version is >= 8.0.0', function (t) {
	Object.defineProperty(process, 'platform', {
		value: 'win32'
	});
	Object.defineProperty(process.versions, 'node', {
		value: '8.0.0'
	});
	os.release = function () {
		return '10.0.10586';
	};

	var result = requireUncached('./');
	t.is(result.stdout.level, 2);
});

test('return level 3 if on Windows 10 build 14931 or later and Node version is >= 8.0.0', function (t) {
	Object.defineProperty(process, 'platform', {
		value: 'win32'
	});
	Object.defineProperty(process.versions, 'node', {
		value: '8.0.0'
	});
	os.release = function () {
		return '10.0.14931';
	};

	var result = requireUncached('./');
	t.is(result.stdout.level, 3);
});

test('return level 2 when FORCE_COLOR is set when not TTY in xterm256', function (t) {
	process.stdout.isTTY = false;
	process.env.FORCE_COLOR = true;
	process.env.TERM = 'xterm-256color';

	var result = requireUncached('./');
	t.truthy(result.stdout);
	t.is(result.stdout.level, 2);
});
