export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Disable commit body line length check
    'body-max-line-length': [0, 'always'],

    // Set maximum header length
    'header-max-length': [2, 'always', 250],

    // Allowed commit types
    'type-enum': [
      2,
      'always',
      [
        'feat', // new feature
        'fix', // bug fix
        'docs', // documentation changes
        'style', // formatting, missing semicolons, etc.; no code change
        'refactor', // refactoring production code
        'test', // adding missing tests, refactoring tests; no production code change
        'chore', // updating build tasks, package manager configs, etc.; no production code change
        'perf', // code changes that improve performance
        'ci', // changes to CI configuration and scripts
        'build', // changes that affect the build system or external dependencies
        'revert', // reverts a previous commit
      ],
    ],
  },
};
