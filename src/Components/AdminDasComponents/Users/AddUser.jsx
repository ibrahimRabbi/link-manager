import React, { useEffect } from 'react';
import AuthContext from '../../../Store/Auth-Context';
import { Form, Button, Schema, FlexboxGrid, Message, toaster } from 'rsuite';
import TextField from '../TextField';
import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { handleIsAdminEditing } from '../../../Redux/slices/navSlice';
import { useMutation } from '@tanstack/react-query';
import fetchAPIRequest from '../../../apiRequests/apiRequest';

const { StringType } = Schema.Types;

const model = Schema.Model({
  first_name: StringType().isRequired('This field is required.'),
  last_name: StringType().isRequired('This field is required.'),
  username: StringType().isRequired('This field is required.'),
  email: StringType()
    .isEmail('Please enter a valid email address.')
    .isRequired('This field is required.'),
});

const AddUser = ({
  isUserSection,
  handleClose,
  editData,
  formValue,
  setFormValue,
  isAdminEditing,
  setCreateSuccess,
  setUpdateSuccess,
  createSuccess,
  updateSuccess,
  setCreateUpdateLoading,
}) => {
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

  // create data using react query
  const { isLoading: createLoading, mutate: createMutate } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: 'user',
        token: authCtx.token,
        method: 'POST',
        body: { ...formValue, enabled: true },
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
        token: authCtx.token,
        method: 'PUT',
        body: { ...formValue, enabled: true },
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
      console.error('Form Error', formError);
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
        <FlexboxGrid justify="space-between">
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
          <FlexboxGrid.Item colspan={24} style={{ margin: '30px 0' }}>
            <TextField name="username" label="User name" reqText="Username is required" />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={24}>
            <TextField name="email" label="Email" reqText="Email is required" />
          </FlexboxGrid.Item>
        </FlexboxGrid>

        {isUserSection ? (
          <FlexboxGrid justify="end" style={{ marginTop: '20px' }}>
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
        ) : (
          <FlexboxGrid justify="end">
            <Button
              className="adminModalFooterBtn"
              style={{ margin: '30px 0' }}
              appearance="primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </FlexboxGrid>
        )}
      </Form>
    </div>
  );
};

export default AddUser;
