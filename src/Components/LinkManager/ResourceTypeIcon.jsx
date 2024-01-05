import React from 'react';
import { FaPlus } from 'react-icons/fa';
import {
  FaSquareCheck,
  FaListCheck,
  FaFileCircleCheck,
  FaBug,
  FaArrowUp,
  FaCode,
  FaRocket,
  FaFileLines,
  FaCodeCompare,
  FaVials,
  FaFlask,
  FaVialVirus,
  FaVialCircleCheck,
  FaCube,
} from 'react-icons/fa6';

const gitlabIcon = {
  Source_code: <FaFileLines style={{ color: '#fc722e', fontSize: '20px' }} />,
  Block_code: <FaCode style={{ color: '#fc7238', fontSize: '20px' }} />,
};

const bitbucketIcon = {
  Source_code: <FaFileLines style={{ color: '#2684ff', fontSize: '20px' }} />,
  Block_code: <FaCode style={{ color: '#2684ff', fontSize: '20px' }} />,
};

const githubIcon = {
  Source_code: <FaFileLines style={{ color: '#24292f', fontSize: '20px' }} />,
  Block_code: <FaCode style={{ color: '#24292f', fontSize: '20px' }} />,
};

const jiraIcon = {
  Task: <aSquareCheck style={{ color: '#2185ff', fontSize: '20px' }} />,
  subT: <FaSquareCheck style={{ color: '#2185ff', fontSize: '20px' }} />,
  Epic: <FaListCheck style={{ color: '#2185ff', fontSize: '20px' }} />,
  UserStory: <FaFileCircleCheck style={{ color: '#2185ff', fontSize: '20px' }} />,
  Issues: <FaBug style={{ color: '#e5493a', fontSize: '20px' }} />,
  Improvement: <FaArrowUp style={{ color: '#2185ff', fontSize: '20px' }} />,
  New_feature: <FaPlus style={{ color: '#2185ff', fontSize: '20px' }} />,
};
const codebeamerIcon = {
  Releases: <FaRocket style={{ color: '#20a99d', fontSize: '20px' }} />,
  Documents: <FaFileLines style={{ color: '#20a99c', fontSize: '20px' }} />,
  requirement_specification: (
    <FaFileCircleCheck style={{ color: '#20a99c', fontSize: '20px' }} />
  ),
  Hardware_tasks: <FaSquareCheck style={{ color: '#20a99d', fontSize: '20px' }} />,
  Software_tasks: <FaSquareCheck style={{ color: '#20a99d', fontSize: '20px' }} />,
  Change_requests: <FaCodeCompare style={{ color: '#20a99d', fontSize: '20px' }} />,
  Risks: <FaBug style={{ color: '#e5493a', fontSize: '20px' }} />,
  Test_cases: <FaVials style={{ color: '#20a99e', fontSize: '20px' }} />,
  Test_sets: <FaFlask style={{ color: '#20a99d', fontSize: '20px' }} />,
  Test_configuration: <FaVialVirus style={{ color: '#20a99d', fontSize: '20px' }} />,
  Bugs: <FaBug style={{ color: '#e5493a', fontSize: '20px' }} />,
  Epics: <FaListCheck style={{ color: '#20a99c', fontSize: '20px' }} />,
  Test_Configurations: <FaVialVirus style={{ color: '#20a99d', fontSize: '20px' }} />,
  Timekeeping: <FaSquareCheck style={{ color: '#20a99c', fontSize: '20px' }} />,
  User_Stories: <FaFileCircleCheck style={{ color: '#20a99c', fontSize: '20px' }} />,
  Test_Runs: <FaVialCircleCheck style={{ color: '#20a99d', fontSize: '20px' }} />,
};
const glideYokeIcon = {
  Physical_parts: <FaCube style={{ color: '#8b8d92', fontSize: '20px' }} />,
  Issues: <FaBug style={{ color: '#e5493a', fontSize: '20px' }} />,
  Document: <FaFileLines style={{ color: '#8b8d92', fontSize: '20px' }} />,
  Change_requests: <FaCodeCompare style={{ color: '#8b8d92', fontSize: '20px' }} />,
};
const dngIcon = {
  Requirement: <FaFileCircleCheck style={{ color: '#367aa0', fontSize: '20px' }} />,
  Requirement_collection: <FaListCheck style={{ color: '#367ba1', fontSize: '20px' }} />,
};
const valispaceIcon = {
  Requirement: <FaFileCircleCheck style={{ color: '#f1b96d', fontSize: '20px' }} />,
};

export const getIcon = (applicationType, resourceType) => {
  let appIcon = '';
  if (applicationType === 'gitlab') {
    if (resourceType === 'Source Code File' || resourceType === 'Repository File')
      appIcon = gitlabIcon.Source_code;
    else if (resourceType === 'Block of code') appIcon = gitlabIcon.Block_code;
  } else if (applicationType === 'bitbucket') {
    if (resourceType === 'Source Code File' || resourceType === 'Repository File')
      appIcon = bitbucketIcon.Source_code;
    else if (resourceType === 'Block of code') appIcon = bitbucketIcon.Block_code;
  } else if (applicationType === 'github') {
    if (resourceType === 'Source Code File' || resourceType === 'Repository File')
      appIcon = githubIcon.Source_code;
    else if (resourceType === 'Block of code') appIcon = githubIcon.Block_code;
  } else if (applicationType === 'jira') {
    if (resourceType === 'Tasks') appIcon = jiraIcon.Task;
    else if (resourceType === 'Epics') appIcon = jiraIcon.Epic;
    else if (resourceType === 'User Stories') appIcon = jiraIcon.UserStory;
    else if (resourceType === 'Bugs') appIcon = jiraIcon.Issues;
    else if (resourceType === 'Improvements') appIcon = jiraIcon.Improvement;
    else if (resourceType === 'New Features') appIcon = jiraIcon.New_feature;
    else appIcon = jiraIcon.subT;
  } else if (applicationType === 'codebeamer') {
    if (resourceType === 'Releases') appIcon = codebeamerIcon.Releases;
    else if (resourceType === 'Documents') appIcon = codebeamerIcon.Documents;
    else if (resourceType === 'Change Requests') appIcon = codebeamerIcon.Change_requests;
    else if (resourceType === 'Hardware Tasks') appIcon = codebeamerIcon.Hardware_tasks;
    else if (resourceType === 'Software Tasks') appIcon = codebeamerIcon.Software_tasks;
    else if (resourceType === 'Risk') appIcon = codebeamerIcon.Risks;
    else if (resourceType === 'Test Cases') appIcon = codebeamerIcon.Test_cases;
    else if (resourceType === 'Test Sets') appIcon = codebeamerIcon.Test_sets;
    else if (resourceType === 'Test Configuration')
      appIcon = codebeamerIcon.Test_configuration;
    else if (resourceType === 'Test Runs') appIcon = codebeamerIcon.Test_Runs;
    else if (resourceType === 'Bugs') appIcon = codebeamerIcon.Bugs;
    else if (resourceType === 'Public Documents') appIcon = codebeamerIcon.Documents;
    else if (resourceType === 'Accounts') appIcon = codebeamerIcon.Documents;
    else if (resourceType === 'Opportunities') appIcon = codebeamerIcon.Documents;
    else if (resourceType === 'Prospects') appIcon = codebeamerIcon.Documents;
    else if (resourceType === 'Leads') appIcon = codebeamerIcon.Documents;
    else if (resourceType === 'Activities') appIcon = codebeamerIcon.Documents;
    else if (resourceType === 'Epics') appIcon = codebeamerIcon.Epics;
    else if (resourceType === 'Test Configurations')
      appIcon = codebeamerIcon.Test_Configurations;
    else if (resourceType === 'Backlog Items') appIcon = codebeamerIcon.Timekeeping;
    else if (resourceType === 'Timekeeping') appIcon = codebeamerIcon.Timekeeping;
    else if (resourceType === 'Tasks') appIcon = codebeamerIcon.Timekeeping;
    else if (resourceType === 'User Stories') appIcon = codebeamerIcon.User_Stories;
    else appIcon = codebeamerIcon.requirement_specification;
  } else if (applicationType === 'dng') {
    if (resourceType === 'Requirements') appIcon = dngIcon.Requirement;
    else appIcon = dngIcon.Requirement_collection;
  } else if (applicationType === 'valispace') {
    appIcon = valispaceIcon.Requirement;
  } else {
    if (applicationType === 'glideyoke') {
      if (resourceType === 'Documents') appIcon = glideYokeIcon.Document;
      else if (resourceType === 'Physical Parts') appIcon = glideYokeIcon.Physical_parts;
      else if (resourceType === 'Change Requests')
        appIcon = glideYokeIcon.Change_requests;
      else appIcon = glideYokeIcon.Issues;
    }
  }
  return appIcon;
};
