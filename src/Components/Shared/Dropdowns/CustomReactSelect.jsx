import React, { useContext, useRef, forwardRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select, { components } from 'react-select';
import AuthContext from '../../../Store/Auth-Context';
import { handleStoreDropdownItems } from '../../../Redux/slices/associationSlice';
import { Message, toaster } from 'rsuite';
const icons = {
  jira: '/jira_logo.png',
  gitlab: '/gitlab_logo.png',
  glide: '/glide_logo.png',
  valispace: '/valispace_logo.png',
  codebeamer: '/codebeamer_logo.png',
  default: '/default_logo.png',
};

const CustomReactSelect = forwardRef((props, ref) => {
  const {
    apiURL,
    apiQueryParams,
    placeholder,
    onChange,
    disabled,
    customLabelKey,
    value,
    isLinkCreation,
    isApplication,
    isValispace,
    isIntegration,
    isEventAssociation,
    isUpdateState,
    restartRequest,
    removeApplication,
    getErrorStatus,
    ...rest
  } = props;

  const [option, setOption] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkPagination, setCheckPagination] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize] = useState(100);
  const [dropdownData, setDropdownData] = useState([]);
  const { isDark } = useSelector((state) => state.nav);
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  const showNotification = (type, message) => {
    if (type && message) {
      const messages = (
        <Message closable showIcon type={type}>
          {message}
        </Message>
      );
      toaster.push(messages, { placement: 'bottomCenter', duration: 5000 });
    }
  };

  const fetchOptions = async (pageNumber, itemsPerPage) => {
    const queryPath = apiQueryParams ? apiQueryParams : null;
    let url = `${apiURL}?page=${pageNumber}&per_page=${itemsPerPage}`;
    if (queryPath) url = `${url}&${queryPath}`;

    if (apiURL && !isValispace) {
      setIsLoading(true);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          authorization: 'Bearer ' + authCtx.token,
        },
      })
        .then((res) => {
          if (res.ok) {
            if (res.status !== 204) {
              return res.json();
            }
          } else {
            if (getErrorStatus) {
              getErrorStatus();
            }
            res.json().then((data) => {
              showNotification('error', data?.message);
            });
          }
        })
        .catch(() => {});
      setIsLoading(false);
      setCheckPagination(response);
      if (response?.items) return response.items;
    }
    return [];
  };

  // handle load more
  const handleLoadMore = async (isNotScrolled = false) => {
    if (option?.length) {
      if (checkPagination?.has_next) {
        const newOptions = await fetchOptions(page + 1, pageSize);
        setOption((prevOptions) => [...prevOptions, ...newOptions]);
        setPage(page + 1);
      }
    }
    if (isNotScrolled) {
      const newOptions = await fetchOptions(page, pageSize);
      setOption(newOptions);
    }
  };

  // map dropdown items
  useEffect(() => {
    let dropdownJsonData = [];
    if (isApplication) {
      const valispaceApp = {
        name: 'Valispace',
        id: 50010,
        type: 'valispace',
      };
      const withHardCodeOption = [...option, valispaceApp];
      dropdownJsonData = withHardCodeOption?.map((item) => {
        let appIcon = '';
        if (item?.type === 'gitlab') appIcon = icons.gitlab;
        else if (item?.type === 'glideyoke') appIcon = icons.glide;
        else if (item?.type === 'jira') appIcon = icons.jira;
        else if (item?.type === 'valispace') appIcon = icons.valispace;
        else if (item?.type === 'codebeamer') appIcon = icons.codebeamer;
        else {
          appIcon = icons.default;
        }
        return {
          ...item,
          label: item?.name,
          value: item?.id,
          icon: appIcon,
        };
      });
    } else if (customLabelKey) {
      dispatch(handleStoreDropdownItems({ label: customLabelKey, data: option }));

      dropdownJsonData = option?.map((item) => {
        return {
          label: item[customLabelKey] ? item[customLabelKey] : item.name,
          value: item.id,
          item,
        };
      });
    } else if (isEventAssociation) {
      dropdownJsonData = option?.map((item) => ({
        ...item,
        label: item?.service_provider_id,
        value: item?.id,
      }));
    } else if (isValispace) {
      const hardCodeProject = [
        {
          name: 'Valispace ST-100 (VALISPACE)',
          id: 1000010,
          application: { type: 'valispace' },
        },
      ];
      dropdownJsonData = hardCodeProject?.map((item) => ({
        ...item,
        label: item?.name || item?.label,
        value: item?.id,
      }));
    } else {
      dropdownJsonData = option?.map((item) => ({
        ...item,
        label: isIntegration ? item?.project?.name : item?.name || item?.label,
        value: item?.id,
      }));
    }
    if (removeApplication) {
      const newDropdownJsonData = dropdownJsonData.filter((item) => {
        if (item?.type !== removeApplication) {
          return item;
        }
      });
      dropdownJsonData = newDropdownJsonData;
    }

    setDropdownData(dropdownJsonData);
  }, [option]);

  // load dropdown item first time
  useEffect(() => {
    let isNotScrolled = true;
    handleLoadMore(isNotScrolled);
  }, [isUpdateState, restartRequest]);

  // react select menu items style
  const customOption = (props) => {
    return (
      <components.Option {...props}>
        <div className="react-select-display-icon-container">
          {props.data?.icon && (
            <img src={props.data?.icon} style={{ height: 20 }} alt={props.data?.label} />
          )}

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
          {props.data?.icon && (
            <img src={props.data?.icon} style={{ height: 20 }} alt={props.data?.label} />
          )}

          <p style={{ color: isDark === 'dark' ? '#34c3ff' : '#1675e0' }}>
            {props.data?.label}
          </p>
        </div>
      </components.SingleValue>
    );
  };

  // handle load more data on Scroll
  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    const nearBottomThreshold = 10;

    if (scrollTop + clientHeight > scrollHeight - nearBottomThreshold) {
      handleLoadMore();
    }
  };

  // control menu list for loading data by scroll bottom
  const MenuList = (props) => {
    const menuListRef = useRef(null);
    useEffect(() => {
      if (menuListRef.current) {
        const menuDiv = menuListRef.current.querySelector('div');
        menuDiv.onscroll = (e) => handleScroll(e);
        menuDiv.style.maxHeight = '200px';
      }
    }, [menuListRef]);

    return (
      <div ref={menuListRef}>
        <components.MenuList {...props}>{props.children}</components.MenuList>
      </div>
    );
  };

  return (
    <Select
      value={value ? dropdownData?.find((v) => v?.value === value) : null}
      ref={ref}
      {...rest}
      className={isDark === 'dark' ? 'reactSelectContainer' : ''}
      classNamePrefix={isDark === 'dark' ? 'reactSelect' : ''}
      options={dropdownData}
      placeholder={<p style={{ fontSize: '17px' }}>{placeholder}</p>}
      onChange={(v) => {
        if (isLinkCreation) onChange(v || null);
        else {
          onChange(v?.value || null);
        }
      }}
      isClearable
      isDisabled={disabled}
      isLoading={isLoading}
      isSearchable={true}
      menuPlacement="bottom"
      name={name}
      components={{
        SingleValue: customSingleValue,
        Option: customOption,
        MenuList: MenuList,
      }}
    />
  );
});

CustomReactSelect.displayName = 'CustomReactSelect';

export default CustomReactSelect;
