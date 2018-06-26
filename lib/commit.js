const inquirer = require('inquirer');
const commitTypes = require('conventional-commit-types');
const pluralize = require('pluralize');
const git = require('simple-git/promise')();

const commitTypeKeys = Object.keys(commitTypes.types);

module.exports = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'commitType',
      message: 'What type of change are you committing?',
      pageSize: commitTypeKeys.length,
      choices: commitTypeKeys.map((typeKey) => {
        const type = commitTypes.types[typeKey];
        const title = pluralize.singular(type.title);

        return {
          name: type.description,
          short: title,
          value: typeKey,
        };
      }),
    },
    {
      type: 'input',
      name: 'commitMessage',
      message: 'Write a brief description of the change',
    },
    {
      type: 'confirm',
      name: 'hasIssue',
      message: 'Does this change affect any open issues?',
      default: false,
    },
    {
      type: 'input',
      name: 'issueNumber',
      message: 'Enter the issue number this change is associated with',
      when({ hasIssue }) {
        return hasIssue;
      },
    },
  ]);

  // Create the commit message
  const baseMessage = `${answers.commitType}: ${answers.commitMessage}`;
  const issueSuffix = answers.hasIssue ? ` (#${answers.issueNumber})` : '';
  const commitMessage = `${baseMessage}${issueSuffix}`;

  // Create the commit
  await git.commit(commitMessage);
};
