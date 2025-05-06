import axios from 'axios';

const BASE_URL = "http://localhost:8000";

export const createFee = async (feeData) => {
  try {
    const response = await axios.post(`${BASE_URL}/fees/create_fee`, feeData);
    return response.data;
  } catch (error) {
    console.error("Create fee error:", error);
    throw error;
  }
};

export const getAllFees = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fees/get_all_fees`);
    return response.data;
  } catch (error) {
    console.error("Get all fees error:", error);
    throw error;
  }
};

export const updateFee = async (feeData) => {
  try {
    const response = await axios.put(`${BASE_URL}/fees/update_fee/${feeData.feeId}`, feeData);
    return response.data;
  } catch (error) {
    console.error("Update fee error:", error);
    throw error;
  }
};

export const deleteFee = async (feeId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/fees/delete_fee/${feeId}`);
    return response.data;
  } catch (error) {
    console.error("Delete fee error:", error);
    throw error;
  }
};

export const getAllAcademicYears = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/courses/get_all_academic_years`);
    return response.data;
  } catch (error) {
    console.error("Get all academic years error:", error);
    throw error;
  }
};

export const getAllCourseCodes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/courses/get_all_course_codes`);
    return response.data;
  } catch (error) {
    console.error("Get all course codes error:", error);
    throw error;
  }
};

export const createCourse = async (courseData) => {
  try {
    const response = await axios.post(`${BASE_URL}/courses/create_course`, courseData);
    return response.data;
  } catch (error) {
    console.error("Create course error:", error);
    throw error;
  }
};

export const getAllCourses = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/courses/get_all_courses`);
    return response.data;
  } catch (error) {
    console.error("Get all courses error:", error);
    throw error;
  }
};

export const updateCourse = async (courseData) => {
  try {
    const response = await axios.put(`${BASE_URL}/courses/update_course/${courseData.courseId}`, courseData);
    return response.data;
  } catch (error) {
    console.error("Update course error:", error);
    throw error;
  }
};

export const deleteCourse = async (courseId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/courses/delete_course/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Delete course error:", error);
    throw error;
  }
};

export const createBill = async (billData) => {
  try {
    console.log("Sending billData:", billData); // Debug the payload
    const response = await axios.post(`${BASE_URL}/bills/create_new_bill`, billData);
    return response.data;
  } catch (error) {
    console.error("Create bill error:", error);
    throw error;
  }
};

export const getAllBills = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/bills/get_all_bills?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Get all bills error:", error);
    throw error;
  }
};

export const updateBill = async (billData) => {
  try {
    const response = await axios.put(`${BASE_URL}/bills/update_bill_by_id`, billData);
    return response.data;
  } catch (error) {
    console.error("Update bill error:", error);
    throw error;
  }
};

export const deleteBill = async (billId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/bills/delete_bill_by_id/${billId}`);
    return response.data;
  } catch (error) {
    console.error("Delete bill error:", error);
    throw error;
  }
};