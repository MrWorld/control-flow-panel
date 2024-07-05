import { useState, useEffect } from 'react';
import { adminService } from 'src/api/services/admin'
import { Grid, Box } from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Footer from 'src/components/layouts/AccentSidebarLayout/Footer';
import Results from './components/Results';
import PageHeader from './components/PageHeader';
import { useSearchParams } from "react-router-dom";
import { useSearchDebounce } from 'src/hooks/useSearchDebounce';
import { useCheckPermission } from 'src/hooks/useCheckPermission';
import useToast from 'src/hooks/useToast';

const AdminList = ({ fromOthers = false, by = null, filterKey = null, filterId = null }) => {
  const { checkPermission } = useCheckPermission();
  const [activeTab, setActiveTab] = useSearchParams({ role: 'ALL' });
  const { handleChangeSearch, query } = useSearchDebounce()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [take, setTake] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('id');
  const { toast } = useToast()

  const handleTabsChange = (_event, tabsValue) => {
    setActiveTab((prevFilters) => ({
      ...prevFilters,
      role: tabsValue
    }))
  }

  const handleChangePage = page => {
    console.log('page',page)
    if (page >= 0) setPage(page)
    console.log(page);
  }

  const getUsers = async () => {
    if (!checkPermission('CUSTOMER:READ')) return true;
    const role = activeTab.get('role')
    let data = {
      page: page,
      take: take,
      roleId: !filterId ? role : filterId
    }
    if (orderBy) {
      data.sort = orderBy + ':' + order
    }
    if(!filterKey) {
      if (activeTab.get('role') !== 'ALL' && !filterId) data.role = role
      else {
        if (!filterId) delete data.roleId
      }

    }else {
      delete data.roleId
      data.filter = filterKey + ':equals:' + filterId
    }
    
    if (query) data.search = query
    else delete data.search

    try {
      setLoading(true);
      const response = await adminService.getCustomersList(data)
      setLoading(false)
      setUsers(response.data.data);
      setTotalCount(response.data.pagination.total)
    } catch (err) {
      toast(err?.response?.data?.message || 'Network Error!', 'error')
      setLoading(false)
      console.error(err);
    }
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleRefreshAdminList = () => getUsers()


  useEffect(() => {
    getUsers();
  }, [activeTab.get('role'), page, take, query, order, orderBy]);

  return (
    <Box dir={'rtl'} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '92vh' }}>
      {!fromOthers && <PageTitleWrapper>
        <PageHeader handleRefreshAdminList={handleRefreshAdminList} />
      </PageTitleWrapper>}
      <Grid
        sx={{
          px: 4
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
        marginBottom='auto'
      >
        <Grid item xs={12} md={12} lg={12}>
          <Results
            loading={loading}
            resultData={users}
            activeTab={activeTab}
            onRequestSort={handleRequestSort}
            order={order}
            orderBy={orderBy}
            pagination={{
              page,
              take,
              totalCount
            }}
            actions={{
              changePage: page => handleChangePage(page),
              changeTake: take => setTake(take),
              handleTabsChange: handleTabsChange,
              handleSearchAdmin: handleChangeSearch
            }} />
        </Grid>
      </Grid>
      {/* <Footer /> */}
    </Box>
  );
}

export default AdminList;
