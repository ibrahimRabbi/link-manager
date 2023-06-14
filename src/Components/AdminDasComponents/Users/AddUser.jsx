import React from 'react';
import AuthContext from '../../../Store/Auth-Context';

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;
import { Form, Button, Schema, FlexboxGrid } from 'rsuite';
import TextField from '../TextField';
import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { handleIsAdminEditing } from '../../../Redux/slices/navSlice';
import { fetchCreateData, fetchUpdateData } from '../../../Redux/slices/useCRUDSlice';

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
  setNotificationType,
  setNotificationMessage,
}) => {
  const [formError, setFormError] = React.useState({});
  const userFormRef = React.useRef();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const showNotification = (type, message) => {
    setNotificationType(type);
    setNotificationMessage(message);
  };
  // handle create and update form submit
  const handleSubmit = () => {
    if (!userFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    } else if (isAdminEditing) {
      const putUrl = `${lmApiUrl}/user/${editData?.id}`;
      dispatch(
        fetchUpdateData({
          url: putUrl,
          token: authCtx.token,
          bodyData: formValue,
          showNotification: showNotification,
        }),
      );
    } else {
      const postUrl = `${lmApiUrl}/user`;
      dispatch(
        fetchCreateData({
          url: postUrl,
          token: authCtx.token,
          bodyData: { ...formValue, enabled: true },
          message: 'user',
          showNotification: showNotification,
        }),
      );
    }
    // close modal
    if (handleClose) handleClose();
    if (isAdminEditing) dispatch(handleIsAdminEditing(false));
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
