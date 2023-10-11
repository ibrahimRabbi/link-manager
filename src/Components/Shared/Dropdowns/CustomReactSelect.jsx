import React, { useContext, useRef, forwardRef, useEffect } from 'react';
import { useState } from 'react';
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
  dng: '/dng_logo.png',
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
    isResourceType,
    selectedLinkType,
    isIntegration,
    isEventAssociation,
    isUpdateState,
    restartRequest,
    removeApplication,
    getErrorStatus,
    isLinkType,
    isMulti,
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

    if (apiURL) {
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
      if (response?.items) {
        return response.items;
      }
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
      let applicationsForLinks = [];
      if (isLinkCreation) {
        // filter application by domain
        applicationsForLinks = selectedLinkType?.target_resource?.reduce(
          (accumulator, item) => {
            const apps = {
              gitlab: '',
              glideYoke: '',
              jira: '',
              valispace: '',
              codebeamer: '',
              dng: '',
            };
            // domains for the filter application when creating links
            const gitlabDomain = ['http://open-services.net/ns/scm#'];
            const valispaceDomain = ['http://open-services.net/ns/rm#'];
            const dngDomain = ['http://open-services.net/ns/rm#'];
            const codeBeamerDomain = [
              'http://open-services.net/ns/rm#',
              'http://open-services.net/ns/qm#',
            ];
            const jiraDomain = [
              'http://open-services.net/ns/cm#',
              'http://open-services.net/ns/rm#',
            ];
            const glideYokeDomain = [
              'http://open-services.net/ns/plm#',
              'http://open-services.net/ns/cm#',
            ];

            const urlType = item?.type.split('#')[0] + '#';

            if (urlType?.includes(gitlabDomain[0])) apps['gitlab'] = 'gitlab';
            if (urlType?.includes(codeBeamerDomain[0])) apps['codebeamer'] = 'codebeamer';
            if (urlType?.includes(codeBeamerDomain[1])) apps['codebeamer'] = 'codebeamer';
            if (urlType?.includes(valispaceDomain[0])) apps['valispace'] = 'valispace';
            if (urlType?.includes(dngDomain[0])) apps['dng'] = 'dng';
            if (urlType?.includes(jiraDomain[0])) apps['jira'] = 'jira';
            if (urlType?.includes(jiraDomain[1])) apps['jira'] = 'jira';
            if (urlType?.includes(glideYokeDomain[0])) apps['glideYoke'] = 'glideyoke';
            if (urlType?.includes(glideYokeDomain[1])) apps['glideYoke'] = 'glideyoke';

            option?.forEach((app) => {
              // eslint-disable-next-line max-len
              if (
                app.type === apps.gitlab ||
                app.type === apps.glideYoke ||
                app.type === apps.jira ||
                app.type === apps.valispace ||
                app.type === apps.codebeamer ||
                app.type === apps.dng
              ) {
                const existingObject = accumulator.find(
                  (obj) => obj.id === app.id && obj.name === app.name,
                );
                if (!existingObject) {
                  accumulator.push(app);
                }
              }
            });
            return accumulator;
          },
          [],
        );
      }

      if (removeApplication) {
        if (removeApplication === 'glide') {
          applicationsForLinks = applicationsForLinks?.filter((item) => {
            if (item?.type !== 'glideyoke') {
              return item;
            }
          });
        }
        applicationsForLinks = applicationsForLinks?.filter((item) => {
          if (item?.type !== removeApplication) {
            return item;
          }
        });
      }

      const mapData = isLinkCreation ? applicationsForLinks : option;
      const newApps = mapData?.map((item) => {
        let appIcon = '';
        if (item?.type === 'gitlab') appIcon = icons.gitlab;
        else if (item?.type === 'glideyoke') appIcon = icons.glide;
        else if (item?.type === 'jira') appIcon = icons.jira;
        else if (item?.type === 'valispace') appIcon = icons.valispace;
        else if (item?.type === 'codebeamer') appIcon = icons.codebeamer;
        else if (item?.type === 'dng') appIcon = icons.dng;
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
      return setDropdownData(newApps);
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
    } else if (isLinkType) {
      dropdownJsonData = option?.map((item) => ({
        ...item,
        // eslint-disable-next-line max-len
        target_resource: item?.target_link?.constraints?.map((constraint) => constraint),
        label: item?.source_link?.name,
        value: item?.id,
      }));
    } else if (isResourceType) {
      dropdownJsonData = option?.map((item) => {
        let appIcon = '';
        if (item?.api === 'gitlab') appIcon = icons.gitlab;
        else if (item?.api === 'glideyoke') appIcon = icons.glide;
        else if (item?.api === 'jira') appIcon = icons.jira;
        else if (item?.api === 'valispace') appIcon = icons.valispace;
        else if (item?.api === 'codebeamer') appIcon = icons.codebeamer;
        else if (item?.api === 'dng') appIcon = icons.dng;
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
    } else {
      dropdownJsonData = option?.map((item) => ({
        ...item,
        label: isIntegration ? item?.project?.name : item?.name || item?.label,
        value: item?.id,
      }));
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
      value={
        value ? (isMulti ? value : dropdownData?.find((v) => v?.value === value)) : null
      }
      ref={ref}
      {...rest}
      className={isDark === 'dark' ? 'reactSelectContainer' : ''}
      classNamePrefix={isDark === 'dark' ? 'reactSelect' : ''}
      options={dropdownData}
      placeholder={<p style={{ fontSize: '17px' }}>{placeholder}</p>}
      onChange={(v) => {
        if (isLinkCreation || isMulti) onChange(v || null);
        else {
          onChange(v?.value || null);
        }
      }}
      isClearable
      isMulti={isMulti}
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
