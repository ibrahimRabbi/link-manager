import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AppSelectIcon from '@rsuite/icons/AppSelect';
import ScatterIcon from '@rsuite/icons/Scatter';
import WarningRoundIcon from '@rsuite/icons/WarningRound';
import PlusRoundIcon from '@rsuite/icons/PlusRound';
import AuthContext from '../../../Store/Auth-Context';
import {
  handleCurrPageTitle,
  handleIsAddNewModal,
  handleIsAdminEditing,
} from '../../../Redux/slices/navSlice';
import AdminDataTable from '../AdminDataTable';
import {
  FlexboxGrid,
  Form,
  Schema,
  Col,
  Button,
  Stack,
  Tooltip,
  Whisper,
  Message,
  toaster,
} from 'rsuite';
import AddNewModal from '../AddNewModal';
import { useRef } from 'react';
import SelectField from '../SelectField';
import UseLoader from '../../Shared/UseLoader';
import {
  fetchCreateData,
  fetchDeleteData,
  fetchGetData,
  fetchUpdateData,
} from '../../../Redux/slices/useCRUDSlice';

import { fetchOslcResource } from '../../../Redux/slices/oslcResourcesSlice.jsx';

import { actions as linkTypeActions } from '../../../Redux/slices/linkTypeSlice';
import { actions as oslcActions } from '../../../Redux/slices/oslcResourcesSlice';
import TextField from '../TextField.jsx';
import CustomReactSelect from '../../Shared/Dropdowns/CustomReactSelect';
import AlertModal from '../../Shared/AlertModal';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
  },
  {
    header: 'Link Type',
    key: 'label',
  },
  {
    header: 'Domain',
    key: 'oslc_domain',
  },
  {
    header: 'Updated',
    key: 'updated',
  },
];

const { StringType } = Schema.Types;

const LinkTypes = () => {
  const { crudData, isCreated, isDeleted, isUpdated, isCrudLoading } = useSelector(
    (state) => state.crud,
  );

  const { selectedLinkTypeCreationMethod, applicationType } = useSelector(
    (state) => state.linkTypes,
  );

  const {
    oslcCatalogInstanceShapeUrl,
    oslcProviderInstanceShapeUrl,
    oslcResourceShapeUrls,
    oslcFoundExternalLinks,
  } = useSelector((state) => state.oslcResources);

  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [registeredLinkTypes, setRegisteredLinkTypes] = useState([]);
  const [linkTypeResourceTypes, setLinkTypeResourceTypes] = useState([]);
  const [formElements, setFormElements] = useState([1]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [formValue, setFormValue] = useState({
    url_1: '',
    label_1: '',
    selectedOption: '',
  });
  const [open, setOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({});
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

  const [model, setModel] = useState(
    Schema.Model({
      url_1: StringType().isRequired('This field is required.'),
      label_1: StringType()
        .addRule((value) => {
          const regex = /^[A-Za-z]+$/;
          return regex.test(value);
        }, 'Please try to enter a label without spaces nor special characters.')
        .isRequired('This field is required.'),
      selectedOption: StringType().isRequired('This field is required.'),
    }),
  );
  const [resourceShapeData, setResourceShapeData] = useState({});
  const linkTypeFormRef = useRef();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  // Pagination
  const handlePagination = (value) => {
    setCurrPage(value);
  };

  const handleChangeLimit = (dataKey) => {
    setCurrPage(1);
    setPageSize(dataKey);
  };

  // handle open add modal
  const handleAddNew = () => {
    handleResetForm();
    dispatch(handleIsAddNewModal(true));
  };

  const handleSelectedNewLinkTypeMethod = (value) => {
    dispatch(linkTypeActions.handleSelectedLinkTypeCreationMethod(value));
    formValue['selectedOption'] = value;
    setFormValue({ ...formValue });
  };

  const handleApplication = (value) => {
    setLinkTypeResourceTypes([]);
    setRegisteredLinkTypes([]);
    setResourceTypes([]);
    dispatch(linkTypeActions.resetApplicationType());
    dispatch(oslcActions.resetRootservicesResponse());
    dispatch(oslcActions.resetOslcCatalogInstanceShape());
    dispatch(oslcActions.resetOslcProviderInstanceShape());
    dispatch(oslcActions.resetOslcResourceShape());
    if (value) {
      dispatch(linkTypeActions.handleApplicationType(value));
    }
  };

  const addExtraFormElements = () => {
    const lastElement = formElements[formElements.length - 1];
    const newElement = lastElement + 1;
    setFormElements([...formElements, newElement]);

    const newFormElements = [...formElements, newElement];

    let modelData = {};
    newFormElements.map((element) => {
      modelData[`url_${element}`] = StringType().isRequired('This field is required.');
      modelData[`label_${element}`] = StringType().addRule((value) => {
        const regex = /^[A-Za-z]+$/;
        return regex.test(value);
      }, 'Please try to enter a label without spaces nor special characters.');
    });

    modelData['selectedOption'] = StringType().isRequired('This field is required.');
    let newFormValue = {};
    newFormValue[`url_${newElement}`] = '';
    newFormValue[`label_${newElement}`] = '';
    setFormValue({ ...formValue, ...newFormValue });

    const newModel = Schema.Model(modelData);
    setModel(newModel);
  };

  const removeFormElement = (index) => {
    let newElements = [...formElements];
    let newFormValue = { ...formValue };
    if (newElements.length > 1) {
      newElements.splice(index, 1);
      newFormValue[`url_${index + 1}`] = 'ValueRemovedFromForm';
      newFormValue[`label_${index + 1}`] = 'ValueRemovedFromForm';
    }
    setFormElements(newElements);
    setFormValue(newFormValue);
  };

  const parseValue = (value) => {
    const words = value.split(/(?=[A-Z])/);
    const formattedWords = words.map((word) => {
      return word.toLowerCase().charAt(0).toUpperCase() + word.slice(1);
    });
    const sentence = formattedWords.join(' ');
    return sentence;
  };

  const showTooltip = (value) => {
    return <Tooltip>{value}</Tooltip>;
  };

  useEffect(() => {
    if (applicationType) {
      const getUrl = `${lmApiUrl}/application/${applicationType}`;
      dispatch(
        fetchGetData({
          url: getUrl,
          token: authCtx.token,
          stateName: 'selectedApplication',
        }),
      );
    }
  }, [applicationType]);

  useEffect(() => {
    if (crudData?.selectedApplication) {
      // eslint-disable-next-line max-len
      const rootservicesUrl = crudData?.selectedApplication?.rootservices_url;
      dispatch(
        fetchOslcResource({
          url: rootservicesUrl,
          token: '',
        }),
      );
    }
  }, [crudData?.selectedApplication]);

  useEffect(() => {
    if (oslcCatalogInstanceShapeUrl) {
      dispatch(
        fetchOslcResource({
          url: oslcCatalogInstanceShapeUrl,
          token: '',
          requestType: 'oslcCatalogInstanceShape',
        }),
      );
    }
  }, [oslcCatalogInstanceShapeUrl]);

  useEffect(() => {
    if (oslcProviderInstanceShapeUrl) {
      dispatch(
        fetchOslcResource({
          url: oslcProviderInstanceShapeUrl,
          token: '',
          requestType: 'oslcServiceProviderInstanceShape',
        }),
      );
    }
  }, [oslcProviderInstanceShapeUrl]);

  useEffect(() => {
    if (oslcResourceShapeUrls) {
      oslcResourceShapeUrls.map((url) => {
        dispatch(
          fetchOslcResource({
            url: url,
            token: '',
            requestType: 'oslcResourceShape',
          }),
        );
      });
    }
  }, [oslcResourceShapeUrls]);

  useEffect(() => {
    if (oslcFoundExternalLinks) {
      oslcFoundExternalLinks.map((resourceType) => {
        if (registeredLinkTypes.includes(resourceType.title) === false) {
          setRegisteredLinkTypes([...registeredLinkTypes, resourceType.title]);
          setResourceTypes([...resourceTypes, resourceType.resourceType]);
          setLinkTypeResourceTypes([
            ...linkTypeResourceTypes,
            {
              label: resourceType.title,
              value: resourceType.links,
            },
          ]);
        }
      });
    }
  }, [oslcFoundExternalLinks]);

  useEffect(() => {
    // eslint-disable-next-line max-len
    if (
      linkTypeResourceTypes.length > 0 &&
      selectedLinkTypeCreationMethod === 'external'
    ) {
      let newResourceShapeData = { ...resourceShapeData };
      linkTypeResourceTypes.map((resourceType) => {
        resourceType.value.map((link) => {
          const domain = link?.url.split('#')[0];
          const property = link?.url.split('#')[1];
          if (!(domain in newResourceShapeData)) {
            newResourceShapeData[domain] = [];
          }
          if (!newResourceShapeData[domain].includes(property)) {
            newResourceShapeData[domain].push(property);
          }
        });
      });
      setResourceShapeData(newResourceShapeData);
      let newFormValue = { ...formValue };
      newFormValue['resourceShapeData'] = newResourceShapeData;
      newFormValue['label_1'] = 'GettingDataFromResourceShape';
      newFormValue['url_1'] = 'GettingDataFromResourceShape';
      setFormValue(newFormValue);
    }
  }, [linkTypeResourceTypes]);

  const handleAddLinkType = () => {
    let payload = [];
    if (!linkTypeFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    } else if (isAdminEditing) {
      const putUrl = `${lmApiUrl}/link-type/${editData?.id}`;
      dispatch(
        fetchUpdateData({
          url: putUrl,
          token: authCtx.token,
          bodyData: formValue,
          showNotification: showNotification,
        }),
      );
    } else {
      if (formValue['selectedOption'] === 'external') {
        let addedResourceTypes = false;
        Object.entries(formValue).forEach(([key, value]) => {
          if (key.includes('resourceShapeData')) {
            Object.entries(value).forEach(function ([uri, labels]) {
              payload.push({
                oslc_domain: uri,
                labels: labels,
              });
            });
          }
          if (payload.length > 0 && !addedResourceTypes) {
            payload[0].resource_type = [];
            registeredLinkTypes.map((linkType, index) => {
              payload[0].resource_type.push({
                uri: linkType,
                label: resourceTypes[index],
              });
            });
          }
        });
      } else {
        let linkLabels = {};
        const data = Object.entries(formValue);
        for (const [key, value] of data) {
          if (key.includes('label')) {
            const replacedKey = key.replace('label', 'url');
            const arrayPosition = data.findIndex(([key]) => key === replacedKey);
            const domainUrl = data[arrayPosition][1];

            if (!(domainUrl in linkLabels)) {
              linkLabels[domainUrl] = [];
            }
            if (!linkLabels[domainUrl].includes(value)) {
              linkLabels[domainUrl].push(value);
            }
          }
        }
        Object.entries(linkLabels).forEach(([key, value]) => {
          payload.push({
            oslc_domain: key,
            labels: value,
          });
        });
      }
      const postUrl = `${lmApiUrl}/link-type`;
      dispatch(
        fetchCreateData({
          url: postUrl,
          token: authCtx.token,
          bodyData: payload,
          message: 'link type',
          showNotification: showNotification,
        }),
      );
    }
    dispatch(handleIsAddNewModal(false));
    if (isAdminEditing) dispatch(handleIsAdminEditing(false));
  };

  // reset form
  const handleResetForm = () => {
    setEditData({});
    setFormValue({
      label_1: '',
      url_1: '',
      selectedOption: '',
    });
    dispatch(linkTypeActions.resetSelectedLinkTypeCreationMethod());
    dispatch(linkTypeActions.resetApplicationType());
    setRegisteredLinkTypes([]);
    setLinkTypeResourceTypes([]);
    setFormElements([1]);
    setResourceTypes([]);
    dispatch(oslcActions.resetRootservicesResponse());
    dispatch(oslcActions.resetOslcCatalogInstanceShape());
    dispatch(oslcActions.resetOslcProviderInstanceShape());
    dispatch(oslcActions.resetOslcResourceShape());
  };

  // get all link types
  useEffect(() => {
    dispatch(handleCurrPageTitle('Link Types'));

    const getUrl = `${lmApiUrl}/link-type?page=${currPage}&per_page=${pageSize}`;
    dispatch(
      fetchGetData({
        url: getUrl,
        token: authCtx.token,
        stateName: 'allLinkTypes',
        showNotification: showNotification,
      }),
    );
  }, [isCreated, isUpdated, isDeleted, pageSize, currPage, refreshData]);

  // handle delete link type
  const handleDelete = (data) => {
    setDeleteData(data);
    setOpen(true);
  };
  const handleConfirmed = (value) => {
    if (value) {
      const deleteUrl = `${lmApiUrl}/link-type/${deleteData?.id}`;
      dispatch(
        fetchDeleteData({
          url: deleteUrl,
          token: authCtx.token,
          showNotification: showNotification,
        }),
      );
    }
  };
  // handle Edit link type
  const handleEdit = (data) => {
    setEditData(data);
    dispatch(handleIsAdminEditing(true));
    setFormValue({
      name: data?.name,
      url: data?.url,
      application_id: data?.application_id,
      incoming_label: data?.incoming_label,
      outgoing_label: data?.outgoing_label,
      description: data?.description,
    });
    dispatch(handleIsAddNewModal(true));
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Link Types',
    rowData: crudData?.allLinkTypes?.items?.length ? crudData?.allLinkTypes?.items : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    handleChangeLimit,
    totalItems: crudData?.allLinkTypes?.total_items,
    totalPages: crudData?.allLinkTypes?.total_pages,
    pageSize,
    page: crudData?.allLinkTypes?.page,
    inpPlaceholder: 'Search Link Type',
  };

  return (
    <div>
      <AddNewModal
        title={selectedLinkTypeCreationMethod ? 'Add link types' : 'Choose an option'}
        handleSubmit={handleAddLinkType}
        handleReset={handleResetForm}
      >
        <div className="show-grid">
          {!selectedLinkTypeCreationMethod ? (
            <FlexboxGrid justify="space-around">
              <FlexboxGrid.Item as={Col} colspan={24} md={10}>
                <Button
                  appearance="subtle"
                  block
                  size={'lg'}
                  onClick={() => handleSelectedNewLinkTypeMethod('external')}
                >
                  <AppSelectIcon fontSize={'6em'} color={'#3498FF'} />
                  <br />
                  <p style={{ marginTop: '10px' }}>Add from external application</p>
                </Button>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item as={Col} colspan={24} md={10}>
                <Button
                  appearance="subtle"
                  block
                  size={'lg'}
                  onClick={() => handleSelectedNewLinkTypeMethod('custom')}
                >
                  <ScatterIcon fontSize={'6em'} color={'#3498FF'} />
                  <br />
                  <p style={{ marginTop: '10px' }}>Add your own link type</p>
                </Button>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          ) : (
            <Form
              fluid
              ref={linkTypeFormRef}
              onChange={setFormValue}
              onCheck={setFormError}
              formValue={formValue}
              model={model}
            >
              {selectedLinkTypeCreationMethod === 'custom' ? (
                <FlexboxGrid justify="space-between">
                  {formElements.map((value, index) => (
                    <React.Fragment key={value}>
                      <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={10}>
                        <TextField
                          name={`label_${value}`}
                          label="Link Type label"
                          reqText="Link type label is required"
                        />
                      </FlexboxGrid.Item>
                      <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={10}>
                        <TextField
                          name={`url_${value}`}
                          label="domain"
                          reqText="URL domain is required"
                        />
                      </FlexboxGrid.Item>
                      <FlexboxGrid.Item
                        style={{
                          margin: '60px 0',
                          alignItems: 'center',
                          marginBottom: '5px',
                        }}
                        colspan={2}
                      >
                        <Button size={'sm'} onClick={() => removeFormElement(index)}>
                          {/* eslint-disable-next-line max-len */}
                          <WarningRoundIcon fontSize={'2em'} color={'red'} />
                        </Button>
                      </FlexboxGrid.Item>
                    </React.Fragment>
                  ))}

                  <Button
                    appearance="subtle"
                    block
                    size={'lg'}
                    onClick={() => addExtraFormElements()}
                  >
                    <PlusRoundIcon fontSize={'2em'} color={'#3498FF'} />
                    <br />
                  </Button>
                </FlexboxGrid>
              ) : (
                <FlexboxGrid justify="space-between">
                  <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
                    <SelectField
                      name="application_id"
                      label="Application"
                      placeholder="Select Application"
                      accepter={CustomReactSelect}
                      apiURL={`${lmApiUrl}/application`}
                      onChange={handleApplication}
                      isApplication={true}
                    />
                  </FlexboxGrid.Item>

                  {linkTypeResourceTypes.length > 0 && (
                    <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
                      <p
                        style={{
                          fontSize: '17px',
                          marginBottom: '10px',
                          textAlign: 'center',
                        }}
                      >
                        Found link types for:
                      </p>
                      {linkTypeResourceTypes.map((item, index) => (
                        <React.Fragment key={`linkResourceType-${index}`}>
                          {item?.value.length > 0 && (
                            <>
                              <h6
                                style={{
                                  marginBottom: '10px',
                                }}
                                key={index}
                              >
                                {item.label}:
                              </h6>
                              <Stack
                                direction={'row'}
                                alignItems={'center'}
                                justifyContent={'flex-start'}
                                wrap
                                spacing={20}
                              >
                                {item?.value.map((link, index) => (
                                  <React.Fragment key={`whisper-${index}`}>
                                    <Whisper
                                      placement="topEnd"
                                      controlId="control-id-hover"
                                      trigger="hover"
                                      speaker={showTooltip(link.url)}
                                    >
                                      <Button key={index} size="lg">
                                        {parseValue(link.value)}
                                      </Button>
                                    </Whisper>
                                  </React.Fragment>
                                ))}
                              </Stack>
                            </>
                          )}
                        </React.Fragment>
                      ))}
                    </FlexboxGrid.Item>
                  )}
                </FlexboxGrid>
              )}
            </Form>
          )}
        </div>
      </AddNewModal>

      {isCrudLoading && <UseLoader />}
      {/* confirmation modal  */}
      <AlertModal
        open={open}
        setOpen={setOpen}
        content={'Do you want to delete the this link type?'}
        handleConfirmed={handleConfirmed}
      />
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default LinkTypes;
