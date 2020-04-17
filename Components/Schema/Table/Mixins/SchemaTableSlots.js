// noinspection ES6CheckImport
import { QSpace, QIcon, QSelect, QInput, QTd, QBtn } from 'quasar'

import { POSITIONS } from 'src/app/Agnostic/enum'
import { counter, filterKey, renderField } from 'src/settings/schema'
import { attrs as defaultAttrs } from 'src/settings/components'
import { tableShowColumnsSelector, tableShowFilters, tableShowSearch } from 'src/settings/table'

/**
 * @mixin {SchemaTableSlots}
 */
export default {
  /**
   */
  data: () => ({
    tableFilters: {}
  }),
  /**
   */
  methods: {
    /**
     * @param h
     * @returns {*}
     */
    renderTableSlots (h) {
      this.counter = 0
      return {
        'top': (props) => {
          return this.renderTableTop(h, props)
        },
        /** @counter */
        [`body-cell-${counter.name}`]: (props) => {
          return this.renderTableCellButtons(h, props)
        },
        'pagination': (props) => {
          return this.renderTablePagination(h, props)
        }
      }
    },
    /**
     * @param {function} h
     * @param {Object} props
     * @returns {*}
     */
    renderTableTop (h, props) {
      const top = [
        this.renderSchemaButtonsCompact(h, POSITIONS.POSITION_TABLE_TOP, { records: this.selected }),
        h(QSpace)
      ]

      if (tableShowColumnsSelector) {
        top.push(this.renderTableColumnsSelector(h))
        top.push(h(QSpace))
      }

      if (tableShowFilters) {
        top.push(this.renderTableFilter(h))
        top.push(h(QSpace))
      }

      if (tableShowSearch) {
        top.push(this.renderTableSearch(h))
      }

      return top
    },
    /**
     * @param {function} h
     * @returns {*}
     */
    renderTableColumnsSelector (h) {
      const attrs = {
        'display-value': this.$lang('agnostic.table.columns'),
        'multiple': true,
        'borderless': true,
        'dense': true,
        'options-dense': true,
        'emit-value': true,
        'map-options': true,
        'options': this.columns,
        'option-value': 'name',
        'transition-show': 'jump-up',
        'transition-hide': 'flip-down',
        'popup-content-class': 'app-float-menu',
        ...defaultAttrs,
        clearable: false
      }
      const props = {
        value: this.visibleColumns
      }
      const style = {
        'min-width': '150px'
      }
      const on = {
        input: (visibleColumns) => { this.visibleColumns = visibleColumns }
      }

      return h(QSelect, { attrs, props, on, style })
    },
    /**
     * @param {function} h
     */
    renderTableFilter (h) {
      const filters = Object.values(this.fields()).filter((field) => field.$layout.tableFilter !== undefined)
      if (!filters.length) {
        return
      }

      const tableFilters = filters.map((field) => {
        const input = ($event) => {
          this.tableFilters[field.$key] = $event && $event.target ? $event.target.value : $event
          field.$layout.tableFilter.call(this, $event)
        }
        field.classNames = 'keep-visible'
        return renderField(h, field, input, this.tableFilters[field.$key])
      })
      return [h(QSpace), ...tableFilters]
    },
    /**
     * @param {function} h
     * @returns {*}
     */
    renderTableSearch (h) {
      const attrs = {
        autofocus: true,
        dense: true,
        clearable: true,
        debounce: 1000,
        placeholder: this.$lang('agnostic.table.search'),
        ...defaultAttrs
      }
      const props = { value: this[filterKey] }
      const on = { input: (filter) => this.applyFilter(filter) }
      const scopedSlots = {
        append: () => h(QIcon, { attrs: { name: 'search' } })
      }

      return h(QInput, { attrs, props, on, scopedSlots })
    },
    /**
     * @param {function} h
     * @param {Object} props
     * @returns {*}
     */
    renderTableCellButtons (h, props) {
      const data = {
        style: { position: 'relative' }
      }
      /** @counter */
      const children = [
        counter.generate(this.pagination.page, this.pagination.rowsPerPage, this.counter++),
        this.renderSchemaButtonsCompact(h, POSITIONS.POSITION_TABLE_CELL, { record: props.row })
      ]

      return h(QTd, data, children)
    },
    /**
     * @param {function} h
     * @param {Object} props
     * @returns {*}
     */
    renderTablePagination (h, props) {
      const texts = [
        props.pagination.rowsPerPage * (props.pagination.page - 1) + 1, '-'
      ]
      let fragment = props.pagination.rowsPerPage * (props.pagination.page)
      if (props.isLastPage) {
        fragment = props.pagination.rowsNumber
      }
      texts.push(fragment)
      texts.push('/')
      texts.push(props.pagination.rowsNumber)

      const button = {
        round: true, dense: true, flat: true, textColor: 'grey-8'
      }

      const first = {
        attrs: { ...button, disable: props.isFirstPage, icon: 'first_page' },
        on: { click: this.firstPage }
      }

      const previous = {
        attrs: { ...button, disable: props.isFirstPage, icon: 'chevron_left' },
        on: { click: this.previousPage }
      }

      const next = {
        attrs: { ...button, disable: props.isLastPage, icon: 'chevron_right' },
        on: { click: this.nextPage }
      }

      const last = {
        attrs: { ...button, disable: props.isLastPage, icon: 'last_page' },
        on: { click: this.lastPage }
      }

      return [
        h('span', { class: 'q-table__bottom-item' }, texts.join(' ')),
        h(QBtn, first),
        h(QBtn, previous),
        h('span', { class: 'text-center' }, `${props.pagination.page} / ${props.pagination.pagesNumber}`),
        h(QBtn, next),
        h(QBtn, last)
      ]
    }
  },
  /**
   */
  created () {
    const filters = Object.values(this.fields()).filter((field) => field.$layout.tableFilter !== undefined)
    this.tableFilters = filters.reduce((accumulator, field) => {
      accumulator[field.$key] = field.attrs.value
      return accumulator
    }, {})
  }
}