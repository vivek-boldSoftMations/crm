import CustomAxios from "./api";

//Designation API
const getDesignationsData = (page, searchQuery) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchQuery) {
    params.append("search", searchQuery);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(`api/hr/designation/?${params.toString()}`);
};

const addDesignation = (designationName) => {
  return CustomAxios.post("/api/hr/designation/", {
    designation: designationName,
  });
};

const updateDesignations = (id, data) => {
  console.log("data", data);
  return CustomAxios.patch(`/api/hr/designation/${id}/`, data);
};

//Department API
const getDepartment = () => {
  return CustomAxios.get("/api/hr/department/");
};

const addDepartment = (departmentName) => {
  return CustomAxios.post("/api/hr/department/", {
    department: departmentName,
  });
};

const updateDepartment = (id, data) => {
  return CustomAxios.patch(`/api/hr/department/${id}/`, data);
};

//Source API
const getSource = () => {
  return CustomAxios.get("/api/hr/source/");
}

const getSourceById = (id) => {
  return CustomAxios.get(`/api/hr/source/${id}/`);
}
const addSource = (sourceName) => { 
  return CustomAxios.post("/api/hr/source/", {
    name: sourceName.name,
  });
}

const updateSource = (id, data) => {
  console.log("data", data);
  return CustomAxios.patch(`/api/hr/source/${id}/`, {name:data.name});
}

//Job-Opening API
const getJobOpening = () => {
  return CustomAxios.get(`/api/hr/job-opening/`);
};

const addJobOpening = (newJobData) => {
  return CustomAxios.post(`/api/hr/job-opening/`, newJobData);
};

const updateJobOpening = (id, updatedJobData) => {
  return CustomAxios.patch(`/api/hr/job-opening/${id}/`, updatedJobData);
};

// Applicant API
const getApplicants = () => {
  return CustomAxios.get(`/api/hr/applicant/`);
};

const addApplicant = (newApplicantData) => {
  return CustomAxios.post(`/api/hr/applicant/`, newApplicantData);
};

const updateApplicant = (id, updatedApplicantData) => {
  return CustomAxios.patch(`/api/hr/applicant/${id}/`, updatedApplicantData);
};

//Interview Status API
const getInterviewStatus = () => {
  return CustomAxios.get(`/api/hr/applicant/?is_shortlisted=True`);
};

const addInterviewStatus = (newInterviewStatus) => {
  return CustomAxios.post(`/api/hr/applicant/`, newInterviewStatus);
}
const updateInterviewStatus = (id, updatedInterviewStatus) => {
  return CustomAxios.patch(`/api/hr/applicant/${id}/`, updatedInterviewStatus);
}


const Hr = {
  getDesignationsData,
  addDesignation,
  updateDesignations,
  getDepartment,
  addDepartment,
  updateDepartment,
  getSource,
  getSourceById,
  addSource,
  updateSource,
  getJobOpening,
  addJobOpening,
  updateJobOpening,
  getApplicants,
  addApplicant,
  updateApplicant,
};

export default Hr;
