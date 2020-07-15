import request from '@/utils/request'

export default {
  getSysInfo: function(params) {
    return request.get('get_sys_info/', { params: params })
  },
  getProjectData: function(params) {
    return request.get('project/get_project_data/', { params: params })
  },
  getScript: function(params) {
    return request.get('project/script/', { params: params })
  },
  uploadScript: function(params) {
    return request.post('project/script/', params)
  },
  deleteScript: function(params) {
    return request.delete(`project/script/${params.id}/`, { params: params })
  },
  logout: function() {
    return request.post('account/logout/')
  },
  get_all_project: function(params) {
    return request.get('project/get_all_project/', { params: params })
  }
}
