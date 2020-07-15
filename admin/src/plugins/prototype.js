import Vue from 'vue'
// 深拷贝
Vue.prototype.$Copy = function(data) {
  return JSON.parse(JSON.stringify(data))
}
Vue.prototype.$CopyByCol = function(target, source) {
  const result = {}
  for (const t of Object.keys(target)) {
    result[t] = source[t] ? source[t] : null
  }
  return result
}
Vue.prototype.$MakeMessage = function(data) {
  if (typeof (data) === 'string') {
    return data
  } else {
    const midstr = []
    for (const i in data) {
      midstr.push(data[i])
    }
    return midstr.join(',')
  }
}
