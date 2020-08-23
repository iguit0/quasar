import { uuid } from '../../../Util/general'

export default {
  /**
   */
  data: () => ({
    records: []
  }),
  /**
   */
  methods: {
    /**
     * @param {number} index
     */
    removeItem (index) {
      const records = [...this.records]
      records.splice(index, 1)
      this.$emit('input', records)
    },
    /**
     * @param {number} index
     * @param {*} record
     */
    updateItem (index, record) {
      const records = [...this.records]
      records[index] = record
      this.updateValue(index, records)
    }
  }
}