<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryForm" class="pl-5">
      <el-form-item label="课程名称">
        <el-input v-model="queryForm.name" placeholder="请输入课程名称" clearable />
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
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="封面图" prop="cover">
          <el-input v-model="ruleForm.cover" placeholder="请上传图片" />
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="ruleForm.cover" :src="ruleForm.cover" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
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
  name: 'Course',
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
            label: '课程名称',
            prop: 'name',
            overHidden: true,
            sortable: true
          },
          {
            label: '封面图',
            prop: 'cover',
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
        cover: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        cover: [
          { required: true, message: '请输入封面图', trigger: 'blur' }
        ]
      },
      baseUrl: process.env.VUE_APP_BASE_API,
      uploadUrl: '',
      sort: {}
    }
  },
  async created() {
    this.uploadUrl = this.baseUrl + 'upload'
    await this.query()
  },
  methods: {
    initForm() {
      this.ruleForm = {
        name: '',
        cover: ''
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
    async query() {
      this.loading = true
      try {
        const res = await this.$api.course.getCourse({
          query: {
            where: { name: { $regex: this.queryForm.name }},
            sort: this.sort,
            page: this.page.currentPage,
            limit: this.page.pageSize
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
      this.ruleForm['_id'] = row._id
    },
    handleAvatarSuccess(res, file) {
      this.ruleForm.cover = this.baseUrl + res.path
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
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
        await this.$api.course.deleteCourse({ _id: row._id })
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
        await this.$api.course.editCourse(this.ruleForm)
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
        await this.$api.course.addCourse(this.ruleForm)
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
  .avatar-uploader {
    ::v-deep .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    ::v-deep .el-upload:hover {
      border-color: #409EFF;
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  ::v-deep .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
