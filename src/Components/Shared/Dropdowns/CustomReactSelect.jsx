import React, { useContext, useRef, forwardRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select, { components } from 'react-select';
import AuthContext from '../../../Store/Auth-Context';
import { handleStoreDropdownItems } from '../../../Redux/slices/associationSlice';

const CustomReactSelect = forwardRef((props, ref) => {
  const {
    apiURL,
    apiQueryParams,
    requestStatus,
    placeholder,
    onChange,
    disabled,
    customLabelKey,
    value,
    ...rest
  } = props;

  const [option, setOption] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkPagination, setCheckPagination] = useState({});
  const [page, setPage] = useState(1);
  const [dropdownData, setDropdownData] = useState([]);
  const { isDark } = useSelector((state) => state.nav);
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  const fetchOptions = async (page) => {
    const queryPath = apiQueryParams ? apiQueryParams : null;
    let url = `${apiURL}?page=${page}&per_page=${'25'}`;
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
            requestStatus('error', res);
          }
        })
        .catch((error) => console.log(error));
      setIsLoading(false);
      setCheckPagination(response);
      if (response?.items) return response.items;
    }
    return [];
  };

  // handle load more
  const handleLoadMore = async () => {
    if (option?.length) {
      if (checkPagination?.has_next) {
        const newOptions = await fetchOptions(page + 1);
        setOption([...option, ...newOptions]);
        setPage(page + 1);
      }
    } else {
      const newOptions = await fetchOptions(page);
      setOption([...option, ...newOptions]);
    }
  };

  // map dropdown items
  useEffect(() => {
    let dropdownJsonData = [];
    if (customLabelKey) {
      dispatch(handleStoreDropdownItems({ label: customLabelKey, data: option }));

      dropdownJsonData = option?.map((item) => {
        return {
          label: item[customLabelKey] ? item[customLabelKey] : item.name,
          value: item.id,
          item,
        };
      });
    } else {
      dropdownJsonData = option?.map((item) => ({
        label: item?.name || item?.label,
        value: item?.id,
        item,
      }));
    }
    setDropdownData(dropdownJsonData);
  }, [option]);

  // load dropdown item first time
  useEffect(() => {
    if (option.length === 0) {
      handleLoadMore();
    }
  }, [apiQueryParams, apiURL]);

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
        <components.MenuList {...props}>
          <div>{props.children}</div>
        </components.MenuList>
      </div>
    );
  };

  return (
    <Select
      value={dropdownData?.find((v) => v?.value === value)}
      ref={ref}
      {...rest}
      className={isDark === 'dark' ? 'reactSelectContainer' : ''}
      classNamePrefix={isDark === 'dark' ? 'reactSelect' : ''}
      options={dropdownData}
      placeholder={<p style={{ fontSize: '17px' }}>{placeholder}</p>}
      onChange={(v) => {
        onChange(v?.value || null);
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
