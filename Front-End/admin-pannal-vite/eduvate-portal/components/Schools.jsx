import React, { useContext, useState, useRef } from 'react'
import { Button, Table, Tooltip, Input, Space } from 'antd';
import useSchools from '../hooks/fetch_schools';
import { DeleteOutlined, EyeOutlined, PlusCircleOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { ModalContext } from '../context/modal_context';
import SchoolModal from '../modals/add_school';
import EditSchoolModel from '../modals/edit_school';
import { DeleteSchoolModal } from '../modals/confirm';



function Schools() {
  const { schools, fetchingSchool, fetchSchools, setPagination, pagination } = useSchools();
  const { setSchoolModal, setEditSchoolModal, setDeleteSchoolModal } = useContext(ModalContext);
  const [schoolId, setSchoolId] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });


  const columns = [
    {
      title: 'School Name',
      dataIndex: 'name',
      key: 'id',
      render: (text) => <p> {text} </p>,
      ...getColumnSearchProps('name'),
    },
    {
      title: 'ERP Code',
      dataIndex: 'erp_code',
      key: 'erp_code',
    },
    {
      title: 'Grades',
      dataIndex: 'grades',
      key: 'id',
      render: (_, { grades }) => (
        <div className='flex gap-1 flex-wrap'>
          {console.log(grades)}
          <p className='p-2 bg-emerald-400 rounded-xl text-white'>{grades[0]?.grades} - {grades.pop()?.grades}</p>
        </div>
      )
    },
    {
      title: 'Academic Manager',
      dataIndex: 'am',
      key: 'id',
      render: (text) => <p>{text?.username}</p>
    },
    {
      title: 'Operational Manager',
      dataIndex: 'om',
      key: 'id',
      render: (text) => <p>{text?.username}</p>
    },
    {
      title: "Action",
      key: "id",
      render: ({ id }) => (
        <div className='flex gap-1'>

          <Tooltip title="View Details">
            <Button icon={<EyeOutlined />} onClick={() => {
              setSchoolId(id)
              setEditSchoolModal(true);
            }} />
          </Tooltip>

          <Tooltip title="Delete School">
            <Button icon={<DeleteOutlined />} danger onClick={() => {
              setSchoolId(id);
              setDeleteSchoolModal(true);
            }} />
          </Tooltip>

        </div>
      )
    }

  ]



  const handleTableChange = (pagination) => {
    setPagination(pagination);
  }

  return (
    <div className=''>
      <EditSchoolModel id={schoolId} />
      <DeleteSchoolModal id={schoolId} />
      <Table columns={columns} dataSource={schools} loading={fetchingSchool} size='small' title={() => (
        <div className='flex justify-end gap-4'>
          <Tooltip title="Add New School">
            <Button shape='round' icon={<PlusCircleOutlined />} onClick={() => setSchoolModal(true)}> ADD </Button>
          </Tooltip>

          <Tooltip title="Refresh Data">
            <Button shape='round' icon={<ReloadOutlined />} onClick={() => fetchSchools({ limit: pagination.pageSize, offset: (pagination.current - 1) * pagination.pageSize })} />
          </Tooltip>
        </div>
      )} pagination={pagination} onChange={handleTableChange} rowKey={record => record.id} />
      <SchoolModal />
    </div>
  )
}

export default Schools