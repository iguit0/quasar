import field from 'src/settings/field'

import Base from '../Base'
import Schema from '../Schema'
import { Field } from '../Helper/interfaces'
import { unique } from 'app/@devitools/Util/general'

/**
 * @class {Fields}
 */
export default abstract class Fields extends Base {
  /**
   * @param {string} $key
   * @param {string} type
   * @return {this}
   */
  addField ($key: string, type = 'string'): this {
    if (this.__fields[$key]) {
      throw new Error(`Field '${$key}' already exists`)
    }

    this.__currentField = $key

    const schema = <typeof Schema>this.constructor

    const domain = schema.domain
    const order = Object.keys(this.__fields).length
    const scopes = this.scopes

    const options = { domain, type, order, scopes }
    const attrs = { value: undefined, disable: false, readonly: false }
    const on = {}

    this.__fields[$key] = field($key, options, attrs, on)
    return this
  }

  /**
   * @param {string} name
   * @return {this}
   */
  getField (name: string): this {
    this.__currentField = name
    return this
  }

  /**
   * @param {string[]} scopes
   * @returns {this}
   */
  fieldScopes (scopes: string[]): this {
    const field = this.__currentField
    if (this.__fields[field]) {
      this.__fields[field].scopes = scopes
    }
    return this
  }

  /**
   * @param {string[]} scopes
   * @returns {this}
   */
  fieldScopesExcept (scopes: string[]): this {
    const field = this.__currentField
    if (this.__fields[field]) {
      const filter = (scope: string) => !scopes.includes(scope)
      this.__fields[field].scopes = this.__fields[field].scopes.filter(filter)
    }
    return this
  }

  /**
   * @param {string[]} scopes
   * @returns {this}
   */
  fieldScopesAppend (scopes: string[]): this {
    const field = this.__currentField
    if (this.__fields[field]) {
      this.__fields[field].scopes.push(...scopes)
    }
    return this
  }

  /**
   * @param {string} group
   * @returns {Schema}
   */
  fieldGroup (group: string) {
    const field = this.__currentField
    if (this.__fields[field]) {
      this.__fields[field].group = group
    }
    return this
  }

  /**
   * @deprecated
   * @param {Function} configure
   * @returns {Schema}
   */
  fieldConfigure (configure: Function) {
    const name = this.__currentField
    this.__fields[name].$configure = configure
    return this
  }

  /**
   * @param {string} type
   * @returns {Schema}
   */
  fieldType (type: string) {
    return this.setAttrs({ type })
  }

  /**
   * @param {Record<string, unknown>} attrs
   * @returns {Schema}
   */
  fieldAppendAttrs (attrs: Record<string, unknown>) {
    return this.setAttrs(attrs)
  }

  /**
   * @param {Boolean} primaryKey
   * @returns {Schema}
   */
  fieldPrimaryKey (primaryKey = true) {
    const name = this.__currentField
    this.__fields[name].$primaryKey = primaryKey
    return this
  }

  /**
   * @param {string} event
   * @param {Function} callable
   * @param {boolean} reset
   * @returns {Schema}
   */
  fieldOn (event: string, callable: Function, reset = false) {
    return this.setOn(event, callable, reset)
  }

  /**
   * @param {Function} callable
   * @param {Record<string, unknown>} options
   * @return {Schema}
   */
  fieldWatch (this: Schema, callable: Function, options: Record<string, unknown> = {}) {
    this.addWatch(`record.${this.__currentField}`, callable, options)
    return this
  }

  /**
   * return {Record<string, Field>}
   */
  getFields (): Record<string, Field> {
    return this.__fields
  }

  /**
   * @param {string} $key
   * @return {this}
   */
  addSeparator (this: Schema, $key = undefined): Schema {
    const field = $key || unique()
    const name = `separators.${field}`
    this.__currentField = name

    const schema = this.$self()
    const label = this.$lang(`domains.${schema.domain}.${name}`)

    this.addField(name)
      .setIs('AppSeparator')
      .fieldAppendAttrs({ label })
      .fieldAvoid()

    return this
  }
}
