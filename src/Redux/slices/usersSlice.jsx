import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';
import clientMessages from './responseMsg';

//  reduce api calling codes for get response
const callAPI = async ({ url, header }) => {
  // check is need to send body data or not
  // Call API
  const response = await fetch(url, header)
    .then((res) => {
      console.log(res);
      if (res.ok) {
        if (res.status === 201) return res.json();
        else if (res.status !== 204) {
          return res.json().then((data) => {
            if (data.message) {
              Swal.fire({
                title: data.status,
                icon: 'success',
                text: data.message,
                confirmButtonColor: '#3085d6',
              });
            }
            return data;
          });
        }
      } else {
        if (res.status === 304) {
          Swal.fire({
            title: 'Already exists',
            icon: 'info',
            text: 'This User is already exists. please try to create another user',
            confirmButtonColor: '#3085d6',
          });
        } else if (res.status === 400) {
          // clientMessages({ status: res.status, message: res.statusText });
          console.log(res.status);
        } else if (res.status === 401) {
          // clientMessages({ status: res.status, message: res.statusText });
          console.log(res.status);
        } else if (res.status === 403) {
          console.log(res.status, res.statusText);
        } else if (res.status === 409) {
          console.log(res.status, res.statusText);
        } else if (res.status === 500) {
          // clientMessages({ status: res.status, message: res.statusText });
          console.log(res.status);
        }
      }
    })
    .catch((err) => console.log(err));
  return response;
};

// Fetch get all users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async ({ url, token }) => {
  const header = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: 'Bearer ' + token,
    },
  };
  const res = callAPI({ url, header });
  return res;
});

// Create New User
export const fetchCreateUser = createAsyncThunk(
  'users/fetchCreateUser',
  async ({ url, token, bodyData, reset }) => {
    const header = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(bodyData),
    };
    const res = callAPI({ url, header });
    reset();
    return res;

    // const response = await fetch(`${url}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-type': 'application/json',
    //     authorization: 'Bearer ' + token,
    //   },
    //   body: JSON.stringify(bodyData),
    // })
    //   .then((res) => {
    //     reset();
    //     if (res.ok) {
    //       return res.json().then((data) => {
    //         console.log(data);
    //         Swal.fire({
    //           title: 'Success',
    //           icon: 'success',
    //           text: data.message,
    //           confirmButtonColor: '#3085d6',
    //         });
    //         return data;
    //       });
    //     } else {
    //       if (res.status === 304) {
    //         Swal.fire({
    //           title: 'Already exists',
    //           icon: 'info',
    //           text: 'This User is already exists. please try to create another user',
    //           confirmButtonColor: '#3085d6',
    //         });
    //       } else if (res.status === 400) {
    //         clientMessages({ status: res.status, message: res.statusText });
    //       } else if (res.status === 401) {
    //         clientMessages({ status: res.status, message: res.statusText });
    //       } else if (res.status === 403) {
    //         console.log(res.status, res.statusText);
    //       } else if (res.status === 409) {
    //         console.log(res.status, res.statusText);
    //       } else if (res.status === 500) {
    //         clientMessages({ status: res.status, message: res.statusText });
    //       }
    //     }
    //     // if links not created we need return a value
    //     return 'Link creating Failed';
    //   })
    //   .catch((error) => clientMessages({ isErrCatch: true, error }));
    // return response;
  },
);
// Delete User
export const fetchDeleteUser = createAsyncThunk(
  'users/fetchDeleteUser',
  async ({ url, token }) => {
    // const res = callAPI({
    //   method:'DELETE',
    //   url,
    //   token,
    // });
    // console.log(res);
    // return res;
    const response = await fetch(`${url}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        console.log(res);
        if (res.ok) {
          return res.json().then((data) => {
            Swal.fire({
              title: 'Deleted',
              icon: 'success',
              text: data.message,
              confirmButtonColor: '#3085d6',
            });
            return data;
          });
        } else {
          if (res.status === 400) {
            clientMessages({ status: res.status, message: res.statusText });
          } else if (res.status === 401) {
            clientMessages({ status: res.status, message: res.statusText });
          } else if (res.status === 403) {
            console.log(res.status, res.statusText);
          } else if (res.status === 409) {
            console.log(res.status, res.statusText);
          } else if (res.status === 500) {
            clientMessages({ status: res.status, message: res.statusText });
          }
        }
        // if links not created we need return a value
        return 'Link delete Failed';
      })
      .catch((error) => clientMessages({ isErrCatch: true, error }));
    return response;
  },
);

/// All user states
const initialState = {
  allUsers: {},
  isUserCreated: false,
  isUserDeleted: false,
  usersLoading: false,
};

export const usersSlice = createSlice({
  name: 'nav',
  initialState,

  reducers: {
    // sidebar controller
    handleIsSidebarOpen: (state, { payload }) => {
      state.isSidebarOpen = payload;
    },
  },
  //----------------------\\
  extraReducers: (builder) => {
    // Get all users
    builder.addCase(fetchUsers.pending, (state) => {
      state.isUserDeleted = false;
      state.isUserCreated = false;
      state.usersLoading = true;
    });
    builder.addCase(fetchUsers.fulfilled, (state, { payload }) => {
      state.usersLoading = false;
      console.log(payload);
      if (payload?.items) {
        // just showing purpose i am using this structure when api will
        //  be updated then i will remove it
        const items = payload.items?.reduce((acc, curr) => {
          acc.push({
            email: curr.email,
            enabled: curr.enabled,
            first_name: curr.first_name,
            last_name: curr.last_name,
            id: curr.user_id?.toString(),
            link: curr.link,
            username: curr.username,
          });
          return acc;
        }, []);
        state.allUsers = { ...payload, items };
      }
    });

    builder.addCase(fetchUsers.rejected, (state) => {
      state.usersLoading = true;
    });

    // Create new user
    builder.addCase(fetchCreateUser.pending, (state) => {
      state.usersLoading = true;
    });
    builder.addCase(fetchCreateUser.fulfilled, (state, { payload }) => {
      state.usersLoading = false;
      console.log('User Creating: ', payload);
      state.isUserCreated = true;
    });
    builder.addCase(fetchCreateUser.rejected, (state) => {
      state.usersLoading = false;
    });

    // Delete user
    builder.addCase(fetchDeleteUser.pending, (state) => {
      state.usersLoading = true;
    });

    builder.addCase(fetchDeleteUser.fulfilled, (state, { payload }) => {
      state.usersLoading = false;
      console.log('User Deleting: ', payload);
      state.isUserDeleted = true;
    });

    builder.addCase(fetchDeleteUser.rejected, (state) => {
      state.usersLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const { handleIsSidebarOpen } = usersSlice.actions;

export default usersSlice.reducer;
