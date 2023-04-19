import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {
  fetchComponents,
  fetchDeleteComp,
  // fetchCreateComp,
  // fetchUpdateComp,
} from '../../../Redux/slices/componentSlice';
import AuthContext from '../../../Store/Auth-Context';
import { handleCurrPageTitle, handleIsAddNewModal } from '../../../Redux/slices/navSlice';
import AddNewModal from '../AddNewModal';
import AdminDataTable from '../AdminDataTable';
import { FlexboxGrid, Loader } from 'rsuite';

// import styles from './Components.module.scss';
// const { errText, formContainer, modalBtnCon, modalBody, mhContainer } = styles;

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
  },
  {
    header: 'Name',
    key: 'name',
  },
  {
    header: 'Component',
    key: 'component',
  },
  {
    header: 'Type',
    key: 'type_',
  },
  {
    header: 'Domain',
    key: 'domain',
  },
  {
    header: 'Description',
    key: 'description',
  },
];

const Application = () => {
  const { allComponents, isCompLoading, isCompUpdated, isCompCreated, isCompDeleted } =
    useSelector((state) => state.components);

  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  // handle open add component modal
  const handleAddNew = () => {
    dispatch(handleIsAddNewModal(true));
  };

  // create and edit component form submit
  // const handleAddUser = (data) => {
  //   setIsAddModal(false);
  //   // update component
  //   if (editData?.name) {
  //     data = {
  //       name: data?.name ? data?.name : editData?.name,
  //       project_id: data.project_id ? data.project_id : editData?.project_id,
  //       description: componentDesc ? componentDesc : editData?.description,
  //     };
  //     const putUrl = `${lmApiUrl}/component/${editData?.id}`;
  //     dispatch(
  //       fetchUpdateComp({
  //         url: putUrl,
  //         token: authCtx.token,
  //         bodyData: data,
  //         reset,
  //       }),
  //     );
  //   }
  //   // Create component
  //   else {
  //     data.description = componentDesc;
  //     const postUrl = `${lmApiUrl}/component`;
  //     dispatch(
  //       fetchCreateComp({
  //         url: postUrl,
  //         token: authCtx.token,
  //         bodyData: data,
  //         reset,
  //       }),
  //     );
  //   }
  // };

  // Pagination
  const handlePagination = (values) => {
    setPageSize(values.pageSize);
    setCurrPage(values.page);
  };

  useEffect(() => {
    dispatch(handleCurrPageTitle('Components'));

    const getUrl = `${lmApiUrl}/component?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchComponents({ url: getUrl, token: authCtx.token }));
  }, [isCompCreated, isCompUpdated, isCompDeleted, pageSize, currPage]);

  // handle delete component
  const handleDelete = (data) => {
    // const idList = data?.map((v) => v.id);
    if (data.length === 1) {
      const id = data[0]?.id;
      Swal.fire({
        title: 'Are you sure',
        icon: 'info',
        text: 'Do you want to delete the Application!!',
        cancelButtonColor: 'red',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#3085d6',
        reverseButtons: true,
      }).then((value) => {
        if (value.isConfirmed) {
          const deleteUrl = `${lmApiUrl}/component/${id}`;
          dispatch(fetchDeleteComp({ url: deleteUrl, token: authCtx.token }));
        }
      });
    } else if (data.length > 1) {
      Swal.fire({
        title: 'Sorry',
        icon: 'info',
        text: 'You can not delete multiple application at the same time!!',
        confirmButtonColor: '#3085d6',
      });
    }
  };
  // handle Edit component
  const handleEdit = () => {
    // if (data.length === 1) {
    //   setIsAddModal(true);
    //   const data1 = data[0];
    //   setEditData(data1);
    // } else if (data.length > 1) {
    //   Swal.fire({
    //     title: 'Sorry!!',
    //     icon: 'info',
    //     text: 'You can not edit more than 1 application at the same time',
    //   });
    // }
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Components',
    rowData: allComponents?.items?.length ? allComponents?.items : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    totalItems: allComponents?.total_items,
    totalPages: allComponents?.total_pages,
    pageSize,
    page: allComponents?.page,
    inpPlaceholder: 'Search Component',
  };

  const handleSubmit = () => {};
  return (
    <div>
      <AddNewModal title="Add New Component" handleSubmit={handleSubmit}></AddNewModal>

      {isCompLoading && (
        <FlexboxGrid justify="center">
          <Loader size="md" label="" />
        </FlexboxGrid>
      )}
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Application;
