import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faBug,
  faCode,
  faCodeCompare,
  faCube,
  faFileCircleCheck,
  faFileLines,
  faFlask,
  faListCheck,
  faPlus,
  faRocket,
  faSquareCheck,
  faVialCircleCheck,
  faVials,
  faVialVirus,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';

const gitlabIcon = {
  Source_code: (
    <FontAwesomeIcon icon={faFileLines} style={{ color: '#fc722e', fontSize: '20px' }} />
  ),
  Block_code: (
    <FontAwesomeIcon icon={faCode} style={{ color: '#fc7238', fontSize: '20px' }} />
  ),
};
const jiraIcon = {
  Task: (
    <FontAwesomeIcon
      icon={faSquareCheck}
      style={{ color: '#2185ff', fontSize: '20px' }}
    />
  ),
  subT: (
    <FontAwesomeIcon
      icon={faSquareCheck}
      style={{ color: '#2185ff', fontSize: '20px' }}
    />
  ),
  Epic: (
    <FontAwesomeIcon icon={faListCheck} style={{ color: '#2185ff', fontSize: '20px' }} />
  ),
  UserStory: (
    <FontAwesomeIcon
      icon={faFileCircleCheck}
      style={{ color: '#2185ff', fontSize: '20px' }}
    />
  ),
  Issues: <FontAwesomeIcon icon={faBug} style={{ color: '#e5493a', fontSize: '20px' }} />,
  Improvement: (
    <FontAwesomeIcon icon={faArrowUp} style={{ color: '#2185ff', fontSize: '20px' }} />
  ),
  New_feature: (
    <FontAwesomeIcon icon={faPlus} style={{ color: '#2185ff', fontSize: '20px' }} />
  ),
};
const codebeamerIcon = {
  Releases: (
    <FontAwesomeIcon icon={faRocket} style={{ color: '#20a99d', fontSize: '20px' }} />
  ),
  Documents: (
    <FontAwesomeIcon icon={faFileLines} style={{ color: '#20a99c', fontSize: '20px' }} />
  ),
  requirement_specification: (
    <FontAwesomeIcon
      icon={faFileCircleCheck}
      style={{ color: '#20a99c', fontSize: '20px' }}
    />
  ),
  Hardware_tasks: (
    <FontAwesomeIcon
      icon={faSquareCheck}
      style={{ color: '#20a99d', fontSize: '20px' }}
    />
  ),
  Software_tasks: (
    <FontAwesomeIcon
      icon={faSquareCheck}
      style={{ color: '#20a99d', fontSize: '20px' }}
    />
  ),
  Change_requests: (
    <FontAwesomeIcon
      icon={faCodeCompare}
      style={{ color: '#20a99d', fontSize: '20px' }}
    />
  ),
  Risks: <FontAwesomeIcon icon={faBug} style={{ color: '#e5493a', fontSize: '20px' }} />,
  Test_cases: (
    <FontAwesomeIcon icon={faVials} style={{ color: '#20a99e', fontSize: '20px' }} />
  ),
  Test_sets: (
    <FontAwesomeIcon icon={faFlask} style={{ color: '#20a99d', fontSize: '20px' }} />
  ),
  Test_configuration: (
    <FontAwesomeIcon icon={faVialVirus} style={{ color: '#20a99d', fontSize: '20px' }} />
  ),
  Bugs: <FontAwesomeIcon icon={faBug} style={{ color: '#e5493a', fontSize: '20px' }} />,
  Epics: (
    <FontAwesomeIcon icon={faListCheck} style={{ color: '#20a99c', fontSize: '20px' }} />
  ),
  Test_Configurations: (
    <FontAwesomeIcon icon={faVialVirus} style={{ color: '#20a99d', fontSize: '20px' }} />
  ),
  Timekeeping: (
    <FontAwesomeIcon
      icon={faSquareCheck}
      style={{ color: '#20a99c', fontSize: '20px' }}
    />
  ),
  User_Stories: (
    <FontAwesomeIcon
      icon={faFileCircleCheck}
      style={{ color: '#20a99c', fontSize: '20px' }}
    />
  ),
  Test_Runs: (
    <FontAwesomeIcon
      icon={faVialCircleCheck}
      style={{ color: '#20a99d', fontSize: '20px' }}
    />
  ),
};
const glideYokeIcon = {
  Physical_parts: (
    <FontAwesomeIcon icon={faCube} style={{ color: '#8b8d92', fontSize: '20px' }} />
  ),
  Issues: <FontAwesomeIcon icon={faBug} style={{ color: '#e5493a', fontSize: '20px' }} />,
  Document: (
    <FontAwesomeIcon icon={faFileLines} style={{ color: '#8b8d92', fontSize: '20px' }} />
  ),
  Change_requests: (
    <FontAwesomeIcon
      icon={faCodeCompare}
      style={{ color: '#8b8d92', fontSize: '20px' }}
    />
  ),
};
const dngIcon = {
  Requirement: (
    <FontAwesomeIcon
      icon={faFileCircleCheck}
      style={{ color: '#367aa0', fontSize: '20px' }}
    />
  ),
  Requirement_collection: (
    <FontAwesomeIcon icon={faListCheck} style={{ color: '#367ba1', fontSize: '20px' }} />
  ),
};
const valispaceIcon = {
  Requirement: (
    <FontAwesomeIcon
      icon={faFileCircleCheck}
      style={{ color: '#f1b96d', fontSize: '20px' }}
    />
  ),
};

export const getIcon = (applicationType, resourceType) => {
  let appIcon = '';
  if (applicationType === 'gitlab') {
    if (resourceType === 'Source Code File' || resourceType === 'Repository File')
      appIcon = gitlabIcon.Source_code;
    else if (resourceType === 'Block of code') appIcon = gitlabIcon.Block_code;
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
