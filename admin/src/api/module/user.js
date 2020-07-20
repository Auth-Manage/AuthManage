import request from '@/utils/request'

export default {
  login: function(params) {
    return request.post('users/login', params)
  },
  register: function(params) {
    return request.post('users/register', params)
  },
  logout: function(params) {
    return request.post('users/logout/', params)
  }
}
