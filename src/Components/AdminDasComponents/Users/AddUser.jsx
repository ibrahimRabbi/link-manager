import React, { useEffect } from 'react';
import AuthContext from '../../../Store/Auth-Context';
import { Form, Button, Schema, FlexboxGrid, Message, toaster } from 'rsuite';
import TextField from '../TextField';
import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleIsAdminEditing } from '../../../Redux/slices/navSlice';
import { useMutation } from '@tanstack/react-query';
import fetchAPIRequest from '../../../apiRequests/apiRequest';
import SelectField from '../SelectField';
import CustomReactSelect from '../../Shared/Dropdowns/CustomReactSelect';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;
const { StringType, ArrayType } = Schema.Types;

const model = Schema.Model({
  first_name: StringType().isRequired('This field is required.'),
  last_name: StringType().isRequired('This field is required.'),
  username: StringType().isRequired('This field is required.'),
  email: StringType()
    .isEmail('Please enter a valid email address.')
    .isRequired('This field is required.'),
  projects: ArrayType(),
});

const AddUser = ({
  isUserSection,
  handleClose,
  editData,
  formValue,
  setFormValue,
  setCreateSuccess,
  setUpdateSuccess,
  createSuccess,
  updateSuccess,
  setCreateUpdateLoading,
  isSubmitClick,
}) => {
  const { isAdminEditing } = useSelector((state) => state.nav);
  const [formError, setFormError] = React.useState({});
  const userFormRef = React.useRef();
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

  // map projects data to not send duplicate values
  const mappedProjectList = formValue?.projects?.map((item) => ({
    id: item?.id,
    name: item?.name,
    organization_id: item?.organization_id,
    description: item?.description,
  }));

  const bodyData = { ...formValue, enabled: true, projects: mappedProjectList };

  // create data using react query
  const { isLoading: createLoading, mutate: createMutate } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: 'user',
        token: authCtx?.token,
        method: 'POST',
        body: bodyData,
        showNotification: showNotification,
      }),
    {
      onSettled: () => {
        setCreateUpdateLoading(false);
        setCreateSuccess(!createSuccess);
      },
    },
  );

  // update data using react query
  const { isLoading: updateLoading, mutate: updateMutate } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: `user/${editData?.id}`,
        token: authCtx?.token,
        method: 'PUT',
        body: bodyData,
        showNotification: showNotification,
      }),
    {
      onSettled: () => {
        setCreateUpdateLoading(false);
        setUpdateSuccess(!updateSuccess);
      },
    },
  );
  // set Create and update loading
  useEffect(() => {
    if (createLoading) setCreateUpdateLoading(createLoading);
    else if (updateLoading) setCreateUpdateLoading(updateLoading);
  }, [createLoading, updateLoading]);

  // handle create and update form submit
  const handleSubmit = () => {
    if (!userFormRef.current.check()) {
      return;
    } else if (isAdminEditing) {
      updateMutate();
    } else {
      createMutate();
    }
    // close modal
    if (isAdminEditing) dispatch(handleIsAdminEditing(false));
    if (handleClose) handleClose();
  };

  useEffect(() => {
    if (isSubmitClick) handleSubmit();
  }, [isSubmitClick]);

  return (
    <div className="show-grid">
      <Form
        fluid
        ref={userFormRef}
        onChange={setFormValue}
        onCheck={setFormError}
        formValue={formValue}
        model={model}
      >
        <FlexboxGrid justify="space-between" style={{ marginBottom: '25px' }}>
          <FlexboxGrid.Item colspan={11}>
            <TextField
              name="first_name"
              label="First Name"
              reqText="First name is required"
            />
          </FlexboxGrid.Item>

          <FlexboxGrid.Item colspan={11}>
            <TextField
              name="last_name"
              label="Last Name"
              reqText="Last name is required"
            />
          </FlexboxGrid.Item>

          <FlexboxGrid.Item colspan={24} style={{ margin: '25px 0' }}>
            <TextField name="username" label="User name" reqText="Username is required" />
          </FlexboxGrid.Item>

          <FlexboxGrid.Item colspan={24} style={{ marginBottom: '25px' }}>
            <TextField name="email" label="Email" reqText="Email is required" />
          </FlexboxGrid.Item>

          <FlexboxGrid.Item
            colspan={24}
            style={{ padding: editData?.id ? '0 5px' : '0' }}
          >
            <SelectField
              name="projects"
              label="Assign projects"
              placeholder="Select Projects"
              accepter={CustomReactSelect}
              apiURL={`${lmApiUrl}/${authCtx.organization_id}/project`}
              error={formError.projects}
              isMulti={true}
              closeMenuOnSelect={false}
            />
          </FlexboxGrid.Item>
        </FlexboxGrid>

        {!isUserSection && (
          <FlexboxGrid
            justify="end"
            style={{
              marginTop: '20px',
              position: 'absolute',
              height: '100px',
              right: '0px',
              bottom: '0px',
            }}
          >
            <Button
              onClick={() => handleClose()}
              className="adminModalFooterBtn"
              appearance="default"
              color="blue"
            >
              Cancel
            </Button>

            <Button
              className="adminModalFooterBtn"
              style={{ marginLeft: '10px' }}
              onClick={handleSubmit}
              appearance="primary"
              color="blue"
            >
              Save
            </Button>
          </FlexboxGrid>
        )}
      </Form>
    </div>
  );
};

export default AddUser;
