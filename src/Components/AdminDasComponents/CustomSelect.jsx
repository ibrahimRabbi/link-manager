import React, { useContext, useState, useEffect } from 'react';
import { SelectPicker } from 'rsuite';
import AuthContext from '../../Store/Auth-Context';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import { useDispatch } from 'react-redux';
import { handleStoreDropdownItems } from '../../Redux/slices/associationSlice';

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
  const {
    apiURL,
    apiQueryParams,
    requestStatus,
    placeholder,
    onChange,
    customLabelKey,
    ...rest
  } = props;
  const [option, setOption] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkPagination, setCheckPagination] = useState({});
  const [page, setPage] = useState(1);
  const [dropDownData, setDropdownData] = useState([]);
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  const fetchOptions = async (page) => {
    setIsLoading(true);
    const queryPath = apiQueryParams ? apiQueryParams : null;
    let url = `${apiURL}?page=${page}&per_page=${'10'}`;
    if (queryPath) {
      url = `${url}&${queryPath}`;
    }
    if (apiURL) {
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
  };

  useEffect(() => {
    (async () => {
      const newOptions = await fetchOptions(page);
      setOption([...newOptions]);
    })();
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
    if (customLabelKey) {
      dispatch(handleStoreDropdownItems({ label: customLabelKey, data: option }));

      dropdownJsonData = option?.map((item) => {
        return {
          label: item[customLabelKey] ? item[customLabelKey] : item.name,
          value: item.id,
        };
      });
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
      block
      size="lg"
      {...rest}
      ref={ref}
      data={dropDownData}
      menuMaxHeight={200}
      onSelect={(value) => onChange(value)}
      searchable={dropDownData?.length > 5}
      placeholder={<p style={{ fontSize: '17px' }}>{placeholder}</p>}
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
