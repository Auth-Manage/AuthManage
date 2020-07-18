import request from '@/utils/request'

export default {
  getInfo: function(params) {
    return request.get('users/getInfo', { params: params })
  }
}
