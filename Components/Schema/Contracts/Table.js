import TableColumns from 'src/app/Components/Schema/Contracts/Table/TableColumns'
import TableFetch from 'src/app/Components/Schema/Contracts/Table/TableFetch'
import { filterKey, searchKey } from 'src/settings/schema'
import { tableMinRowsPerPage, tableOuterHeight, tableSelection } from 'src/settings/table'

/**
 * @mixin {Table}
 */
export default {
  /**
   */
  mixins: [
    TableColumns, TableFetch
  ],
  /**
   */
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    size: {
      type: Number,
      default: undefined
    },
    selection: {
      type: String,
      default: tableSelection
    }
  },
  /**
   */
  data () {
    let descending
    let sortBy
    if (this.$route.query.sort) {
      const pieces = String(this.$route.query.sort).split('.')
      descending = pieces.pop() === 'desc'
      sortBy = pieces.join('.')
    }

    const p = this.$route.query.page
    const page = p ? Number(p) : 1

    const f = this.$route.query[filterKey]
    const filter = f ? String(f) : ''

    const s = this.$route.query[searchKey]
    const search = s ? String(s) : ''

    let size = this.size
    if (!size) {
      const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      const rowsPerPage = Math.ceil((height - tableOuterHeight) / (this.$q.platform.is.desktop ? 40 : 55))
      size = rowsPerPage > tableMinRowsPerPage ? rowsPerPage : tableMinRowsPerPage
    }

    const pagination = {
      sortBy: sortBy,
      descending: descending,
      page,
      pagesNumber: 1,
      rowsNumber: 1,
      rowsPerPage: size
    }

    const bind = {
      rowsPerPageOptions: [],
      dense: false,
      grid: false,
      rowKey: this.primaryKey,
      separator: 'horizontal',
      selection: this.selection
    }

    // noinspection JSValidateTypes
    return {
      [filterKey]: filter,
      [searchKey]: search,
      pagination,
      bind: bind,

      data: [],
      columns: [],
      visibleColumns: [],
      selected: [],

      loading: false,

      filters: [],
      sorter: '',

      tooltip: {
        delay: 600
      }
    }
  },
  /**
   */
  methods: {
    /**
     */
    initialize () {
      this.data = []
      this.columns = []

      this.renderColumns()
      this.renderButtons()
    },
    /**
     */
    getSelected () {
      if (!Array.isArray(this.selected)) {
        return
      }
      if (this.selected.length < 1) {
        this.$message.info('', this.$lang('agnostic.table.noItemSelected'))
        return
      }
      return this.selected[0]
    },
    /**
     * @param {boolean} tableHidden
     * @return {this}
     */
    $fieldTableHidden (tableHidden = true) {
      return this.$setLayout('tableHidden', tableHidden)
    },
    /**
     * @param {string} tableWhere
     * @return {this}
     */
    $fieldTableWhere (tableWhere = 'automatic') {
      return this.$setLayout('tableWhere', tableWhere)
    }
  },
  /**
   */
  watch: {
    /**
     * @param {Array} data
     */
    value: {
      handler () {
        this.fetchRecords()
      }
    }
  }
}