import SchemaForm from 'src/app/Components/Schema/SchemaForm'
import { SCOPES } from 'src/app/Agnostic/enum'

/**
 * @component {AppEmbedForm}
 */
export default {
  /**
   */
  extends: SchemaForm,
  /**
   */
  name: 'AppEmbedForm',
  /**
   */
  props: {
    value: {
      type: [String, Number],
      default: () => undefined
    },
    readonly: {
      default: false
    },
    disable: {
      default: false
    },
    masterKey: {
      type: String,
      default: undefined
    },
    masterValue: {
      required: true
    },
    clipboard: {
      type: Object,
      default: () => ({})
    },
    embed: {
      type: Boolean,
      default: false
    }
  },
  /**
   */
  computed: {
    /**
     * @return {boolean}
     */
    locked () {
      if (this.readonly) {
        return true
      }
      return !this.masterValue
    }
  },
  methods: {
    /**
     * @param id
     */
    loadRecordMasterDetailForm (id) {
      const scopes = [SCOPES.SCOPE_MASTER_DETAIL_EDIT, SCOPES.SCOPE_MASTER_DETAIL_VIEW]
      if (!scopes.includes(this.scope)) {
        return
      }
      return this.fetchRecord(id)
    }
  },
  watch: {
    scope: {
      handler (scope) {
        if (scope === SCOPES.SCOPE_MASTER_DETAIL_INDEX) {
          return
        }

        this.reloadComponents()

        if (scope !== SCOPES.SCOPE_MASTER_DETAIL_VIEW) {
          return
        }

        if (!this.components) {
          return
        }
        const setField = (key) => this.setFieldAttrs(key, { readonly: true, disable: true })
        Object.keys(this.components).forEach(setField)
      },
      immediate: true
    },
    'clipboard.forceClear': {
      handler () {
        this.renderRecord()
        this.record[this.masterKey] = this.masterValue
      },
      immediate: true
    },
    masterValue: {
      handler (value) {
        this.record[this.masterKey] = value
      },
      immediate: true
    }
  },
  /**
   */
  created () {
    this.record[this.masterKey] = this.masterValue

    this.$watch(`clipboard.${this.primaryKey}`, (id) => {
      return this.loadRecordMasterDetailForm(id)
    }, { immediate: true })
  },
  /**
   * @param {function} h
   */
  render (h) {
    const data = {
      class: ['AppEmbedForm'],
      attrs: {
        padding: true
      }
    }
    const children = [
      this.renderForm(h),
      this.renderFormDebuggers(h)
    ]

    return h('div', data, children)
  }
}