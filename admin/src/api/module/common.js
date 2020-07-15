import request from '@/utils/request'

export default {
  get: function(db, params) {
    return request.get(`${db}`, { params: params })
  },
  add: function(db, params) {
    return request.post(`${db}`, params)
  },
  edit: function(db, params) {
    return request.put(`${db}/${params._id}`, params)
  },
  delete: function(db, params) {
    return request.delete(`${db}/${params._id}`, { params: params })
  }
}
