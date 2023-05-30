import React, { useContext, useState, useEffect } from 'react';
import { SelectPicker } from 'rsuite';
import AuthContext from '../../Store/Auth-Context';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';

const FixedLoader = () => (
  <h5
    style={{
      display: 'flex',
      justifyContent: 'center',
      position: 'absolute',
      bottom: '0',
      background: '#fff',
      width: '100%',
      padding: '4px 0',
    }}
  >
    <SpinnerIcon spin style={{ fontSize: '35px' }} />
  </h5>
);

const CustomSelect = React.forwardRef((props, ref) => {
  // eslint-disable-next-line max-len
  const { apiURL, placeholder, onChange, customSelectLabel, apiQueryParams, ...rest } =
    props;
  const [option, setOption] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkPagination, setCheckPagination] = useState({});
  const [page, setPage] = useState(1);
  const [dropDownData, setDropdownData] = useState([]);
  const authCtx = useContext(AuthContext);

  async function fetchOptions(page) {
    setIsLoading(true);
    const queryParams = apiQueryParams ? apiQueryParams : null;
    let url = `${apiURL}?page=${page}&per_page=${'10'}`;
    if (queryParams) {
      url = `${url}&${queryParams}`;
    }
    if (apiURL) {
      console.log('url', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          authorization: 'Bearer ' + authCtx.token,
        },
      });
      const data = await response.json();
      setIsLoading(false);
      setCheckPagination(data);
      if (data?.items) return data.items;
    }
    return [];
  }

  // handle load more
  async function handleLoadMore() {
    if (option.length) {
      if (checkPagination?.has_next) {
        const newOptions = await fetchOptions(page + 1);
        setOption([...option, ...newOptions]);
        setPage(page + 1);
      }
    } else {
      const newOptions = await fetchOptions(page);
      setOption([...option, ...newOptions]);
    }
  }

  useEffect(async () => {
    // console.log('New API URL', apiURL);
    // console.log('New API Query Params', apiQueryParams);
    const newOptions = await fetchOptions(page);
    setOption([...newOptions]);
  }, [apiURL, apiQueryParams]);

  useEffect(() => {
    getData();
  }, [option]);

  // load dropdown item first time
  useEffect(() => {
    if (option.length === 0) {
      handleLoadMore();
    }
  }, []);

  const getData = () => {
    let dropdownJsonData = [];
    if (customSelectLabel) {
      dropdownJsonData = option?.map((item) => ({
        label: item.name + ' - ' + item[customSelectLabel],
        value: JSON.stringify(item),
      }));
    } else {
      dropdownJsonData = option?.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    }
    setDropdownData(dropdownJsonData);
  };

  const onItemsRendered = (props) => {
    if (props.visibleStopIndex >= option.length - 1) {
      handleLoadMore();
    }
  };

  const renderMenu = (menu) => {
    return (
      <>
        {menu}
        {isLoading && <FixedLoader />}
      </>
    );
  };
  return (
    <SelectPicker
      menuMaxHeight={250}
      size="lg"
      block
      ref={ref}
      {...rest}
      data={dropDownData}
      onChange={(v) => onChange(v)}
      placeholder={<p style={{ fontSize: '17px' }}>{placeholder}</p>}
      virtualized
      renderMenu={renderMenu}
      listProps={{ onItemsRendered }}
      renderMenuItem={(label) => {
        return (
          <div className="selectPickerMenu">
            <p style={{ fontSize: '17px' }}>{label}</p>
          </div>
        );
      }}
      renderMenuGroup={(label) => {
        return (
          <div className="selectPickerMenu">
            <p style={{ fontSize: '17px' }}>{label}</p>
          </div>
        );
      }}
    />
  );
});

CustomSelect.displayName = 'CustomSelect';

export default CustomSelect;
