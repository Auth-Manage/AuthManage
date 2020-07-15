import request from '@/utils/request'

export default {
  getCourse: function(params) {
    return request.get('courses', { params: params })
  },
  addCourse: function(params) {
    return request.post('courses', params)
  },
  editCourse: function(params) {
    return request.put(`courses/${params._id}`, params)
  },
  deleteCourse: function(params) {
    return request.delete(`courses/${params._id}`, { params: params })
  }
}
