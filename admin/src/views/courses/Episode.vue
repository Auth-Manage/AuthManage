<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryForm" class="pl-5">
      <el-form-item label="课时名称">
        <el-input v-model="queryForm.name" placeholder="请输入课时名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click.stop="search()">查询</el-button>
        <el-button type="primary" @click.stop="create()">新增</el-button>
      </el-form-item>
    </el-form>
    <avue-crud
      ref="crud"
      :data="data"
      :option="option"
      :page.sync="page"
      :table-loading="loading"
      @size-change="sizeChange"
      @current-change="currentChange"
      @sort-change="sortChange"
    >
      <template slot="menu" slot-scope="{row}">
        <el-button size="mini" @click.stop="update(row)">编辑</el-button>
        <el-button size="mini" type="danger" @click.stop="remove(row)">删除</el-button>
      </template>
    </avue-crud>
    <el-dialog
      :title="isEdit?'编辑':'新增'"
      :visible.sync="centerDialogVisible"
      width="50%"
      center
    >
      <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px">
        <el-form-item label="课时名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入课时名称" />
        </el-form-item>
        <el-form-item label="所属课程" prop="course">
          <el-select v-model="ruleForm.course" class="w-100" placeholder="请选择所属课程">
            <el-option
              v-for="item in courseList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课时文件" prop="file">
          <el-input v-model="ruleForm.file" placeholder="请上课时文件" />
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancel">取 消</el-button>
        <el-button type="primary" @click.native="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

moment.locale('zh-cn')
export default {
  name: 'Episode',
  data() {
    return {
      queryForm: {
        name: ''
      },
      page: {
        pageSizes: [10, 20, 30, 40], // 默认
        currentPage: 1,
        total: 0,
        pageSize: 10
      },
      data: [],
      loading: false,
      option: {
        emptyText: '暂无数据',
        border: true,
        stripe: true,
        selection: false,
        align: 'center',
        menu: false,
        column: [
          {
            label: '课时名称',
            prop: 'name',
            overHidden: true,
            sortable: true
          },
          {
            label: '所属课程',
            prop: 'course',
            overHidden: true,
            formatter: (row, value, label, column) => {
              return value ? value.name : ''
            }
          },
          {
            label: '课时文件',
            prop: 'file',
            overHidden: true
          },
          {
            label: '创建时间',
            prop: 'createdAt',
            overHidden: true,
            sortable: true,
            formatter: (row, value, label, column) => {
              return moment(value).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            label: '操作',
            prop: 'menu',
            width: '150',
            slot: true
          }
        ]
      },
      isEdit: false,
      centerDialogVisible: false,
      ruleForm: {
        name: '',
        course: '',
        file: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        course: [
          { required: true, message: '请选择所属课程', trigger: 'change' }
        ],
        file: [
          { required: true, message: '请上传文件', trigger: 'blur' }
        ]
      },
      baseUrl: process.env.VUE_APP_BASE_API,
      uploadUrl: '',
      sort: {},
      courseList: []
    }
  },
  async created() {
    this.uploadUrl = this.baseUrl + 'upload'
    await this.getCourseList()
    await this.query()
  },
  methods: {
    initForm() {
      this.ruleForm = {
        name: '',
        course: '',
        file: ''
      }
    },
    async search() {
      this.page.currentPage = 1
      await this.query()
    },
    sortChange({ prop, order }) {
      if (!order) {
        this.sort = null
      } else {
        this.sort = {
          [prop]: order === 'ascending' ? 1 : -1
        }
      }
    },
    async getCourseList() {
      const res = await this.$api.course.getCourse()
      this.courseList = res.data
    },
    async query() {
      this.loading = true
      try {
        const res = await this.$api.common.get('episodes', {
          query: {
            where: { name: { $regex: this.queryForm.name }},
            sort: this.sort,
            page: this.page.currentPage,
            limit: this.page.pageSize,
            populate: 'course'
          }
        })
        // console.log(res)
        this.page.total = res.total
        this.data = res.data
        this.loading = false
      } catch (e) {
        this.loading = false
        this.$message.error(this.$MakeMessage(e))
      }
    },
    sizeChange(val) {
      this.page.currentPage = 1
      this.page.pageSize = val
      this.query()
    },
    currentChange(val) {
      this.page.currentPage = val
      this.query()
    },
    create() {
      this.resetForm('ruleForm')
      this.initForm()
      this.centerDialogVisible = true
      this.isEdit = false
    },
    async update(row) {
      this.centerDialogVisible = true
      this.isEdit = true
      this.ruleForm = this.$CopyByCol(this.ruleForm, row)
      this.ruleForm.course = row.course._id
      this.ruleForm['_id'] = row._id
    },
    handleAvatarSuccess(res, file) {
      this.ruleForm.file = this.baseUrl + res.path
    },
    remove(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        confirmButtonClass: 'el-button--danger'
      }).then(async() => {
        this.loading = true
        await this.$api.common.delete('episodes', { _id: row._id })
        this.loading = false
        this.$message.success('删除成功')
        await this.query()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        this.loading = false
      })
    },
    cancel() {
      this.centerDialogVisible = false
    },
    save() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.edit()
          } else {
            this.add()
          }
        } else {
          return false
        }
      })
    },
    async edit() {
      const loading = this.localLoading()
      try {
        await this.$api.common.edit('episodes', this.ruleForm)
        this.centerDialogVisible = false
        this.$message.success('修改成功')
        await this.query()
        loading.close()
      } catch (e) {
        loading.close()
      }
    },
    async add() {
      const loading = this.localLoading()
      try {
        await this.$api.common.add('episodes', this.ruleForm)
        this.centerDialogVisible = false
        this.$message.success('新增成功')
        await this.query()
        loading.close()
      } catch (e) {
        loading.close()
      }
    },
    localLoading() {
      const loading = this.$loading({ lock: true })
      return loading
    },
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
        this.$refs[formName].clearValidate()
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
