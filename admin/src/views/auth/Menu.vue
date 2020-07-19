<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryForm" class="pl-5">
      <el-form-item label="菜单名称">
        <el-input v-model="queryForm.name" placeholder="请输入菜单名称" clearable />
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
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单编码" prop="code">
          <el-input v-model="ruleForm.code" placeholder="请输入菜单编码" />
        </el-form-item>
        <el-form-item label="父菜单" prop="parent">
          <el-select v-model="ruleForm.parent" class="w-100" placeholder="请输入父菜单">
            <el-option
              v-for="item in menuList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单序号" prop="order">
          <el-input-number v-model="ruleForm.order" :min="1" />
        </el-form-item>
        <el-form-item label="说明" prop="desc">
          <el-input v-model="ruleForm.desc" type="textarea" placeholder="请输入说明" />
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
  name: 'Menu',
  data() {
    return {
      queryForm: {
        name: ''
      },
      menuList: [],
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
            label: '菜单名称',
            prop: 'name',
            overHidden: true,
            sortable: true
          }, {
            label: '菜单编码',
            prop: 'code',
            overHidden: true,
            sortable: true
          }, {
            label: '父菜单',
            prop: 'parent',
            overHidden: true,
            formatter: (row, value, label, column) => {
              if (value) {
                return value.name
              } else {
                return ''
              }
            }
          }, {
            label: '序号',
            prop: 'order',
            overHidden: true,
            sortable: true
          }, {
            label: '说明',
            prop: 'desc',
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
        code: '',
        parent: null,
        order: 1,
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入菜单编码', trigger: 'blur' }
        ],
        order: [
          { required: true, message: '请输入序号', trigger: 'blur' }
        ]
      },
      sort: { order: 1 }
    }
  },
  async created() {
    await this.query()
    await this.getMenuList()
  },
  methods: {
    initForm() {
      this.ruleForm = {
        name: '',
        code: '',
        parent: null,
        order: 1,
        desc: ''
      }
    },
    async getMenuList() {
      const res = await this.$api.common.get('menus', {})
      this.menuList = res.data
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
        const res = await this.$api.common.get('menus', {
          query: {
            where: { name: { $regex: this.queryForm.name }},
            populate: 'parent',
            sort: this.sort,
            page: this.page.currentPage,
            limit: this.page.pageSize
          }
        })
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
      this.ruleForm.parent = row.parent ? row.parent._id : ''
      this.ruleForm['_id'] = row._id
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
        await this.$api.common.delete('menus', { _id: row._id })
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
          this.getMenuList()
        } else {
          return false
        }
      })
    },
    async edit() {
      const loading = this.localLoading()
      try {
        await this.$api.common.edit('menus', this.ruleForm)
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
        await this.$api.common.add('menus', this.ruleForm)
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

