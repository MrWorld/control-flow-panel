import { AxiosInstance } from "../index";

export const adminService = {

    getStations: data => AxiosInstance.get(`/station?page=${data.page + 1}&take=${data.take}${data.search ?`&search=${data.search}` : ''}`),
    getStationDetail: id => AxiosInstance.get(`/station/${id}`),
    updateStation: (id, data) => AxiosInstance.patch(`/station/${id}`, data),
    addStation: data => AxiosInstance.post(`/station`, data),
    deleteStation: id => AxiosInstance.delete(`/station/${id}`),
    getStationOperationDetail: data => AxiosInstance.post(`/station/operation-detail`, data),
    updateStationStatus: (id, data) => AxiosInstance.put(`/station/status/${id}`, data),

    getProducts: data => AxiosInstance.get(`/product?page=${data.page + 1}&take=${data.take}${data.search ? `&search=${data.search}` : '' } `),
    getProductDetail: id => AxiosInstance.get(`/product/${id}`),
    updateProduct: (id, data) => AxiosInstance.patch(`/product/${id}`, data),
    addProduct: data => AxiosInstance.post(`/product`, data),
    deleteProduct: id => AxiosInstance.delete(`/product/${id}`),

    getManufactorings: data => AxiosInstance.get(`/manufactoring?page=${data.page + 1}&take=${data.take}${data.search ? `&search=${data.search}` : '' } `),
    getManufactoringDetail: id => AxiosInstance.get(`/manufactoring/${id}`),
    updateManufactoring: (id, data) => AxiosInstance.patch(`/manufactoring/${id}`, data),
    addManufactoring: data => AxiosInstance.post(`/manufactoring`, data),
    deleteManufactoring: id => AxiosInstance.delete(`/manufactoring/${id}`),
    unBindManufactoringMedia: id => AxiosInstance.put(`/manufactoring/unbind-media/${id}`),


    getTasks: data => AxiosInstance.get(`/task?page=${data.page + 1}&take=${data.take}`),
    getTaskDetail: id => AxiosInstance.get(`/task/${id}`),
    updateTask: (id, data) => AxiosInstance.patch(`/task/${id}`, data),
    addTask: data => AxiosInstance.post(`/task`, data),
    deleteTask: id => AxiosInstance.delete(`/task/${id}`),
    updateSubTaskStatus: (id, data) => AxiosInstance.put(`/task/sub-task/status-update/${id}`, data),

    getUsers: data => AxiosInstance.get(`/user?page=${data.page + 1}&take=${data.take}${data.search ?`&search=${data.search}` : ''}`),
    getUserDetail: id => AxiosInstance.get(`/user/${id}`),
    updateUser: (id, data) => AxiosInstance.patch(`/user/${id}`, data),
    addUser: data => AxiosInstance.post(`/user`, data),
    deleteUser: id => AxiosInstance.delete(`/user/${id}`),

}

const fixPageNumber = data => {
    //***** Pagination component in material UI start from page 0, our backend start from 1, 
    // For dealing with API call and handle pagination functions I did this manipulation *****
    let manipulatedPage = (data.page + 1)
    data['page'] = manipulatedPage

    return data
}
