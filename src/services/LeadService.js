import CustomAxios from "./api";

const getAllLeads = (stage, lead_id) => {
  return CustomAxios.get(
    `/api/lead/list-lead/?funnel=${stage}&ordering=${lead_id}`
  );
};

const getAllSearchWithFilteredLeads = (
  stage,
  orderingValue,
  filter,
  filterValue,
  searchValue
) => {
  return CustomAxios.get(
    `/api/lead/list-lead/?funnel=${stage}&ordering=${orderingValue}&${filter}=${filterValue}&search=${searchValue}`
  );
};

const getFilteredLeads = (stage, orderingValue, filter, filterValue) => {
  return CustomAxios.get(
    `/api/lead/list-lead/?funnel=${stage}&ordering=${orderingValue}&${filter}=${filterValue}`
  );
};

const getSearchLeads = (stage, orderingValue, searchValue) => {
  return CustomAxios.get(
    `/api/lead/list-lead/?funnel=${stage}&ordering=${orderingValue}&search=${searchValue}`
  );
};

const getFilterWithSearchPaginateLeads = (
  currentPage,
  stage,
  orderValue,
  filter,
  filterValue,
  searchValue
) => {
  return CustomAxios.get(
    `/api/lead/list-lead/?page=${currentPage}&funnel=${stage}&ordering=${orderValue}&${filter}=${filterValue}&search=${searchValue}`
  );
};

const getSearchPaginateLeads = (
  currentPage,
  stage,
  orderValue,
  searchValue
) => {
  return CustomAxios.get(
    `/api/lead/list-lead/?page=${currentPage}&funnel=${stage}&ordering=${orderValue}&search=${searchValue}`
  );
};

const getFilterPaginateLeads = (
  currentPage,
  stage,
  orderValue,
  filter,
  filterValue
) => {
  return CustomAxios.get(
    `/api/lead/list-lead/?page=${currentPage}&funnel=${stage}&ordering=${orderValue}&${filter}=${filterValue}`
  );
};

const getAllPaginateLeads = (currentPage, stage, orderingValue) => {
  return CustomAxios.get(
    `/api/lead/list-lead/?page=${currentPage}&funnel=${stage}&ordering=${orderingValue}`
  );
};

const getFilterAssignedtoPaginateLeads = (currentPage, filter, search) => {
  return CustomAxios.get(
    `/api/lead/list-lead/?page=${currentPage}&${filter}=${search}`
  );
};

// duplicate leads

const getAllDuplicateLeads = (filterValue) => {
  return CustomAxios.get(`/api/lead/duplicate-leads/?field=${filterValue}`);
};

const getAllPaginateDuplicateLeads = (
  currentPage,
  filterValue,
  searchValue
) => {
  return CustomAxios.get(
    `/api/lead/duplicate-leads/?page=${currentPage}&field=${filterValue}&search=${searchValue}`
  );
};

const getSearchDuplicateLeads = (filterValue, searchValue) => {
  return CustomAxios.get(
    `/api/lead/duplicate-leads/?field=${filterValue}&search=${searchValue}`
  );
};

const getFilterPaginateDuplicateLeads = (
  currentPage,
  filterValue,
  searchValue
) => {
  return CustomAxios.get(
    `/api/lead/duplicate-leads/?page=${currentPage}&field=${filterValue}&search=${searchValue}`
  );
};

const getAllUnassignedData = () => {
  return CustomAxios.get(`/api/lead/list-unassigned/`);
};

const getAllPaginateUnassigned = (currentPage) => {
  return CustomAxios.get(`/api/lead/list-unassigned/?page=${currentPage}`);
};

const getAllPaginateWithFilterUnassigned = (currentPage, filter, search) => {
  return CustomAxios.get(
    `/api/lead/list-unassigned/?page=${currentPage}&${filter}=${search}`
  );
};

const getAllFilterByUnassignedData = (filter, search) => {
  return CustomAxios.get(`/api/lead/list-unassigned/?${filter}=${search}`);
};

const getAllAssignedUser = () => {
  return CustomAxios.get(`/api/user/sales-user`);
};

const createLeads = (data) => {
  return CustomAxios.post("/api/lead/list-lead/", data);
};

const getLeadsById = (id) => {
  return CustomAxios.get(`/api/lead/list-lead/${id}`);
};

const updateLeads = (id, data) => {
  return CustomAxios.patch(`/api/lead/list-lead/${id}`, data);
};

const getAllRefernces = () => {
  return CustomAxios.get(`/api/lead/list-references`);
};

const createRefernces = (data) => {
  return CustomAxios.post("/api/lead/view-references/", data);
};

const getReferncesById = (id) => {
  return CustomAxios.get(`/api/lead/view-references/${id}`);
};

const updateRefernces = (id, data) => {
  return CustomAxios.patch(`/api/lead/view-references/${id}`, data);
};

const createFollowUpLeads = (data) => {
  return CustomAxios.post("/api/lead/list-followup/", data);
};

// Generic function to get order book data
const getAllFollowUp = ({ typeValue, assignToFilter }) => {
  let url = `/api/lead/list-followup/?type=${typeValue}`;
  if (assignToFilter) url += `&user__email=${assignToFilter}`;
  return CustomAxios.get(url);
};

const createPotentialLead = (data) => {
  return CustomAxios.post("/api/lead/list-potential/", data);
};

const deletePotentialLeadsById = (id) => {
  return CustomAxios.delete(`/api/lead/view-potential/${id}`);
};

const DoneLeadFollowup = (id, data) => {
  return CustomAxios.patch(`/api/lead/list-followup/${id}`, data);
};

const BulkLeadAssign = (data) => {
  return CustomAxios.post("/api/lead/assign-bulk-leads/", data);
};

const AssignMultipleLeads = (data) => {
  return CustomAxios.post("/api/lead/assign-multiple-leads/", data);
};

// IndiaMart Leads API
const getIndiaMartLeads = (data) => {
  return CustomAxios.get("/api/lead/indiamart-leads-list/", data);
};
const getAllFollowup = (options) => {
  const {
    startDate,
    endDate,
    currentPage,
    filter,
    filterValue,
    search,
    searchValue,
  } = options;

  let url = `/api/lead/list-all-follow-ups/?date_range_after=${startDate}&date_range_before=${endDate}`;

  if (currentPage) {
    url += `&page=${currentPage}`;
  }

  if (filter && filterValue) {
    url += `&${filter}=${filterValue}`;
  }

  if (search && searchValue) {
    url += `&${search}=${searchValue}`;
  }

  return CustomAxios.get(url);
};

const LeadServices = {
  getAllLeads,
  getAllAssignedUser,
  getAllUnassignedData,
  getAllFilterByUnassignedData,
  getAllPaginateUnassigned,
  getAllPaginateWithFilterUnassigned,
  getAllSearchWithFilteredLeads,
  getFilteredLeads,
  getSearchLeads,
  getFilterWithSearchPaginateLeads,
  getSearchPaginateLeads,
  getFilterPaginateLeads,
  getAllPaginateLeads,
  getFilterAssignedtoPaginateLeads,
  getAllDuplicateLeads,
  getAllPaginateDuplicateLeads,
  getSearchDuplicateLeads,
  getFilterPaginateDuplicateLeads,
  createLeads,
  getLeadsById,
  updateLeads,
  createFollowUpLeads,
  getAllFollowUp,
  createPotentialLead,
  deletePotentialLeadsById,
  getAllRefernces,
  createRefernces,
  getReferncesById,
  updateRefernces,
  DoneLeadFollowup,
  BulkLeadAssign,
  AssignMultipleLeads,
  getAllFollowup,
  getIndiaMartLeads
};

export default LeadServices;
