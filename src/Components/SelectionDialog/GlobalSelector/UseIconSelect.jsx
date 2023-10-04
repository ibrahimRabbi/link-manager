import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Select, { components } from 'react-select';
import {
  faSquareCheck,
  faListCheck,
  faFileCircleCheck,
  faBug,
  faArrowUp,
  faPlus,
  faRocket,
  faFileLines,
  faCodeCompare,
  faVials,
  faFlask,
  faVialVirus,
  faVialCircleCheck,
  faCube,
} from '@fortawesome/free-solid-svg-icons';

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
const UseIconSelect = (props) => {
  const { name, items, appData, onChange, placeholder, isLoading, disabled, isMulti } =
    props;
  console.log(appData);
  const [selectOptions, setSelectOptions] = useState([]);
  const { isDark } = useSelector((state) => state.nav);

  // map dropdown items
  useEffect(() => {
    const newItems = items?.map((item) => {
      let appIcon = '';
      if (appData?.application_type === 'jira' || appData?.type === 'jira') {
        if (item?.name === 'Tasks') appIcon = jiraIcon.Task;
        else if (item?.name === 'Epics') appIcon = jiraIcon.Epic;
        else if (item?.name === 'User Stories') appIcon = jiraIcon.UserStory;
        else if (item?.name === 'Bugs') appIcon = jiraIcon.Issues;
        else if (item?.name === 'Improvements') appIcon = jiraIcon.Improvement;
        else if (item?.name === 'New Features') appIcon = jiraIcon.New_feature;
        else appIcon = jiraIcon.subT;
      } else if (
        appData?.application_type === 'codebeamer' ||
        appData?.type === 'codebeamer'
      ) {
        if (item?.name === 'Releases') appIcon = codebeamerIcon.Releases;
        else if (item?.name === 'Documents') appIcon = codebeamerIcon.Documents;
        else if (item?.name === 'Change Requests')
          appIcon = codebeamerIcon.Change_requests;
        else if (item?.name === 'Hardware Tasks') appIcon = codebeamerIcon.Hardware_tasks;
        else if (item?.name === 'Software Tasks') appIcon = codebeamerIcon.Software_tasks;
        else if (item?.name === 'Risk') appIcon = codebeamerIcon.Risks;
        else if (item?.name === 'Test Cases') appIcon = codebeamerIcon.Test_cases;
        else if (item?.name === 'Test Sets') appIcon = codebeamerIcon.Test_sets;
        else if (item?.name === 'Test Configuration')
          appIcon = codebeamerIcon.Test_configuration;
        else if (item?.name === 'Test Runs') appIcon = codebeamerIcon.Test_Runs;
        else if (item?.name === 'Bugs') appIcon = codebeamerIcon.Bugs;
        else if (item.name === 'Public DOcuments') appIcon = codebeamerIcon.Documents;
        else if (item.name === 'Accounts') appIcon = codebeamerIcon.Documents;
        else if (item.name === 'Opportunities') appIcon = codebeamerIcon.Documents;
        else if (item.name === 'Prospects') appIcon = codebeamerIcon.Documents;
        else if (item.name === 'Leads') appIcon = codebeamerIcon.Documents;
        else if (item.name === 'Activities') appIcon = codebeamerIcon.Documents;
        else if (item.name === 'Epics') appIcon = codebeamerIcon.Epics;
        else if (item.name === 'Test Configurations')
          appIcon = codebeamerIcon.Test_Configurations;
        else if (item.name === 'Backlog Items') appIcon = codebeamerIcon.Timekeeping;
        else if (item.name === 'Timekeeping') appIcon = codebeamerIcon.Timekeeping;
        else if (item.name === 'Tasks') appIcon = codebeamerIcon.Timekeeping;
        else if (item.name === 'User Stories') appIcon = codebeamerIcon.User_Stories;
        else appIcon = codebeamerIcon.requirement_specification;
      } else if (appData?.application_type === 'dng' || appData?.type === 'dng') {
        if (item?.name === 'Requirements') appIcon = dngIcon.Requirement;
        else appIcon = dngIcon.Requirement_collection;
      } else if (appData?.application_type === 'valispace') {
        if (item?.name === 'Requirements') {
          appIcon = valispaceIcon.Requirement;
        }
      } else if (appData?.type === 'valispace') {
        if (item?.name === 'Requirements') {
          appIcon = valispaceIcon.Requirement;
        }
      } else {
        if (item?.name === 'Documents') appIcon = glideYokeIcon.Document;
        else if (item?.name === 'Physical Parts') appIcon = glideYokeIcon.Physical_parts;
        else if (item?.name === 'Change Requests')
          appIcon = glideYokeIcon.Change_requests;
        else appIcon = glideYokeIcon.Issues;
      }
      return {
        ...item,
        label: item?.name,
        value: item?.name,
        icon: appIcon,
      };
    });
    setSelectOptions(newItems);
  }, [items, appData]);

  // react select menu items style
  const customOption = (props) => {
    return (
      <components.Option {...props}>
        <div className="react-select-display-icon-container">
          {props.data?.icon}

          <p>{props.data?.label}</p>
        </div>
      </components.Option>
    );
  };

  // react select main input container style
  const customSingleValue = (props) => {
    return (
      <components.SingleValue {...props}>
        <div className="react-select-display-icon-container">
          {props.data?.icon}

          <p style={{ color: isDark === 'dark' ? '#34c3ff' : '#1675e0' }}>
            {props.data?.label}
          </p>
        </div>
      </components.SingleValue>
    );
  };

  return (
    <Select
      className={isDark === 'dark' ? 'reactSelectContainer' : ''}
      classNamePrefix={isDark === 'dark' ? 'reactSelect' : ''}
      options={selectOptions}
      placeholder={<p>{placeholder}</p>}
      onChange={(v) => {
        onChange(v);
      }}
      isDisabled={disabled}
      isLoading={isLoading}
      isMulti={isMulti}
      isClearable={true}
      isSearchable={true}
      menuPlacement="auto"
      name={name}
      components={{
        SingleValue: customSingleValue,
        Option: customOption,
      }}
    />
  );
};

export default UseIconSelect;
